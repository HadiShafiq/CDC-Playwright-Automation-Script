import type { Page } from '@playwright/test';
import { dbSchema } from '../../core/doc-status';
import { sitQuery } from '../../core/sit-db';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm } from './pf';
import type { StageCtx } from './stages';
import { openTask } from './tasklist';

/*
 * Letter of Intent (LI, after Supplier Finalization SF 62213). SIT path read 2026-11-25 from LI260000000000724:
 * 62400 Pending LOI Submission → 62401 Pending LOI Approval → 62403 Pending Supplier Acknowledgement → 62404 Pending LOI
 * Negotiation → 62405 LOI Completed. BPM: "Prepare LOI" (QT task, Desk Officer) → "Approve LOI" → "Accept LOI"
 * (supplier) → "Negotiate LOI". Screens mapped on SIT 2026-11-25 with QT260000000004539.
 */

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Fill every empty, enabled, visible field of the current tab that the form marks as required (first option / a text). */
async function fillRequired(page: Page, log: (m: string) => void, where: string) {
  const menus = await page.evaluate(() =>
    [...document.querySelectorAll('select')]
      .filter((s) => (s.closest('.ui-selectonemenu') as HTMLElement | null)?.offsetParent && !s.disabled && !s.closest('.ui-dialog'))
      // only menus still on "- Select One -" (an empty value can be a real choice, e.g. branch HQ)
      .filter((s) => /Select One/i.test(s.selectedOptions[0]?.text ?? ''))
      .map((s) => ({ id: s.id.replace(/_input$/, ''), opt: [...s.options].find((o) => o.value && !/Select One/i.test(o.text))?.text.trim() ?? '' }))
      .filter((m) => m.opt),
  );
  for (const m of menus) {
    await pfSelect(page, m.id, m.opt);
    await pfIdle(page);
    log(`${where}: ${m.id.split(':').pop()} = ${m.opt}`);
  }
  const texts = page.locator('textarea:visible:enabled, input[type=text]:visible:enabled').filter({ hasNot: page.locator('xpath=ancestor::*[contains(@class,"ui-dialog")]') });
  for (let i = 0; i < (await texts.count()); i++) {
    const t = texts.nth(i);
    const id = (await t.getAttribute('id')) ?? '';
    if (/_focus$|_input$|calDate|Date_input/.test(id) || (await t.inputValue()).trim() || (await t.getAttribute('readonly')) !== null) continue;
    await t.fill(/Desig/i.test(id) ? 'Pengarah' : 'QA automation');
    await t.blur();
    await pfIdle(page);
    log(`${where}: ${id.split(':').pop()} filled`);
  }
}

/**
 * Negotiation Terms tab ("Please add at least one Negotiation Term", ERR-760289): one negotiation location row
 * (Add → location menu, date from the picker, 10:00) and every listed term ticked (negoTermstbl). SIT 2026-11-25.
 */
async function negotiation(page: Page, log: (m: string) => void) {
  const locRows = page.locator('tbody[id$="negoloctbl_data"] > tr[data-ri]');
  if (!(await locRows.count())) {
    await page.getByRole('button', { name: 'Add', exact: true }).first().click();
    await pfIdle(page);
  }
  const date = page.locator('[id$="negoloctbl:0:datesb:calDate_input"]').first();
  if ((await date.count()) && !(await date.inputValue()).trim()) {
    await date.locator('xpath=following-sibling::button[contains(@class,"ui-datepicker-trigger")]').click();
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
    const hour = await page.evaluate(() => (document.querySelector('select[id$="negoloctbl:0:datesb:calHour_input"], select[id$="negoloctbl:0:datesb:calHour"]') as HTMLElement | null)?.id.replace(/_input$/, '') ?? '');
    if (hour) await pfSelect(page, hour, '10').catch(async () => page.locator(`[id="${hour}"]`).selectOption('10'));
  }
  // "Date Minute is mandatory": set the minute whenever it is still on "Minute"
  const minute = await page.evaluate(() => {
    const s = document.querySelector('select[id$="negoloctbl:0:datesb:calMin_input"], select[id$="negoloctbl:0:datesb:calMin"]') as HTMLSelectElement | null;
    return s && /Minute/i.test(s.selectedOptions[0]?.text ?? '') ? s.id.replace(/_input$/, '') : '';
  });
  if (minute) await pfSelect(page, minute, '00').catch(async () => page.locator(`[id="${minute}"]`).selectOption('00'));
  await pfIdle(page);
  const terms = page.locator('tbody[id$="negoTermstbl_data"] > tr[data-ri] .ui-chkbox-box');
  let ticked = 0;
  for (let i = 0; i < (await terms.count()); i++) {
    if (/ui-state-active/.test((await terms.nth(i).getAttribute('class')) ?? '')) continue;
    await terms.nth(i).click();
    await pfIdle(page);
    ticked++;
  }
  log(`negotiation: location row ${await locRows.count()}, ${ticked} term checkbox(es) ticked`);
}

