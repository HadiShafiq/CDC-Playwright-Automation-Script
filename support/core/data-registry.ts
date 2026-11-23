import path from 'node:path';
import { getEnv } from '../../config/environments';
import { nowMy, stateDir, tester } from './context';
import { readJson, updateJson } from './json-file';
import type { DocType } from './documents';

/**
 * Test data registry: every transaction a flow created or moved, with its latest verified checkpoint.
 * .data/<ENV>/<tester>/transactions.json — per environment and tester, never shared between SIT and UAT.
 * Nothing here deletes application data; "reuse" only says whether a flow may build on the record.
 */
export interface Transaction {
  ref: string;
  docType: DocType;
  env: string;
  tester: string;
  module: string;
  /** Latest checkpoint reached by a step that produced or used this document. */
  checkpoint: string;
  verification: 'verified' | 'completed-unverified';
  createdBy: { flowRunId: string; stepId: string } | null;
  lastStep: { flowRunId: string; stepId: string };
  createdAt: string;
  lastVerifiedAt: string;
  /** Documents this one was made from (e.g. RN ← SQ). */
  parents: string[];
  reuse: 'available' | 'reserved' | 'consumed' | 'do-not-use';
  cr: string | null;
  notes: string[];
}

const file = () => path.join(stateDir(), 'transactions.json');

export function listTransactions(filter: Partial<Pick<Transaction, 'docType' | 'checkpoint' | 'module' | 'reuse'>> = {}): Transaction[] {
  return readJson<Transaction[]>(file(), []).filter((t) => Object.entries(filter).every(([k, v]) => (t as any)[k] === v));
}

export function findTransaction(ref: string): Transaction | undefined {
  return readJson<Transaction[]>(file(), []).find((t) => t.ref === ref);
}

/** Record that `stepId` produced or used `ref` and reached `checkpoint`. */
export async function recordTransaction(x: {
  ref: string; docType: DocType; module: string; checkpoint: string; verified: boolean;
  flowRunId: string; stepId: string; produced: boolean; parents?: string[]; note?: string;
}) {
  const t = nowMy();
  await updateJson<Transaction[]>(file(), [], (all) => {
    let row = all.find((r) => r.ref === x.ref);
    if (!row) {
      row = {
        ref: x.ref, docType: x.docType, env: getEnv().name, tester: tester(), module: x.module, checkpoint: x.checkpoint,
        verification: x.verified ? 'verified' : 'completed-unverified',
        createdBy: x.produced ? { flowRunId: x.flowRunId, stepId: x.stepId } : null,
        lastStep: { flowRunId: x.flowRunId, stepId: x.stepId }, createdAt: t, lastVerifiedAt: t,
        parents: x.parents ?? [], reuse: 'available', cr: process.env.QA_CR || null, notes: [],
      };
      all.push(row);
    } else {
      row.checkpoint = x.checkpoint;
      row.verification = x.verified ? 'verified' : 'completed-unverified';
      row.lastStep = { flowRunId: x.flowRunId, stepId: x.stepId };
      row.lastVerifiedAt = t;
      for (const p of x.parents ?? []) if (!row.parents.includes(p)) row.parents.push(p);
    }
    if (x.note) row.notes.push(`${t} ${x.note}`);
  });
}
