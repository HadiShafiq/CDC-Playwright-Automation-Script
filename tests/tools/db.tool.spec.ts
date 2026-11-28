// Read-only SIT database tools behind the QA CLI (no browser). Usually through the CLI:
//   npm run qa -- doc-status --env sit --doc LA260000000004216      status history EN/BM (all workflow types) + BPM tasks
//   npm run qa -- db-catalog --env sit                              every status per document type → registry/db-statuses.json
// Direct: npx cross-env TEST_ENV=SIT QA_TOOL=doc-status QA_DOC=LA26… playwright test tests/tools --project=tools --reporter=line
import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';
import { bpmTasks } from '../../support/core/bpm-tasks';
import { ROOT, nowMy } from '../../support/core/context';
import { dbSchema, statusHistory, statusKinds, statusesInUse } from '../../support/core/doc-status';
import { DOC_TYPES, looksLike, type DocType } from '../../support/core/documents';
import { dmlStatements, sitDbAvailable, sitExecute, sitQuery } from '../../support/core/sit-db';
import { activeStatuses, checkSimulation, kindOfWorkflow, planSimulation } from '../../support/core/simulate';

const tool = process.env.QA_TOOL ?? '';

test.describe('SIT database tools @tool', () => {
  test.skip(!tool, 'QA_TOOL not set (run through npm run qa -- doc-status / db-catalog)');
  test.skip(!sitDbAvailable(), 'no DBeaver "SIT" connection or SQL*Plus on this machine');
  test.setTimeout(20 * 60_000);

  test('doc-status', () => {
    test.skip(tool !== 'doc-status');
    const no = (process.env.QA_DOC ?? '').trim();
    const doc = DOC_TYPES.find((t) => looksLike(t, no)) as DocType | undefined;
    if (!doc) throw new Error(`"${no}" is not a document number`);
    const lines: string[] = [`${no} — ${dbSchema().documents[doc]?.name ?? doc}`];
    const src = dbSchema().documents[doc];
    if (!src) throw new Error(`${doc} has no database mapping in registry/db-schema.json`);
    // A contract's FD and AC have their own ids; a QT's committee rows share its id, so one list shows its whole path.
    const kinds = src.subIds ? statusKinds(doc) : src.wfTypes.length > 1 ? [`${doc}:*`] : [doc];
    for (const kind of kinds) {
      const h = statusHistory(kind, no);
      if (!h.length && kinds.length > 2) continue; // a contract has 16 workflow types: show the ones it has
      const wf = kind.split(':')[1];
      lines.push('', `Status history (${kind}${wf && src.wfNames?.[wf] ? ` ${src.wfNames[wf]}` : ''})${h.length ? '' : ': no rows'}`);
      for (const s of h) lines.push(`  ${s.current ? '▶' : ' '} ${s.at}  ${s.docType.padEnd(4)} ${String(s.statusId).padEnd(6)} ${s.en}  |  ${s.bm}`);
    }
    const tasks = bpmTasks(no);
    lines.push('', `BPM tasks${tasks.length ? '' : ': none'}`);
    for (const t of tasks)
      lines.push(`  ${t.createdAt}  ${(t.state || 'done').padEnd(9)} ${t.activity}${t.assignees.length || t.groupAssignees.length ? ` → ${[...t.assignees, ...t.groupAssignees.map((g) => `group ${g}`)].join(', ')}` : ''}${t.claimedBy ? ` (claimed by ${t.claimedBy})` : ''}`);
    console.log(`\n${lines.join('\n')}\n`);
  });

  test('simulate-plan', () => {
    test.skip(tool !== 'simulate-plan');
    // Read-only: builds the data patch (support/core/simulate.ts); the tester runs it, then `qa simulate … --check`.
    const p = planSimulation((process.env.QA_DOC ?? '').trim(), Number(process.env.QA_STATUS), process.env.QA_TYPE || undefined);
    const warn = p.active ? '' : '\nWARNING: this status is not in registry/active-statuses.json';
    console.log(`\n${p.sql}\n\nSaved: ${path.relative(ROOT, p.file)}${warn}`);
  });

  test('simulate-run', () => {
    test.skip(tool !== 'simulate-run');
    // Data change allowed by the user (2026-11-24): plan, run the patch (allow-listed, one transaction), confirm, audit.
    const no = (process.env.QA_DOC ?? '').trim();
    const target = Number(process.env.QA_STATUS);
    const p = planSimulation(no, target, process.env.QA_TYPE || undefined);
    if (p.currentStatus === target) return console.log(`
${no} is already at ${target}`);
    sitExecute(dmlStatements(p.sql), process.env.QA_TESTER || 'tester', `Status simulation ${no} (${p.kind}) ${p.currentStatus} → ${target}`);
    const r = checkSimulation(no, target, process.env.QA_TYPE || undefined, process.env.QA_TESTER || 'tester', p.file);
    console.log(`
${no} ${r.kind}: now ${r.statusId} ${r.en} / ${r.bm} → ${r.ok ? 'SIMULATED OK' : 'NOT at target'} (rollback SQL: ${path.relative(ROOT, p.file)})`);
    if (!r.ok) process.exitCode = 1;
  });

  test('simulate-module', () => {
    test.skip(tool !== 'simulate-module');
    test.setTimeout(8 * 3600_000);
    // Verifies the status-simulation patch of every "simulate" status of ONE module (QA_MODULE, user 2026-11-24: one module
    // at a time). Per status: patch a sandbox document (our own test document of a finished run), confirm in the DB, then
    // restore it at once (allow-listed DELETE + UPDATE), so at most one document is ever away from its real status.
    // QA_DRY=1: plan only (no change). Results: .data/SIT/simulate/module-<M>.json; audited in knowledge/data-change-audit.md.
    const M = (process.env.QA_MODULE ?? '').toUpperCase();
    const dry = process.env.QA_DRY === '1';
    const tester = process.env.QA_TESTER || 'tester';
    const specs = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'status-specs.json'), 'utf8')).index as Record<string, { spec: string; method: string }>;
    const simulate = new Set(Object.values(specs).filter((s) => s.method === 'simulate').map((s) => {
      const m = s.spec.match(/by-status\/([^/]+)\/([^/]+)\/(\d+)-/);
      return m ? `${m[1].toUpperCase()}|${m[2]}|${m[3]}` : '';
    }));
    // sandbox candidates: documents of finished runs (never one of an unfinished run), newest first
    const runs = path.join(ROOT, '.data', 'SIT', tester, 'runs');
    const states = fs.readdirSync(runs).map((d) => { try { return JSON.parse(fs.readFileSync(path.join(runs, d, 'state.json'), 'utf8')); } catch { return null; } }).filter(Boolean);
    // only runs that still wait to go on (e.g. the FL runs waiting for iGFMAS) keep their documents out of the sandbox
    const busy = new Set(states.filter((s) => ['in-progress', 'blocked', 'uncertain'].includes(s.status)).flatMap((s) => Object.values(s.docs ?? {}) as string[]));
    // plus documents recorded in transactions.json (e.g. CR/CO/DO/FN/IN of finished fulfilment runs), except do-not-use ones
    const txFile = path.join(ROOT, '.data', 'SIT', tester, 'transactions.json');
    const tx = fs.existsSync(txFile) ? (JSON.parse(fs.readFileSync(txFile, 'utf8')) as { ref: string; reuse?: string }[]).filter((t) => t.reuse !== 'do-not-use').map((t) => t.ref).reverse() : [];
    const base = [...new Set([...states.filter((s) => s.status === 'completed' || s.status === 'failed').sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).flatMap((s) => Object.values(s.docs ?? {}) as string[]), ...tx])].filter((d) => !busy.has(d));
    // FL chain from our own requests (user's query 2026-11-24): CR/PR → FL_FULFILMENT_ORDER (PO/CO) → FL_DELIVERY_ORDER (DO)
    // → FL_FULFILMENT_NOTE (FN, by delivery_order_id); FL_INVOICE (IN) and FL_ADJUSTMENT (DN/CN) by fulfilment_order_id
    const chain: string[] = [];
    if (M === 'FL') {
      const q = (sql: string) => { try { return sitQuery(sql).map((r) => r[0]).filter(Boolean); } catch { return []; } };
      const reqs = base.filter((d) => /^(CR|PR)\d{12,15}$/.test(d)).map((d) => `'${d}'`);
      if (reqs.length) {
        const where = `r.doc_no in (${reqs.join(',')})`;
        const ord = `select o.fulfilment_order_id from ngep_sit.fl_fulfilment_order o join ngep_sit.fl_fulfilment_request r on r.fulfilment_req_id = o.fulfilment_req_id where ${where}`;
        chain.push(
          ...q(`select o.doc_no from ngep_sit.fl_fulfilment_order o join ngep_sit.fl_fulfilment_request r on r.fulfilment_req_id = o.fulfilment_req_id where ${where} order by o.created_date desc`),
          ...q(`select d.delivery_order_no from ngep_sit.fl_delivery_order d where d.fulfilment_order_id in (${ord}) order by d.created_date desc`),
          ...q(`select n.fulfilment_note_no from ngep_sit.fl_fulfilment_note n where n.delivery_order_id in (select d.delivery_order_id from ngep_sit.fl_delivery_order d where d.fulfilment_order_id in (${ord})) order by n.created_date desc`),
          ...q(`select i.invoice_no from ngep_sit.fl_invoice i where i.fulfilment_order_id in (${ord}) order by i.created_date desc`),
          ...q(`select a.doc_no from ngep_sit.fl_adjustment a where a.fulfilment_order_id in (${ord}) order by a.created_date desc`),
        );
      }
    }
    const cands = [...new Set([...base, ...chain])].filter((d) => !busy.has(d));
    // statuses already proven OK by an earlier (non-dry) run of this module are not simulated again
    const prevFile = path.join(ROOT, '.data', 'SIT', 'simulate', `module-${M}.json`);
    const proven = new Set<string>(fs.existsSync(prevFile) ? (JSON.parse(fs.readFileSync(prevFile, 'utf8')).results as { wf: string; status: number; result: string }[]).filter((r) => /^OK/.test(r.result)).map((r) => `${r.wf}|${r.status}`) : []);
    const list = activeStatuses().filter((s) => s.module === M && simulate.has(`${M}|${s.docType}|${s.statusId}`) && !proven.has(`${s.docType}|${s.statusId}`));
    const sandbox: Record<string, string | null> = {};
    const out: { wf: string; status: number; en: string; doc?: string; result: string }[] = [];
    for (const s of list) {
      const k = kindOfWorkflow(M, s.docType);
      if (!k) { out.push({ wf: s.docType, status: s.statusId, en: s.en, result: 'no document type mapped' }); continue; }
      if (!(s.docType in sandbox)) {
        sandbox[s.docType] = null;
        for (const d of cands.filter((x) => looksLike(k.doc, x))) {
          try { planSimulation(d, s.statusId, s.docType); sandbox[s.docType] = d; break; } catch { /* not in this workflow */ }
        }
      }
      const doc = sandbox[s.docType];
      if (!doc) { out.push({ wf: s.docType, status: s.statusId, en: s.en, result: `no sandbox ${k.doc} with a ${s.docType} workflow row` }); continue; }
      try {
        const p = planSimulation(doc, s.statusId, s.docType);
        if (p.currentStatus === s.statusId) { out.push({ wf: s.docType, status: s.statusId, en: s.en, doc, result: 'already there (real status)' }); continue; }
        if (dry) { out.push({ wf: s.docType, status: s.statusId, en: s.en, doc, result: `plan ${p.currentStatus} → ${s.statusId}` }); continue; }
        sitExecute(dmlStatements(p.sql), tester, `Status simulation check ${doc} (${p.kind}) ${p.currentStatus} → ${s.statusId}`);
        const r = checkSimulation(doc, s.statusId, s.docType, tester, p.file);
        const back = p.sql.split('\n').filter((l) => /^-- (DELETE|UPDATE)/.test(l)).map((l) => l.slice(3));
        sitExecute(dmlStatements(back.join('\n')), tester, `Restore ${doc} (${p.kind}) ${s.statusId} → ${p.currentStatus} after the simulation check`);
        const after = planSimulation(doc, p.currentStatus, s.docType).currentStatus;
        out.push({ wf: s.docType, status: s.statusId, en: s.en, doc, result: `${r.ok ? 'OK' : `NOT AT TARGET (${r.statusId})`}; restored to ${after}${after === p.currentStatus ? '' : ' — RESTORE MISMATCH'}` });
        if (after !== p.currentStatus) break; // never go on with a document off its real status
      } catch (e) {
        out.push({ wf: s.docType, status: s.statusId, en: s.en, doc, result: `ERROR ${String((e as Error).message).slice(0, 160)}` });
      }
    }
    const dir = path.join(ROOT, '.data', 'SIT', 'simulate');
    fs.mkdirSync(dir, { recursive: true });
    if (!dry && fs.existsSync(prevFile)) out.unshift(...(JSON.parse(fs.readFileSync(prevFile, 'utf8')).results as typeof out).filter((r) => /^OK/.test(r.result)));
    fs.writeFileSync(path.join(dir, `module-${M}${dry ? '-dry' : ''}.json`), JSON.stringify({ module: M, at: nowMy(), dry, sandbox, results: out }, null, 2));
    const sum: Record<string, number> = {};
    for (const o of out) { const key = o.result.split(/[;(:]/)[0].trim(); sum[key] = (sum[key] ?? 0) + 1; }
    console.log(`
MODULE ${M} (${dry ? 'dry run' : 'run'}): ${out.length} statuses · ${JSON.stringify(sum)} · sandbox ${JSON.stringify(sandbox)}`);
  });

  test('simulate-check', () => {
    test.skip(tool !== 'simulate-check');
    const no = (process.env.QA_DOC ?? '').trim();
    const target = Number(process.env.QA_STATUS);
    const r = checkSimulation(no, target, process.env.QA_TYPE || undefined, process.env.QA_TESTER || 'tester');
    console.log(`\n${no} ${r.kind}: now ${r.statusId ?? 'no status'} ${r.en} / ${r.bm} → ${r.ok ? 'SIMULATED OK (logged in knowledge/data-change-audit.md)' : `NOT at ${target}`}`);
    if (!r.ok) process.exitCode = 1;
  });

  test('sql', () => {
    test.skip(tool !== 'sql');
    // Ad-hoc READ-ONLY query (npm run qa -- sql): sitQuery itself refuses anything but one SELECT/WITH (no FOR UPDATE,
    // line breaks folded, DEFINE off). Writes stay with sitExecute (allow-list, audited).
    const max = Number(process.env.QA_MAX_ROWS ?? 200);
    const rows = sitQuery(process.env.QA_SQL ?? '');
    for (const r of rows.slice(0, max)) console.log(r.join(' | '));
    console.log(`\n${rows.length} row(s)${rows.length > max ? `, first ${max} shown (--max to change)` : ''}`);
  });

  test('db-usage', () => {
    test.skip(tool !== 'db-usage');
    // Every (doc type, status) ever written to each workflow table, with row count and last use: which active statuses
    // SIT really reaches (registry/db-usage.json; scripts/status-coverage.mjs crosses it with registry/active-statuses.json).
    const usage: Record<string, { rows: number; last: string }> = {};
    for (const t of ['sc', 'ct', 'fl', 'sm', 'cm', 'pm', 'pp']) {
      const rows = sitQuery(`select doc_type, status_id, count(*), to_char(max(created_date), 'YYYY-MM-DD') from ngep_sit.${t}_workflow_status group by doc_type, status_id`);
      for (const [docType, statusId, n, last] of rows) usage[`${t.toUpperCase()}|${docType}|${statusId}`] = { rows: Number(n), last };
      console.log(`${t}_workflow_status: ${rows.length} (doc type, status) pairs`);
    }
    const file = path.join(ROOT, 'registry', 'db-usage.json');
    fs.writeFileSync(file, JSON.stringify({ _about: 'GENERATED by npm run qa -- db-usage (read-only, SIT, all time): key = WORKFLOW|DOC_TYPE|STATUS_ID.', readAt: nowMy(), usage }, null, 1) + '\n');
    console.log(`written ${path.relative(ROOT, file)}`);
  });

  test('db-catalog', () => {
    test.skip(tool !== 'db-catalog');
    const days = Number(process.env.QA_DAYS ?? 3650);
    const statuses: Record<string, unknown> = {};
    for (const [doc, src] of Object.entries(dbSchema().documents))
      for (const t of src.wfTypes) {
        const k = t === doc ? doc : `${doc}:${t}`;
        if (k in statuses) continue;
        statuses[k] = statusesInUse(src.workflow, t, days);
        console.log(`${k}: ${(statuses[k] as unknown[]).length} statuses`);
      }
    for (const [workflow, types] of Object.entries(dbSchema().catalogOnly ?? {})) {
      if (!Array.isArray(types)) continue;
      for (const t of types) {
        const k = `${workflow.split('_')[0].toUpperCase()}:${t}`;
        statuses[k] = statusesInUse(workflow, t, days);
        console.log(`${k}: ${(statuses[k] as unknown[]).length} statuses (catalogue only)`);
      }
    }
    const file = path.join(ROOT, 'registry', 'db-statuses.json');
    fs.writeFileSync(file, JSON.stringify({ _about: 'GENERATED by npm run qa -- db-catalog (read-only, SIT): every status each workflow type used in the period, with PM_STATUS_DESC names. Do not edit.', readAt: nowMy(), days, statuses }, null, 1) + '\n');
    console.log(`written ${path.relative(ROOT, file)}`);
  });
});
