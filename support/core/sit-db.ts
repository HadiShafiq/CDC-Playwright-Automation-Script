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
