import path from 'node:path';
import { getEnv } from '../../config/environments';
import { nowMy, runDir, tester, type Lang } from './context';
import { readJson, updateJson } from './json-file';
import type { DocType } from './documents';

/**
 * Persistent checkpoint state of one flow run: .data/<ENV>/<tester>/runs/<flowRunId>/state.json
 * Written before and after every step, so an interrupted run can be resumed from a verified position.
 * The CLI (cli/qa.mjs) creates it and records gate decisions; the flow runner updates it.
 */
export type StepState =
  | 'running' // started, no result yet. If found at the next start: the process died mid-step → UNCERTAIN
  | 'verified' // finished and its expected outcome was observed
  | 'completed-unverified' // finished, but no expected outcome is known/observed for it
  | 'failed'
  | 'blocked'
  | 'uncertain'; // interrupted state-changing step: the person must reconcile before anything else runs

export interface Attempt {
  runId: string;
  startedAt: string;
  endedAt?: string;
  result: StepState;
  error?: string;
  classification?: string;
  messages?: { severity: string; text: string }[];
  evidenceDir?: string;
  /** SIT DB status of the checkpoint's document before the attempt (self-heal proof). */
  dbBefore?: { kind: string; docNo: string; statusId: number | null };
  /** Set when the attempt was an automatic self-heal retry, or a self-heal resolved it. */
  selfHeal?: string;
}

export interface StepRecord {
  state: StepState;
  attempts: Attempt[];
  outputs: Partial<Record<DocType, string>>;
  checkpoint?: string;
  login?: string;
  /** SIT database status read after the step (expected = registry checkpoint.db.statusId; null when only observed). */
  db?: DbResult;
}

export interface DbResult {
  kind: string;
  docNo: string;
  expected: number | null;
  statusId: number | null;
  en: string;
  bm: string;
  at: string;
  ok: boolean;
  checkedAt: string;
  observeOnly?: boolean;
}

export interface RunState {
  flowRunId: string;
  flowId: string;
  module: string;
  env: string;
  tester: string;
  language: Lang;
  cr: string | null;
  createdAt: string;
  updatedAt: string;
  /** Selection: only steps from `from` to `to` (inclusive) run; the rest are skipped. */
  from: string | null;
  to: string | null;
  /** Latest document of each type in this run (from --input, gates and step outputs). */
  docs: Partial<Record<DocType, string>>;
  /** Officer to log in as for an 'assignedOfficer' step, set by the person (gate command). */
  officers: Record<string, string>;
  gates: Record<string, { done: boolean; by: string; at: string; values?: Record<string, string>; db?: DbResult }>;
  steps: Record<string, StepRecord>;
  /** Items not needed in this run (e.g. no debit note was created → its approval is skipped), with the reason. */
  skipItems?: Record<string, string>;
  /** Steps the person allowed to run again (after a failure or a reconciled UNCERTAIN). Consumed when used. */
  allowRerun: string[];
  /** Variables per step for this run only (from --var KAT-021.Fulfilmenttype=2). */
  vars: Record<string, Record<string, string>>;
  status: 'in-progress' | 'blocked' | 'failed' | 'completed' | 'uncertain';
  blockedReason?: string;
}

export function stateFile(flowRunId: string) {
  return path.join(runDir(flowRunId), 'state.json');
}

export function newRunState(flowRunId: string, flowId: string, module: string, lang: Lang): RunState {
  const t = nowMy();
  return {
    flowRunId, flowId, module, env: getEnv().name, tester: tester(), language: lang, cr: process.env.QA_CR || null,
    createdAt: t, updatedAt: t, from: null, to: null, docs: {}, officers: {}, gates: {}, steps: {}, allowRerun: [], vars: {},
    status: 'in-progress',
  };
}

export function readRunState(flowRunId: string): RunState | undefined {
  return readJson<RunState | undefined>(stateFile(flowRunId), undefined);
}

export async function updateRunState(flowRunId: string, change: (s: RunState) => void): Promise<RunState> {
  return updateJson<RunState>(stateFile(flowRunId), undefined as unknown as RunState, (s) => {
    if (!s) throw new Error(`No run state for ${flowRunId}`);
    change(s);
    s.updatedAt = nowMy();
  });
}