/** QT-017: Prepare LOI → LOI Required = Yes → Prepare Letter Of Intent → fill the four tabs → Save → Submit. Returns the LI number. */
export async function prepareLoi(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const existing = loiOf(qt);
  if (existing) {
    // A saved draft locks "LOI Required" and is listed only after selecting the supplier row (SIT 2026-11-25):
    // reopen it with the row's edit button instead of creating a second LOI.
    log(`reopening the LOI draft ${existing}`);
    await page.locator('tbody[id$="loiLoaDtl_data"] > tr[data-ri]').first().locator('td').first().click();
    await pfIdle(page);
    await page.locator('tr').filter({ hasText: existing }).locator('button').last().click();
  } else {
    const req = page.locator('select[id$="isLoiReq"]').first();
    if ((await req.count()) && (await req.isEnabled())) {
      await req.selectOption({ label: 'Yes' });
      await pfIdle(page);
      await clickButton(page, 'Save');
      log(`LOI required = Yes; save: ${(await pageMessages(page)).join(' | ') || 'no message'}`);
    }
    await page.locator('a, button').filter({ hasText: /^\s*Prepare Letter Of Intent\s*$/ }).first().click();
  }
  await pfIdle(page);
  await page.locator('[id$="contractSigner_input"]').waitFor({ state: 'attached', timeout: 30_000 });
  const shown = clean(await page.locator('#main-content').innerText()).match(/LOI No\.\s+(\S+)/)?.[1] ?? '';
  if (existing && shown !== existing) throw new Error(`Expected to reopen ${existing}, the form shows "${shown}" (nothing saved)`);
  // supplier branch: HQ (an earlier run chose TERENGGANU by mistake on LI260000000000781)
  const branch = await page.evaluate(() => (document.querySelector('select[id$="branch_input"]') as HTMLSelectElement | null)?.id.replace(/_input$/, '') ?? '');
  if (branch) {
    await pfSelect(page, branch, 'HQ');
    await pfIdle(page);
  }
  // Letter Of Intent tab: title, online verification Yes (the supplier must acknowledge: 62403), signer + designation
  const title = page.locator('textarea[id$=":title"]');
  if (!(await title.inputValue()).trim()) await title.fill(`Letter of Intent ${qt} (QA automation)`);
  await page.locator('xpath=//tr[.//*[contains(normalize-space(),"Required Online Verification")]]//label[normalize-space()="Yes"]').first().click().catch(() => {});
  await pfIdle(page);
  await fillRequired(page, log, 'Letter Of Intent');
  for (const tab of ['Zone / Item Details', 'Negotiation Terms', 'Verification And Approval']) {
    await openTab(page, tab);
    await pfIdle(page);
    if (tab === 'Negotiation Terms') await negotiation(page, log);
    await fillRequired(page, log, tab);
  }
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`LOI save: ${saved || 'no message'}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  const all = [saved, ...msgs].join(' | ');
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`LOI submit: ${msgs.join(' | ') || 'no message'}`);
  const li = all.match(/\bLI\d{15}\b/)?.[0] ?? loiOf(qt);
  // the LI status is written a moment after the message (11:27:00 check vs 11:27:01 row, 2026-11-25): wait for it
  const st = await waitLoiStatus(page, li, 62401);
  return { messages: [...msgs, `LOI ${li || '(number not shown)'} at ${st}`] };
}

/** The LOI numbers of a QT (SC_LOI → SC_LOI_LOA.DOC_ID = SC_QT.QT_ID), newest first. */
export function loiOf(qt: string): string {
  return sitQuery(`select l.loi_no from ngep_sit.sc_loi l join ngep_sit.sc_loi_loa x on x.loi_loa_id = l.loi_loa_id join ngep_sit.sc_qt q on q.qt_id = x.doc_id where q.qt_no = '${qt.replace(/'/g, '')}' order by l.created_date desc`)[0]?.[0] ?? '';
}

