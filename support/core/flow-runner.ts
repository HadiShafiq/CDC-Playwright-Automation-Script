import fs from 'node:fs';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import { test, scenario } from '../../fixtures/flow';
import type { Evidence } from '../../fixtures/test';
import type { AppMessage } from './app-messages';
import { classify } from './classify';
import { language, nowMy, runDir, type Lang } from './context';
import { recordTransaction } from './data-registry';
import { docName, findDocs, type DocType } from './documents';
import { emit } from './events';
import { newRunState, readRunState, stateFile, updateRunState, type RunState, type StepState } from './run-state';
import { writeJson } from './json-file';
import type { FlowDef, FlowItem, GateDef, StepDef } from './workflow-registry';
import { setFlowInputs, observedTexts, type FlowLogin } from '../katalon/runtime';
import { STEPS } from '../katalon/steps';
import overrides from '../katalon/data-overrides.json';

/**
 * Runs the flows of registry/ as serial Playwright describe blocks (declared in tests/flows/<lang>/<module>.flow.spec.ts):
 * one test per step or gate.
 *
 * Safety rules enforced here:
 * - A step already finished in this flow run is never repeated (resume skips it).
 * - A state-changing step found "running" (process died mid-step) becomes UNCERTAIN and stops the flow until the
 *   person reconciles it (`qa reconcile`). A failed state-changing step is not retried unless the person allows it.
 * - A gate (SQL date move, DB lookup) blocks the flow until the person records it as done (`qa gate`).
 * - A step passes as VERIFIED only when its expected application message (and document) was observed; otherwise
 *   it is COMPLETED_UNVERIFIED, never "passed" on reaching the last line alone.
 */
/** Tags of a flow's describe block: select with --grep @flow-<id>, @module-<m>, @lang-en. */
export function flowTags(flow: FlowDef, lang: Lang) {
  return [`@flow-${flow.id}`, `@module-${flow.module}`, `@lang-${lang.toLowerCase()}`];
}

export function flowTitle(flow: FlowDef, lang: Lang) {
  return `${flow.id} [${lang}] ${flow.title}`;
}

/** Inside the flow's describe block: serial mode, language guard, and the run state opened before the first item. */
export function setupFlow(flow: FlowDef, lang: Lang): () => string {
  test.describe.configure({ mode: 'serial' });
  if (lang === 'BM')
    test.fixme(process.env.QA_ALLOW_BM !== '1', 'Bahasa Melayu flows start only after every English flow passes and the user allows it (QA_ALLOW_BM=1).');
  if (lang !== language()) test.skip(true, `QA_LANG is ${language()}; this is the ${lang} flow`);
  let flowRunId = '';
  test.beforeAll(async () => {
    flowRunId = await openRun(flow, lang);
  });
  return () => flowRunId;
}

/** Title and details (tags, annotations for evidence and report) of each item of a flow. */
export function flowItems(flow: FlowDef) {
  return flow.items.map((item, index) => {
    const label = item.kind === 'step' ? item.step.id : `GATE ${item.gate.id}`;
    const title = `${String(index + 1).padStart(2, '0')} ${label} ${item.kind === 'step' ? item.step.title : item.gate.title}`;
    const details = scenario({
      cr: process.env.QA_CR || 'FLOW',
      id: `${flow.id}/${String(index + 1).padStart(2, '0')}_${item.kind === 'step' ? item.step.id : item.gate.id}`,
      module: flow.module,
      role: item.kind === 'step' ? item.step.role : 'Tester (manual gate)',
      tags: item.kind === 'step' ? [`@${item.step.id}`] : [`@gate-${item.gate.id}`],
      expected:
        item.kind === 'step'
          ? `${item.step.checkpoint.description}` +
            (item.step.outputs.some((o) => o.message) ? ` (message: ${item.step.outputs.map((o) => o.message).filter(Boolean).join(' / ')})` : ' (no expected message known yet)')
          : `Gate recorded as done by the tester`,
    });
    return { item, index, title, details };
  });
}

export interface FlowFixtures {
  page: Page;
  appMessages: AppMessage[];
  evidence: Evidence;
}

