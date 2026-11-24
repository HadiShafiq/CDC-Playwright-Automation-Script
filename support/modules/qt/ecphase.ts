import type { Page } from '@playwright/test';
import { openTasks } from '../../core/bpm-tasks';
import { currentStatus } from '../../core/doc-status';
import { sitQuery } from '../../core/sit-db';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm, settledEval } from './pf';
import { addCommitteeMember, QT_SIT, type StageCtx } from './stages';
import { openTask } from './tasklist';

/**
 * QT-012..015 (60022 → 60010 → OC/TEC/FEC → 60023): driven by the open BPM tasks, not the QT status, because several
 * tasks run under one status. Ported from ngep-runner stages/ecphase.mjs, evaluation.mjs and ecmeeting.mjs.
 * Each task is done by its BPM assignee (shared SIT officer password); the loop stops when the SIT DB shows the target.
 */
export interface EcCtx extends StageCtx {
  as: (user: string) => Promise<void>;
}

const back = async (page: Page) => {
  await clickButton(page, '<< Back');
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
};
const next = async (page: Page) => {
  await clickButton(page, 'Next');
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  return pageMessages(page);
};
const atEnd = (page: Page) => page.getByRole('button', { name: 'Next', exact: true }).isVisible().then((v) => !v).catch(() => true);
const onTab = (page: Page, label: string) => page.getByText(label, { exact: true }).first().isVisible().catch(() => false);

async function walk(page: Page, act: (p: Page) => Promise<void>) {
  for (let i = 0; i < 12 && !(await atEnd(page)); i++) {
    await act(page);
    const msgs = await next(page);
    if (msgs.length) throw new Error(msgs.join(' | '));
  }
}

async function markComply(page: Page, remark: string) {
  if (!(await page.getByRole('button', { name: 'Save', exact: true }).count())) return null;
  const sels = await settledEval(page, () => [...document.querySelectorAll('select')].filter((s) => !s.disabled && [...s.options].some((o) => o.text.trim() === 'Comply') && s.selectedOptions[0]?.text.trim() !== 'Comply').map((s) => s.id.replace(/_input$/, '')), undefined);
  for (const id of sels) await pfSelect(page, id, 'Comply');
  const tas = page.locator('textarea:visible:enabled');
  for (let i = 0; i < (await tas.count()); i++) if (!(await tas.nth(i).inputValue()).trim()) await tas.nth(i).fill(remark);
  await clickButton(page, 'Save');
  return (await pageMessages(page)).join(' ') || 'saved';
}

async function toWizard(page: Page, remark: string) {
  for (let k = 0; k < 4 && !(await page.getByRole('button', { name: 'Next', exact: true }).count()); k++) {
    await markComply(page, remark);
    if (!(await page.getByRole('button', { name: '<< Back' }).count())) break;
    await back(page);
  }
}

async function checkCompliance(page: Page, remark = 'Comply (QA automation)') {
  const out: (string | null)[] = [];
  await toWizard(page, remark);
  const actions = () => page.locator('button:visible').filter({ hasText: /^\s*(Check|View)\s*$/ });
  const n = await actions().count();
  for (let i = 0; i < n; i++) {
    const btn = actions().nth(i);
    if ((await btn.innerText()).trim() !== 'Check') continue;
    await btn.click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(page);
    const sup = () => page.locator('button:visible').filter({ hasText: /^\s*(Check|View)\s*$/ });
    const m = await sup().count();
    if (!m) out.push(await markComply(page, remark));
    for (let j = 0; j < m; j++) {
      await sup().nth(j).click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await pfIdle(page);
      out.push(await markComply(page, remark));
      await back(page);
    }
    await back(page);
  }
  return out;
}