/** Current LI workflow status of an LOI number (SC_WORKFLOW_STATUS doc_type LI, doc_id = SC_LOI.LOI_ID). */
export function loiStatus(li: string): number | undefined {
  const v = sitQuery(`select w.status_id from ngep_sit.sc_workflow_status w join ngep_sit.sc_loi l on l.loi_id = w.doc_id where w.doc_type = 'LI' and l.loi_no = '${li.replace(/'/g, '')}' order by w.created_date desc, w.workflow_status_id desc`)[0]?.[0]; // newest row (is_current lagged, 2026-11-25)
  return v ? Number(v) : undefined;
}

/** Poll the DB (2 min) until the LOI reaches `statusId`; returns the last status seen. */
export async function waitLoiStatus(page: Page, li: string, statusId: number): Promise<number | undefined> {
  let st = loiStatus(li);
  for (let i = 0; i < 24 && st !== statusId; i++) {
    await page.waitForTimeout(5000);
    st = loiStatus(li);
  }
  return st;
}

export const LOI_TEXT = clean;

/** Open BPM task of an LOI (WFTASK is keyed on the LI number; bpm-tasks only knows the standard document types). */
function loiTask(li: string, activity: string): string | undefined {
  const r = sitQuery(`select assignees, acquiredby from ${dbSchema().bpmTasks} where customattributestring1 = '${li.replace(/'/g, '')}' and activityname = '${activity}' and state = 'ASSIGNED' order by createddate desc`)[0];
  if (!r) return undefined;
  return r[1] || (r[0] ?? '').split(/[;:]/).map((a) => a.trim()).filter((a) => !/,group$/i.test(a))[0]?.replace(/,user$/i, '');
}

/**
 * QT-018: the LOI approver (BPM "Approve LOI") approves LI → 62403 Pending Supplier Acknowledgement (online
 * verification Yes). Logs in as the task's assignee itself (selfLogin).
 */
