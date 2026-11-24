import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { getEnv } from '../../config/environments';

/**
 * READ-ONLY access to the SIT database (NGEP_SIT), for status checks and document lookups (QA, Phase 1).
 *
 * - Uses the tester's own DBeaver connection named "SIT" (rac-cluster-scan…/sitapp); its login is decrypted in memory
 *   at run time and never written anywhere. Approved by the user 2026-11-23 ("use my SIT DB for all modules").
 * - Only a single SELECT/WITH statement is accepted; anything else throws before connecting.
 * - Only when TEST_ENV is SIT. UAT/PROD connections in DBeaver are never touched.
 * Idea from the ngep-runner project (same company), rewritten for this framework; QA owns it.
 */
const DBEAVER_DIR = path.join(process.env.APPDATA ?? '', 'DBeaverData', 'workspace6', 'EP', '.dbeaver');
const SQLPLUS = process.env.SQLPLUS_PATH ?? 'C:\\oracle\\product\\10.2.0\\client_1\\bin\\sqlplus.exe';
const SIT_HOST = 'rac-cluster-scan.eperolehan.com.my';
const SIT_SERVICE = 'sitapp';
const SEP = '|~|';

let login: { user: string; password: string } | undefined;

function sitLogin() {
  if (login) return login;
  const ds = JSON.parse(fs.readFileSync(path.join(DBEAVER_DIR, 'data-sources.json'), 'utf8'));
  const entry = Object.entries<any>(ds.connections).find(
    ([, c]) => c.name === 'SIT' && String(c.configuration?.url ?? '').includes(SIT_HOST) && /SERVICE_NAME\s*=\s*sitapp/i.test(c.configuration?.url ?? ''),
  );
  if (!entry) throw new Error('DBeaver has no connection named "SIT" pointing at the SIT database; status checks need it');
  // DBeaver encrypts credentials-config.json with its fixed, publicly documented default key; IV = first 16 bytes.
  const raw = fs.readFileSync(path.join(DBEAVER_DIR, 'credentials-config.json'));
  const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from('babb4a9f774ab853c96c2d653dfe544a', 'hex'), raw.subarray(0, 16));
  const creds = JSON.parse(Buffer.concat([decipher.update(raw.subarray(16)), decipher.final()]).toString('utf8'));
  const c = creds[entry[0]]?.['#connection'];
  if (!c?.user || !c?.password) throw new Error('The DBeaver SIT connection has no saved login');
  login = { user: c.user, password: c.password };
  return login;
}

function assertReadOnly(sql: string) {
  const s = sql.trim().replace(/;\s*$/, '');
  if (!/^(select|with)\b/i.test(s)) throw new Error('sit-db: only SELECT statements are allowed');
  if (s.includes(';')) throw new Error('sit-db: one statement only');
  if (/\bfor\s+update\b/i.test(s)) throw new Error('sit-db: SELECT … FOR UPDATE is not allowed');
  return s;
}

/** Runs one SELECT on SIT and returns its rows as string arrays (columns in SELECT order). */
export function sitQuery(sql: string): string[][] {
  if (getEnv().name !== 'SIT') throw new Error('sit-db: database checks run only on SIT');
  const statement = assertReadOnly(sql);
  const { user, password } = sitLogin();
  const script = [
    'WHENEVER SQLERROR EXIT FAILURE',
    `CONNECT ${user}/"${password}"@"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${SIT_HOST})(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=${SIT_SERVICE})))"`,
    'SET PAGESIZE 0 HEADING OFF FEEDBACK OFF VERIFY OFF ECHO OFF TAB OFF',
    'SET LINESIZE 32767 TRIMSPOOL ON TRIMOUT ON',
    `SET COLSEP '${SEP}'`,
    "ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS';",
    `${statement};`,
    'EXIT',
  ].join('\n');
  const r = spawnSync(SQLPLUS, ['-S', '/nolog'], { input: script, encoding: 'utf8', timeout: 60_000, windowsHide: true });
  const out = (r.stdout ?? '').split(password).join('***');
  if (r.status !== 0) throw new Error(`sit-db: query failed: ${out.trim().split('\n').slice(-3).join(' ').slice(0, 300)}`);
  return out
    .split(/\r?\n/)
    .filter((l) => l.trim() && !/^Session altered\.?$/.test(l.trim()))
    .map((l) => l.split(SEP).map((v) => v.trim()));
}

