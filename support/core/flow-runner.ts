import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import { test, scenario } from '../../fixtures/flow';
import type { Evidence } from '../../fixtures/test';
import type { AppMessage } from './app-messages';
import { classify } from './classify';
import { getEnv } from '../../config/environments';
import { assignedOfficer, invitedSupplierLogins, openTasks, waitForTask } from './bpm-tasks';
import { language, nowMy, runDir, stateDir, type Lang } from './context';
import { recordTransaction } from './data-registry';
import { adjustmentsOf, contractOfLoa, currentStatus, deliveryOrdersOf, ordersOfRequest, parseKind, statusHistory, statusKinds } from './doc-status';
import { docName, findDocs, isDocType, looksLike, type DocType } from './documents';
import { emit } from './events';
import { newRunState, readRunState, stateFile, updateRunState, type Attempt, type DbResult, type RunState, type StepRecord, type StepState } from './run-state';
import { dmlStatements, sitDbAvailable, sitExecute, sitQuery } from './sit-db';
import { checkSimulation, planSimulation } from './simulate';
import { writeJson } from './json-file';
import type { DbCheck, FlowDef, FlowItem, GateDef, StepDef } from './workflow-registry';
import { setFlowInputs, observedTexts, type FlowLogin } from '../katalon/runtime';
import { STEPS } from '../katalon/steps';
import { MODULE_STEPS } from '../modules';
import { loadPasswordFor, loadSharedOfficerPassword } from '../credentials';
import { closeAnnouncement, ssoLogin, ssoLogout } from '../mof/sso';
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

export interface SetupOptions {
  /** Stop after this item (data-prep specs stop at one status). */
  to?: string;
  /** Start at this item (execution specs start where data prep stopped). */
  from?: string;
  /** Run ID prefix (default `<flow>` or `<flow>-to-<to>`); the RUN_ID is appended. CR suites: `CR-<cr>_<scenario>_prep`. */
  runPrefix?: string;
  /**
   * Execution: take the documents of the latest COMPLETED run whose ID starts with this prefix (the data-prep run),
   * unless QA_INPUT="LA=LA26…,SQ=SQ26…" gives them. The documents must still be at the status data prep left them in.
   */
  inputsFrom?: string;
  cr?: string;
  /**
   * Continue the latest unfinished run with this prefix instead of starting a new one (status specs: rerun the same spec
   * after a gate or a simulation and it picks up where it stopped). QA_NEW_RUN=1 forces a new run.
   */
  resumeLatest?: boolean;
}

/**
 * Inside the flow's describe block: serial mode, language guard, and the run state opened before the first item.
 */
export function setupFlow(flow: FlowDef, lang: Lang, opts: SetupOptions = {}): () => string {
  test.describe.configure({ mode: 'serial' });
  if (lang === 'BM')
    test.fixme(process.env.QA_ALLOW_BM !== '1', 'Bahasa Melayu flows start only after every English flow passes and the user allows it (QA_ALLOW_BM=1).');
  if (lang !== language()) test.skip(true, `QA_LANG is ${language()}; this is the ${lang} flow`);
  if (opts.cr) process.env.QA_CR = opts.cr;
  let flowRunId = '';
  test.beforeAll(async () => {
    flowRunId = await openRun(flow, lang, opts);
  });
  return () => flowRunId;
}

/** QA_INPUT="LA=LA26…,SQ=SQ26…" → { LA: …, SQ: … } (checked shapes). */
function inputsFromEnv(): Partial<Record<DocType, string>> {
  const out: Partial<Record<DocType, string>> = {};
  for (const pair of (process.env.QA_INPUT ?? '').split(',').map((p) => p.trim()).filter(Boolean)) {
    const [k, v] = pair.split('=').map((x) => x?.trim());
    if (!isDocType(k) || !v || !looksLike(k, v)) throw new Error(`QA_INPUT: "${pair}" is not DOC=number (e.g. LA=LA260000000004216)`);
    out[k] = v;
  }
  return out;
}

/** Documents of the latest completed run whose ID starts with `prefix_` (a data-prep run). */
export function preparedDocs(prefix: string): { runId: string; docs: Partial<Record<DocType, string>> } | undefined {
  const base = path.join(stateDir(), 'runs');
  if (!fs.existsSync(base)) return undefined;
  const runs = fs
    .readdirSync(base)
    .filter((d) => d.startsWith(`${prefix}_`))
    .map((d) => readRunState(d))
    .filter((s): s is RunState => !!s && s.status === 'completed')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return runs[0] ? { runId: runs[0].flowRunId, docs: runs[0].docs } : undefined;
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
  test.setTimeout(3 * 60 * 60_000); // long steps: QT evaluation phase, iGFMAS waits, SQ quarter hours
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
  /** Why this attempt is an automatic self-heal retry (recorded on the attempt). */
  healReason?: string;
}

const itemKey = (it: FlowItem) => (it.kind === 'step' ? it.step.id : it.gate.id);

async function openRun(flow: FlowDef, lang: Lang, opts: SetupOptions): Promise<string> {
  const { to, from } = opts;
  const wanted = process.env.QA_FLOW === flow.id ? process.env.QA_FLOW_RUN : undefined;
  const prefix = opts.runPrefix ?? `${flow.id}${to ? `-to-${to}` : ''}`;
  let latest: string | undefined;
  if (!wanted && opts.resumeLatest && process.env.QA_NEW_RUN !== '1') {
    const base = path.join(stateDir(), 'runs');
    latest = (fs.existsSync(base) ? fs.readdirSync(base) : [])
      .filter((d) => d.startsWith(`${prefix}_`))
      .map((d) => readRunState(d))
      .filter((x): x is RunState => !!x && x.status !== 'completed')
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.flowRunId;
  }
  const id = wanted || latest || `${prefix}_${process.env.RUN_ID ?? 'local'}`;
  const existing = readRunState(id);
  if (existing && existing.flowId !== flow.id) throw new Error(`Run ${id} belongs to flow ${existing.flowId}, not ${flow.id}`);
  if (!existing) {
    // Execution: documents from QA_INPUT, else from the latest completed data-prep run.
    let docs: Partial<Record<DocType, string>> = inputsFromEnv();
    let source = Object.keys(docs).length ? 'QA_INPUT' : '';
    if (!source && opts.inputsFrom) {
      const p = preparedDocs(opts.inputsFrom);
      if (p) ((docs = { ...p.docs }), (source = `data-prep run ${p.runId}`));
    }
    const st: RunState = { ...newRunState(id, flow.id, flow.module, lang), to: to ?? null, from: from ?? null, docs };
    writeJson(stateFile(id), st);
    emit(id, flow.id, 'flow-start', { module: flow.module, language: lang, items: flow.items.map(itemKey), docs, source });
    if (from) await precheckPrepared(flow, id, from, source, opts.inputsFrom);
  } else if (existing.status !== 'uncertain') {
    await updateRunState(id, (s) => {
      s.status = 'in-progress';
      delete s.blockedReason;
    });
    emit(id, flow.id, 'flow-start', { resumed: Object.keys(existing.steps).length + Object.keys(existing.gates).length > 0, module: flow.module, language: lang, items: flow.items.map(itemKey) });
  }
  return id;
}

/**
 * Before an execution starts at `from`: the prepared documents must exist and still be at the status the previous
 * item leaves them in (its checkpoint.db). Otherwise the run is BLOCKED before anything changes data.
 */