/** Body of one flow item's test. */
export async function runItem(flow: FlowDef, item: FlowItem, index: number, flowRunId: string, fx: FlowFixtures, testInfo: TestInfo) {
  test.setTimeout(60 * 60_000);
  const ctx: ItemCtx = { flow, item, index, flowRunId, ...fx, testInfo };
  if (item.kind === 'gate') await runGate(ctx, item.gate);
  else await runStep(ctx, item.step);
}

interface ItemCtx {
  flow: FlowDef;
  item: FlowItem;
  index: number;
  flowRunId: string;
  page: Page;
  appMessages: AppMessage[];
  evidence: Evidence;
  testInfo: TestInfo;
}

const itemKey = (it: FlowItem) => (it.kind === 'step' ? it.step.id : it.gate.id);

async function openRun(flow: FlowDef, lang: Lang): Promise<string> {
  const wanted = process.env.QA_FLOW === flow.id ? process.env.QA_FLOW_RUN : undefined;
  const id = wanted || `${flow.id}_${process.env.RUN_ID ?? 'local'}`;
  const existing = readRunState(id);
  if (existing && existing.flowId !== flow.id) throw new Error(`Run ${id} belongs to flow ${existing.flowId}, not ${flow.id}`);
  if (!existing) {
    writeJson(stateFile(id), newRunState(id, flow.id, flow.module, lang));
    emit(id, flow.id, 'flow-start', { module: flow.module, language: lang, items: flow.items.map(itemKey) });
  } else if (existing.status !== 'uncertain') {
    await updateRunState(id, (s) => {
      s.status = 'in-progress';
      delete s.blockedReason;
    });
    emit(id, flow.id, 'flow-start', { resumed: true, module: flow.module, language: lang, items: flow.items.map(itemKey) });
  }
  return id;
}

/** Stop this flow here without failing it: the person must act (gate, input, officer). Shown as BLOCKED. */
async function block(ctx: ItemCtx, reason: string): Promise<never> {
  await updateRunState(ctx.flowRunId, (s) => {
    s.status = 'blocked';
    s.blockedReason = reason;
  });
  fs.writeFileSync(path.join(runDir(ctx.flowRunId), 'NEXT_ACTION.md'), `# ${ctx.flowRunId} is waiting\n\n${reason}\n`);
  emit(ctx.flowRunId, ctx.flow.id, 'gate-blocked', { item: itemKey(ctx.item), reason });
  ctx.testInfo.annotations.push({ type: 'blocked', description: reason });
  ctx.evidence.log(`BLOCKED: ${reason}`);
  test.skip(true, `BLOCKED: ${reason}`);
  throw new Error('unreachable');
}

function skipItem(ctx: ItemCtx, why: string): never {
  emit(ctx.flowRunId, ctx.flow.id, 'step-skip', { item: itemKey(ctx.item), why });
  test.skip(true, why);
  throw new Error('unreachable');
}

/** Stop before this item when the run is blocked/uncertain or the item is outside --from/--to. */
function guard(ctx: ItemCtx, s: RunState) {
  // `qa stop` (or the first Ctrl+C in `qa run`) leaves a STOP file: finish the current step, start nothing new.
  if (fs.existsSync(path.join(runDir(ctx.flowRunId), 'STOP'))) skipItem(ctx, 'Stopped by the tester before this item (resume with: npm run qa -- resume)');
  if (s.status === 'uncertain') skipItem(ctx, `Run is UNCERTAIN: ${s.blockedReason ?? ''}`);
  if (s.status === 'blocked' && s.blockedReason && !s.blockedReason.includes(itemKey(ctx.item)))
    skipItem(ctx, `Run is blocked earlier: ${s.blockedReason}`);
  const keys = ctx.flow.items.map(itemKey);
  const from = s.from ? keys.indexOf(s.from) : 0;
  const to = s.to ? keys.indexOf(s.to) : keys.length - 1;
  if (ctx.index < from || ctx.index > to) skipItem(ctx, `Outside the selected range (${s.from ?? 'start'} → ${s.to ?? 'end'})`);
}

