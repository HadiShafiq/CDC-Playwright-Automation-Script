#!/usr/bin/env node
// ePerolehan QA CLI (Phase 1). Usage: npm run qa -- <command> [options]     (npm run qa -- help)
//
// It plans and runs the flows of registry/ through Playwright (tests/flows/<lang>/<module>.flow.spec.ts), keeps the
// per-run checkpoint state in .data/<ENV>/<tester>/runs/<flowRunId>/, shows live progress from the run's events, and
// records the tester's decisions at gates (SQL date moves, DB lookups, officer assignment). Plain Node, no extra packages.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const MODULES = ['pm', 'sm', 'qt', 'sq', 'dp', 'direct-loa', 'ct', 'fl'];
const DOC_TYPES = ['AA', 'AP', 'PD', 'PL', 'TC', 'CX', 'RC', 'QT', 'SQ', 'PI', 'RN', 'PR', 'PO', 'LA', 'CT', 'CR', 'CO', 'DO', 'FN', 'SD', 'IN', 'DN', 'CN', 'PA'];
const ENVS = { SIT: 'http://ngepsit.eperolehan.com.my', UAT: 'http://ngepuat.eperolehan.com.my' };
const tty = process.stdout.isTTY;
const c = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = c(1), dim = c(2), red = c(31), green = c(32), yellow = c(33), cyan = c(36);

/* ---------- arguments ---------- */
function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const [k, inline] = a.slice(2).split(/=(.*)/s, 2);
    const next = inline ?? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true);
    if (['input', 'var', 'officer', 'set'].includes(k)) (out[k] ??= []).push(next);
    else out[k] = next;
  }
  return out;
}
const die = (msg) => { console.error(red(`✖ ${msg}`)); process.exit(1); };

/* ---------- context ---------- */
const tester = () => (process.env.QA_TESTER || os.userInfo().username || 'tester').toLowerCase().replace(/[^a-z0-9._-]+/g, '_');
function envOf(args, required = true) {
  const raw = String(args.env ?? process.env.TEST_ENV ?? '').toUpperCase();
  if (!raw) { if (required) die('Choose the environment explicitly: --env sit   (UAT is not set up yet; production is never configured)'); return undefined; }
  if (!ENVS[raw]) die(`--env must be sit or uat (got "${raw}")`);
  return raw;
}
const stateDir = (env) => path.join(ROOT, '.data', env, tester());
const runDirOf = (env, id) => path.join(stateDir(env), 'runs', id);
const readJson = (f, fb) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fb);
function writeJson(f, d) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(`${f}.tmp`, JSON.stringify(d, null, 2) + '\n');
  fs.renameSync(`${f}.tmp`, f);
}
const nowMy = () => new Date(Date.now() + 8 * 3600_000).toISOString().replace(/\.\d+Z$/, '+08:00');
const stampMy = () => nowMy().slice(0, 19).replace(/-/g, '').replace('T', '-').replace(/:/g, '');

/* ---------- registry ---------- */
function loadRegistry() {
  const problems = [];
  const gates = readJson(path.join(ROOT, 'registry', 'gates.json'), {});
  const steps = {}, flows = {}, modules = [];
  for (const m of MODULES) {
    const d = readJson(path.join(ROOT, 'registry', 'workflows', `${m}.json`), null);
    if (!d) { problems.push(`registry/workflows/${m}.json missing`); continue; }
    modules.push({ id: m, name: d.name, description: d.description, steps: Object.keys(d.steps).length, flows: d.flows.length });
    for (const [id, s] of Object.entries(d.steps)) {
      if (steps[id]) problems.push(`${id} owned by ${steps[id].module} and ${m}`);
      steps[id] = { id, module: m, ...s };
      for (const x of [...s.inputs, ...s.outputs]) if (!DOC_TYPES.includes(x.doc)) problems.push(`${id}: unknown document type ${x.doc}`);
      if (!['manual', 'module'].includes(s.automation) && !fs.existsSync(path.join(ROOT, 'support', 'katalon', 'steps', `${id}.ts`))) problems.push(`${id}: no step function support/katalon/steps/${id}.ts`);
    }
    for (const f of d.flows) flows[f.id] = { ...f, module: m };
  }
  for (const f of Object.values(flows))
    for (const r of f.steps) {
      if (typeof r === 'string' && !steps[r]) problems.push(`flow ${f.id}: unknown step ${r}`);
      if (typeof r === 'object' && !gates[r.gate]) problems.push(`flow ${f.id}: unknown gate ${r.gate}`);
    }
  return { gates, steps, flows, modules, problems };
}
const itemKey = (r) => (typeof r === 'string' ? r : r.gate);
function flowOrDie(reg, id) {
  if (!id || id === true) die('Give --flow <id>   (npm run qa -- list-flows)');
  const f = reg.flows[id];
  if (!f) die(`Unknown flow "${id}". npm run qa -- list-flows`);
  return f;
}
function externalInputs(reg, flow) {
  const have = new Set(), need = new Set();
  for (const r of flow.steps) {
    if (typeof r === 'object') { for (const d of reg.gates[r.gate].provides ?? []) have.add(d); continue; }
    for (const i of reg.steps[r].inputs) if (!have.has(i.doc)) need.add(i.doc);
    for (const o of reg.steps[r].outputs) have.add(o.doc);
  }
  return [...need];
}

/* ---------- commands: catalogue ---------- */
function cmdListModules() {
  const reg = loadRegistry();
  for (const m of reg.modules) console.log(`${bold(m.id.padEnd(11))} ${m.name}  ${dim(`(${m.steps} steps, ${m.flows} flows)`)}\n${' '.repeat(12)}${dim(m.description)}`);
}
function cmdListFlows(args) {
  const reg = loadRegistry();
  for (const f of Object.values(reg.flows)) {
    if (args.module && f.module !== args.module) continue;
    const ext = externalInputs(reg, f);
    console.log(`${bold(f.id.padEnd(38))} ${f.module.padEnd(10)} ${String(f.steps.length).padStart(2)} items  ${verif(f.verification)}${ext.length ? yellow(`  needs --input ${ext.join(',')}`) : ''}\n${' '.repeat(39)}${dim(f.title)}`);
  }
}
const verif = (v) => (v === 'execution' ? green(v) : v === 'unverified' ? red(v) : yellow(v));
function cmdShowFlow(args) {
  const reg = loadRegistry();
  const f = flowOrDie(reg, args.flow);
  console.log(`${bold(f.id)} — ${f.title}\nmodule ${f.module} · verification ${verif(f.verification)}\n${dim(f.notes)}\n`);
  f.steps.forEach((r, i) => {
    const n = String(i + 1).padStart(2, '0');
    if (typeof r === 'object') { const g = reg.gates[r.gate]; console.log(`${n} ${yellow('GATE')} ${bold(r.gate)} (${g.type}) ${g.title}`); return; }
    const s = reg.steps[r];
    const login = typeof s.login === 'object' ? `account of ${s.login.accountOf}` : s.login;
    console.log(`${n} ${bold(s.id)} ${s.title}\n     role ${s.role} · login ${login} · in ${s.inputs.map((x) => `${x.var}←${x.doc}`).join(', ') || '-'} · out ${s.outputs.map((x) => x.doc).join(', ') || '-'}\n     checkpoint ${s.checkpoint.id} (${verif(s.checkpoint.verification)})${s.stateChanging ? red(' · changes data') : ''}`);
  });
  if (f.variables && Object.keys(f.variables).length) console.log(`\nflow variables: ${JSON.stringify(f.variables)}`);
}
function cmdListStatuses(args) {
  const reg = loadRegistry();
  const seen = new Set();
  for (const s of Object.values(reg.steps)) {
    if (args.module && s.module !== args.module) continue;
    const cp = s.checkpoint;
    const key = `${s.module}:${cp.id}`;
    console.log(`${(seen.has(key) ? dim : bold)(cp.id.padEnd(24))} ${s.module.padEnd(10)} after ${s.id.padEnd(8)} ${verif(cp.verification).padEnd(12)} EN: ${cp.displayedStatus.en ?? dim('not yet seen')}  BM: ${cp.displayedStatus.bm ?? dim('not yet seen')}`);
    seen.add(key);
  }
  console.log(dim('\nDisplayed statuses stay "not yet seen" until a run reads the application\'s own status text.'));
}