async function precheckPrepared(flow: FlowDef, id: string, from: string, source: string, inputsFrom?: string) {
  const idx = flow.items.findIndex((it) => itemKey(it) === from);
  const prev = flow.items.slice(0, idx).reverse().find((it) => it.kind === 'step' || it.gate.db);
  const db = prev ? (prev.kind === 'step' ? prev.step.checkpoint.db : prev.gate.db) : undefined;
  const s = readRunState(id)!;
  const blockRun = async (reason: string) => {
    await updateRunState(id, (x) => {
      x.status = 'blocked';
      x.blockedReason = reason;
    });
    fs.writeFileSync(path.join(runDir(id), 'NEXT_ACTION.md'), `# ${id} is waiting\n\n${reason}\n`);
    emit(id, flow.id, 'gate-blocked', { item: from, reason });
  };
  const first = flow.items[idx];
  const needs = first?.kind === 'step' ? first.step.inputs.map((i) => i.doc).filter((d) => !s.docs[d]) : [];
  if (needs.length) {
    return blockRun(
      `PREPARED DATA MISSING before ${from}: no ${needs.join(', ')}. Run the data-prep spec first` +
        (inputsFrom ? ` (a completed run "${inputsFrom}_…")` : '') +
        `, or give it: QA_INPUT=${needs[0]}=<number>.`,
    );
  }
  if (!db || db.statusId == null) return;
  const no = s.docs[parseKind(db.kind).doc];
  if (!no || !dbReady()) return;
  const cur = currentStatus(db.kind, no);
  emit(id, flow.id, 'db-status', { item: from, kind: db.kind, docNo: no, statusId: cur?.statusId ?? null, en: cur?.en, expected: db.statusId, when: 'before execution' });
  if (cur?.statusId !== db.statusId)
    return blockRun(
      `PREPARED DATA NOT AT THE START STATUS: ${no} (${source}) is at ${cur ? `${cur.statusId} ${cur.en}` : 'no status'}, ` +
        `but ${from} needs ${db.statusId} ${db.en ?? ''}. It was probably used already: run the data-prep spec again.`,
    );
}

/**
 * PO_LOOKUP / CO_LOOKUP (order iGFMAS creates from the PR/CR) and DO_LOOKUP (delivery against the PO/CO), polled every
 * 30 s for up to QA_LOOKUP_WAIT_MIN (default 15) minutes. Returns the documents found, or undefined (the gate then asks).
 */
async function autoLookup(ctx: ItemCtx, gate: GateDef, docs: Partial<Record<DocType, string>>): Promise<Partial<Record<DocType, string>> | undefined> {
  const find = (): Partial<Record<DocType, string>> | undefined => {
    if (gate.id === 'PO_LOOKUP' && docs.PR) {
      const o = ordersOfRequest(docs.PR).filter((x) => x.docType === 'PO').at(-1);
      return o ? { PO: o.docNo } : undefined;
    }
    if (gate.id === 'CO_LOOKUP' && docs.CR) {
      const o = ordersOfRequest(docs.CR).filter((x) => x.docType === 'CO').at(-1);
      return o ? { CO: o.docNo } : undefined;
    }
    if (gate.id === 'DO_LOOKUP' && (docs.CO || docs.PO)) {
      const d = deliveryOrdersOf((docs.CO ?? docs.PO)!).at(-1);
      return d ? { DO: d.docNo } : undefined;
    }
    if (gate.id === 'DN_LOOKUP' && (docs.CO || docs.PO)) {
      const d = adjustmentsOf((docs.CO ?? docs.PO)!, 'DN').at(-1);
      return d ? { DN: d.docNo } : undefined;
    }
    return undefined;
  };
  if (!['PO_LOOKUP', 'CO_LOOKUP', 'DO_LOOKUP', 'DN_LOOKUP'].includes(gate.id)) return undefined;
  const end = Date.now() + Number(process.env.QA_LOOKUP_WAIT_MIN ?? 15) * 60_000;
  for (let first = true; ; first = false) {
    const r = find();
    if (r) {
      ctx.evidence.log(`Gate ${gate.id}: found in the SIT database: ${Object.entries(r).map(([k, v]) => `${k} ${v}`).join(', ')}`);
      emit(ctx.flowRunId, ctx.flow.id, 'note', { item: gate.id, text: `found in SIT DB: ${Object.entries(r).map(([k, v]) => `${k} ${v}`).join(', ')}` });
      return r;
    }
    if (Date.now() > end) return undefined;
    if (first) emit(ctx.flowRunId, ctx.flow.id, 'note', { item: gate.id, text: `waiting for it in the SIT database (up to ${process.env.QA_LOOKUP_WAIT_MIN ?? 15} min)` });
    await new Promise((res) => setTimeout(res, 30_000));
  }
}

/** The document a DB check needs: from the run, or derived (a contract from its LOA). */
function docFor(doc: DocType, docs: Partial<Record<DocType, string>>): string | undefined {
  if (docs[doc]) return docs[doc];
  try {
    if (doc === 'CT' && docs.LA) return contractOfLoa(docs.LA);
  } catch {
    /* no derivation */
  }
  return undefined;
}

/** Runs a step's proof query (read-only); true = done, false = not done, undefined = could not check. */
function proofOf(step: StepDef, docs: Partial<Record<DocType, string>>): boolean | undefined {
  const sql = step.checkpoint.proofSql;
  if (!sql || !dbReady()) return undefined;
  const filled = sql.replace(/{([A-Z]{2})}/g, (_m, t: string) => docs[t as DocType] ?? '<missing>');
  if (filled.includes('<missing>')) return undefined;
  try {
    return Number(sitQuery(filled)[0]?.[0] ?? 0) > 0;
  } catch {
    return undefined;
  }
}

function dbReady(): boolean {
  return getEnv().name === 'SIT' && process.env.QA_DB_CHECK !== '0' && sitDbAvailable();
}

/**
 * Reads the SIT database status the checkpoint expects, waiting while SIT finishes the move. Never changes data.
 * Returns undefined when it cannot check (not SIT, no DBeaver SIT connection, QA_DB_CHECK=0, document unknown).
 */