const fill = (text: string, s: RunState) =>
  text
    .replace(/\{RUN\}/g, s.flowRunId)
    // Malaysia time one hour ago, as 'YYYY-MM-DD HH24:MI:SS' for TO_DATE
    .replace(/\{NOW_MINUS_1H\}/g, new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 19).replace('T', ' '))
    .replace(/\{([A-Z]{2}(?:\|[A-Z]{2})*)\}/g, (_m, types: string) => types.split('|').map((t) => s.docs[t as DocType]).find(Boolean) ?? `<${types}>`);

async function runGate(ctx: ItemCtx, gate: GateDef) {
  const s = readRunState(ctx.flowRunId)!;
  guard(ctx, s);
  const g = s.gates[gate.id];
  if (g?.done) {
    const missing = (gate.provides ?? []).filter((d) => !s.docs[d]);
    if (missing.length) await block(ctx, `GATE ${gate.id} is marked done but ${missing.join(', ')} was not given. ${fill(gate.instructions, s)}`);
    ctx.evidence.log(`Gate ${gate.id} done by ${g.by} at ${g.at}${g.values ? ` (${Object.entries(g.values).map(([k, v]) => `${k}=${v}`).join(', ')})` : ''}`);
    ctx.evidence.actual(`Gate ${gate.id} recorded as done by ${g.by} at ${g.at}`);
    emit(ctx.flowRunId, ctx.flow.id, 'gate-passed', { item: gate.id, by: g.by, values: g.values });
    if (isLastSelected(ctx)) await finishRun(ctx);
    return;
  }
  // A gate may need documents from earlier steps; if they are missing the run is not ready for it.
  const needs = (gate.needs ?? []).filter((n) => !n.split('|').some((d) => s.docs[d as DocType]));
  const why = needs.length ? ` (also missing ${needs.join(', ')}: run the earlier steps or give --input)` : '';
  await block(ctx, `GATE ${gate.id} — ${gate.title}. ${fill(gate.instructions, s)}${why} When done: npm run qa -- gate --run ${s.flowRunId} --gate ${gate.id} --done`);
}

function officerFromOverrides(stepId: string): string | undefined {
  return (overrides as unknown as Record<string, Record<string, unknown>>)[stepId]?._officer as string | undefined;
}

