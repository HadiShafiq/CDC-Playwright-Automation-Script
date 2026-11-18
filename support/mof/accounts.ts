import fs from 'node:fs';
import path from 'node:path';

/**
 * Accounts created by the MOF registration chain, kept in the git-ignored .auth folder
 * (.auth/mof-accounts.json). Each run of REG-001 appends one; the later stages use the latest.
 */
export interface MofAccount {
  env: string;
  createdAt: string;
  supplierType: string;
  businessType: string;
  companyName: string;
  regNo: string;
  ownerName: string;
  /** Login ID = owner IC number. */
  username: string;
  password: string;
  email: string;
  /** Set by REG-002 (Declare): the MOF application number, e.g. KN-16112026-0001. */
  applicationNo?: string;
  /** Free-form progress notes written by the stages. */
  notes?: string[];
}

const ROOT = path.resolve(__dirname, '../..');
const FILE = path.join(ROOT, '.auth', 'mof-accounts.json');

export function loadAccounts(): MofAccount[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8')) as MofAccount[];
}

/** The account the chain is working on: MOF_ACCOUNT=<username> or the latest one of this environment. */
export function currentAccount(env: string): MofAccount {
  const all = loadAccounts().filter((a) => a.env === env);
  const wanted = process.env.MOF_ACCOUNT;
  const acct = wanted ? all.find((a) => a.username === wanted) : all.at(-1);
  if (!acct) throw new Error(`No MOF account for ${env} in ${FILE}${wanted ? ` with username ${wanted}` : ''}. Run REG-001 first`);
  return acct;
}

export function saveAccount(acct: MofAccount) {
  const all = loadAccounts();
  const i = all.findIndex((a) => a.env === acct.env && a.username === acct.username);
  if (i >= 0) all[i] = acct;
  else all.push(acct);
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2) + '\n');
}

export function noteAccount(acct: MofAccount, note: string) {
  acct.notes = [...(acct.notes ?? []), `${new Date().toISOString()} ${note}`];
  saveAccount(acct);
}

/** Append a row to knowledge/data-change-audit.md (every SIT change is logged there). */
export function audit(env: string, who: string, what: string, change: string, action: string, next = 'n/a') {
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const line = `| ${stamp} | ${env} | ${who} | ${what} | ${change} | ${action} | ${next} | n/a |\n`;
  fs.appendFileSync(path.join(ROOT, 'knowledge', 'data-change-audit.md'), line);
}
