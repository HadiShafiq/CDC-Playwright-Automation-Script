// Proven status coverage (read-only SIT DB). Which of the 804 active statuses our own documents really reached (status
// history of every document in .data/<ENV>/<tester>/transactions.json and runs/*), which were simulated
// (.data/SIT/simulate/module-<M>.json, result OK), and why the rest are open (class from registry/status-coverage.json).
// Run: npx cross-env TEST_ENV=SIT QA_TOOL=coverage playwright test tests/tools/coverage.tool.spec.ts --project=tools --reporter=line
// Writes docs/status-proven.md and .data/SIT/status-proven.json.
import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';
import { ROOT, nowMy } from '../../support/core/context';
import { dbSchema, historySql, statusKinds } from '../../support/core/doc-status';
import { DOC_TYPES, findDocs, type DocType } from '../../support/core/documents';
import { sitDbAvailable, sitQuery } from '../../support/core/sit-db';

type Active = { module: string; docType: string; statusId: number; en: string; bm: string };
type Cov = Active & { class: string; prep?: string };
type Sim = { wf: string; status: number; doc: string; result: string };

const q = (s: string) => `'${s.replace(/'/g, '')}'`;

test('coverage @tool', () => {
  test.skip(process.env.QA_TOOL !== 'coverage');
  test.skip(!sitDbAvailable(), 'no SIT DB connection');
  test.setTimeout(30 * 60_000);

  // 1. our documents: every number in our transactions and run files
  const dataDir = path.join(ROOT, '.data', 'SIT');
  const files: string[] = [];
  for (const tester of fs.readdirSync(dataDir, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'simulate')) {
    const base = path.join(dataDir, tester.name);
    if (fs.existsSync(path.join(base, 'transactions.json'))) files.push(path.join(base, 'transactions.json'));
    const runs = path.join(base, 'runs');
    if (fs.existsSync(runs))
      for (const r of fs.readdirSync(runs)) for (const f of ['state.json', 'events.jsonl']) if (fs.existsSync(path.join(runs, r, f))) files.push(path.join(runs, r, f));
  }
  const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const docs = new Map<DocType, Set<string>>();
  for (const t of DOC_TYPES) {
    if (!dbSchema().documents[t]) continue;
    const found = new Set(findDocs(text, t));
    if (found.size) docs.set(t, found);
  }

  // 2. their status history (doc number, workflow doc type, status)
  const reached = new Map<string, Set<string>>(); // "WF|status" → documents
  const add = (wf: string, st: string, no: string) => {
    const k = `${wf}|${Number(st)}`;
    if (!reached.has(k)) reached.set(k, new Set());
    reached.get(k)!.add(no);
  };
  for (const [t, nos] of docs) {
    const src = dbSchema().documents[t]!;
    if (src.subIds) {
      for (const no of nos) for (const kind of statusKinds(t)) for (const [wf, st] of sitQuery(historySql(kind, no))) add(wf, st, no);
      continue;
    }
    const list = [...nos];
    for (let i = 0; i < list.length; i += 200) {
      const chunk = list.slice(i, i + 200).map(q).join(', ');
      const rows = sitQuery(`select distinct w.doc_type, w.status_id, d.${src.no} from ngep_sit.${src.workflow} w join ngep_sit.${src.table} d on d.${src.id} = w.doc_id
        where d.${src.no} in (${chunk}) and w.doc_type in (${src.wfTypes.map(q).join(', ')})`);
      for (const [wf, st, no] of rows) add(wf, st, no);
    }
  }
  // LOI (LI) rows hang on SC_LOI.LOI_ID, not on the QT id
  const qts = [...(docs.get('QT') ?? [])];
  if (qts.length)
    for (const [wf, st, no] of sitQuery(`select distinct w.doc_type, w.status_id, l.loi_no from ngep_sit.sc_workflow_status w join ngep_sit.sc_loi l on l.loi_id = w.doc_id
      join ngep_sit.sc_loi_loa x on x.loi_loa_id = l.loi_loa_id join ngep_sit.sc_qt qq on qq.qt_id = x.doc_id where w.doc_type = 'LI' and qq.qt_no in (${qts.map(q).join(', ')})`))
      add(wf, st, no);

  // 3. simulated (doc, status) pairs: these rows in the history are not real runs
  const sims: Sim[] = [];
  for (const f of fs.readdirSync(path.join(dataDir, 'simulate')).filter((f) => /^module-[A-Z]+\.json$/.test(f))) {
    const j = JSON.parse(fs.readFileSync(path.join(dataDir, 'simulate', f), 'utf8'));
    if (!j.dry) sims.push(...(j.results as Sim[]).filter((r) => /^OK/.test(r.result)));
  }
  const simKey = new Set(sims.map((s) => `${s.wf}|${s.status}|${s.doc}`));
  const simByStatus = new Map(sims.map((s) => [`${s.wf}|${s.status}`, s.doc]));

  // 4. classify every active status
  const cov = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'status-coverage.json'), 'utf8')).statuses as Cov[];
  const rows = cov.map((c) => {
    const k = `${c.docType}|${c.statusId}`;
    const real = [...(reached.get(k) ?? [])].filter((no) => !simKey.has(`${k}|${no}`));
    const sim = simByStatus.get(k);
    const state = real.length
      ? 'RUN'
      : sim
        ? 'SIMULATED'
        : c.class === 'NEVER_USED'
          ? 'CANNOT_NEVER_USED'
          : c.prep === 'unmapped'
            ? 'CANNOT_UNMAPPED'
            : c.class === 'FLOW' || c.class === 'FLOW_MANUAL'
              ? 'OPEN_FLOW_EXISTS'
              : c.class === 'SYSTEM'
                ? 'OPEN_SYSTEM'
                : 'OPEN_NO_FLOW';
    return { module: c.module, docType: c.docType, statusId: c.statusId, en: c.en, class: c.class, state, evidence: real[0] ?? sim ?? '' };
  });

  const STATES = ['RUN', 'SIMULATED', 'OPEN_FLOW_EXISTS', 'OPEN_NO_FLOW', 'OPEN_SYSTEM', 'CANNOT_NEVER_USED', 'CANNOT_UNMAPPED'];
  const LABEL: Record<string, string> = {
    RUN: 'Dah run (real flow, our document)',
    SIMULATED: 'Dah simulate (data patch, restored)',
    OPEN_FLOW_EXISTS: 'Belum: our flow can reach it, not reached yet',
    OPEN_NO_FLOW: 'Belum: SIT reaches it on screens, no flow / sandbox of ours',
    OPEN_SYSTEM: 'Belum: backend status (iGFMAS / batch), simulate on a sandbox',
    CANNOT_NEVER_USED: 'X boleh: never written on SIT (dev/backend-only or obsolete)',
    CANNOT_UNMAPPED: 'X boleh: document type not mapped to a table',
  };
  const modules = [...new Set(rows.map((r) => r.module))].sort();
  const count = (m: string | null, s: string) => rows.filter((r) => (!m || r.module === m) && r.state === s).length;
  const total = rows.length;
  const proven = count(null, 'RUN') + count(null, 'SIMULATED');
  const out: string[] = [
    '# Status coverage: proven vs open (generated)',
    '',
    `Generated ${nowMy()} by \`tests/tools/coverage.tool.spec.ts\` from the SIT DB (read-only): ${[...docs.values()].reduce((n, s) => n + s.size, 0)} of our documents, ${sims.length} simulations. Do not edit by hand.`,
    '',
    `**Proven: ${proven}/${total} (${((proven / total) * 100).toFixed(1)}%)** = ${count(null, 'RUN')} real runs + ${count(null, 'SIMULATED')} simulated.`,
    '',
    `| Module | Active | ${STATES.join(' | ')} |`,
    `|---|---|${STATES.map(() => '---').join('|')}|`,
    ...modules.map((m) => `| ${m} | ${rows.filter((r) => r.module === m).length} | ${STATES.map((s) => count(m, s)).join(' | ')} |`),
    `| **All** | ${total} | ${STATES.map((s) => count(null, s)).join(' | ')} |`,
    '',
    ...STATES.map((s) => `- **${s}**: ${LABEL[s]}`),
  ];
  for (const m of modules) {
    out.push('', `## ${m}`, '', '| Doc type | Status | EN | State | Evidence |', '|---|---|---|---|---|');
    for (const r of rows.filter((x) => x.module === m).sort((a, b) => a.docType.localeCompare(b.docType) || a.statusId - b.statusId))
      out.push(`| ${r.docType} | ${r.statusId} | ${r.en} | ${r.state} | ${r.evidence} |`);
  }
  fs.writeFileSync(path.join(ROOT, 'docs', 'status-proven.md'), out.join('\n') + '\n');
  fs.writeFileSync(path.join(dataDir, 'status-proven.json'), JSON.stringify({ at: nowMy(), rows }, null, 1));
  console.log(out.slice(0, 20).join('\n'));
});