async function runStep(ctx: ItemCtx, step: StepDef) {
  const s = readRunState(ctx.flowRunId)!;
  guard(ctx, s);
  const rec = s.steps[step.id];
  const rerunAllowed = s.allowRerun.includes(step.id);

  if (rec && (rec.state === 'verified' || rec.state === 'completed-unverified') && !rerunAllowed)
    skipItem(ctx, `Done in an earlier attempt (${rec.state}${Object.keys(rec.outputs).length ? `: ${Object.values(rec.outputs).join(', ')}` : ''})`);
  if (rec && (rec.state === 'running' || rec.state === 'uncertain') && !rerunAllowed) {
    const reason =
      `${step.id} was interrupted during an earlier attempt, so it may or may not have changed data on ${s.env}. ` +
      `Check the application (Task Status Search / the document list) and then either ` +
      `"npm run qa -- reconcile --run ${s.flowRunId} --step ${step.id} --done [DOC=number]" (it went through) or ` +
      `"... --step ${step.id} --redo" (it did not).`;
    await updateRunState(ctx.flowRunId, (x) => {
      x.steps[step.id].state = 'uncertain';
      x.status = 'uncertain';
      x.blockedReason = reason;
    });
    emit(ctx.flowRunId, ctx.flow.id, 'failure', { item: step.id, class: 'INTERRUPTED', reason });
    throw new Error(`UNCERTAIN: ${reason}`);
  }
  if (rec?.state === 'failed' && step.stateChanging && !rerunAllowed)
    await block(ctx, `${step.id} failed in an earlier attempt (${rec.attempts.at(-1)?.classification ?? 'see report'}). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run ${s.flowRunId} --step ${step.id}`);

  // Inputs: documents produced earlier in this run, given with --input, or supplied at a gate.
  const vars: Record<string, unknown> = { ...(ctx.flow.variables[step.id] ?? {}), ...(s.vars[step.id] ?? {}) };
  for (const inp of step.inputs) {
    const v = s.docs[inp.doc];
    if (!v) await block(ctx, `${step.id} needs a ${docName(inp.doc)} (${inp.doc}) and this run has none. Run the earlier steps, or start with --input ${inp.doc}=<number>.`);
    vars[inp.var] = v;
  }

  // Login: the step's own Katalon account, another step's account, or the officer SIT assigned the task to.
  let login: FlowLogin | undefined;
  let loginNote = 'Katalon default account of the step';
  if (step.login === 'assignedOfficer') {
    const officer = s.officers[step.id] ?? officerFromOverrides(step.id);
    if (!officer)
      await block(ctx, `${step.id} must log in as the officer SIT assigned the task to. Find it in Task Status Search for ${step.inputs.map((i) => s.docs[i.doc]).join(', ')}, then: npm run qa -- gate --run ${s.flowRunId} --officer ${step.id}=<login ID>`);
    login = { officer: officer! };
    loginNote = s.officers[step.id] ? `officer ${officer} (given for this run)` : `officer ${officer} from data-overrides.json (seen in an earlier run; not checked for this document)`;
  } else if (typeof step.login === 'object') {
    login = { accountOf: step.login.accountOf };
    loginNote = `account of ${step.login.accountOf}`;
  }

  const attemptStart = nowMy();
  await updateRunState(ctx.flowRunId, (x) => {
    x.allowRerun = x.allowRerun.filter((id) => id !== step.id);
    const r = (x.steps[step.id] ??= { state: 'running', attempts: [], outputs: {} });
    r.state = 'running';
    r.login = loginNote;
    r.attempts.push({ runId: process.env.RUN_ID ?? 'local', startedAt: attemptStart, result: 'running', evidenceDir: ctx.evidence.dir });
  });
  emit(ctx.flowRunId, ctx.flow.id, 'step-start', { item: step.id, title: step.title, role: step.role, login: loginNote, inputs: vars, checkpoint: step.checkpoint.id });
  ctx.evidence.log(`${step.id} ${step.title} — role ${step.role}, login: ${loginNote}`);

  // Screenshot every application message as it appears (the scripts sign out at the end, so the final page is not evidence).
  let shots = 0;
  const seen = ctx.appMessages.length;
  const watcher = setInterval(() => {
    for (const m of ctx.appMessages.slice(seen + shots)) {
      shots++;
      emit(ctx.flowRunId, ctx.flow.id, 'message', { item: step.id, severity: m.severity, text: m.text });
      if (shots <= 12) ctx.evidence.capture(`message_${m.severity}`, { step: `${step.id} application message`, actual: m.text }).catch(() => {});
    }
  }, 250);

  setFlowInputs(step.id, { vars, login });
  let error: unknown;
  try {
    const mod = await STEPS[step.id]();
    await mod.run();
  } catch (e) {
    error = e;
  } finally {
    setFlowInputs(step.id, undefined);
    clearInterval(watcher);
  }
  const messages = ctx.appMessages.slice(seen).map((m) => ({ severity: m.severity, text: m.text }));

  if (error) {
    const text = String((error as Error)?.message ?? error);
    const c = classify(text, ctx.appMessages.slice(seen));
    await endStep(ctx, step, 'failed', {}, messages, `${c.class} (${c.confidence}): ${c.because}`, text);
    emit(ctx.flowRunId, ctx.flow.id, 'failure', { item: step.id, class: c.class, confidence: c.confidence, because: c.because, error: text.split('\n')[0] });
    throw error;
  }

  // Outcome: the expected message and document, from the application's messages, else from what the script read.
  const texts = [...ctx.appMessages.slice(seen).filter((m) => m.severity === 'info').map((m) => m.text), ...observedTexts()];
  const outputs: Partial<Record<DocType, string>> = {};
  const problems: string[] = [];
  let allObserved = step.outputs.length > 0;
  for (const o of step.outputs) {
    const re = o.message ? new RegExp(o.message, 'i') : null;
    const hit = texts.filter((t) => (!re || re.test(t)) && findDocs(t, o.doc).length).at(-1);
    if (!hit) {
      allObserved = false;
      if (re) problems.push(`expected message /${o.message}/ with a ${o.doc} number was not observed`);
      continue;
    }
    const doc = findDocs(hit, o.doc).at(-1)!;
    const input = step.inputs.find((i) => i.doc === o.doc);
    if (input && vars[input.var] !== doc) problems.push(`the message names ${doc}, but the step worked on ${vars[input.var]}`);
    outputs[o.doc] = doc;
  }
  if (problems.length) {
    const text = `Expected outcome not observed for ${step.id}: ${problems.join('; ')}`;
    await endStep(ctx, step, 'failed', outputs, messages, 'BUSINESS_ASSERTION (high): the step finished but its expected outcome was not seen', text);
    emit(ctx.flowRunId, ctx.flow.id, 'failure', { item: step.id, class: 'BUSINESS_ASSERTION', error: text });
    throw new Error(text);
  }
  const verified = allObserved && step.checkpoint.verification !== 'unverified';
  const state: StepState = verified ? 'verified' : 'completed-unverified';
  await endStep(ctx, step, state, outputs, messages);

  // Test data registry: the documents this step produced or moved, with the checkpoint they reached.
  const parents = step.inputs.map((i) => String(vars[i.var]));
  for (const [doc, ref] of Object.entries(outputs))
    await recordTransaction({ ref: ref!, docType: doc as DocType, module: step.module, checkpoint: step.checkpoint.id, verified, flowRunId: ctx.flowRunId, stepId: step.id, produced: !parents.includes(ref!), parents: parents.filter((p) => p !== ref) });
  for (const i of step.inputs)
    if (!Object.values(outputs).includes(String(vars[i.var])))
      await recordTransaction({ ref: String(vars[i.var]), docType: i.doc, module: step.module, checkpoint: step.checkpoint.id, verified, flowRunId: ctx.flowRunId, stepId: step.id, produced: false });

  const summary = `${step.checkpoint.id} ${verified ? 'VERIFIED' : 'COMPLETED (not verified)'}` + (Object.keys(outputs).length ? ` — ${Object.entries(outputs).map(([k, v]) => `${k} ${v}`).join(', ')}` : '');
  ctx.evidence.actual(summary);
  if (!verified) ctx.testInfo.annotations.push({ type: 'warning', description: `${step.id}: completed, but its outcome is not verified (no expected message known or seen)` });
  if (isLastSelected(ctx)) await finishRun(ctx);
}