async function checkDb(ctx: ItemCtx, db: DbCheck, docs: Partial<Record<DocType, string>>): Promise<DbResult | undefined> {
  const { doc } = parseKind(db.kind);
  if (!dbReady()) return undefined;
  const no = docFor(doc, docs);
  if (!no) return undefined;
  const waitMs = (db.waitSec ?? (db.via?.length ? 600 : db.observeOnly ? 30 : 120)) * 1000;
  const end = Date.now() + waitMs;
  let cur = currentStatus(db.kind, no);
  while (db.statusId != null && cur?.statusId !== db.statusId && Date.now() < end) {
    await new Promise((r) => setTimeout(r, 5_000));
    cur = currentStatus(db.kind, no);
  }
  const r: DbResult = {
    kind: db.kind, docNo: no, expected: db.statusId, statusId: cur?.statusId ?? null, en: cur?.en ?? '', bm: cur?.bm ?? '', at: cur?.at ?? '',
    ok: db.statusId == null || cur?.statusId === db.statusId, checkedAt: nowMy(),
    ...(db.observeOnly ? { observeOnly: true } : {}),
  };
  emit(ctx.flowRunId, ctx.flow.id, 'db-status', { item: itemKey(ctx.item), ...r });
  ctx.evidence.log(`DB status ${db.kind} ${no}: ${r.statusId ?? '-'} ${r.en} / ${r.bm}${db.statusId != null ? ` (expected ${db.statusId}${r.ok ? ', OK' : db.observeOnly ? ', different — observe-only, reported' : ', MISMATCH'})` : ''}`);
  if (!r.ok && db.observeOnly) ctx.testInfo.annotations.push({ type: 'warning', description: `${db.kind} ${no} is at ${r.statusId} ${r.en}; the registry expects ${db.statusId} (observe-only, from ${db.evidence})` });
  return r;
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
    skipItem(ctx, `Run is blocked earlier (${s.blockedReason.match(/^GATE \w+|^KAT-\d+/)?.[0] ?? 'see status'})`);
  const keys = ctx.flow.items.map(itemKey);
  const from = s.from ? keys.indexOf(s.from) : 0;
  const to = s.to ? keys.indexOf(s.to) : keys.length - 1;
  if (ctx.index < from || ctx.index > to) skipItem(ctx, `Outside the selected range (${s.from ?? 'start'} → ${s.to ?? 'end'})`);
}

const fill = (text: string, s: RunState) =>
  text
    .replace(/\{RUN\}/g, s.flowRunId)
    // Nearest upcoming quarter hour in Malaysia time (:00/:15/:30/:45), as 'YYYY-MM-DD HH24:MI:SS' for TO_DATE.
    // User rule 2026-11-23: SIT processes Simple Quote dates on the quarter hour.
    .replace(/\{NEXT_QUARTER\}/g, () => {
      const q = 15 * 60_000;
      const t = Math.ceil((Date.now() + 8 * 3600_000) / q) * q;
      return new Date(t).toISOString().slice(0, 19).replace('T', ' ');
    })
    .replace(/\{([A-Z]{2}(?:\|[A-Z]{2})*)\}/g, (_m, types: string) => types.split('|').map((t) => s.docs[t as DocType]).find(Boolean) ?? `<${types}>`);

async function runGate(ctx: ItemCtx, gate: GateDef) {
  const s = readRunState(ctx.flowRunId)!;
  guard(ctx, s);
  let g = s.gates[gate.id];
  // A lookup gate whose documents the tester already gave (--input) needs no second answer.
  if (!g?.done && gate.type === 'lookup' && gate.provides?.length && gate.provides.every((d) => s.docs[d])) {
    const values = Object.fromEntries(gate.provides.map((d) => [d, s.docs[d]!]));
    g = { done: true, by: `${s.tester} (--input)`, at: nowMy(), values };
    await updateRunState(ctx.flowRunId, (x) => {
      x.gates[gate.id] = g!;
    });
  }
  // DN_LOOKUP: no debit note when the order went straight to Pending Payment Match (invoice not above the order):
  // the gate is not needed and the debit-note approval is skipped (2026-11-24 PO260000000007216 → 41025, no DN).
  if (!g?.done && gate.id === 'DN_LOOKUP' && dbReady() && (s.docs.PO || s.docs.CO)) {
    const order = (s.docs.CO ?? s.docs.PO)!;
    const cur = currentStatus(s.docs.CO ? 'CO' : 'PO', order);
    if (cur && [41025, 41525].includes(cur.statusId) && !adjustmentsOf(order, 'DN').length) {
      const why = `no debit note: ${order} is at ${cur.statusId} ${cur.en}`;
      const next = ctx.flow.items.slice(ctx.index + 1).find((it) => it.kind === 'step' && it.step.inputs.some((i) => i.doc === 'DN'));
      g = { done: true, by: `SIT database (${why})`, at: nowMy() };
      await updateRunState(ctx.flowRunId, (x) => {
        x.gates[gate.id] = g!;
        if (next && next.kind === 'step') x.skipItems = { ...(x.skipItems ?? {}), [next.step.id]: why };
      });
      emit(ctx.flowRunId, ctx.flow.id, 'note', { item: gate.id, text: `not needed — ${why}` });
      ctx.evidence.log(`Gate ${gate.id} not needed — ${why}`);
    }
  }
  // SQL gates (SQ dates): run the allow-listed SQL when the user allowed it (QA_AUTO_SQL=1), then wait for the time it sets.
  if (!g?.done && gate.sql && process.env.QA_AUTO_SQL === '1' && dbReady()) {
    const sql = fill(gate.sql, s);
    if (/<[A-Z|]+>/.test(sql)) await block(ctx, `GATE ${gate.id}: missing document for ${sql}`);
    sitExecute([sql], s.tester, `Gate ${gate.id} (${s.flowRunId})`);
    ctx.evidence.log(`Gate ${gate.id}: ran ${sql}`);
    emit(ctx.flowRunId, ctx.flow.id, 'note', { item: gate.id, text: `SQL run: ${sql}` });
    const at = sql.match(/TO_DATE\('(\d{4}-\d\d-\d\d \d\d:\d\d:\d\d)'/)?.[1];
    if (at && gate.waitUntilTime) {
      const until = new Date(`${at.replace(' ', 'T')}+08:00`).getTime() + 90_000;
      const ms = Math.max(0, until - Date.now());
      emit(ctx.flowRunId, ctx.flow.id, 'note', { item: gate.id, text: `waiting ${Math.round(ms / 60000)} min until ${at} has passed` });
      await new Promise((r) => setTimeout(r, ms));
    }
    g = { done: true, by: `${s.tester} via automatic SQL (user permission)`, at: nowMy() };
    await updateRunState(ctx.flowRunId, (x) => {
      x.gates[gate.id] = g!;
    });
  }
  // PO/CO/DO lookups: read the number from the SIT database instead of asking the tester (read-only; QA_AUTO_LOOKUP=0 turns it off).
  if (!g?.done && gate.type === 'lookup' && process.env.QA_AUTO_LOOKUP !== '0' && dbReady()) {
    const found = await autoLookup(ctx, gate, s.docs);
    if (found) {
      g = { done: true, by: 'SIT database (automatic lookup)', at: nowMy(), values: found };
      await updateRunState(ctx.flowRunId, (x) => {
        x.gates[gate.id] = g!;
        Object.assign(x.docs, found);
      });
      Object.assign(s.docs, found);
    }
  }
  if (g?.done) {
    const notNeeded = g.by.startsWith('SIT database (no ');
    const missing = notNeeded ? [] : (gate.provides ?? []).filter((d) => !s.docs[d]);
    if (missing.length) await block(ctx, `GATE ${gate.id} is marked done but ${missing.join(', ')} was not given. ${fill(gate.instructions, s)}`);
    ctx.evidence.log(`Gate ${gate.id} done by ${g.by} at ${g.at}${g.values ? ` (${Object.entries(g.values).map(([k, v]) => `${k}=${v}`).join(', ')})` : ''}`);
    if (gate.db && !g.db?.ok) {
      const r = await checkDb(ctx, gate.db, s.docs);
      if (r) {
        await updateRunState(ctx.flowRunId, (x) => {
          x.gates[gate.id].db = r;
        });
        if (!r.ok && !gate.db.observeOnly)
          await block(ctx, `GATE ${gate.id} is recorded as done, but ${r.docNo} is still at ${r.statusId ?? '-'} ${r.en} (expected ${gate.db.statusId} ${gate.db.en ?? ''}) after waiting. Check the SQL/date, then resume.`);
      }
    }
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

/**
 * Memory guard (2026-11-23: a batch was killed mid-step when the PC ran low on memory). Before a step starts, wait
 * until at least QA_MIN_FREE_GB (default 1.2 GB) is free, checking every 30 s for up to QA_MEMORY_WAIT_MIN (default
 * 10) minutes; if memory stays low, stop BETWEEN steps (BLOCKED, resumable) instead of risking a kill mid-step.
 */
async function waitForMemory(ctx: ItemCtx, step: StepDef) {
  const min = Number(process.env.QA_MIN_FREE_GB ?? 1.2);
  const deadline = Date.now() + Number(process.env.QA_MEMORY_WAIT_MIN ?? 10) * 60_000;
  const freeGb = () => os.freemem() / 1024 ** 3;
  let warned = false;
  while (freeGb() < min) {
    if (Date.now() > deadline)
      await block(ctx, `LOW MEMORY before ${step.id}: only ${freeGb().toFixed(1)} GB free (need ${min} GB). Close some apps (e.g. browser tabs), then: npm run qa -- resume --env sit --run ${ctx.flowRunId}`);
    if (!warned) {
      ctx.evidence.log(`Waiting for memory before ${step.id}: ${freeGb().toFixed(1)} GB free, need ${min} GB`);
      emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `waiting for memory (${freeGb().toFixed(1)} GB free)` });
      warned = true;
    }
    await new Promise((r) => setTimeout(r, 30_000));
  }
}

/** Login username of each step's Katalon account (.auth/katalon-variables.json, git-ignored; passwords not read here). */
let accountsCache: Record<string, string> | undefined;
function stepAccounts(): Record<string, string> {
  if (accountsCache) return accountsCache;
  const f = path.join(__dirname, '..', '..', '.auth', 'katalon-variables.json');
  const raw = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as Record<string, { Username?: string }>) : {};
  accountsCache = Object.fromEntries(Object.entries(raw).filter(([, v]) => v.Username).map(([k, v]) => [k, String(v.Username)]));
  return accountsCache;
}