/** True when the DBeaver SIT connection and SQL*Plus are available (status checks are skipped otherwise). */
export function sitDbAvailable(): boolean {
  try {
    sitLogin();
    return fs.existsSync(SQLPLUS);
  } catch {
    return false;
  }
}

/**
 * WRITE access, for the data changes the user allowed (2026-11-24: "for sql u can run it i give u permission"):
 * the Simple Quote date gates and status simulations only. Every statement must match the allow-list below; all run
 * in ONE transaction (any error → rollback) on SIT only, and each call is logged in knowledge/data-change-audit.md.
 * Turned on per run with QA_AUTO_SQL=1 (runner) or `qa simulate … --run` / `qa sql` (CLI).
 */
const WRITE_ALLOWED: RegExp[] = [
  /^UPDATE NGEP_SIT\.SC_QUOTE mp SET (START_DATE|END_DATE) = TO_DATE\('\d{4}-\d\d-\d\d \d\d:\d\d:\d\d', 'YYYY-MM-DD HH24:MI:SS'\) WHERE mp\.QUOTE_NO IN \('SQ\d{12,15}'\)$/i,
  /^UPDATE ngep_sit\.(sc|ct|fl|sm|cm|pm|pp)_workflow_status SET is_current = 0, changed_by = \d+, changed_date = systimestamp WHERE doc_type = '[A-Z0-9]{1,4}' AND doc_id = \d+ AND is_current = 1$/i,
  /^INSERT INTO ngep_sit\.(sc|ct|fl|sm|cm|pm|pp)_workflow_status \(workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date\) VALUES \(ngep_sit\.(SC|CT|FL|SM|CM|PM|PP)_WORKFLOW_STATUS_SEQ\.nextval, '[A-Z0-9]{1,4}', \d+, 1, \d+, 1, \d+, systimestamp\)$/i,
  /^UPDATE ngep_sit\.sm_appl SET status_id = \d+ WHERE appl_id = \d+$/i,
  /^DELETE FROM ngep_sit\.(sc|ct|fl|sm|cm|pm|pp)_workflow_status WHERE doc_type = '[A-Z0-9]{1,4}' AND doc_id = \d+ AND is_current = 1 AND status_id = \d+$/i,
  /^UPDATE ngep_sit\.(sc|ct|fl|sm|cm|pm|pp)_workflow_status SET is_current = 1 WHERE workflow_status_id = \d+$/i,
];

/** Picks the executable statements out of a script (comments and COMMIT removed). */
export function dmlStatements(script: string): string[] {
  return script
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('--') && !/^COMMIT;?$/i.test(l))
    .map((l) => l.replace(/;\s*$/, ''));
}

export function sitExecute(statements: string[], who: string, what: string): void {
  if (getEnv().name !== 'SIT') throw new Error('sit-db: data changes run only on SIT');
  if (!statements.length) throw new Error('sit-db: nothing to run');
  for (const s of statements)
    if (!WRITE_ALLOWED.some((re) => re.test(s.trim()))) throw new Error(`sit-db: statement not allowed (only SQ dates and status simulation): ${s.slice(0, 160)}`);
  const { user, password } = sitLogin();
  const script = [
    'WHENEVER SQLERROR EXIT FAILURE ROLLBACK',
    `CONNECT ${user}/"${password}"@"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${SIT_HOST})(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=${SIT_SERVICE})))"`,
    'SET FEEDBACK ON',
    ...statements.map((s) => `${s.trim()};`),
    'COMMIT;',
    'EXIT',
  ].join('\n');
  const r = spawnSync(SQLPLUS, ['-S', '/nolog'], { input: script, encoding: 'utf8', timeout: 60_000, windowsHide: true });
  const out = (r.stdout ?? '').split(password).join('***');
  if (r.status !== 0) throw new Error(`sit-db: data change failed and was rolled back: ${out.trim().split('\n').slice(-3).join(' ').slice(0, 300)}`);
  const rows = (out.match(/(\d+) rows? (updated|created|deleted)/gi) ?? []).join(', ');
  const audit = path.join(__dirname, '..', '..', 'knowledge', 'data-change-audit.md');
  const at = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 16).replace('T', ' ');
  fs.appendFileSync(audit, `| ${at} | SIT | User permission 2026-11-24 ("for sql u can run it"); run by ${who} | ${what} | ${statements.map((s) => s.replace(/\|/g, '/')).join('; ')} | SQL*Plus via the DBeaver SIT connection (${rows || 'ok'}) | Rollback SQL kept with the plan (.data/…) | No |\n`);
}