async function markAttendance(page: Page) {
  await page.getByText(/^\s*(Evaluation|Opening|Technical( Evaluation)?|Financial( Evaluation)?) Committee\s*$/).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  const boxes = page.locator('tr:visible .ui-chkbox-box:not(.ui-state-active)');
  for (let n = await boxes.count(); n > 0; n--) {
    await boxes.first().click();
    await pfIdle(page);
  }
  await clickButton(page, 'Save');
  return pageMessages(page);
}

async function meetingDone(page: Page) {
  await page.getByText('Meeting Details', { exact: true }).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  const ids = await page.evaluate(() => [...document.querySelectorAll('select')].filter((s) => [...s.options].some((o) => o.text.trim() === 'Done') && (s.closest('.ui-selectonemenu') as HTMLElement | null)?.offsetParent).map((s) => s.id.replace(/_input$/, '')));
  for (const id of ids) await pfSelect(page, id, 'Done');
  await clickButton(page, 'Save');
  return pageMessages(page);
}

async function saveSpecScores(page: Page, remark = 'ok (QA automation)') {
  const out: string[] = [];
  const views = () => page.locator('button:visible').filter({ hasText: /^\s*(View|Check|Evaluate)\s*$/ });
  const pending = page.locator('button:visible').filter({ hasText: /^\s*(Check|Evaluate)\s*$/ });
  await ((await pending.count()) ? pending : views()).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  const m = await views().count();
  for (let j = 0; j < m; j++) {
    await views().nth(j).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(page);
    const save = page.getByRole('button', { name: 'Save', exact: true });
    if ((await save.count()) && (await save.isEnabled())) {
      const boxes = page.locator('input[type=text][id*="core"]:visible:enabled');
      for (let k = 0; k < (await boxes.count()); k++) if (!(await boxes.nth(k).inputValue()).trim()) await boxes.nth(k).fill('10');
      const ta = page.locator('textarea:visible:enabled, input[type=text]:visible:enabled').last();
      if ((await ta.count()) && !(await ta.inputValue()).trim()) await ta.fill(remark);
      await clickButton(page, 'Save');
      out.push((await pageMessages(page)).join(' ') || 'saved');
    }
    await back(page);
  }
  await back(page);
  return out;
}

const supplierCounts = (page: Page) =>
  settledEval(page, () => {
    const tables = [...document.querySelectorAll('table')].filter((t) => (t as HTMLElement).offsetWidth && t.tHead && /Supplier Code/.test(t.tHead.innerText));
    const n = (t?: HTMLTableElement) => (t ? [...t.tBodies[0].rows].filter((r) => !/No records found/.test((r as HTMLElement).innerText)).length : 0);
    return { passed: n(tables[0]), failed: n(tables[1]) };
  }, undefined);

async function assertSummary(page: Page, tab: string, expected: number, financial: boolean) {
  await openTab(page, tab);
  await pfIdle(page);
  const check = async (where: string) => {
    const c = await supplierCounts(page);
    if (financial && !c.passed && !c.failed) return `${where} empty (no financial-by-item result)`;
    if (c.passed !== expected || c.failed) throw new Error(`${where}: ${c.passed}/${expected} suppliers passed, ${c.failed} failed`);
    return `${where} ${c.passed}/${expected}`;
  };
  const id = await page.evaluate(() => [...document.querySelectorAll('select')].find((s) => [...s.options].some((o) => o.text.trim() === 'Item') && (s.closest('.ui-selectonemenu') as HTMLElement | null)?.offsetParent)?.id.replace(/_input$/, '') ?? null);
  if (!id) return [await check('summary')];
  await pfSelect(page, id, 'Item');
  const items = async () => {
    await settledEval(page, () => {
      document.querySelectorAll('[data-pw-items]').forEach((e) => e.removeAttribute('data-pw-items'));
      [...document.querySelectorAll('table')].find((t) => (t as HTMLElement).offsetWidth && t.tHead && t.tHead.innerText.trim() === 'Item')?.setAttribute('data-pw-items', '1');
    }, undefined);
    return page.locator('table[data-pw-items="1"] > tbody > tr');
  };
  const out: string[] = [];
  for (let i = 0; i < (await (await items()).count()); i++) {
    const row = (await items()).nth(i);
    const name = (await row.innerText()).trim();
    await row.click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(page);
    out.push(await check(name.slice(0, 25)));
  }
  if (!out.length) throw new Error('summary lists no item');
  return out;
}