/** Username and password of a Katalon step's account, for module steps that act as that supplier / officer. */
function katalonAccount(stepId: string): { Username: string; Password: string } | undefined {
  const f = path.join(__dirname, '..', '..', '.auth', 'katalon-variables.json');
  if (!fs.existsSync(f)) return undefined;
  const a = (JSON.parse(fs.readFileSync(f, 'utf8')) as Record<string, { Username?: string; Password?: string }>)[stepId];
  return a?.Username && a.Password ? { Username: String(a.Username), Password: String(a.Password) } : undefined;
}

function officerFromOverrides(stepId: string): string | undefined {
  return (overrides as unknown as Record<string, Record<string, unknown>>)[stepId]?._officer as string | undefined;
}

async function runStep(ctx: ItemCtx, step: StepDef) {
  const s = readRunState(ctx.flowRunId)!;
  guard(ctx, s);
  if (s.skipItems?.[step.id]) skipItem(ctx, `Not needed in this run: ${s.skipItems[step.id]}`);
  if (step.onlyIfStatus && dbReady() && !s.steps[step.id]) {
    const no = docFor(parseKind(step.onlyIfStatus.kind).doc, s.docs);
    const cur = no ? currentStatus(step.onlyIfStatus.kind, no) : undefined;
    if (cur && cur.statusId !== step.onlyIfStatus.statusId) {
      emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `not needed: ${no} is at ${cur.statusId} ${cur.en}, not ${step.onlyIfStatus.statusId}` });
      skipItem(ctx, `Not needed: ${no} is at ${cur.statusId} ${cur.en} (this step only runs at ${step.onlyIfStatus.statusId})`);
    }
  }
  const rec = s.steps[step.id];
  const rerunAllowed = s.allowRerun.includes(step.id);

  if (rec && (rec.state === 'verified' || rec.state === 'completed-unverified') && !rerunAllowed) {
    // A step the person did by hand (manual step, or reconciled): confirm its checkpoint in the SIT database once.
    const db = step.checkpoint.db;
    if (db && db.statusId != null && !rec.db?.ok) {
      const r = await checkDb(ctx, db, s.docs);
      // a later step may already have moved the document on (KAT-060 DO 42000 → FL-101 42010, 2026-11-25): the
      // checkpoint status in the document's DB history proves the step went through
      if (r && !r.ok && r.docNo) {
        try {
          if (statusHistory(db.kind, r.docNo).some((h) => h.statusId === db.statusId)) {
            ctx.evidence.log(`${step.id}: ${r.docNo} passed ${db.statusId} earlier (DB history), now at ${r.statusId}; checkpoint accepted`);
            r.ok = true;
          }
        } catch { /* kind without history: keep the result */ }
      }
      if (r) {
        await updateRunState(ctx.flowRunId, (x) => {
          x.steps[step.id].db = r;
          if (r.ok) x.steps[step.id].state = 'verified';
        });
        if (!r.ok && !db.observeOnly)
          await block(ctx, `${step.id} is recorded as done, but ${r.docNo} is at ${r.statusId ?? '-'} ${r.en}, not ${db.statusId} ${db.en ?? ''} (${step.checkpoint.id}). Finish it in the application, then: npm run qa -- resume --env sit --run ${s.flowRunId}`);
        ctx.evidence.actual(r.ok ? `${step.checkpoint.id} VERIFIED by the SIT database: ${r.docNo} ${r.statusId} ${r.en} / ${r.bm}` : `${step.checkpoint.id} done by hand; DB shows ${r.docNo} ${r.statusId} ${r.en} (registry expectation ${db.statusId} is observe-only)`);
        await recordDocs(ctx, step, s.docs, r.ok);
        if (isLastSelected(ctx)) await finishRun(ctx);
        return;
      }
    }
    skipItem(ctx, `Done in an earlier attempt (${rec.state}${Object.keys(rec.outputs).length ? `: ${Object.values(rec.outputs).join(', ')}` : ''})`);
  }
  // SELF-HEAL: a failed or interrupted state-changing step is resolved from evidence, not repeated blindly.
  if (rec && ['running', 'uncertain', 'failed'].includes(rec.state) && step.stateChanging && !rerunAllowed) {
    const heal = await selfHeal(ctx, step, rec, s);
    if (heal === 'done') {
      ctx.evidence.actual(`${step.checkpoint.id} VERIFIED by the SIT database (self-heal: the earlier attempt went through)`);
      if (isLastSelected(ctx)) await finishRun(ctx);
      return;
    }
    if (heal === 'retry') return runStep(ctx, step);
  }
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

  // Manual step (not automated yet): the tester does it in the application, records it, and the DB status confirms it.
  if (step.automation === 'manual') {
    const docsIn = step.inputs.map((i) => `${i.doc} ${vars[i.var]}`).join(', ');
    let who = '';
    if (dbReady() && step.inputs.length) {
      const a = assignedOfficer(step.inputs.map((i) => String(vars[i.var])), step.bpmTask);
      who = ` ${a.why}.`;
    }
    await updateRunState(ctx.flowRunId, (x) => {
      x.steps[step.id] ??= { state: 'blocked', attempts: [{ runId: process.env.RUN_ID ?? 'local', startedAt: nowMy(), result: 'blocked' }], outputs: {} };
    });
    const outs = step.outputs.map((o) => ` ${o.doc}=<number>`).join('');
    await block(
      ctx,
      `MANUAL ${step.id} — ${step.title} (${step.role})${docsIn ? ` on ${docsIn}` : ''}. Not automated yet: do it in the application.` +
        `${step.instructions ? ` ${step.instructions}` : ''}${who} Expected afterwards: ${step.checkpoint.db ? `${step.checkpoint.db.kind} status ${step.checkpoint.db.statusId} ${step.checkpoint.db.en ?? ''}` : step.checkpoint.description}. ` +
        `Then: npm run qa -- reconcile --env sit --run ${s.flowRunId} --step ${step.id} --done${outs}  and  npm run qa -- resume --env sit --run ${s.flowRunId}`,
    );
  }

  // A step on a BPM task: wait until SIT has created the task (the previous step's task spawns asynchronously).
  if (step.bpmTask && dbReady() && step.inputs.length) {
    const no = String(vars[step.inputs[0].var]);
    const t = await waitForTask(no, step.bpmTask, Number(process.env.QA_TASK_WAIT_MIN ?? 5) * 60_000);
    if (!t) await block(ctx, `${step.id}: SIT has no open "${step.bpmTask}" task for ${no} after ${process.env.QA_TASK_WAIT_MIN ?? 5} min (BPM WFTASK). Check Task Status Search, then resume.`);
    ctx.evidence.log(`BPM task "${t!.activity}" of ${no} is open (assigned to ${[...t!.assignees, ...t!.groupAssignees.map((g) => `group ${g}`)].join(', ') || '?'})`);
  }

  // Login: the step's own Katalon account, another step's account, or the officer SIT assigned the task to
  // (given for this run > the BPM task's assignee in SIT > data-overrides.json from an earlier run).
  let login: FlowLogin | undefined;
  let loginNote = 'Katalon default account of the step';
  if (s.officers[step.id] && step.login !== 'assignedOfficer') {
    // an officer given for this run (qa gate --officer) wins for any step, e.g. a requisitioner of the contract's own
    // PTJ when the step's Katalon account belongs to another PTJ (KAT-057 on a QT contract, 2026-11-25)
    login = { officer: s.officers[step.id] };
    loginNote = `officer ${s.officers[step.id]} (given for this run)`;
  } else if (step.login === 'assignedOfficer') {
    let officer = s.officers[step.id];
    loginNote = `officer ${officer} (given for this run)`;
    if (!officer && dbReady() && step.inputs.length) {
      const nos = step.inputs.map((i) => String(vars[i.var]));
      let a = assignedOfficer(nos, step.bpmTask);
      // SELF-HEAL: SIT spawns the next task asynchronously (e.g. PR creation ~5 min after RN approval): wait for it.
      if (!a.officer && /no open BPM task/.test(a.why)) {
        const waitMin = Number(process.env.QA_TASK_WAIT_MIN ?? 10);
        ctx.evidence.log(`No open BPM task for ${nos.join(', ')} yet: waiting up to ${waitMin} min`);
        emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `waiting for the BPM task of ${nos.join(', ')} (up to ${waitMin} min)` });
        const end = Date.now() + waitMin * 60_000;
        while (!a.officer && /no open BPM task/.test(a.why) && Date.now() < end) {
          await new Promise((r) => setTimeout(r, 15_000));
          a = assignedOfficer(nos, step.bpmTask);
        }
      }
      if (a.officer) ((officer = a.officer), (loginNote = `officer ${officer}: ${a.why}`));
      else ctx.evidence.log(`Assigned officer not found in BPM: ${a.why}`);
    }
    if (!officer && step.automation === 'module' && MODULE_STEPS[step.id]?.loginAs) {
      officer = MODULE_STEPS[step.id].loginAs!;
      loginNote = `officer ${officer} (QT role user from ngep-runner's SIT presets; BPM did not name a single assignee)`;
    }
    if (!officer && (officer = officerFromOverrides(step.id)!))
      loginNote = `officer ${officer} from data-overrides.json (seen in an earlier run; not checked for this document)`;
    if (!officer)
      await block(ctx, `${step.id} must log in as the officer SIT assigned the task to. Find it in Task Status Search for ${step.inputs.map((i) => s.docs[i.doc]).join(', ')}, then: npm run qa -- gate --run ${s.flowRunId} --officer ${step.id}=<login ID>`);
    login = { officer: officer! };
  } else if (typeof step.login === 'object') {
    login = { accountOf: step.login.accountOf };
    loginNote = `account of ${step.login.accountOf}`;
  }
  // SELF-HEAL (login): the document's open BPM task belongs to other users than this step's account (e.g. the PO goes
  // to the supplier who answered the inquiry) → log in with the step account whose username is an assignee.
  if (step.login !== 'assignedOfficer' && !s.officers[step.id] && dbReady() && step.inputs.length && process.env.QA_SELF_HEAL !== '0') {
    try {
      const accounts = stepAccounts();
      // the account the step would really use: its flow login, else a data-overrides _accountOf (old KAT-spec data), else its own
      const ovAcc = (overrides as unknown as Record<string, Record<string, unknown>>)[step.id]?._accountOf as string | undefined;
      const mineId = typeof step.login === 'object' ? step.login.accountOf : (ovAcc ?? step.id);
      const mine = accounts[mineId];
      const open = step.inputs.flatMap((i) => openTasks(String(vars[i.var]), step.bpmTask));
      let assignees = [...new Set(open.flatMap((t) => (t.claimedBy ? [t.claimedBy] : t.assignees)))];
      // Simple Quote replies have no BPM task: the invited supplier companies (SC_QUOTE_SUPPLIER) tell who may answer
      const sqIn = step.inputs.find((i) => i.doc === 'SQ');
      if (!assignees.length && sqIn) assignees = invitedSupplierLogins(String(vars[sqIn.var]), Object.values(accounts));
      if (assignees.length && mine && !assignees.includes(mine)) {
        const other = assignees.includes(accounts[step.id]) ? step.id : Object.entries(accounts).find(([, u]) => assignees.includes(u))?.[0];
        if (other) {
          login = { accountOf: other };
          loginNote = `account of ${other} (${accounts[other]}) — self-heal: ${open[0] ? `the open BPM task "${open[0].activity}" is assigned to` : 'the SQ was sent to the companies of'} ${assignees.join(', ')}, not to ${mine}`;
          emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `self-heal login: ${loginNote}` });
        } else ctx.evidence.log(`BPM task assigned to ${assignees.join(', ')}; no step account matches (this step uses ${mine})`);
      }
    } catch {
      /* lookup problems never stop a step */
    }
  }

  await waitForMemory(ctx, step);

  const attemptStart = nowMy();
  // DB status before the step (for self-heal: proof whether a failed attempt changed anything)
  let dbBefore: Attempt['dbBefore'];
  let attemptDbBefore: number | null | undefined;
  const cdb = step.checkpoint.db;
  if (cdb && dbReady()) {
    const doc = parseKind(cdb.kind).doc;
    const no = step.inputs.some((i) => i.doc === doc) || doc === 'CT' ? docFor(doc, s.docs) : undefined;
    if (no) {
      try {
        const cur = currentStatus(cdb.kind, no);
        dbBefore = { kind: cdb.kind, docNo: no, statusId: cur?.statusId ?? null };
        attemptDbBefore = dbBefore.statusId;
      } catch {
        /* DB read problems never stop a step */
      }
    }
  }
  await updateRunState(ctx.flowRunId, (x) => {
    x.allowRerun = x.allowRerun.filter((id) => id !== step.id);
    const r = (x.steps[step.id] ??= { state: 'running', attempts: [], outputs: {} });
    r.state = 'running';
    r.login = loginNote;
    r.attempts.push({ runId: process.env.RUN_ID ?? 'local', startedAt: attemptStart, result: 'running', evidenceDir: ctx.evidence.dir, ...(dbBefore ? { dbBefore } : {}), ...(ctx.healReason ? { selfHeal: ctx.healReason } : {}) });
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
  const moduleTexts: string[] = [];
  try {
    if (step.automation === 'module') {
      // typed step (support/modules): the runner logs in, runs it, signs out
      const def = MODULE_STEPS[step.id];
      if (!def) throw new Error(`${step.id} is "automation": "module" but has no function in support/modules/index.ts`);
      const env = getEnv();
      if (def.selfLogin) {
        const log = (m: string) => ctx.evidence.log(`${step.id}: ${m}`);
        try {
          // self-login steps may still switch to an officer (e.g. one approver from a BPM pool): sign out, sign in as them
          const as = async (u: string) => {
            await ssoLogout(ctx.page, env).catch(() => {});
            log(`login ${u}`);
            const pw = (await loadPasswordFor(env.name, u)) ?? (await loadSharedOfficerPassword(env.name));
            if (!pw) throw new Error(`No password for ${u} in .auth/credentials.xlsx`);
            await ssoLogin(ctx.page, env, u, pw, log);
            await closeAnnouncement(ctx.page).catch(() => {});
          };
          const r = await def.run({ page: ctx.page, baseURL: env.baseURL, inputs: { ...s.docs }, runId: ctx.flowRunId, log, as, env, evidence: ctx.evidence });
          await ssoLogout(ctx.page, env).catch(() => {});
          moduleTexts.push(...r.messages, ...Object.values(r.outputs ?? {}).map((v) => `${v}`));
        } catch (e) {
          await explore(ctx, step, String((e as Error)?.message ?? e), []).catch(() => {});
          await ctx.page.screenshot({ path: path.join(runDir(ctx.flowRunId), `failure-${step.id}.png`), fullPage: true }).catch(() => {});
          await ssoLogout(ctx.page, env).catch(() => {});
          throw e;
        }
      } else {
      const acc = login && 'accountOf' in login ? katalonAccount(login.accountOf) : undefined;
      const user = acc?.Username ?? (login && 'officer' in login ? login.officer : def.loginAs);
      if (!user) throw new Error(`${step.id}: no login (no BPM assignee, no account and no loginAs)`);
      const password = acc?.Password ?? (await loadPasswordFor(env.name, user)) ?? (await loadSharedOfficerPassword(env.name));
      if (!password) throw new Error('No shared SIT officer password (row Username "*" in .auth/credentials.xlsx)');
      const log = (m: string) => ctx.evidence.log(`${step.id}: ${m}`);
      log(`login ${user}${acc ? ` (account of ${(login as { accountOf: string }).accountOf})` : login && 'officer' in login ? ' (BPM assignee)' : ' (role user)'}`);
      await ssoLogin(ctx.page, env, user, password, log);
      await closeAnnouncement(ctx.page).catch(() => {});
      try {
        const as = async (u: string) => {
          await ssoLogout(ctx.page, env).catch(() => {});
          log(`login ${u} (switch)`);
          const pw = await loadPasswordFor(env.name, u);
          if (!pw) throw new Error(`No password for ${u} in .auth/credentials.xlsx`);
          await ssoLogin(ctx.page, env, u, pw, log);
          await closeAnnouncement(ctx.page).catch(() => {});
        };
        const r = await def.run({ page: ctx.page, baseURL: env.baseURL, inputs: { ...s.docs }, runId: ctx.flowRunId, log, as, env, evidence: ctx.evidence });
        moduleTexts.push(...r.messages, ...Object.values(r.outputs ?? {}).map((v) => `${v}`));
      } catch (e) {
        // explore the screen BEFORE signing out (afterwards only the home page is left)
        await explore(ctx, step, String((e as Error)?.message ?? e), []).catch(() => {});
        await ctx.page.screenshot({ path: path.join(runDir(ctx.flowRunId), `failure-${step.id}.png`), fullPage: true }).catch(() => {});
        throw e;
      } finally {
        await ssoLogout(ctx.page, env).catch(() => {});
      }
      }
    } else {
      const mod = await STEPS[step.id]();
      await mod.run();
    }
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
    await explore(ctx, step, text, messages).catch(() => {});
    emit(ctx.flowRunId, ctx.flow.id, 'failure', { item: step.id, class: c.class, confidence: c.confidence, because: c.because, error: text.split('\n')[0] });
    throw error;
  }

  // Outcome: the expected message and document, from the application's messages, else from what the script read.
  const texts = [...ctx.appMessages.slice(seen).filter((m) => m.severity === 'info').map((m) => m.text), ...observedTexts(), ...moduleTexts];
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
  // The SIT database must show the checkpoint's status (registry checkpoint.db); a different status fails the step.
  let dbr: DbResult | undefined;
  if (step.checkpoint.db) {
    dbr = await checkDb(ctx, step.checkpoint.db, { ...s.docs, ...outputs });
    if (dbr && !dbr.ok && !step.checkpoint.db.observeOnly) {
      const text = `Expected outcome not in the database for ${step.id}: ${dbr.docNo} is at ${dbr.statusId ?? 'no status'} ${dbr.en}, expected ${dbr.expected} ${step.checkpoint.db.en ?? ''} (${step.checkpoint.id})`;
      await endStep(ctx, step, 'failed', outputs, messages, 'BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one', text);
      await updateRunState(ctx.flowRunId, (x) => {
        x.steps[step.id].db = dbr;
      });
      emit(ctx.flowRunId, ctx.flow.id, 'failure', { item: step.id, class: 'BUSINESS_ASSERTION', error: text });
      throw new Error(text);
    }
  }
  const proof = proofOf(step, { ...s.docs, ...outputs });
  if (proof === false) {
    const text = `Expected outcome not in the database for ${step.id}: its proof query found nothing (${step.checkpoint.proofSql})`;
    await endStep(ctx, step, 'failed', outputs, messages, 'BUSINESS_ASSERTION (high): the step finished but its proof query is not satisfied', text);
    emit(ctx.flowRunId, ctx.flow.id, 'failure', { item: step.id, class: 'BUSINESS_ASSERTION', error: text });
    throw new Error(text);
  }
  const dbConfirms = (!!dbr?.ok && dbr.expected != null && (dbr.expected !== (attemptDbBefore ?? -1) || proof === true)) || proof === true;
  const verified = (allObserved || dbConfirms) && step.checkpoint.verification !== 'unverified';
  const state: StepState = verified ? 'verified' : 'completed-unverified';
  await endStep(ctx, step, state, outputs, messages);
  if (dbr)
    await updateRunState(ctx.flowRunId, (x) => {
      x.steps[step.id].db = dbr;
    });

  // Test data registry: the documents this step produced or moved, with the checkpoint they reached.
  await recordDocs(ctx, step, { ...s.docs, ...outputs }, verified, outputs, vars);

  const summary =
    `${step.checkpoint.id} ${verified ? 'VERIFIED' : 'COMPLETED (not verified)'}` +
    (Object.keys(outputs).length ? ` — ${Object.entries(outputs).map(([k, v]) => `${k} ${v}`).join(', ')}` : '') +
    (dbr ? ` · DB ${dbr.docNo} ${dbr.statusId} ${dbr.en} / ${dbr.bm}` : '');
  ctx.evidence.actual(summary);
  if (!verified) ctx.testInfo.annotations.push({ type: 'warning', description: `${step.id}: completed, but its outcome is not verified (no expected message known or seen)` });
  if (isLastSelected(ctx)) await finishRun(ctx);
}

/**
 * SELF-HEAL of a failed/interrupted state-changing step (at most QA_SELF_HEAL_MAX, default 1, automatic retry per step
 * and run; QA_SELF_HEAL=0 turns it off). Never a blind repeat — only on evidence:
 *  - 'done'  : the SIT DB shows the checkpoint status → the earlier attempt went through; recorded as VERIFIED.
 *  - 'retry' : the SIT DB shows the same status as before the attempt (nothing changed), or the attempt failed before it
 *              could open the document (it was not in the task list: nothing can have been submitted).
 *  - undefined: no proof either way → the person decides (UNCERTAIN / retry command), as before.
 */
async function selfHeal(ctx: ItemCtx, step: StepDef, rec: StepRecord, s: RunState): Promise<'done' | 'retry' | undefined> {
  if (process.env.QA_SELF_HEAL === '0') return undefined;
  const last = rec.attempts.at(-1);
  const healed = rec.attempts.filter((a) => a.selfHeal).length;
  const db = step.checkpoint.db;
  let cur: { statusId: number | null; en: string } | undefined;
  if (db && db.statusId != null && dbReady()) {
    const no = docFor(parseKind(db.kind).doc, s.docs) ?? last?.dbBefore?.docNo;
    if (no) {
      const c = currentStatus(db.kind, no);
      cur = { statusId: c?.statusId ?? null, en: c?.en ?? '' };
      // proof only when the step moves the status (expected ≠ status before), or the step's own proof query says so
      const before = last?.dbBefore?.statusId;
      const moved = before === undefined ? !step.checkpoint.proofSql : before !== db.statusId;
      const proven = step.checkpoint.proofSql ? proofOf(step, s.docs) : moved;
      if (c?.statusId === db.statusId && proven) {
        await updateRunState(ctx.flowRunId, (x) => {
          const r = x.steps[step.id];
          r.state = 'verified';
          r.checkpoint = step.checkpoint.id;
          r.db = { kind: db.kind, docNo: no, expected: db.statusId, statusId: c.statusId, en: c.en, bm: c.bm, at: c.at, ok: true, checkedAt: nowMy() };
          r.attempts.at(-1)!.selfHeal = `DB shows ${c.statusId} ${c.en}: the attempt went through`;
          if (x.status === 'uncertain' || x.status === 'failed') x.status = 'in-progress';
          delete x.blockedReason;
        });
        emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `self-heal: DB shows ${no} at ${c.statusId} ${c.en}; the earlier attempt went through` });
        return 'done';
      }
    }
  }
  if (healed >= Number(process.env.QA_SELF_HEAL_MAX ?? 1)) return undefined;
  const notOpened = /not in this account's (task list|My Task)|not in this account's My Task|no open .* task/i.test(`${last?.classification ?? ''} ${last?.error ?? ''}`);
  // 'unchanged' is proof of nothing when the step itself does not move the status; then only an explicit proof query counts
  const unchanged = step.checkpoint.proofSql
    ? proofOf(step, s.docs) === false
    : !!(last?.dbBefore && cur && cur.statusId === last.dbBefore.statusId && last.dbBefore.statusId !== db?.statusId);
  if (!notOpened && !unchanged) return undefined;
  const why = notOpened
    ? `the attempt failed before opening the document (${(last?.error ?? '').split('\n')[0].slice(0, 120)}), so nothing was submitted`
    : last?.dbBefore && cur
      ? `the SIT DB still shows ${last.dbBefore.docNo} at ${cur.statusId} ${cur.en}, as before the attempt`
      : `the step's proof query finds nothing in the SIT DB (${(step.checkpoint.proofSql ?? '').slice(0, 80)}…)`; // proofSql-only step (no checkpoint.db), 2026-11-25
  await updateRunState(ctx.flowRunId, (x) => {
    x.steps[step.id].state = 'failed';
    x.allowRerun = [...new Set([...x.allowRerun, step.id])];
    if (x.status === 'uncertain' || x.status === 'failed') x.status = 'in-progress';
    delete x.blockedReason;
  });
  emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `self-heal: retrying once — ${why}` });
  ctx.evidence.log(`SELF-HEAL ${step.id}: retry once — ${why}`);
  ctx.healReason = why;
  return 'retry';
}