export async function approveLoi(ctx: StageCtx & { as: (u: string) => Promise<void> }, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const li = loiOf(qt);
  if (!li) throw new Error(`${qt} has no LOI`);
  let user = loiTask(li, 'Approve LOI');
  for (let i = 0; !user && i < 12; i++) {
    await page.waitForTimeout(10_000);
    user = loiTask(li, 'Approve LOI');
  }
  if (!user) throw new Error(`no open "Approve LOI" task for ${li} (SIT WFTASK)`);
  log(`Approve LOI ${li} -> ${user}`);
  await ctx.as(user);
  await openTask(page, ctx.baseURL, li, log);
  const visible = (await page.locator('button:visible').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  if (!visible.includes('Approve')) throw new Error(`No Approve button on ${li} (nothing pressed). Buttons: ${visible.join(' | ')}`);
  await page.evaluate(() => {
    for (const t of document.querySelectorAll('textarea')) {
      const ta = t as HTMLTextAreaElement;
      if (ta.offsetWidth && !ta.readOnly && !ta.disabled && !ta.value && !ta.closest('.ui-dialog')) { ta.value = 'Approved (QA automation)'; ta.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });
  const msgs = await pressAndConfirm(page, 'Approve', log);
  if (!msgs.some((m) => /success|approved/i.test(m))) throw new Error(`Approve LOI not confirmed: ${msgs.join(' | ') || 'no message'}`);
  const st = await waitLoiStatus(page, li, 62403);
  return { messages: [...msgs, `LOI ${li} at ${st}`] };
}

/** Users of an open LOI task that we can log in as (credentials.xlsx), first one first. */
async function loiTaskUsers(li: string, activity: string): Promise<string[]> {
  const r = sitQuery(`select assignees, acquiredby from ${dbSchema().bpmTasks} where customattributestring1 = '${li.replace(/'/g, '')}' and activityname = '${activity}' and state = 'ASSIGNED' order by createddate desc`)[0];
  if (!r) return [];
  return [r[1], ...(r[0] ?? '').split(/[;:]/).map((a) => a.trim()).filter((a) => !/,group$/i.test(a)).map((a) => a.replace(/,user$/i, ''))].filter(Boolean) as string[];
}

/**
 * QT-019: the supplier acknowledges the LOI ("Accept LOI": Letter Of Intent Acknowledgement → remarks → Accept) →
 * 62404 Pending LOI Negotiation. The task names the supplier's users; the first one with a password in
 * .auth/credentials.xlsx is used (FIRST ALLIED: firstallied1234 = "QT Supplier 1"). SIT 2026-11-25.
 */
export async function acceptLoi(ctx: StageCtx & { as: (u: string) => Promise<void> }, qt: string, loginable: (u: string) => Promise<boolean>): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const li = loiOf(qt);
  if (!li) throw new Error(`${qt} has no LOI`);
  let users = await loiTaskUsers(li, 'Accept LOI');
  for (let i = 0; !users.length && i < 12; i++) {
    await page.waitForTimeout(10_000);
    users = await loiTaskUsers(li, 'Accept LOI');
  }
  let user = '';
  for (const u of users) if (await loginable(u)) { user = u; break; }
  if (!user) throw new Error(`"Accept LOI" of ${li}: none of its users has a password in credentials.xlsx (${users.join(', ') || 'no open task'})`);
  log(`Accept LOI ${li} -> supplier ${user}`);
  await ctx.as(user);
  await openTask(page, ctx.baseURL, li, log);
  await page.evaluate(() => {
    for (const t of document.querySelectorAll('textarea')) {
      const ta = t as HTMLTextAreaElement;
      if (ta.offsetWidth && !ta.readOnly && !ta.disabled && !ta.value && !ta.closest('.ui-dialog')) { ta.value = 'Accepted (QA automation)'; ta.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });
  const msgs = await pressAndConfirm(page, 'Accept', log);
  if (!msgs.some((m) => /success|accepted|acknowledg/i.test(m))) throw new Error(`Accept LOI not confirmed: ${msgs.join(' | ') || 'no message'}`);
  const st = await waitLoiStatus(page, li, 62404);
  return { messages: [...msgs, `LOI ${li} at ${st}`] };
}

/**
 * QT-020: the Desk Officer records the negotiation result ("Negotiate LOI": Review / Request LOI → tab Result of
 * Negotiation: location + date, a result per term) → Save → Submit → 62405 Letter Of Intent Completed. SIT 2026-11-25.
 */
export async function negotiateLoi(ctx: StageCtx & { as: (u: string) => Promise<void> }, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const li = loiOf(qt);
  if (!li) throw new Error(`${qt} has no LOI`);
  let users = await loiTaskUsers(li, 'Negotiate LOI');
  for (let i = 0; !users.length && i < 12; i++) {
    await page.waitForTimeout(10_000);
    users = await loiTaskUsers(li, 'Negotiate LOI');
  }
  if (!users.length) throw new Error(`no open "Negotiate LOI" task for ${li}`);
  log(`Negotiate LOI ${li} -> ${users[0]}`);
  await ctx.as(users[0]);
  await openTask(page, ctx.baseURL, li, log);
  await openTab(page, 'Result of Negotiation');
  await pfIdle(page);
  const loc = page.locator('input[id$="negoloctbl:0:negLocId"]').first();
  if ((await loc.count()) && !(await loc.inputValue()).trim()) await loc.fill('Bilik Mesyuarat (QA automation)');
  await negotiation(page, log);
  const results = page.locator('textarea[id$="negoRemarkId"]:visible:enabled');
  for (let i = 0; i < (await results.count()); i++) if (!(await results.nth(i).inputValue()).trim()) await results.nth(i).fill('Dipersetujui (QA automation)');
  log(`negotiation result: ${await results.count()} term(s)`);
  await clickButton(page, 'Save');
  log(`save: ${(await pageMessages(page)).join(' | ') || 'no message'}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted|completed/i.test(m))) throw new Error(`Negotiate LOI submit: ${msgs.join(' | ') || 'no message'}`);
  const st = await waitLoiStatus(page, li, 62405);
  return { messages: [...msgs, `LOI ${li} at ${st}`] };
}
