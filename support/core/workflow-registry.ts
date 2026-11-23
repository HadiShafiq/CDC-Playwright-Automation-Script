import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './context';
import { isDocType, type DocType } from './documents';

export const MODULES = ['sq', 'dp', 'direct-loa', 'ct', 'fl'] as const;
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
  checkpoint: {
    id: string;
    description: string;
    displayedStatus: { en: string | null; bm: string | null };
    verification: Verification;
    evidence: string;
  };
}

export interface GateDef {
  id: string;
  type: 'sql' | 'lookup' | 'wait';
  title: string;
  needs?: string[];
  provides?: DocType[];
  instructions: string;
  source: string;
}

export type FlowItem = { kind: 'step'; step: StepDef } | { kind: 'gate'; gate: GateDef };

export interface FlowDef {
  id: string;
  module: ModuleId;
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
  flows: { id: string; title: string; verification: Verification; notes: string; steps: (string | { gate: string })[]; variables?: Record<string, Record<string, unknown>> }[];
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
      flows.set(fl.id, { id: fl.id, module: f.module, title: fl.title, verification: fl.verification, notes: fl.notes, items, variables: fl.variables ?? {} });
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