/**
 * EXPLORE after a failure: what the page and SIT looked like, for the repair loop (knowledge/repair-log.md).
 * Writes runs/<id>/diagnosis-<step>.md: page URL/title, accessibility snapshot, messages, DB status and BPM tasks.
 */
async function explore(ctx: ItemCtx, step: StepDef, error: string, messages: { severity: string; text: string }[]) {
  const s = readRunState(ctx.flowRunId)!;
  const L = [`# Diagnosis ${step.id} — ${step.title}`, '', `Run ${ctx.flowRunId} · ${nowMy()}`, '', '## Error', '```', error.slice(0, 2000), '```', ''];
  L.push('## Application messages', ...(messages.length ? messages.map((m) => `- ${m.severity}: ${m.text}`) : ['- none']), '');
  try {
    L.push('## Page', `- URL: ${ctx.page.url()}`, `- Title: ${await ctx.page.title()}`, '', '```yaml', (await ctx.page.locator('body').ariaSnapshot({ timeout: 5_000 })).slice(0, 12_000), '```', '');
  } catch (e) {
    L.push('## Page', `- not readable: ${String(e).slice(0, 200)}`, '');
  }
  // The values the form will POST (selects, hidden and text inputs): the snapshot shows labels, not submitted values.
  try {
    const fields = await ctx.page.evaluate(() =>
      Array.from(document.querySelectorAll('select, input:not([type=button]):not([type=submit]), textarea'))
        .map((el) => {
          const id = (el as HTMLInputElement).id || (el as HTMLInputElement).name || '';
          const type = (el as HTMLInputElement).type ?? '';
          let val: string;
          if (el instanceof HTMLSelectElement) val = `${el.value} [${el.selectedIndex >= 0 ? (el.options[el.selectedIndex]?.text ?? '') : ''}]`;
          else if (el instanceof HTMLInputElement && (type === 'checkbox' || type === 'radio')) val = String(el.checked);
          else val = (el as HTMLInputElement).value;
          return `${el.tagName.toLowerCase()}${type ? `/${type}` : ''} ${id} = ${String(val).slice(0, 80)}`;
        })
        .filter((x) => !/javax\.faces\.ViewState|password/i.test(x))
        .slice(0, 400),
    );
    L.push('## Form values (what the page would submit)', '```', ...fields, '```', '');
  } catch (e) {
    L.push('## Form values', `- not readable: ${String(e).slice(0, 200)}`, '');
  }
  if (dbReady()) {
    L.push('## SIT database');
    for (const [doc, no] of Object.entries(s.docs)) {
      try {
        const kind = statusKinds(doc as DocType)[0];
        const c = kind ? currentStatus(kind, no!) : undefined;
        const tasks = openTasks(no!).map((t) => `${t.activity} → ${[...t.assignees, ...t.groupAssignees.map((g) => `group ${g}`)].join(', ')}`);
        L.push(`- ${doc} ${no}: ${c ? `${c.statusId} ${c.en}` : 'no status row'}${tasks.length ? ` · open tasks: ${tasks.join('; ')}` : ' · no open task'}`);
      } catch (e) {
        L.push(`- ${doc} ${no}: ${String(e).slice(0, 120)}`);
      }
    }
  }
  fs.writeFileSync(path.join(runDir(ctx.flowRunId), `diagnosis-${step.id}.md`), L.join('\n') + '\n');
  emit(ctx.flowRunId, ctx.flow.id, 'note', { item: step.id, text: `diagnosis written: diagnosis-${step.id}.md` });
}

