import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './context';
import { isDocType, type DocType } from './documents';

export const MODULES = ['pm', 'sm', 'qt', 'sq', 'dp', 'direct-loa', 'ct', 'fl'] as const;
export type ModuleId = (typeof MODULES)[number];
export type Verification = 'execution' | 'source' | 'documentation' | 'unverified';

export type StepLogin = 'default' | 'assignedOfficer' | { accountOf: string };

export interface StepDef {
  id: string;
  module: ModuleId;
  title: string;
  role: string;
  stateChanging: boolean;
  login: StepLogin;
  inputs: { var: string; doc: DocType }[];
  outputs: { doc: DocType; message: string | null }[];
  /**
   * How the step runs: 'katalon' (default) = support/katalon/steps/<id>.ts; 'manual' = not automated yet: the run stops
   * there, the tester does it in the application and records it (qa reconcile … --done); the DB status check then
   * confirms the checkpoint. 'source' says where the logic can be ported from.
   */
  automation?: 'katalon' | 'manual' | 'module';
  source?: string;
  instructions?: string;
  /** Run only when the SIT DB shows this status (e.g. BPK approval only when the QT is at 60030); else skipped as not needed. */
  onlyIfStatus?: { kind: string; statusId: number };
  /** BPM task (SIT WFTASK activity name) the step works on; used to find the assigned officer and to wait for it. */
  bpmTask?: string;
  checkpoint: {
    id: string;
    description: string;
    displayedStatus: { en: string | null; bm: string | null };
    verification: Verification;
    evidence: string;
    /** Expected status in the SIT database after the step (registry/db-schema.json kinds); null statusId = the step does not change it. */
    db?: DbCheck;
    /**
     * Exact proof that the step happened when the status alone cannot show it (e.g. a supplier reply leaves the SQ at
     * 60851): one SELECT returning a number, > 0 = done. {SQ}, {LA}, … are filled from the run's documents.
     */
    proofSql?: string;
  };
}

export interface DbCheck {
  kind: string; // 'LA', 'CT:FD', 'QT', 'QT:OC', …
  statusId: number | null;
  en?: string;
  bm?: string;
  /** In-between statuses that are normal while SIT finishes the move (e.g. iGFMAS 40600/40610 before 40800): keep waiting. */
  via?: number[];
  /** How long to wait for the status (default 120 s; with via, 600 s). */
  waitSec?: number;
  /** Expectation not yet seen on SIT (e.g. from DEV): a different status is reported, not failed. */
  observeOnly?: boolean;
  evidence: string;
}

export interface GateDef {
  id: string;
  type: 'sql' | 'lookup' | 'wait';
  title: string;
  needs?: string[];
  provides?: DocType[];
  instructions: string;
  source: string;
  /** Expected SIT database status once the person has done the gate (checked when the run passes it). */
  db?: DbCheck;
  /** Allow-listed SQL the runner may run itself when QA_AUTO_SQL=1 (user permission); {SQ}, {NEXT_QUARTER} are filled. */
  sql?: string;
  /** After the SQL, wait until the date/time it sets has passed (+90 s). */
  waitUntilTime?: boolean;
}

export type FlowItem = { kind: 'step'; step: StepDef } | { kind: 'gate'; gate: GateDef };

export interface FlowDef {
  id: string;
  module: ModuleId;
  /** Sub-module (folder under the module in tests/data-prep), e.g. direct-loa/one-off, fl/maintenance. */
  submodule: string;
  title: string;
  verification: Verification;
  notes: string;
  items: FlowItem[];
  variables: Record<string, Record<string, unknown>>;
}

interface ModuleFile {
  module: ModuleId;
  name: string;
  description: string;
  steps: Record<string, Omit<StepDef, 'id' | 'module'>>;
  flows: { id: string; submodule?: string; title: string; verification: Verification; notes: string; steps: (string | { gate: string })[]; variables?: Record<string, Record<string, unknown>> }[];
}

export interface Registry {
  modules: { id: ModuleId; name: string; description: string }[];
  steps: Map<string, StepDef>;
  gates: Map<string, GateDef>;
  flows: Map<string, FlowDef>;
}

const DIR = path.join(ROOT, 'registry');
let cache: Registry | undefined;

/** Load and validate registry/. Throws with every problem listed, so a broken registry never runs half a flow. */
export function loadRegistry(): Registry {
  if (cache) return cache;
  const problems: string[] = [];
  const files = MODULES.map((m) => JSON.parse(fs.readFileSync(path.join(DIR, 'workflows', `${m}.json`), 'utf8')) as ModuleFile);
  const gatesRaw = JSON.parse(fs.readFileSync(path.join(DIR, 'gates.json'), 'utf8')) as Record<string, Omit<GateDef, 'id'>>;

  const gates = new Map<string, GateDef>(Object.entries(gatesRaw).map(([id, g]) => [id, { id, ...g }]));
  const steps = new Map<string, StepDef>();
  for (const f of files) {
    for (const [id, s] of Object.entries(f.steps)) {
      if (steps.has(id)) problems.push(`${id} is owned by two modules (${steps.get(id)!.module}, ${f.module})`);
      for (const x of [...s.inputs, ...s.outputs]) if (!isDocType(x.doc)) problems.push(`${id}: unknown document type ${x.doc}`);
      steps.set(id, { id, module: f.module, ...s });
    }
  }
  const flows = new Map<string, FlowDef>();
  for (const f of files) {
    for (const fl of f.flows) {
      if (flows.has(fl.id)) problems.push(`flow ${fl.id} defined twice`);
      const items: FlowItem[] = [];
      for (const ref of fl.steps) {
        if (typeof ref === 'string') {
          const step = steps.get(ref);
          if (!step) problems.push(`flow ${fl.id}: unknown step ${ref}`);
          else items.push({ kind: 'step', step });
        } else {
          const gate = gates.get(ref.gate);
          if (!gate) problems.push(`flow ${fl.id}: unknown gate ${ref.gate}`);
          else items.push({ kind: 'gate', gate });
        }
      }
      // Every step input must come from an earlier output, a gate, or --input.
      flows.set(fl.id, { id: fl.id, module: f.module, submodule: fl.submodule ?? 'main', title: fl.title, verification: fl.verification, notes: fl.notes, items, variables: fl.variables ?? {} });
    }
  }
  if (problems.length) throw new Error(`registry/ is invalid:\n- ${problems.join('\n- ')}`);
  cache = { modules: files.map((f) => ({ id: f.module, name: f.name, description: f.description })), steps, gates, flows };
  return cache;
}

export function flowsOf(module: ModuleId): FlowDef[] {
  return [...loadRegistry().flows.values()].filter((f) => f.module === module);
}

/**
 * Documents a flow needs from outside (inputs no earlier step or gate provides). They must be given with
 * --input DOC=… (or be in the run state from an earlier attempt).
 */
export function externalInputs(flow: FlowDef): DocType[] {
  const have = new Set<DocType>();
  const need = new Set<DocType>();
  for (const it of flow.items) {
    if (it.kind === 'gate') for (const d of it.gate.provides ?? []) have.add(d);
    else {
      for (const i of it.step.inputs) if (!have.has(i.doc)) need.add(i.doc);
      for (const o of it.step.outputs) have.add(o.doc);
    }
  }
  return [...need];
}