const submittedCount = (qt: string) =>
  Number(sitQuery(`select count(*) from ngep_sit.sc_qt_proposal p join ngep_sit.sc_qt_supplier s on s.qt_supplier_id = p.qt_supplier_id join ngep_sit.sc_qt q on q.qt_id = s.qt_id where q.qt_no = '${qt}' and p.is_submitted = 1`)[0]?.[0] ?? 0);
const pendingScores = (qt: string, category: number) =>
  Number(sitQuery(`select count(*) from ngep_sit.sc_qt_proposal_checklist pc join ngep_sit.sc_qt_checklist c on c.qt_checklist_id = pc.qt_checklist_id join ngep_sit.sc_qt_proposal p on p.qt_proposal_id = pc.qt_proposal_id join ngep_sit.sc_qt_supplier s on s.qt_supplier_id = p.qt_supplier_id join ngep_sit.sc_qt q on q.qt_id = s.qt_id where q.qt_no = '${qt}' and p.is_submitted = 1 and c.is_scoring_req = 1 and c.doc_category = ${category} and pc.eval_status_id <> 61601`)[0]?.[0] ?? 0);

async function finalizeEvaluation(ctx: EcCtx, qt: string) {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  log(`attendance: ${(await markAttendance(page)).join(' ')}`);
  log(`meeting: ${(await meetingDone(page)).join(' ')}`);
  const stage = async (p: Page) => ((await onTab(p, 'Technical (Item)')) ? 'technical' : (await onTab(p, 'Financial (Item)')) ? 'financial' : (await onTab(p, 'Technical')) && (await onTab(p, 'Financial')) ? 'compliance' : null);
  let seen = new Set<string>();
  await walk(page, async (p) => {
    const s = await stage(p);
    if (!s || seen.has(s)) return;
    seen.add(s);
    if (s === 'compliance') {
      for (const tab of ['Technical', 'Financial']) {
        await openTab(p, tab);
        log(`${tab.toLowerCase()} compliance: ${(await checkCompliance(p)).length} saved`);
      }
    } else if (pendingScores(qt, s === 'technical' ? 1 : 2)) log(`${s} scores: ${(await saveSpecScores(p)).join('; ')}`);
    else log(`${s} scores: all already saved (DB), skipped`);
  });
  const stages = seen;
  await openTask(page, ctx.baseURL, qt, log);
  const n = submittedCount(qt);
  const SUMMARY: Record<string, string> = { compliance: 'Summary', technical: 'Summary', financial: 'Financial Summary' };
  seen = new Set();
  await walk(page, async (p) => {
    const s = await stage(p);
    if (!s) return;
    const tab = s === 'financial' && !(await onTab(p, SUMMARY[s])) ? 'Summary' : SUMMARY[s];
    if (seen.has(s) || !(await onTab(p, tab))) return;
    seen.add(s);
    log(`${s} summary: ${(await assertSummary(p, tab, n, s === 'financial')).join('; ')}`);
  });
  if (!seen.size || seen.size < stages.size) throw new Error(`Summaries checked for ${[...seen].join(', ') || 'no stage'} of ${[...stages].join(', ') || 'none'}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`Finalize not confirmed: ${msgs.join(' | ')}`);
}

async function endorseEvaluation(ctx: EcCtx, qt: string, button = 'Endorsement') {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  for (let i = 0; i < 12 && (await page.getByRole('button', { name: 'Next', exact: true }).isVisible().catch(() => false)); i++) {
    const msgs = await next(page);
    if (msgs.length) throw new Error(msgs.join(' | '));
  }
  const msgs = await pressAndConfirm(page, button, log);
  if (!msgs.some((m) => /success|endorsed|signed off|submitted/i.test(m))) throw new Error(`${button} not confirmed: ${msgs.join(' | ') || 'no message'}`);
}

async function coordinateMeeting(ctx: EcCtx, qt: string) {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  if (!(await settledEval(page, () => !!document.querySelector('[id$="meetingDatesb:calDate_input"]'), undefined))) await clickButton(page, 'Add');
  const date = page.locator('[id$="meetingDatesb:calDate_input"]').first();
  if (!(await date.inputValue()).trim()) {
    await date.locator('xpath=following-sibling::button[contains(@class, "ui-datepicker-trigger")]').click();
    const picker = page.locator('#ui-datepicker-div');
    await picker.waitFor({ state: 'visible' });
    const today = new Date().getDate();
    const days = picker.locator('td:not(.ui-datepicker-other-month):not(.ui-datepicker-unselectable):not(.ui-state-disabled) a');
    for (let i = 0; i < (await days.count()); i++) {
      if (Number((await days.nth(i).innerText()).trim()) >= today) {
        await days.nth(i).click();
        await pfIdle(page);
        break;
      }
    }
  }
  const hr = await settledEval(page, () => document.querySelector('select[id$="meetingDatesb:calHour"]')?.id ?? '', undefined);
  const mi = await settledEval(page, () => document.querySelector('select[id$="meetingDatesb:calMin"]')?.id ?? '', undefined);
  await pfSelect(page, hr, '23');
  await pfSelect(page, mi, '30');
  const v = page.locator('[id$=":0:locationId"]').first();
  if (!(await v.inputValue()).trim()) {
    await v.fill('Bilik Mesyuarat (QA automation)');
    await v.press('Tab');
    await pfIdle(page);
  }
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`Meeting submit: ${msgs.join(' | ') || 'no message'}`);
}

const IC = /\b\d{12}\b/g;
async function deleteCommitteeMember(page: Page, ic: string, tab: string, log: (m: string) => void) {
  await openTab(page, tab);
  const cb = await page.evaluate((ic) => {
    const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Identification No/.test(x.tHead?.innerText || ''));
    const r = t && [...t.tBodies[0].rows].find((x) => (x as HTMLElement).innerText.includes(ic));
    return r ? (r.querySelector('input[type=checkbox]') as HTMLElement).id.replace(/_input$/, '') : null;
  }, ic);
  if (!cb) return `${ic} not in committee`;
  await page.locator(`[id="${cb}"] .ui-chkbox-box`).click({ force: true });
  await pfIdle(page);
  log(`delete ${ic}: ${(await pressAndConfirm(page, 'Delete', log)).join(' ')}`);
  return `${ic} removed`;
}

async function assignCommittee(ctx: EcCtx, qt: string) {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const ROLES = [/^Chair/i, /^Secret/i, /^Member/i, /^Member/i];
  for (const [tab, key] of [['Technical Evaluation Committee', 'TEC'], ['Financial Evaluation Committee', 'FEC'], ['Opening Committee', 'OC'], ['Evaluation Committee', 'EC']] as const) {
    if (!(await onTab(page, tab))) continue;
    await openTab(page, tab);
    if (!(await page.getByRole('button', { name: 'Delete', exact: true }).isVisible().catch(() => false))) continue; // approved: read-only
    let shown = '';
    for (let i = 0; i < 10 && !IC.test(shown); i++) {
      if (i) await page.waitForTimeout(1000);
      IC.lastIndex = 0;
      shown = await page.evaluate(() => [...document.querySelectorAll('table')].filter((t) => (t as HTMLElement).offsetWidth && !t.closest('.ui-dialog') && /Identification No/.test(t.tHead?.innerText || '')).map((t) => (t as HTMLElement).innerText).join(' '));
    }
    IC.lastIndex = 0;
    const want = QT_SIT.committees[key];
    for (const ic of new Set(shown.match(IC) || [])) if (!want.includes(ic)) log(`${tab}: ${await deleteCommitteeMember(page, ic, tab, log)}`);
    for (const [i, ic] of want.entries()) log(`${tab}: ${await addCommitteeMember(page, ic, ROLES[i], tab)}`);
  }
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`Committee submit not confirmed: ${msgs.join(' | ') || 'no message'}`);
}

async function approveCommittee(ctx: EcCtx, qt: string) {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const msgs = await pressAndConfirm(page, 'Approve', log);
  if (!msgs.some((m) => /success|is approved|approved/i.test(m))) throw new Error(`Approve not confirmed: ${msgs.join(' | ') || 'no message'}`);
}

const HANDLERS: [RegExp, (ctx: EcCtx, qt: string) => Promise<void>][] = [
  [/Assign (EC\/OC|TEC|FEC) Committee|Committee Formation Submission/i, assignCommittee],
  [/Approve Committee/i, approveCommittee],
  // FC = Finalization Committee (Supplier Finalization, SF 622xx, after 60023): same task shapes, "Selection" instead of
  // "Evaluation" (SIT QT260000000003654, read 2026-11-25). Not run on SIT yet: the forms may differ.
  [/Coordinate (EC|OC|TEC|FEC|FC) Meeting/i, coordinateMeeting],
  [/Finalize (EC|OC|TEC|FEC) Evaluation|Finalize FC Selection/i, finalizeEvaluation],
  [/Endorse (EC|OC|TEC|FEC) Evaluation|Endorse FC Selection/i, (c, q) => endorseEvaluation(c, q, 'Endorsement')],
  [/SignOff (EC|OC|TEC|FEC) Evaluation|SignOff FC Selection/i, (c, q) => endorseEvaluation(c, q, 'Sign Off')],
];
// members' Update/View tasks are withdrawn once the secretary finalizes; Handle Error is a parked BPM fault
const SKIP = /Update (EC|OC|TEC|FEC) Evaluation|Update FC Selection|View Evaluation|Update Scoring|View Scoring|Handle Error/i;

/** Act on the QT's open evaluation tasks until the SIT DB shows `target` (kind 'QT' or 'QT:OC' …). */
export async function ecPhase(ctx: EcCtx, qt: string, target: { kind: string; statusId: number }, maxMinutes = 90): Promise<{ messages: string[] }> {
  const done = new Set<string>();
  const messages: string[] = [];
  let current = '';
  for (let m = 0; m < maxMinutes; m++) {
    const st = currentStatus(target.kind, qt);
    if (st?.statusId === target.statusId) return { messages: [...messages, `${qt} at ${st.statusId} ${st.en}`] };
    let acted = false;
    for (const t of openTasks(qt).filter((x) => !SKIP.test(x.activity))) {
      const h = HANDLERS.find(([re]) => re.test(t.activity));
      if (!h) throw new Error(`Evaluation task "${t.activity}" is not mapped yet`);
      if (done.has(t.taskId)) continue;
      const user = t.claimedBy || t.assignees[0];
      // BPM sometimes creates the task before naming its assignees: look again next round (ngep-runner skips these too)
      if (!user) {
        ctx.log(`${t.activity}: no user assignee yet (${t.groupAssignees.join(', ') || 'none'}), waiting`);
        continue;
      }
      ctx.log(`${t.activity} -> ${user}`);
      if (user !== current) {
        await ctx.as(user);
        current = user;
      }
      await h[1](ctx, qt);
      messages.push(`${t.activity} done by ${user}`);
      done.add(t.taskId);
      acted = true;
    }
    if (!acted) await ctx.page.waitForTimeout(60_000); // BPM spawns the next task ~1-5 min later
  }
  throw new Error(`${qt} did not reach ${target.kind} ${target.statusId} in ${maxMinutes} min`);
}
