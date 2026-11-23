import fs from 'node:fs';
import path from 'node:path';
import { withDataLock } from '../data-lock';

export function readJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

/** Write via a temp file + rename, so a crash never leaves half a JSON file. */
export function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

/** Read-modify-write under a local lock (one machine only; see support/data-lock.ts). */
export async function updateJson<T>(file: string, fallback: T, change: (data: T) => T | void): Promise<T> {
  return withDataLock(`json_${path.basename(path.dirname(file))}_${path.basename(file)}`, async () => {
    const data = readJson(file, fallback);
    const next = (change(data) ?? data) as T;
    writeJson(file, next);
    return next;
  });
}
