import fs from 'node:fs';
import path from 'node:path';
import { nowMy, runDir } from './context';

/**
 * Structured execution events, one JSON object per line: .data/<ENV>/<tester>/runs/<flowRunId>/events.jsonl
 * The CLI tails this file for the live view (`qa run`, `qa watch`) and `qa report` reads it afterwards.
 */
export type EventType =
  | 'flow-start' | 'step-start' | 'step-end' | 'step-skip' | 'gate-blocked' | 'gate-passed'
  | 'login' | 'message' | 'document' | 'evidence' | 'failure' | 'flow-end' | 'note';

export interface FlowEvent {
  t: string;
  type: EventType;
  flowRunId: string;
  flowId: string;
  item?: string;
  [k: string]: unknown;
}

export function emit(flowRunId: string, flowId: string, type: EventType, data: Record<string, unknown> = {}) {
  const ev: FlowEvent = { t: nowMy(), type, flowRunId, flowId, ...data };
  fs.appendFileSync(path.join(runDir(flowRunId), 'events.jsonl'), JSON.stringify(ev) + '\n');
}