async function endStep(ctx: ItemCtx, step: StepDef, state: StepState, outputs: Partial<Record<DocType, string>>, messages: { severity: string; text: string }[], classification?: string, error?: string) {
  await updateRunState(ctx.flowRunId, (x) => {
    const r = x.steps[step.id];
    r.state = state;
    Object.assign(r.outputs, outputs);
    if (state !== 'failed') {
      r.checkpoint = step.checkpoint.id;
      Object.assign(x.docs, outputs);
    } else x.status = 'failed';
    const a = r.attempts.at(-1)!;
    Object.assign(a, { endedAt: nowMy(), result: state, messages, classification, error: error?.split('\n')[0] });
  });
  emit(ctx.flowRunId, ctx.flow.id, 'step-end', { item: step.id, state, outputs, checkpoint: step.checkpoint.id, classification });
}

/** True for the last item of the selection (--to, else the flow's last item). */
function isLastSelected(ctx: ItemCtx): boolean {
  const s = readRunState(ctx.flowRunId)!;
  const to = s.to ? ctx.flow.items.map(itemKey).indexOf(s.to) : ctx.flow.items.length - 1;
  return ctx.index === to;
}

async function finishRun(ctx: ItemCtx) {
  const s = await updateRunState(ctx.flowRunId, (x) => {
    if (x.status === 'in-progress') x.status = 'completed';
  });
  emit(ctx.flowRunId, ctx.flow.id, 'flow-end', { status: s.status, docs: s.docs });
}
