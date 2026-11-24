// Cross-checks every ACTIVE status (registry/active-statuses.json, from NGEPSIT_Active_Status_All_Modules.xlsx) with
//   - what SIT really writes (registry/db-usage.json, `npm run qa -- db-usage`), and
//   - what our flows reach (registry/workflows/*.json checkpoint.db, gates),
// and writes registry/status-coverage.json + docs/status-coverage.md. Run: node scripts/status-coverage.mjs
//
// Classes (how a test case gets a document at that status):
//   FLOW        an automated step of a flow reaches it (data prep spec exists)
//   FLOW_MANUAL a manual step / an expectation not yet seen on SIT reaches it (data prep spec stops there for the tester)
//   UI_NO_FLOW  SIT reaches it through the screens (rows exist) but no flow of ours does yet → add a flow
//   SYSTEM      set by the backend (iGFMAS/interface, scheduler, batch, time limit, migration…) → simulate it
//   NEVER_USED  active but never written on SIT → backend/developer-only or obsolete → simulate if a test needs it
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const active = read('registry/active-statuses.json');
const usage = fs.existsSync(path.join(root, 'registry/db-usage.json')) ? read('registry/db-usage.json') : { usage: {}, readAt: '-' };
const schema = read('registry/db-schema.json');
const specs = fs.existsSync(path.join(root, 'registry/status-specs.json')) ? read('registry/status-specs.json').index : {};
const gates = read('registry/gates.json');
const MODULES = ['pm', 'sm', 'qt', 'sq', 'dp', 'direct-loa', 'ct', 'fl'];
const files = MODULES.map((m) => read(`registry/workflows/${m}.json`));

// kind ('LA', 'CT:FD', 'QT:OC', 'AA:CP') → workflow prefix + doc type, e.g. SC|LA, CT|FD, SC|OC, PM|CP
const wfOf = (kind) => {
  const [doc, wf] = kind.split(':');
  const src = schema.documents[doc];
  if (!src) return null;
  return `${src.workflow.split('_')[0].toUpperCase()}|${wf ?? src.wfTypes[0]}`;
};
const reached = new Map(); // MOD|TYPE|STATUS → [{flow, step, manual, expected}]
const add = (key, v) => (reached.get(key) ?? reached.set(key, []).get(key)).push(v);
for (const d of files)
  for (const f of d.flows)
    for (const r of f.steps) {
      const step = typeof r === 'string' ? d.steps[r] ?? files.flatMap((x) => (x.steps[r] ? [x.steps[r]] : []))[0] : null;
      const db = step ? step.checkpoint.db : gates[r.gate]?.db;
      if (!db || db.statusId == null) continue;
      const wf = wfOf(db.kind);
      if (!wf) continue;
      const v = { flow: f.id, module: d.module, submodule: f.submodule ?? 'main', step: typeof r === 'string' ? r : `GATE ${r.gate}`, manual: step?.automation === 'manual', expected: !!db.observeOnly };
      add(`${wf}|${db.statusId}`, v);
      for (const via of db.via ?? []) add(`${wf}|${via}`, { ...v, via: true });
    }

const SYSTEM = [
  [/i ?gfmas|1gfmas|interface|myGPIS|eperunding|ePerunding|synchron/i, 'interface (iGFMAS / external system response)'],
  [/year end|AP59|ministry restructuring|migration|archived|closed due to|cancelled by system|by system|auto[- ]?(cancel|delet|reject|clos)|system (generated|cancel)/i, 'batch / scheduler / administrative job'],
  [/expired|within (the )?pre-?defined|pre-?defined period|no response|no payment|not declare|validity period|time ?out/i, 'scheduler after a time limit'],
];
const systemOf = (en) => SYSTEM.find(([re]) => re.test(en))?.[1];

const rows = active.statuses.map((s) => {
  const key = `${s.module}|${s.docType}|${s.statusId}`;
  const u = usage.usage[key];
  const by = reached.get(key) ?? [];
  const sys = systemOf(s.en);
  let cls;
  if (by.some((b) => !b.manual && !b.expected && !b.via)) cls = 'FLOW';
  else if (by.length) cls = 'FLOW_MANUAL';
  else if (sys) cls = 'SYSTEM';
  else if (u?.rows) cls = 'UI_NO_FLOW';
  else cls = 'NEVER_USED';
  const how =
    cls === 'FLOW' || cls === 'FLOW_MANUAL'
      ? `data prep: ${[...new Set(by.map((b) => `${b.module}/${b.submodule}/${b.flow}${b.via ? ' (passes through)' : ''}`))].slice(0, 3).join(', ')}`
      : cls === 'SYSTEM'
        ? `${sys}: prepare the nearest status, then npm run qa -- simulate --env sit --doc <no> --status ${s.statusId}${s.module === 'SC' || s.module === 'CT' ? ' --type ' + s.docType : ''}`
        : cls === 'UI_NO_FLOW'
          ? `reachable on screens (${u.rows} rows, last ${u.last}): add a flow, or simulate`
          : 'never written on SIT: confirm with the developer; simulate if a test case needs it';
  const sp = specs[key];
  return { ...s, rows: u?.rows ?? 0, lastUsed: u?.last ?? '', class: cls, flows: by.map((b) => b.flow), how, spec: sp?.spec ?? null, prep: sp?.method ?? null };
});

