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
}

export interface StepRecord {
  state: StepState;
  attempts: Attempt[];
  outputs: Partial<Record<DocType, string>>;
  checkpoint?: string;
  login?: string;
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
  gates: Record<string, { done: boolean; by: string; at: string; values?: Record<string, string> }>;
  steps: Record<string, StepRecord>;
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