/* ---------- commands: run ---------- */
function parsePairs(list, what) {
  const out = {};
  for (const p of list ?? []) {
    const m = String(p).match(/^([^=]+)=(.+)$/);
    if (!m) die(`--${what} expects KEY=VALUE (got "${p}")`);
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}
const DOC_RE = (t) =>
  t === 'DO' ? /^\d{5}[A-Z]\d{3}[A-Z]\d{7}$/ : t === 'AP' ? /^[A-Z]{2}-\d{8}-\d{4}$/ : t === 'AA' ? /^AP\d{15}$/ : t === 'PL' ? /^P[PE]\d{15}$/ : t === 'TC' ? /^(CQ|PQ|PM)\d{13,15}$/ : t === 'RC' ? /^RN[CE]\d{6}-\d{4}$/ : t === 'CN' ? /^(CN\d{12,15}|C\d{16})$/ : new RegExp(`^${t}\\d{12,15}$`);
function checkDocs(pairs) {
  for (const [k, v] of Object.entries(pairs)) {
    if (!DOC_TYPES.includes(k)) die(`Unknown document type ${k} (${DOC_TYPES.join(', ')})`);
    if (!DOC_RE(k).test(v)) die(`${v} does not look like a ${k} number`);
  }
}

function printPlan(reg, f, st) {
  const keys = f.steps.map(itemKey);
  const from = st.from ? keys.indexOf(st.from) : 0, to = st.to ? keys.indexOf(st.to) : keys.length - 1;
  console.log(`\n${bold('Execution plan')}  ${dim(st.flowRunId)}`);
  console.log(`  environment ${bold(st.env)} (${ENVS[st.env]}) · tester ${st.tester} · language ${st.language} · CR ${st.cr ?? '-'}`);
  console.log(`  flow ${bold(f.id)} (${f.module}) · items ${from + 1}–${to + 1} of ${keys.length}`);
  if (Object.keys(st.docs).length) console.log(`  documents in hand: ${Object.entries(st.docs).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  f.steps.forEach((r, i) => {
    const k = itemKey(r), rec = st.steps[k], g = st.gates[k];
    const mark = i < from || i > to ? dim('skip') : typeof r === 'object' ? (g?.done ? green('done') : yellow('WAIT')) : rec ? stateMark(rec.state) : cyan('run ');
    const label = typeof r === 'object' ? `GATE ${k} — ${reg.gates[k].title}` : `${k} ${reg.steps[k].title} ${dim(`(${reg.steps[k].role})`)}`;
    console.log(`  ${mark} ${String(i + 1).padStart(2, '0')} ${label}`);
  });
  const missing = externalInputs(reg, f).filter((d) => !st.docs[d]);
  const firstStep = f.steps.slice(from, to + 1).find((r) => typeof r === 'string');
  if (missing.length && firstStep) console.log(yellow(`  ⚠ needs ${missing.join(', ')} from outside: --input ${missing[0]}=<number> (or a gate will ask for it)`));
}
const stateMark = (s) => ({ verified: green('✔ ok'), 'completed-unverified': yellow('✔ ? '), failed: red('✖   '), blocked: yellow('⏸   '), running: red('?!  '), uncertain: red('?!  ') })[s] ?? s;

function newState(env, f, args) {
  const id = `${f.id}_${stampMy()}`;
  const lang = String(args.lang ?? 'en').toUpperCase();
  if (!['EN', 'BM'].includes(lang)) die('--lang must be en or bm');
  const inputs = parsePairs(args.input, 'input');
  checkDocs(inputs);
  const vars = {};
  for (const [k, v] of Object.entries(parsePairs(args.var, 'var'))) {
    const m = k.match(/^(KAT-\d{3})\.(\w+)$/);
    if (!m) die(`--var expects KAT-0xx.Variable=value (got ${k})`);
    (vars[m[1]] ??= {})[m[2]] = v;
  }
  const keys = f.steps.map(itemKey);
  for (const k of ['from', 'to']) if (args[k] && !keys.includes(args[k])) die(`--${k} ${args[k]} is not an item of ${f.id}: ${keys.join(', ')}`);
  const t = nowMy();
  return {
    flowRunId: id, flowId: f.id, module: f.module, env, tester: tester(), language: lang, cr: args.cr ? String(args.cr) : null,
    createdAt: t, updatedAt: t, from: args.from ?? null, to: args.to ?? null, docs: inputs, officers: parsePairs(args.officer, 'officer'),
    gates: {}, steps: {}, allowRerun: [], vars, status: 'in-progress',
  };
}

async function confirm(q) {
  if (!process.stdin.isTTY) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question(q)).trim().toLowerCase();
  rl.close();
  return a === '' || a === 'y' || a === 'yes';
}

async function cmdPlan(args) {
  const env = envOf(args);
  const reg = loadRegistry();
  const f = flowOrDie(reg, args.flow);
  printPlan(reg, f, newState(env, f, args));
  console.log(dim('\nDry run only: nothing was started. Use "run" with the same options to execute.'));
}

async function cmdRun(args) {
  const env = envOf(args);
  const reg = loadRegistry();
  if (reg.problems.length) die(`registry/ is invalid:\n  ${reg.problems.join('\n  ')}`);
  const f = flowOrDie(reg, args.flow);
  const st = newState(env, f, args);
  if (st.language === 'BM' && process.env.QA_ALLOW_BM !== '1') die('Bahasa Melayu runs start only after every English flow passes and the user allows it (set QA_ALLOW_BM=1).');
  if (env === 'UAT') console.log(yellow('⚠ UAT: no UAT credentials or verified behaviour yet; expect script changes.'));
  printPlan(reg, f, st);
  if (!args.yes && !(await confirm(`\nStart this run on ${env}? It changes SIT data. [Y/n] `))) die('Not started.');
  writeJson(path.join(runDirOf(env, st.flowRunId), 'state.json'), st);
  await execute(env, f, st.flowRunId, args);
}

/** Ways to reach a status: every (flow, step) whose checkpoint is it, best first. */
function statusCandidates(reg, status, { module, flow } = {}) {
  const RANK = { execution: 0, documentation: 1, source: 2, unverified: 3 };
  const out = [];
  for (const f of Object.values(reg.flows)) {
    if (flow && f.id !== flow) continue;
    f.steps.forEach((r, i) => {
      if (typeof r !== 'string') return;
      const s = reg.steps[r];
      if (s.checkpoint.id !== status || (module && s.module !== module)) return;
      const gates = f.steps.slice(0, i + 1).filter((x) => typeof x === 'object').map((x) => x.gate);
      out.push({ flow: f, step: s, index: i, gates });
    });
  }
  return out.sort((a, b) => RANK[a.flow.verification] - RANK[b.flow.verification] || a.gates.length - b.gates.length || a.index - b.index);
}

/** Prepare a transaction at a status for manual testing: run the best flow up to the step that reaches it, then stop. */
async function cmdPrepare(args) {
  // --status-id: the by-status spec of one active status (tests/data-prep/en/by-status/<module>/<doc type>/<id>-*.spec.ts)
  if (args['status-id'] && args['status-id'] !== true) {
    const env = envOf(args);
    const idx = readJson(path.join(ROOT, 'registry', 'status-specs.json'), { index: {} }).index;
    const hits = Object.entries(idx).filter(([k]) => {
      const [m, t, id] = k.split('|');
      return id === String(args['status-id']) && (!args['doc-type'] || t === String(args['doc-type'])) && (!args.module || m === String(args.module).toUpperCase());
    });
    if (!hits.length) die(`No active status ${args['status-id']}${args['doc-type'] ? ' / ' + args['doc-type'] : ''} (docs/status-coverage.md)`);
    if (hits.length > 1) die(`Status ${args['status-id']} exists for several doc types: ${hits.map(([k]) => k).join(', ')} — add --doc-type`);
    const [key, x] = hits[0];
    console.log(`${bold('Prepare')} ${key} · method ${x.method}${x.flow ? ` · flow ${x.flow} up to ${x.upTo}` : ''}
  ${dim(x.spec)}`);
    if (args.plan) return console.log(dim('Plan only (--plan): nothing started.'));
    if (x.method === 'unmapped' || x.method === 'never-used-type') die(`${key}: ${x.method === 'unmapped' ? 'doc type not mapped to a table yet' : 'no document on SIT has ever been in this workflow'} (see the spec header)`);
    const pwArgs = [path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js'), 'test', x.spec, '--project=flows', '--workers=1', ...(args.headed ? ['--headed'] : [])];
    const input = parsePairs(args.input, 'input');
    checkDocs(input);
    const child = spawn(process.execPath, pwArgs, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, TEST_ENV: env, ...(Object.keys(input).length ? { QA_INPUT: Object.entries(input).map(([k, v]) => `${k}=${v}`).join(',') } : {}) } });
    process.exitCode = await new Promise((r) => child.on('exit', r));
    return;
  }
  const reg = loadRegistry();
  if (!args.status || args.status === true) {
    console.log('Give --status <STATUS>. Statuses:');
    return cmdListStatuses(args);
  }
  const c = statusCandidates(reg, String(args.status), { module: args.module, flow: args.flow });
  if (!c.length) die(`No flow reaches status ${args.status}${args.flow ? ` in ${args.flow}` : ''}. npm run qa -- list-statuses`);
  const best = c[0];
  console.log(`${bold('Prepare')} ${args.status}: ${best.step.checkpoint.description}\n  via ${bold(best.flow.id)} up to ${best.step.id} (${best.index + 1} items${best.gates.length ? `; gates ${best.gates.join(', ')}` : '; no gates'})`);
  if (c.length > 1) console.log(dim(`  other ways (use --flow): ${c.slice(1, 6).map((x) => `${x.flow.id} (${x.index + 1} items)`).join(', ')}${c.length > 6 ? ', …' : ''}`));
  if (args.plan) return cmdPlan({ ...args, flow: best.flow.id, to: best.step.id });
  return cmdRun({ ...args, flow: best.flow.id, to: best.step.id });
}

async function cmdResume(args) {
  const env = envOf(args);
  const reg = loadRegistry();
  const { st, dir } = loadRun(env, args.run);
  const f = flowOrDie(reg, st.flowId);
  if (st.status === 'uncertain') die(`Run is UNCERTAIN: ${st.blockedReason}`);
  fs.rmSync(path.join(dir, 'STOP'), { force: true });
  for (const k of ['from', 'to']) if (args[k]) st[k] = args[k];
  writeJson(path.join(dir, 'state.json'), st);
  printPlan(reg, f, st);
  if (!args.yes && !(await confirm(`\nResume on ${env}? Finished steps are skipped. [Y/n] `))) die('Not resumed.');
  await execute(env, f, st.flowRunId, args);
}

function loadRun(env, id) {
  if (!id || id === true) {
    const runs = listRuns(env);
    if (!runs.length) die('No runs yet.');
    id = runs[0].flowRunId;
    console.log(dim(`(latest run: ${id})`));
  }
  const dir = runDirOf(env, id);
  const st = readJson(path.join(dir, 'state.json'), null);
  if (!st) die(`No run ${id} in ${stateDir(env)}`);
  return { st, dir, id };
}
function listRuns(env) {
  const base = path.join(stateDir(env), 'runs');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).map((d) => readJson(path.join(base, d, 'state.json'), null)).filter(Boolean).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Runs Playwright for one flow and shows live progress from the run's events.jsonl. */
async function execute(env, f, flowRunId, args, spec) {
  const dir = runDirOf(env, flowRunId);
  const lock = path.join(stateDir(env), 'active-run.json');
  const active = readJson(lock, null);
  if (active && isAlive(active.pid)) die(`Another run is active (${active.flowRunId}, pid ${active.pid}). One run at a time per tester: accounts and data are shared.`);
  writeJson(lock, { pid: process.pid, flowRunId, startedAt: nowMy() });

  // spec: a CR-suite spec (its run ID is fixed by RUN_ID; the spec writes the state itself)
  const lang = (spec?.lang ?? readJson(path.join(dir, 'state.json')).language).toLowerCase();
  const pwArgs = spec
    ? ['playwright', 'test', spec.path, '--project=flows', '--workers=1']
    : ['playwright', 'test', `tests/flows/${lang}/${f.module}.flow.spec.ts`, '--project=flows', '--workers=1', '--grep', `@flow-${f.id}(\\s|$)`];
  if (args.headed) pwArgs.push('--headed');
  const env2 = { ...process.env, TEST_ENV: env, QA_FLOW: f.id, QA_FLOW_RUN: flowRunId, QA_LANG: lang.toUpperCase(), RUN_ID: undefined };
  if (args.cr) env2.QA_CR = String(args.cr);
  delete env2.RUN_ID;
  if (spec?.runId) env2.RUN_ID = spec.runId;
  if (spec?.input) env2.QA_INPUT = spec.input;
  const log = fs.openSync(path.join(dir, 'playwright.log'), 'a');
  console.log(dim(`\n$ npx ${pwArgs.join(' ')}\n  log: ${path.relative(ROOT, path.join(dir, 'playwright.log'))}\n  Ctrl+C once = stop after the current step; twice = abort now (the step becomes UNCERTAIN)\n`));
  const started = Date.now();
  // Node runs Playwright's CLI directly (no shell: the grep pattern has "|"). Detached, so Ctrl+C reaches only this
  // CLI, which turns the first one into "stop after the current step".
  const pwCli = path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
  const child = spawn(process.execPath, [pwCli, ...pwArgs.slice(1)], { cwd: ROOT, env: env2, stdio: ['ignore', log, log], detached: true, windowsHide: true });
  let interrupts = 0;
  process.on('SIGINT', () => {
    interrupts++;
    if (interrupts === 1) { fs.writeFileSync(path.join(dir, 'STOP'), nowMy()); console.log(yellow('\n⏸ Stop requested: the current step finishes, nothing new starts.')); }
    else { console.log(red('\n✖ Aborting now.')); child.kill('SIGINT'); }
  });
  const stopWatch = watchEvents(env, flowRunId, f, started);
  const code = await new Promise((r) => child.on('exit', r));
  await new Promise((r) => setTimeout(r, 700));
  stopWatch();
  fs.rmSync(lock, { force: true });
  const st = readJson(path.join(dir, 'state.json'), null);
  if (!st) { console.log(red(`\nNo run state was written (playwright exit ${code}); see ${path.relative(ROOT, path.join(dir, 'playwright.log'))}`)); process.exitCode = 1; return; }
  console.log(`\n${bold('Result')} ${statusColor(st.status)} · ${Math.round((Date.now() - started) / 1000)} s · playwright exit ${code}`);
  if (Object.keys(st.docs).length) console.log(`  documents: ${Object.entries(st.docs).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  if (st.blockedReason) console.log(yellow(`  next: ${st.blockedReason}`));
  if (st.status === 'failed') console.log(red(`  see: npm run qa -- report --env ${env.toLowerCase()} --run ${flowRunId}`));
  writeReport(env, flowRunId);
  console.log(dim(`  report: ${path.relative(ROOT, path.join(dir, 'report.md'))}`));
  process.exitCode = st.status === 'completed' || st.status === 'blocked' ? 0 : 1;
  // Self-heal on a fresh failure: resume once after a minute (SIT task lists lag behind BPM). The runner's selfHeal
  // decides from the SIT DB whether the failed step may run again; without evidence it stays failed for a person.
  if (st.status === 'failed' && !spec && !args._healed && process.env.QA_SELF_HEAL !== '0') {
    console.log(yellow('\n↻ Self-heal: resuming once in 60 s; the failed step runs again only if the SIT DB proves nothing was changed.'));
    await new Promise((r) => setTimeout(r, 60_000));
    await execute(env, f, flowRunId, { ...args, _healed: true }, spec);
  }
}
const statusColor = (s) => (s === 'completed' ? green(s.toUpperCase()) : s === 'blocked' ? yellow('BLOCKED (waiting for you)') : red(s.toUpperCase()));
function isAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

/** Live view: one line per event; progress counts only items that really finished (checkpoints), never estimates. */
function watchEvents(env, flowRunId, f, started) {
  const file = path.join(runDirOf(env, flowRunId), 'events.jsonl');
  let pos = fs.existsSync(file) ? fs.statSync(file).size : 0;
  const total = f.steps.length;
  const tick = () => {
    if (!fs.existsSync(file)) return;
    const size = fs.statSync(file).size;
    if (size <= pos) return;
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(size - pos);
    fs.readSync(fd, buf, 0, buf.length, pos);
    fs.closeSync(fd);
    pos = size;
    for (const line of buf.toString('utf8').split('\n').filter(Boolean)) {
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      const t = dim(e.t.slice(11, 19));
      const st = readJson(path.join(runDirOf(env, flowRunId), 'state.json'), { steps: {}, gates: {} });
      const done = f.steps.filter((r) => (typeof r === 'object' ? st.gates[r.gate]?.done : ['verified', 'completed-unverified'].includes(st.steps[r]?.state))).length;
      const prog = dim(`[${done}/${total} · ${Math.round((Date.now() - started) / 1000)} s]`);
      if (e.type === 'step-start') console.log(`${t} ${cyan('▶')} ${bold(e.item)} ${e.title} ${dim(`role ${e.role}; login ${e.login}`)}${Object.keys(e.inputs ?? {}).length ? dim(`; inputs ${Object.entries(e.inputs).map(([k, v]) => `${k}=${v}`).join(', ')}`) : ''}`);
      else if (e.type === 'message') console.log(`${t}   ${e.severity === 'error' ? red('✉') : dim('✉')} ${e.severity}: ${e.text.slice(0, 160)}`);
      else if (e.type === 'step-end') console.log(`${t} ${e.state === 'verified' ? green('✔ VERIFIED') : e.state === 'failed' ? red('✖ FAILED') : yellow('✔ COMPLETED (not verified)')} ${e.item} ${e.checkpoint}${Object.keys(e.outputs ?? {}).length ? ' — ' + Object.entries(e.outputs).map(([k, v]) => `${k} ${v}`).join(', ') : ''} ${prog}`);
      else if (e.type === 'failure') console.log(`${t} ${red('  ↳')} ${e.class ?? ''} ${dim(e.because ?? '')}\n${' '.repeat(11)}${red((e.error ?? e.reason ?? '').slice(0, 300))}`);
      else if (e.type === 'gate-blocked') console.log(`${t} ${yellow('⏸ BLOCKED')} ${e.item}\n${' '.repeat(11)}${e.reason}`);
      else if (e.type === 'gate-passed') console.log(`${t} ${green('✔ gate')} ${e.item} ${dim(`done by ${e.by}`)} ${prog}`);
      else if (e.type === 'step-skip') console.log(`${t} ${dim(`· skip ${e.item}: ${e.why}`)}`);
      else if (e.type === 'flow-start') console.log(`${t} ${bold(e.resumed ? 'resumed' : 'started')} ${e.flowId} (${e.language})`);
      else if (e.type === 'flow-end') console.log(`${t} ${bold('flow ended')} ${statusColor(e.status)}`);
      else if (e.type === 'db-status') console.log(`${t}   ${e.expected == null || e.statusId === e.expected ? green('DB') : red('DB')} ${e.kind} ${e.docNo ?? ''} ${e.statusId ?? '-'} ${e.en ?? ''}${e.expected != null ? dim(` (expected ${e.expected})`) : ''}${e.when ? dim(` ${e.when}`) : ''}`);
      else if (e.type === 'note') console.log(`${t} ${yellow('…')} ${e.item ?? ''} ${e.text ?? ''}`);
    }
  };
  const h = setInterval(tick, 500);
  return () => { tick(); clearInterval(h); };
}

/* ---------- commands: decisions ---------- */
function cmdGate(args) {
  const env = envOf(args);
  const reg = loadRegistry();
  const { st, dir } = loadRun(env, args.run);
  const officers = parsePairs(args.officer, 'officer');
  const values = parsePairs(args.set, 'set');
  checkDocs(values);
  for (const [k, v] of Object.entries(officers)) {
    if (!reg.steps[k]) die(`Unknown step ${k}`);
    if (!/^[\w.]+$/.test(v)) die(`Officer login ID "${v}" looks wrong`);
    st.officers[k] = v;
    console.log(green(`✔ ${k} will log in as officer ${v}`));
  }
  if (args.gate) {
    const g = reg.gates[args.gate];
    if (!g) die(`Unknown gate ${args.gate}`);
    if (!args.done && !Object.keys(values).length) die('Say what happened: --done (and --set DOC=number for lookups)');
    for (const d of g.provides ?? []) if (!values[d] && !st.docs[d]) die(`${args.gate} provides ${d}: add --set ${d}=<number>`);
    Object.assign(st.docs, values);
    st.gates[args.gate] = { done: true, by: tester(), at: nowMy(), ...(Object.keys(values).length ? { values } : {}) };
    console.log(green(`✔ gate ${args.gate} recorded as done${Object.keys(values).length ? ` (${Object.entries(values).map(([k, v]) => `${k}=${v}`).join(', ')})` : ''}`));
  }
  if (st.status === 'blocked') { st.status = 'in-progress'; delete st.blockedReason; }
  st.updatedAt = nowMy();
  writeJson(path.join(dir, 'state.json'), st);
  console.log(dim(`Continue with: npm run qa -- resume --env ${env.toLowerCase()} --run ${st.flowRunId}`));
}
function cmdReconcile(args) {
  const env = envOf(args);
  const { st, dir } = loadRun(env, args.run);
  const id = args.step;
  const rec = st.steps[id];
  if (!rec) die(`${id} has no record in this run`);
  if (args.done) {
    const vals = parsePairs(typeof args.done === 'string' ? [args.done] : args.set, 'done');
    checkDocs(vals);
    rec.state = 'completed-unverified';
    Object.assign(rec.outputs, vals);
    Object.assign(st.docs, vals);
    rec.attempts.at(-1).result = 'completed-unverified';
    rec.attempts.at(-1).reconciled = { by: tester(), at: nowMy(), decision: 'went through', values: vals };
    console.log(green(`✔ ${id} recorded as gone through (by ${tester()}), not re-run`));
  } else if (args.redo) {
    rec.state = 'failed';
    rec.attempts.at(-1).reconciled = { by: tester(), at: nowMy(), decision: 'did not go through' };
    st.allowRerun = [...new Set([...st.allowRerun, id])];
    console.log(green(`✔ ${id} will run again on resume`));
  } else die('Give --done [DOC=number] or --redo');
  st.status = 'in-progress';
  delete st.blockedReason;
  st.updatedAt = nowMy();
  writeJson(path.join(dir, 'state.json'), st);
}
function cmdRetry(args) {
  const env = envOf(args);
  const { st, dir } = loadRun(env, args.run);
  if (!st.steps[args.step]) die(`${args.step} has no record in this run`);
  st.allowRerun = [...new Set([...st.allowRerun, args.step])];
  st.status = 'in-progress';
  delete st.blockedReason;
  writeJson(path.join(dir, 'state.json'), st);
  console.log(green(`✔ ${args.step} may run again once. Resume with: npm run qa -- resume --env ${env.toLowerCase()} --run ${st.flowRunId}`));
}
function cmdStop(args) {
  const env = envOf(args);
  const { dir, st } = loadRun(env, args.run);
  fs.writeFileSync(path.join(dir, 'STOP'), nowMy());
  console.log(yellow(`⏸ ${st.flowRunId} stops after its current step.`));
}

/* ---------- commands: status, report, data ---------- */
function cmdRuns(args) {
  const env = envOf(args);
  for (const r of listRuns(env).slice(0, Number(args.limit ?? 20)))
    console.log(`${r.updatedAt.slice(0, 16).replace('T', ' ')}  ${statusColor(r.status).padEnd(12)}  ${bold(r.flowRunId)}  ${dim(Object.entries(r.docs).map(([k, v]) => `${k} ${v}`).join(', '))}`);
}
function cmdStatus(args) {
  const env = envOf(args);
  const reg = loadRegistry();
  const { st } = loadRun(env, args.run);
  printPlan(reg, flowOrDie(reg, st.flowId), st);
  console.log(`\nstatus ${statusColor(st.status)}${st.blockedReason ? `\n${yellow(st.blockedReason)}` : ''}`);
}
function writeReport(env, id) {
  const reg = loadRegistry();
  const dir = runDirOf(env, id);
  const st = readJson(path.join(dir, 'state.json'));
  const f = reg.flows[st.flowId];
  const L = [`# Flow run ${id}`, '', `| | |`, `|---|---|`, `| Flow | ${f.id} — ${f.title} |`, `| Module | ${f.module} |`, `| Environment | ${st.env} |`, `| Tester | ${st.tester} |`, `| Language | ${st.language} |`, `| CR | ${st.cr ?? '-'} |`, `| Status | **${st.status.toUpperCase()}** |`, `| Started / updated | ${st.createdAt} / ${st.updatedAt} |`, `| Documents | ${Object.entries(st.docs).map(([k, v]) => `${k} ${v}`).join(', ') || '-'} |`, ''];
  if (st.blockedReason) L.push(`**Waiting for:** ${st.blockedReason}`, '');
  L.push('## Items', '', '| # | Item | Result | Checkpoint | Documents | Login | Classification / note |', '|---|---|---|---|---|---|---|');
  f.steps.forEach((r, i) => {
    const k = itemKey(r);
    if (typeof r === 'object') { const g = st.gates[k]; L.push(`| ${i + 1} | GATE ${k} | ${g?.done ? `done by ${g.by} ${g.at}` : 'waiting'} | | ${g?.values ? Object.entries(g.values).map(([a, b]) => `${a} ${b}`).join(', ') : ''} | | |`); return; }
    const rec = st.steps[k];
    const a = rec?.attempts.at(-1);
    L.push(`| ${i + 1} | ${k} ${reg.steps[k].title} | ${rec ? rec.state.toUpperCase() : 'not run'}${rec && rec.attempts.length > 1 ? ` (${rec.attempts.length} attempts)` : ''} | ${rec?.checkpoint ?? ''} | ${rec ? Object.entries(rec.outputs).map(([a2, b]) => `${a2} ${b}`).join(', ') : ''} | ${rec?.login ?? ''} | ${(a?.classification ?? '').replace(/\|/g, '/')} ${a?.error ? `<br>${a.error.replace(/\|/g, '/').slice(0, 300)}` : ''} |`);
  });
  L.push('', '## Application messages per step', '');
  for (const [k, rec] of Object.entries(st.steps))
    for (const a of rec.attempts) {
      L.push(`**${k}** attempt ${a.startedAt} → ${a.result}${a.evidenceDir ? ` · evidence \`${path.relative(ROOT, a.evidenceDir)}\`` : ''}`);
      for (const m of a.messages ?? []) L.push(`- ${m.severity}: ${m.text.replace(/\n/g, ' ')}`);
      L.push('');
    }
  fs.writeFileSync(path.join(dir, 'report.md'), L.join('\n') + '\n');
  return path.join(dir, 'report.md');
}
function cmdReport(args) {
  const env = envOf(args);
  const { id } = loadRun(env, args.run);
  console.log(fs.readFileSync(writeReport(env, id), 'utf8'));
}
function cmdData(args) {
  const env = envOf(args);
  const rows = readJson(path.join(stateDir(env), 'transactions.json'), []).filter((t) => (!args.type || t.docType === args.type) && (!args.checkpoint || t.checkpoint === args.checkpoint) && (!args.module || t.module === args.module));
  if (!rows.length) return console.log(dim('No test data recorded yet for this environment and tester.'));
  for (const t of rows) console.log(`${bold(t.ref.padEnd(18))} ${t.docType} ${t.module.padEnd(10)} ${t.checkpoint.padEnd(22)} ${t.verification === 'verified' ? green('verified') : yellow('unverified')}  ${t.reuse}  ${dim(`${t.lastVerifiedAt.slice(0, 16)} ${t.lastStep.stepId} ${t.parents.length ? '← ' + t.parents.join(',') : ''}`)}`);
}
function cmdWatch(args) {
  const env = envOf(args);
  const reg = loadRegistry();
  const { st } = loadRun(env, args.run);
  console.log(dim(`Watching ${st.flowRunId} (Ctrl+C to leave; the run continues)`));
  watchEvents(env, st.flowRunId, flowOrDie(reg, st.flowId), Date.now());
}

/* ---------- SIT database tools (read-only; run through the Playwright "tools" project, which has the TS reader) ---------- */
function runTool(env, toolEnv) {
  if (env !== 'SIT') die('Database checks run only on SIT.');
  const pwCli = path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [pwCli, 'test', 'tests/tools', '--project=tools', '--workers=1', '--reporter=list'], {
      cwd: ROOT, env: { ...process.env, TEST_ENV: env, ...toolEnv }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
    });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('exit', (code) => {
      // show the tool's own output, not Playwright's list lines
      const lines = out.split(/\r?\n/).filter((l) => !/^\s*(Running \d+ test|[✓✘-]\s+\d+|\d+ (passed|skipped|failed)|Slow test|\[tools\])/.test(l));
      console.log(lines.join('\n').trim());
      if (/skipped/.test(out) && !/passed/.test(out)) console.log(yellow('Skipped: no DBeaver "SIT" connection or SQL*Plus on this machine.'));
      process.exitCode = code;
      resolve(code);
    });
  });
}
async function cmdDocStatus(args) {
  const env = envOf(args);
  const no = String(args.doc ?? '');
  if (!DOC_TYPES.some((t) => DOC_RE(t).test(no))) die('Give --doc <document number>, e.g. --doc LA260000000004216');
  await runTool(env, { QA_TOOL: 'doc-status', QA_DOC: no });
}
/** Simulate a backend-only status on one document: prints the data patch (tester runs it), --check confirms + logs it. */
async function cmdSimulate(args) {
  const env = envOf(args);
  const no = String(args.doc ?? '');
  if (!DOC_TYPES.some((t) => DOC_RE(t).test(no)) || !args.status || args.status === true) die('Give --doc <number> --status <status id> [--type <workflow doc type, e.g. OC, FA, CP>]   (statuses: docs/status-coverage.md)');
  const toolEnv = { QA_DOC: no, QA_STATUS: String(args.status), ...(args.type && args.type !== true ? { QA_TYPE: String(args.type) } : {}), QA_TESTER: tester() };
  if (args.check) return runTool(env, { QA_TOOL: 'simulate-check', ...toolEnv });
  if (args.run) return runTool(env, { QA_TOOL: 'simulate-run', ...toolEnv });
  await runTool(env, { QA_TOOL: 'simulate-plan', ...toolEnv });
  console.log(yellow('\nRun the SQL above in DBeaver (SIT connection only), then: npm run qa -- simulate --env sit --doc ' + no + ' --status ' + args.status + (args.type ? ' --type ' + args.type : '') + ' --check'));
}
async function cmdDbUsage(args) {
  const env = envOf(args);
  await runTool(env, { QA_TOOL: 'db-usage' });
  if (!process.exitCode) await new Promise((r) => spawn(process.execPath, [path.join(ROOT, 'scripts', 'status-coverage.mjs')], { cwd: ROOT, stdio: 'inherit' }).on('exit', r));
}
async function cmdDbCatalog(args) {
  const env = envOf(args);
  await runTool(env, { QA_TOOL: 'db-catalog', QA_DAYS: String(args.days ?? 3650) });
  if (!process.exitCode) {
    await new Promise((r) => spawn(process.execPath, [path.join(ROOT, 'scripts', 'gen-suites.mjs')], { cwd: ROOT, stdio: 'inherit' }).on('exit', r));
  }
}

/* ---------- CR suites: tests/cr-suites/<CR>/{cr.json,data-prep,execution} ---------- */
const CR_ROOT = path.join(ROOT, 'tests', 'cr-suites');
function crSuites() {
  if (!fs.existsSync(CR_ROOT)) return [];
  return fs.readdirSync(CR_ROOT).filter((d) => !d.startsWith('_') && fs.existsSync(path.join(CR_ROOT, d, 'cr.json'))).map((d) => ({ dir: d, ...readJson(path.join(CR_ROOT, d, 'cr.json')) }));
}
function crSpec(dir, kind, sid) {
  const d = path.join(CR_ROOT, dir, kind);
  const f = fs.existsSync(d) ? fs.readdirSync(d).find((x) => x.startsWith(`${sid}-`) && x.endsWith('.spec.ts')) : undefined;
  return f ? path.join(d, f) : undefined;
}
/**
 * Pick and choose a CR scenario: module → sub-module → flow → where data prep stops → where execution ends.
 * Appends it to tests/cr-suites/<CR>/cr.json (created when new) and regenerates the specs.
 * Non-interactive: cr add --cr 123 --flow dloa-oneoff-services --prepare LA_ACKNOWLEDGED --execute LA_VERIFIED --title "…" [--expected "…"]
 */
async function cmdCrAdd(args) {
  const reg = loadRegistry();
  if (!args.cr || args.cr === true) die('Give --cr <CR number>');
  const cr = String(args.cr);
  if (!/^[\w.-]+$/.test(cr)) die('CR number: letters, digits, - and . only');
  const dir = path.join(CR_ROOT, cr);
  const file = path.join(dir, 'cr.json');
  const def = readJson(file, null) ?? { cr, title: args['cr-title'] ? String(args['cr-title']) : `CR ${cr}`, language: 'EN', notes: '', scenarios: [] };
  const interactive = !args.flow && process.stdin.isTTY;
  let rl;
  const ask = async (q, d = '') => (await rl.question(`${q}${d ? dim(` [${d}]`) : ''}: `)).trim() || d;
  const pick = async (title, options) => {
    console.log(`\n${bold(title)}`);
    options.forEach((o, i) => console.log(`  ${String(i + 1).padStart(2)}. ${o.label}`));
    const n = Number(await ask('Choose', '1'));
    return options[n - 1]?.value ?? die('No such option');
  };
  let flowId = args.flow, prepare = args.prepare, execute = args.execute, title = args.title, expected = args.expected;
  if (interactive) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const module = await pick('Module', reg.modules.map((m) => ({ label: `${m.id} — ${m.name}`, value: m.id })));
    const flowsOfM = Object.values(reg.flows).filter((f) => f.module === module);
    const subs = [...new Set(flowsOfM.map((f) => f.submodule ?? 'main'))];
    const sub = await pick(`Sub-module of ${module}`, subs.map((s) => ({ label: `${s} ${dim(`(${flowsOfM.filter((f) => (f.submodule ?? 'main') === s).length} flows)`)}`, value: s })));
    flowId = await pick('Flow', flowsOfM.filter((f) => (f.submodule ?? 'main') === sub).map((f) => ({ label: `${f.id} ${dim(f.title)}`, value: f.id })));
  }
  const f = flowOrDie(reg, flowId);
  const items = f.steps.map((r, i) => {
    if (typeof r === 'object') return { key: r.gate, label: `GATE ${r.gate}`, status: `GATE ${r.gate}`, i };
    const s = reg.steps[r];
    const db = s.checkpoint.db ? ` · DB ${s.checkpoint.db.kind} ${s.checkpoint.db.statusId ?? '-'} ${s.checkpoint.db.en ?? ''}` : '';
    return { key: r, status: s.checkpoint.id, label: `${s.checkpoint.id} ${dim(`after ${r} ${s.title}${s.automation === 'manual' ? ' (manual)' : ''}${db}`)}`, i };
  });
  if (interactive) {
    prepare = await pick('Data prep stops at (start status of the scenario)', [{ label: dim('— none: the execution starts from scratch'), value: '' }, ...items.filter((x) => !x.key.includes('_LOOKUP') && !x.label.startsWith('GATE')).map((x) => ({ label: x.label, value: x.key }))]);
    const from = prepare ? items.find((x) => x.key === prepare).i : -1;
    execute = await pick('Execution ends at', [{ label: dim('— none: the tester executes by hand'), value: '' }, ...items.filter((x) => x.i > from && !x.label.startsWith('GATE')).map((x) => ({ label: x.label, value: x.key }))]);
    title = await ask('Scenario title', title || f.title);
    expected = await ask('Approved expected result (leave empty if not given yet)', expected || '');
    rl.close();
  }
  const resolve = (v) => {
    if (!v || v === true) return undefined;
    const hit = items.find((x) => x.key === v) ?? items.filter((x) => x.status === v);
    if (Array.isArray(hit)) { if (hit.length !== 1) die(`${v}: ${hit.length ? 'occurs several times, give the step ID' : `not in ${f.id}`} (${items.map((x) => x.key).join(', ')})`); return hit[0].key; }
    return hit.key;
  };
  const sc = {
    id: `S${String(def.scenarios.length + 1).padStart(2, '0')}`,
    title: String(title || f.title),
    flow: f.id,
    ...(resolve(prepare) ? { prepare: { until: resolve(prepare) } } : {}),
    ...(resolve(execute) ? { execute: { until: resolve(execute) } } : {}),
    ...(expected ? { expected: String(expected) } : {}),
  };
  def.scenarios.push(sc);
  writeJson(file, def);
  console.log(green(`✔ ${cr} ${sc.id} added: ${f.id} · data prep → ${sc.prepare?.until ?? '(none)'} · execution → ${sc.execute?.until ?? 'manual'}`));
  await new Promise((r) => spawn(process.execPath, [path.join(ROOT, 'scripts', 'gen-suites.mjs')], { cwd: ROOT, stdio: 'inherit' }).on('exit', r));
  console.log(dim(`See tests/cr-suites/${cr}/README.md`));
}

async function cmdCr(args) {
  if (args._[1] === 'add') return cmdCrAdd(args);
  const suites = crSuites();
  if (!args.cr || args.cr === true) {
    if (!suites.length) return console.log(dim('No CR suites yet. Copy tests/cr-suites/_TEMPLATE to tests/cr-suites/<CR>/, edit cr.json, npm run suites:gen.'));
    for (const s of suites) {
      console.log(`${bold(`CR ${s.cr}`)} ${s.title}  ${dim(`tests/cr-suites/${s.dir}/README.md`)}`);
      for (const sc of s.scenarios)
        console.log(`  ${bold(sc.id)} ${sc.title}\n     ${dim(`flow ${sc.flow} · data prep → ${sc.prepare?.until ?? '(none)'} · execution → ${sc.execute ? sc.execute.until ?? 'end' : 'manual'}`)}`);
    }
    return console.log(dim('\nRun: npm run qa -- cr --env sit --cr <CR> --scenario S01 --prep   (then --exec)   [--headed] [--input LA=LA26…]'));
  }
  const env = envOf(args);
  const s = suites.find((x) => x.cr === String(args.cr) || x.dir === String(args.cr));
  if (!s) die(`No CR suite "${args.cr}" (npm run qa -- cr)`);
  const sc = s.scenarios.find((x) => x.id === String(args.scenario));
  if (!sc) die(`Give --scenario: ${s.scenarios.map((x) => x.id).join(', ')}`);
  const kind = args.exec ? 'execution' : args.prep ? 'data-prep' : die('Say --prep (data prep) or --exec (execution)');
  const file = crSpec(s.dir, kind, sc.id);
  if (!file) die(`No ${kind} spec for ${sc.id}; run: npm run suites:gen`);
  const reg = loadRegistry();
  const f = flowOrDie(reg, sc.flow);
  const runStamp = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '');
  const flowRunId = `CR-${s.cr}_${sc.id}_${kind === 'execution' ? 'exec' : 'prep'}_${runStamp}`;
  const input = parsePairs(args.input, 'input');
  checkDocs(input);
  console.log(`\n${bold(`CR ${s.cr} ${sc.id}`)} ${sc.title}\n  ${kind.toUpperCase()} · flow ${f.id} · ${path.relative(ROOT, file)}\n  run ${flowRunId}${Object.keys(input).length ? ` · input ${Object.entries(input).map(([k, v]) => `${k}=${v}`).join(', ')}` : ''}`);
  if (!args.yes && !(await confirm(`\nStart on ${env}? It changes SIT data. [Y/n] `))) die('Not started.');
  fs.mkdirSync(runDirOf(env, flowRunId), { recursive: true });
  await execute(env, f, flowRunId, { ...args, cr: s.cr }, {
    path: path.relative(ROOT, file).split(path.sep).join('/'), lang: s.language ?? 'en', runId: runStamp,
    input: Object.entries(input).map(([k, v]) => `${k}=${v}`).join(',') || undefined,
  });
}

/* ---------- doctor ---------- */
async function cmdDoctor(args) {
  const env = envOf(args);
  const results = [];
  const check = (status, name, detail = '') => results.push({ status, name, detail });
  const [maj] = process.versions.node.split('.').map(Number);
  check(maj >= 20 ? 'PASS' : 'FAIL', 'Node.js', process.versions.node);
  try {
    const pw = readJson(path.join(ROOT, 'node_modules', '@playwright', 'test', 'package.json'), null);
    check(pw ? 'PASS' : 'FAIL', 'Playwright', pw?.version ?? 'npm install needed');
    const { chromium } = await import('playwright-core');
    const exe = chromium.executablePath();
    check(fs.existsSync(exe) ? 'PASS' : 'FAIL', 'Chromium browser', fs.existsSync(exe) ? 'installed' : 'run: npx playwright install chromium');
  } catch (e) { check('FAIL', 'Playwright', String(e.message)); }
  const reg = loadRegistry();
  check(reg.problems.length ? 'FAIL' : 'PASS', 'Registry', reg.problems.length ? reg.problems.join('; ') : `${Object.keys(reg.steps).length} steps, ${Object.keys(reg.flows).length} flows, ${Object.keys(reg.gates).length} gates`);
  // Environment identity: the configured URL must answer as ePerolehan.
  try {
    const res = await fetch(`${ENVS[env]}/home`, { signal: AbortSignal.timeout(20_000), redirect: 'follow' });
    const html = await res.text();
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '';
    check(res.ok && /ePerolehan/i.test(title) ? 'PASS' : 'FAIL', `${env} reachable (VPN)`, `${ENVS[env]}/home → HTTP ${res.status}, title "${title}"`);
  } catch (e) { check('FAIL', `${env} reachable (VPN)`, `${ENVS[env]}: ${e.cause?.code ?? e.message} — check the VPN`); }
  try {
    const res = await fetch('http://ngepsso.eperolehan.com.my/oam/server/logout', { signal: AbortSignal.timeout(20_000) });
    check(res.status < 500 ? 'PASS' : 'WARN', 'SSO server reachable', `HTTP ${res.status}`);
  } catch (e) { check('WARN', 'SSO server reachable', e.cause?.code ?? e.message); }
  // Credentials: presence only, never values.
  const xlsx = path.join(ROOT, '.auth', 'credentials.xlsx');
  if (!fs.existsSync(xlsx)) check('FAIL', 'Credentials workbook', '.auth/credentials.xlsx missing');
  else {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(xlsx);
      const ws = wb.getWorksheet('Credentials');
      const text = (v) => (v == null ? '' : String(typeof v === 'object' && 'text' in v ? v.text : v).trim());
      const header = ws.getRow(1).values.map(text);
      const [e, u, p] = ['Environment', 'Username', 'Password'].map((n) => header.indexOf(n));
      let rows = 0, officer = false;
      for (let r = 2; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        if (text(row.getCell(e).value).toUpperCase() !== env || !text(row.getCell(p).value)) continue;
        rows++;
        if (text(row.getCell(u).value) === '*') officer = true;
      }
      check(rows ? 'PASS' : 'FAIL', `Credentials for ${env}`, `${rows} row(s) with a password (values not shown)`);
      check(officer ? 'PASS' : 'WARN', 'Shared officer password', officer ? 'present (for assignedOfficer steps)' : 'no "*" row: steps run by an assigned officer will block');
    } catch (e) { check('FAIL', 'Credentials workbook', e.message); }
  }
  const kv = readJson(path.join(ROOT, '.auth', 'katalon-variables.json'), null);
  const withLogin = kv ? Object.values(kv).filter((v) => v.Username && v.Password).length : 0;
  check(withLogin ? 'PASS' : 'FAIL', 'Step accounts', kv ? `${withLogin} steps have a default login (.auth/katalon-variables.json)` : 'missing: npm run katalon:convert');
  const dataDir = process.env.KATALON_DATA_DIR ?? path.join(os.homedir(), 'Desktop', 'Data Prep Excel AP 201');
  check(fs.existsSync(dataDir) ? 'PASS' : 'WARN', 'Katalon data workbooks', fs.existsSync(dataDir) ? dataDir : `${dataDir} not found: steps use their test case defaults + data-overrides`);
  try {
    fs.mkdirSync(stateDir(env), { recursive: true });
    fs.mkdirSync(path.join(ROOT, 'evidence'), { recursive: true });
    fs.accessSync(path.join(ROOT, 'evidence'), fs.constants.W_OK);
    check('PASS', 'Evidence and state folders writable', path.relative(ROOT, stateDir(env)));
  } catch (e) { check('FAIL', 'Evidence and state folders writable', e.message); }
  const active = readJson(path.join(stateDir(env), 'active-run.json'), null);
  check(active && isAlive(active.pid) ? 'WARN' : 'PASS', 'No other active run', active && isAlive(active.pid) ? `${active.flowRunId} (pid ${active.pid})` : 'none');
  const uncertain = listRuns(env).filter((r) => r.status === 'uncertain');
  check(uncertain.length ? 'WARN' : 'PASS', 'Runs needing reconciliation', uncertain.map((r) => r.flowRunId).join(', ') || 'none');
  const free = os.freemem() / 1024 ** 3;
  check(free >= 1 ? 'PASS' : 'WARN', 'Free memory', `${free.toFixed(1)} GB (one browser ≈ 0.6–0.8 GB)`);
  if (env === 'UAT') check('WARN', 'UAT', 'not verified: no UAT credentials, behaviour may differ from SIT');

  for (const r of results) console.log(`${r.status === 'PASS' ? green('PASS') : r.status === 'WARN' ? yellow('WARN') : red('FAIL')}  ${r.name.padEnd(36)} ${dim(r.detail)}`);
  const fails = results.filter((r) => r.status === 'FAIL').length;
  console.log(fails ? red(`\n${fails} check(s) failed: fix them before running flows.`) : green('\nReady.'));
  process.exitCode = fails ? 1 : 0;
}

/* ---------- housekeeping ---------- */
function cmdClean(args) {
  const days = Number(args['older-than'] ?? 7);
  const base = path.join(ROOT, 'test-results');
  if (!fs.existsSync(base)) return console.log('test-results/ is empty.');
  let n = 0;
  for (const env of fs.readdirSync(base)) {
    const d = path.join(base, env);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const run of fs.readdirSync(d)) {
      const p = path.join(d, run);
      if (Date.now() - fs.statSync(p).mtimeMs > days * 86_400_000) { if (!args['dry-run']) fs.rmSync(p, { recursive: true, force: true }); n++; }
    }
  }
  console.log(`${args['dry-run'] ? 'Would remove' : 'Removed'} ${n} Playwright output folder(s) older than ${days} days from test-results/ (evidence/, reports/ and .data/ are never cleaned).`);
}

/* ---------- interactive menu ---------- */
async function cmdMenu() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q, def = '') => (await rl.question(`${q}${def ? dim(` [${def}]`) : ''}: `)).trim() || def;
  const pick = async (title, options) => {
    console.log(`\n${bold(title)}`);
    options.forEach((o, i) => console.log(`  ${String(i + 1).padStart(2)}. ${o.label}`));
    const n = Number(await ask('Choose', '1'));
    return options[n - 1]?.value ?? die('No such option');
  };
  const reg = loadRegistry();
  const env = await pick('Environment', [{ label: 'SIT (http://ngepsit.eperolehan.com.my)', value: 'sit' }, { label: 'UAT — not verified yet', value: 'uat' }]);
  const action = await pick('What do you want to do?', [
    { label: 'Run a flow', value: 'run' }, { label: 'Resume a run', value: 'resume' }, { label: 'Record a gate / officer', value: 'gate' },
    { label: 'Show run status', value: 'status' }, { label: 'List test data', value: 'data' }, { label: 'Check the setup (doctor)', value: 'doctor' },
  ]);
  const base = { env, _: [] };
  if (action === 'run') {
    const module = await pick('Module', reg.modules.map((m) => ({ label: `${m.id} — ${m.name}`, value: m.id })));
    const flow = await pick('Flow', Object.values(reg.flows).filter((f) => f.module === module).map((f) => ({ label: `${f.id} ${dim(f.title)}`, value: f.id })));
    const f = reg.flows[flow];
    const keys = f.steps.map(itemKey);
    console.log(dim(`Items: ${keys.join(' → ')}`));
    const from = await ask('Start from item (empty = first)');
    const to = await ask('Stop after item (empty = last)');
    const input = [];
    for (const d of externalInputs(reg, f)) { const v = await ask(`${d} number to start from (empty = a gate will ask)`); if (v) input.push(`${d}=${v}`); }
    const headed = (await ask('Show the browser? (y/n)', 'n')).toLowerCase().startsWith('y');
    rl.close();
    return cmdRun({ ...base, flow, from: from || undefined, to: to || undefined, input, headed, lang: 'en' });
  }
  if (action === 'resume' || action === 'status') {
    const runs = listRuns(env.toUpperCase()).slice(0, 15);
    if (!runs.length) die('No runs yet.');
    const run = await pick('Run', runs.map((r) => ({ label: `${r.flowRunId} ${statusColor(r.status)}`, value: r.flowRunId })));
    rl.close();
    return action === 'resume' ? cmdResume({ ...base, run, headed: false }) : cmdStatus({ ...base, run });
  }
  if (action === 'gate') {
    const runs = listRuns(env.toUpperCase()).filter((r) => r.status === 'blocked').slice(0, 15);
    if (!runs.length) die('No blocked runs.');
    const run = await pick('Blocked run', runs.map((r) => ({ label: `${r.flowRunId}: ${dim((r.blockedReason ?? '').slice(0, 90))}`, value: r.flowRunId })));
    const st = runs.find((r) => r.flowRunId === run);
    console.log(`\n${yellow(st.blockedReason)}`);
    const gate = st.blockedReason.match(/GATE (\w+)/)?.[1];
    const officer = st.blockedReason.match(/(KAT-\d{3}) must log in as the officer/)?.[1];
    if (officer) { const id = await ask(`Officer login ID for ${officer}`); rl.close(); return cmdGate({ ...base, run, officer: [`${officer}=${id}`] }); }
    if (gate) {
      const g = reg.gates[gate];
      const set = [];
      for (const d of g.provides ?? []) set.push(`${d}=${await ask(`${d} number`)}`);
      const ok = (await ask(`Is "${g.title}" done? (y/n)`, 'n')).toLowerCase().startsWith('y');
      rl.close();
      if (!ok) die('Nothing recorded.');
      return cmdGate({ ...base, run, gate, done: true, set });
    }
    rl.close();
    return die('This run is not waiting at a gate or officer; see its status.');
  }
  rl.close();
  if (action === 'data') return cmdData(base);
  if (action === 'doctor') return cmdDoctor(base);
}

/* ---------- help ---------- */
const HELP = `${bold('ePerolehan QA CLI')} — npm run qa -- <command> [options]

${bold('Catalogue')}
  list-modules                                   The five modules
  list-flows [--module sq]                       Flows, what they need, how well they are verified
  show-flow --flow <id>                          Steps, roles, inputs/outputs, gates
  list-statuses [--module fl]                    Checkpoints and the displayed statuses seen so far

${bold('Run')} ${dim('(--env is always required; SIT only for now)')}
  doctor --env sit                               Preflight: VPN, browser, credentials (presence only), registry
  plan   --env sit --flow <id> [run options]     Dry run: show what would run
  run    --env sit --flow <id> [--from KAT-023] [--to KAT-024] [--input SQ=SQ26…] [--var KAT-021.Fulfilmenttype=2]
         [--officer KAT-024=<id>] [--cr CR-12345] [--lang en] [--headed] [--yes]
  prepare --env sit --status-id 62509 [--doc-type LA] [--input LA=LA26…] [--headed] [--plan]
                                                 Bring a document to ANY active status (by-status spec: flow, or flow + simulation)
  prepare --env sit --status LA_VERIFIED [--flow <id>] [--module dp] [--input …] [--headed] [--plan]
                                                 Make a transaction at that status for manual testing, then stop
                                                 (catalogue: docs/status-catalog.md; specs: tests/data-prep/en/<module>/<flow>/)
  resume --env sit [--run <id>] [--headed] [--yes]     Continue a run; finished steps are skipped
  stop   --env sit [--run <id>]                  Stop after the current step
  watch  --env sit [--run <id>]                  Live view of a run started elsewhere

${bold('CR suites')} ${dim('(tests/cr-suites/<CR>/: cr.json → data-prep/ + execution/ specs + README.md)')}
  cr                                             List CR suites and their scenarios
  cr add --cr <CR>                               Pick and choose a scenario: module → sub-module → flow → start status → end status
  cr add --cr <CR> --flow <id> --prepare <STATUS|step> --execute <STATUS|step> --title "…" [--expected "…"]
  cr --env sit --cr <CR> --scenario S01 --prep   Data prep: run to the scenario's start status, then stop
  cr --env sit --cr <CR> --scenario S01 --exec   Execution: from the prepared data (DB-checked) to the end status
                                                 [--input LA=LA26…] instead of the latest data-prep run · [--headed]

${bold('SIT database')} ${dim('(read-only, via your DBeaver SIT connection)')}
  doc-status --env sit --doc LA260000000004216   Status history EN/BM (whole path) + BPM tasks and who they are assigned to
  db-usage   --env sit                          Every status SIT ever wrote → registry/db-usage.json + docs/status-coverage.md (vs the active list)
  simulate   --env sit --doc <no> --status <id> [--type OC]   Data patch to put one document at a backend-only status (tester runs it)
  simulate   --env sit --doc <no> --status <id> --check       Confirm it in the DB and log it in knowledge/data-change-audit.md
  simulate   --env sit --doc <no> --status <id> --run         Run the patch itself (allowed SQL only, one transaction, audited)
  db-catalog --env sit [--days 3650]              Every status per document type → registry/db-statuses.json + docs/status-catalog.md
                                                 (DBeaver queries for each document type: sql/status/<DOC>.sql)

${bold('Decisions')} ${dim('(only a person records these)')}
  gate      --env sit --run <id> --gate SQ_START_SQL --done
  gate      --env sit --run <id> --gate PO_LOOKUP --set PO=PO26…
  gate      --env sit --run <id> --officer KAT-024=<login ID>
  reconcile --env sit --run <id> --step KAT-023 --done RN=RN26…   (an interrupted step went through)
  reconcile --env sit --run <id> --step KAT-023 --redo            (it did not; run it again)
  reconcile --env sit --run <id> --step QT-001 --done QT=QT26…     (a MANUAL step you did in the application)
  retry     --env sit --run <id> --step KAT-023                   (allow one more attempt after a failure)

${bold('Results')}
  runs   --env sit                               Recent runs
  status --env sit [--run <id>]                  Items, documents, what the run waits for
  report --env sit [--run <id>]                  Markdown report (also written to the run folder)
  data   --env sit [--type LA] [--checkpoint LA_VERIFIED] [--module dp]   Test data registry
  clean  [--older-than 7] [--dry-run]            Remove old Playwright output (test-results/ only)

  menu                                           Interactive menu

Plain Playwright still works: npx cross-env TEST_ENV=SIT playwright test tests/flows/en --grep @flow-sq-services
`;

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] ?? 'help';
const COMMANDS = {
  help: () => console.log(HELP), 'list-modules': cmdListModules, 'list-flows': cmdListFlows, 'show-flow': cmdShowFlow, 'list-statuses': cmdListStatuses,
  doctor: cmdDoctor, plan: cmdPlan, run: cmdRun, prepare: cmdPrepare, resume: cmdResume, stop: cmdStop, watch: cmdWatch,
  gate: cmdGate, reconcile: cmdReconcile, 'doc-status': cmdDocStatus, 'db-catalog': cmdDbCatalog, 'db-usage': cmdDbUsage, simulate: cmdSimulate, cr: cmdCr, retry: cmdRetry, runs: cmdRuns, status: cmdStatus, report: cmdReport, data: cmdData, clean: cmdClean, menu: cmdMenu,
};
if (!COMMANDS[cmd]) die(`Unknown command "${cmd}". npm run qa -- help`);
await COMMANDS[cmd](args);