// statuses SIT writes that are NOT in the active list (inactive in PM_STATUS, or missing)
const activeKeys = new Set(active.statuses.map((s) => `${s.module}|${s.docType}|${s.statusId}`));
const inactiveUsed = Object.entries(usage.usage).filter(([k]) => !activeKeys.has(k)).map(([k, v]) => ({ key: k, ...v })).sort((a, b) => b.rows - a.rows);

const CLASSES = ['FLOW', 'FLOW_MANUAL', 'UI_NO_FLOW', 'SYSTEM', 'NEVER_USED'];
const summary = {};
for (const r of rows) {
  summary[r.module] ??= Object.fromEntries([['total', 0], ...CLASSES.map((c) => [c, 0])]);
  summary[r.module].total++;
  summary[r.module][r.class]++;
}
fs.writeFileSync(path.join(root, 'registry', 'status-coverage.json'), JSON.stringify({ _about: 'GENERATED by scripts/status-coverage.mjs — do not edit', generatedAt: new Date().toISOString(), usageReadAt: usage.readAt, summary, statuses: rows, inactiveButUsed: inactiveUsed }, null, 1) + '\n');

const L = [
  '# Status coverage (generated)',
  '',
  `Generated by \`node scripts/status-coverage.mjs\` (also run by \`npm run qa -- db-usage --env sit\`). Source of the active list: ${active._about}`,
  `SIT usage read ${usage.readAt} (all-time rows per status in the 7 workflow tables). Do not edit by hand.`,
  '',
  '| Class | Meaning | How a test case gets a document there |',
  '|---|---|---|',
  '| FLOW | an automated step of our flows reaches it | run its data-prep spec |',
  '| FLOW_MANUAL | a manual step (or an expectation not yet seen on SIT) reaches it | run the data-prep spec; the tester does the manual step |',
  '| UI_NO_FLOW | SIT reaches it on screens, no flow of ours yet | add a flow (or simulate meanwhile) |',
  '| SYSTEM | set by the backend: interface (iGFMAS), batch/scheduler, time limit | prepare the nearest status, then `npm run qa -- simulate` (data patch run by the tester, logged in knowledge/data-change-audit.md) |',
  '| NEVER_USED | active but never written on SIT (developer/backend-only or obsolete) | confirm with the developer; simulate if a test case needs it |',
  '',
  'Every status has a spec in `tests/data-prep/en/by-status/<module>/<doc type>/<status id>-<name>.spec.ts` (`npm run qa -- prepare --env sit --status-id <id> --doc-type <type>`). Method: **flow** = a flow step reaches it; **simulate** = a flow (or QA_INPUT) makes the document, then the status is simulated (tester runs the patch, rerun confirms); **unmapped** = doc type not mapped to a table yet; **never-used-type** = no document on SIT has ever been in that workflow.',
  '',
  '## Summary per module',
  '',
  `| Module | Active | ${CLASSES.join(' | ')} |`,
  `|---|---|${CLASSES.map(() => '---').join('|')}|`,
  ...Object.entries(summary).map(([m, s]) => `| ${m} | ${s.total} | ${CLASSES.map((c) => s[c]).join(' | ')} |`),
  '',
];
for (const m of Object.keys(summary)) {
  L.push(`## ${m}`, '', '| Doc type | Status | EN | BM | SIT rows (last) | Class | Data prep spec (method) |', '|---|---|---|---|---|---|---|');
  for (const r of rows.filter((x) => x.module === m).sort((a, b) => a.docType.localeCompare(b.docType) || a.statusId - b.statusId))
    L.push(`| ${r.docType} | ${r.statusId} | ${r.en} | ${r.bm} | ${r.rows}${r.lastUsed ? ` (${r.lastUsed})` : ''} | ${r.class} | ${r.spec ? `[${r.prep}](../${r.spec})` : r.how.replace(/\|/g, '/')} |`);
  L.push('');
}
L.push('## Written on SIT but not in the active list', '', 'Statuses the workflow tables contain that PM_STATUS does not list as active (RECORD_STATUS ≠ 1 or missing). Worth asking the developer whether they are still set.', '', '| Workflow | Doc type | Status | Rows | Last used |', '|---|---|---|---|---|');
for (const x of inactiveUsed.slice(0, 300)) {
  const [w, t, s] = x.key.split('|');
  L.push(`| ${w} | ${t} | ${s} | ${x.rows} | ${x.last} |`);
}
if (inactiveUsed.length > 300) L.push(`| … | | ${inactiveUsed.length - 300} more in registry/status-coverage.json | | |`);
fs.writeFileSync(path.join(root, 'docs', 'status-coverage.md'), L.join('\n') + '\n');
console.log('status coverage:', JSON.stringify(summary), `· ${inactiveUsed.length} used-but-inactive pairs`);