/** Test data registry: the documents a step produced or moved, with the checkpoint they reached. */
async function recordDocs(
  ctx: ItemCtx, step: StepDef, docs: Partial<Record<DocType, string>>, verified: boolean,
  outputs: Partial<Record<DocType, string>> = {}, vars: Record<string, unknown> = {},
) {
  const inputs = step.inputs.map((i) => ({ doc: i.doc, ref: String(vars[i.var] ?? docs[i.doc] ?? '') })).filter((x) => x.ref);
  const parents = inputs.map((i) => i.ref);
  const outs = Object.keys(outputs).length ? outputs : Object.fromEntries(step.outputs.filter((o) => docs[o.doc]).map((o) => [o.doc, docs[o.doc]]));
  for (const [doc, ref] of Object.entries(outs))
    await recordTransaction({ ref: ref!, docType: doc as DocType, module: step.module, checkpoint: step.checkpoint.id, verified, flowRunId: ctx.flowRunId, stepId: step.id, produced: !parents.includes(ref!), parents: parents.filter((p) => p !== ref) });
  for (const i of inputs)
    if (!Object.values(outs).includes(i.ref))
      await recordTransaction({ ref: i.ref, docType: i.doc, module: step.module, checkpoint: step.checkpoint.id, verified, flowRunId: ctx.flowRunId, stepId: step.id, produced: false });
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

/* ------------------------------------------------------------------------------------------------------------------
 * Status targets (tests/data-prep/en/by-status/…): bring ONE document to ONE active status of the status list.
 * Used after the flow items (if a flow makes the document) or alone (the document comes from QA_INPUT).
 * - Already at the target → VERIFIED.
 * - Else: the data patch is planned (support/core/simulate.ts, read-only) and the run waits for the tester to run it;
 *   rerunning the same spec continues the run (resumeLatest) and confirms the status, logging the patch.
 * ---------------------------------------------------------------------------------------------------------------- */
export interface StatusTarget {
  module: string;
  docType: string;
  statusId: number;
  en: string;
  bm: string;
  doc: DocType;
  kind: string;
  /** How a test case reaches it: 'flow' (a flow step reaches it), 'simulate' (data patch). */
  method: 'flow' | 'simulate';
}

export async function reachStatus(target: StatusTarget, runId: string | undefined, fx: FlowFixtures, testInfo: TestInfo) {
  test.setTimeout(10 * 60_000);
  const s = runId ? readRunState(runId) : undefined;
  if (s && (s.status === 'blocked' || s.status === 'uncertain' || s.status === 'failed') && !s.blockedReason?.startsWith('SIMULATE'))
    test.skip(true, `The flow part is not finished (${s.status}): ${s.blockedReason ?? 'see the run report'}`);
  const docs: Partial<Record<DocType, string>> = { ...(s?.docs ?? {}), ...inputsFromEnv() };
  const no = docFor(target.doc, docs);
  if (!no)
    test.skip(true, `Needs a ${docName(target.doc)}: run the data-prep flow, or give one with QA_INPUT=${target.doc}=<number> (the document must already be in the ${target.docType} workflow)`);
  if (!dbReady()) test.skip(true, 'Needs the SIT database (DBeaver "SIT" connection) to read and confirm the status');
  const wfType = target.kind.includes(':') ? target.kind.split(':')[1] : undefined;
  const cur = currentStatus(target.kind, no!);
  const label = `${target.module} ${target.docType} ${target.statusId} ${target.en} / ${target.bm}`;
  if (cur?.statusId === target.statusId) {
    // logs the patch in the audit only when this run had planned one (an existing simulation file)
    if (fs.existsSync(path.join(runId ? runDir(runId) : '', `${no}_${wfType ?? target.docType}_${target.statusId}.sql`))) checkSimulation(no!, target.statusId, wfType, s?.tester ?? 'tester');
    fx.evidence.actual(`STATUS REACHED: ${no} is at ${label}`);
    testInfo.annotations.push({ type: 'status', description: `${no} at ${target.statusId} ${target.en}` });
    if (runId)
      await updateRunState(runId, (x) => {
        x.status = 'completed';
        delete x.blockedReason;
      });
    return;
  }
  if (target.method === 'flow') throw new Error(`${no} is at ${cur?.statusId ?? 'no status'} ${cur?.en ?? ''}, not ${label}, after the flow`);
  const plan = planSimulation(no!, target.statusId, wfType, runId ? runDir(runId) : undefined);
  if (process.env.QA_AUTO_SQL === '1') {
    // user permission (2026-11-24): run the allow-listed patch, then confirm
    sitExecute(dmlStatements(plan.sql), s?.tester ?? 'tester', `Status simulation ${no} (${plan.kind}) ${plan.currentStatus} → ${target.statusId} ${target.en}`);
    const r = checkSimulation(no!, target.statusId, wfType, s?.tester ?? 'tester', plan.file);
    if (!r.ok) throw new Error(`Simulation ran but ${no} is at ${r.statusId} ${r.en}, not ${target.statusId}`);
    fx.evidence.actual(`STATUS SIMULATED: ${no} is at ${label} (patch + rollback: ${path.basename(plan.file)})`);
    testInfo.annotations.push({ type: 'status', description: `${no} simulated to ${target.statusId} ${target.en}` });
    if (runId)
      await updateRunState(runId, (x) => {
        x.status = 'completed';
        delete x.blockedReason;
      });
    return;
  }
  const reason =
    `SIMULATE ${no}: ${plan.currentStatus} → ${label}. No screen produces this status in our flows, so it is simulated: ` +
    `run the SQL in ${path.relative(path.join(__dirname, '..', '..'), plan.file)} in DBeaver (SIT connection only), then run this same spec again (it continues and confirms).`;
  if (runId)
    await updateRunState(runId, (x) => {
      x.status = 'blocked';
      x.blockedReason = reason;
    });
  fx.evidence.log(reason);
  fx.evidence.log(plan.sql);
  testInfo.annotations.push({ type: 'blocked', description: reason });
  test.skip(true, reason);
}

/** True when QA_INPUT gives a document of this type: a status spec then skips the flow that would create a new one. */
export function hasInput(doc: DocType): boolean {
  return !!inputsFromEnv()[doc];
}
