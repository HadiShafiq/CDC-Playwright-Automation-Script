import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getEnv, type EnvName } from '../../config/environments';

export const ROOT = path.resolve(__dirname, '..', '..');

export type Lang = 'EN' | 'BM';

/** Tester ID: QA_TESTER, else the OS user. Keeps data, runs and locks of different testers apart. */
export function tester(): string {
  const raw = process.env.QA_TESTER || os.userInfo().username || 'tester';
  return raw.toLowerCase().replace(/[^a-z0-9._-]+/g, '_');
}

export function language(): Lang {
  const v = (process.env.QA_LANG ?? 'EN').toUpperCase();
  if (v !== 'EN' && v !== 'BM') throw new Error(`QA_LANG must be EN or BM (got "${v}")`);
  return v;
}

/** Git-ignored state of this tester in this environment: .data/<ENV>/<tester>/ */
export function stateDir(env: EnvName = getEnv().name): string {
  const dir = path.join(ROOT, '.data', env, tester());
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function runDir(flowRunId: string, env: EnvName = getEnv().name): string {
  const dir = path.join(stateDir(env), 'runs', flowRunId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Malaysia time stamp: 2026-11-23T10:30:15+08:00 */
export function nowMy(): string {
  const d = new Date(Date.now() + 8 * 3600_000);
  return d.toISOString().replace(/\.\d+Z$/, '+08:00');
}

/** 20261123_103015 (Malaysia time), for file names. */
export function stampMy(): string {
  return nowMy().slice(0, 19).replace(/-/g, '').replace('T', '_').replace(/:/g, '');
}
