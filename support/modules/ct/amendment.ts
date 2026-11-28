import path from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { openTasks } from '../../core/bpm-tasks';
import { sitQuery } from '../../core/sit-db';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm } from '../qt/pf';
import type { StageCtx } from '../qt/stages';
import { openTask } from '../qt/tasklist';

/*
 * Contract Amendment With Supplement (CT workflow FA). SIT path read 2026-11-28 from CT260000000001864 (another team's
 * contract, read only): Create FA (51050) → Review FA → Confirm FA Meeting (51200) → Update FA Result (51250) → Sign Off
 * (51300) → Chairperson SignOff (51320) → Prepare LOA (51400, supplemental contract letter) → Endorse LOA (51405) → Ack FA
 * (supplier, 51450) → Verify FA (51500 → 51700) → Create Draft AC/SA → Review AC/SA.
 * Screen probed 2026-11-28 on our CT260000000002328: Contract Maintenance → search → Option → Amendment With Supplement →
 * tabs Fulfilment Details / Amendment Detail / Approver Settings and Checklist; Save, Submit.
 */

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Current FA (amendment with supplement) status of a contract, from its newest FA version. */
export function faStatus(ct: string): number | undefined {
  const v = sitQuery(`select w.status_id from ngep_sit.ct_workflow_status w join ngep_sit.ct_contract_ver v on v.contract_ver_id = w.doc_id
    join ngep_sit.ct_contract c on c.contract_id = v.contract_id where c.contract_no = '${ct.replace(/'/g, '')}' and w.doc_type = 'FA'
    order by w.created_date desc, w.workflow_status_id desc`)[0]?.[0];
  return v ? Number(v) : undefined;
}

/** Contract Maintenance → search the contract → Option → the given action (e.g. "Amendment With Supplement"). */
export async function openContractOption(page: Page, ct: string, option: string, log: (m: string) => void) {
  await page.locator('xpath=//a[normalize-space()="Contract Maintenance"]').first().click();
  await pfIdle(page);
  await page.locator('xpath=(//label[contains(normalize-space(),"Contract No")]/following::input[1])[1]').fill(ct);
  await clickButton(page, 'Search');
  const row = page.locator('tr[data-ri]').filter({ hasText: ct }).first();
  await row.waitFor({ timeout: 30_000 });
  await row.getByRole('button', { name: 'Option' }).click();
  await pfIdle(page);
  await page.locator(`xpath=//a[.//span[normalize-space()="${option}"]]`).first().click();
  await pfIdle(page);
  log(`${ct}: Contract Maintenance → ${option}`);
}

/** Tick the PrimeFaces checkbox whose row/label text is `label` (no-op when already ticked). */
async function tick(page: Page, label: string, checklist = false) {
  // the label is the text of the checkbox's nearest ancestor that has text (SIT 2026-11-28: amendment types, authority)
  const state = await page.evaluate(({ label, checklist }) => {
    document.querySelectorAll('[data-pw-tick]').forEach((e) => e.removeAttribute('data-pw-tick'));
    for (const c of document.querySelectorAll('.ui-chkbox')) {
      if (!(c as HTMLElement).offsetParent) continue;
      let n: Element | null = c;
      let txt = '';
      for (let i = 0; i < 4 && n && !txt; i++) {
        n = n.parentElement;
        txt = (n as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim() ?? '';
      }
      // checklist rows read "<type> at side menu <menu>" (SIT 2026-11-28)
      if (txt !== label && !(checklist && txt.startsWith(`${label} at side menu`))) continue;
      c.setAttribute('data-pw-tick', '1');
      const inp = c.querySelector('input') as HTMLInputElement | null;
      return inp?.disabled ? 'disabled' : inp?.checked ? 'checked' : 'unchecked';
    }
    return 'missing';
  }, { label, checklist });
  if (state === 'missing' || state === 'disabled') throw new Error(`Checkbox "${label}" ${state}`);
  if (state === 'unchecked') {
    await page.locator('[data-pw-tick="1"] .ui-chkbox-box').click();
    await pfIdle(page);
  }
}

export interface FaOptions {
  /** Amendment type labels as shown on Amendment Detail (default: Change of clause — no amount fields). */
  types?: string[];
  /** Committee secretary shown in "Desk Officer Committee" (default: our QT desk officer). */
  secretary?: string;
}

/**
 * FA-001 (Create FA): Contract Administrator opens Amendment With Supplement, ticks the amendment type, File Reference No.,
 * approving authority Committee Type QQC with the desk officer committee secretary, remarks → Save → Submit → 51050.
 */
export async function createFa(ctx: StageCtx, ct: string, o: FaOptions = {}): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const before = faStatus(ct);
  if (before && before !== 51000) throw new Error(`${ct} already has an amendment at FA ${before}: not creating another`);
  // Save leaves the form for an acknowledgement page and creates the draft (51000) with the BPM task "Submit FA" for the
  // Contract Administrator (SIT 2026-11-28): Submit happens from the task. A draft from an earlier attempt is reused.
  let saved = '';
  if (!before) saved = await fillAndSave(ctx, ct, o);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('xpath=//a[.//span[normalize-space()="Amendment Detail"]] | //li[contains(@class,"ui-tabmenuitem")][normalize-space()="Amendment Detail"]').first().waitFor({ timeout: 60_000 });
  // ERR-750093 "Checklist is mandatory to tick at side menu Approver Setting and Checklist" (SIT 2026-11-28)
  // tick only the checklist rows of the amendment types chosen ("each selected Amendment Type has been updated")
  await sideMenu(page, 'Approver Settings and Checklist', /^approver list$/i);
  for (const t of o.types ?? ['Change of clause']) await tick(page, t, true);
  log(`checklist ticked: ${(o.types ?? ['Change of clause']).join(', ')}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  log(`FA submit: ${msgs.join(' | ') || 'no message'}`);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`FA submit: ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && faStatus(ct) !== 51050; i++) await page.waitForTimeout(5000);
  return { messages: [saved, ...msgs, `${ct} FA ${faStatus(ct) ?? '(no FA row)'}`].filter(Boolean).map(clean) };
}

/**
 * Side menu of the contract form (Fulfilment Details / Amendment Detail / Approver Settings and Checklist): tab-menu
 * items whose active class does not change (openTab reported "did not open", SIT 2026-11-28) → click, wait for a text.
 */
async function sideMenu(page: Page, label: string, expectText: RegExp) {
  await page.locator('li.ui-tabmenuitem:visible a', { hasText: new RegExp(`^\\s*${label}\\s*$`) }).first().click();
  await pfIdle(page);
  await page.getByText(expectText).first().waitFor({ timeout: 30_000 });
}

/** Open Amendment With Supplement, fill Amendment Detail and Save (creates the FA draft 51000). */
async function fillAndSave(ctx: StageCtx, ct: string, o: FaOptions): Promise<string> {
  const { page, log } = ctx;
  await openContractOption(page, ct, 'Amendment With Supplement', log);
  // the form opens on Fulfilment Details; the amendment fields render only on the Amendment Detail tab
  await page.locator('xpath=//a[.//span[normalize-space()="Amendment Detail"]] | //li[contains(@class,"ui-tabmenuitem")][normalize-space()="Amendment Detail"]').first().waitFor({ timeout: 60_000 });
  await openTab(page, 'Amendment Detail');
  await page.locator('input[id$="txtfrno"]').first().waitFor({ timeout: 30_000 });
  for (const t of o.types ?? ['Change of clause']) await tick(page, t);
  const ref = page.locator('input[id$="txtfrno"]').first();
  if (!(await ref.inputValue()).trim()) await ref.fill(`QA/FA/${ct.slice(-6)}`);
  const desc = page.locator('textarea[id$="txtdesc"]').first();
  if (!/QA automation/.test(await desc.inputValue())) await desc.fill(`Amendment with supplement: change of clause (QA automation) ${ct}`);
  // approving authority: Committee Type (ticked by default) → Quotation Committee (QQC) → secretary
  await tick(page, 'Committee Type');
  if (!(await page.locator('input[type=radio][id$="committeeType:0"]').isChecked())) {
    await page.locator('label[for$="committeeType:0"]').click();
    await pfIdle(page);
  }
  const sec = await page.evaluate(() => (document.querySelector('select[id$="secretaryId_input"]') as HTMLSelectElement | null)?.id.replace(/_input$/, '') ?? '');
  if (sec) {
    await pfSelect(page, sec, o.secretary ?? 'Wan Nurhazwani Binti Wan Yusoff - 881204115188');
    await pfIdle(page);
  }
  const remark = page.locator('textarea[id$="textAreaId"]:visible').first();
  if ((await remark.count()) && !(await remark.inputValue()).trim()) await remark.fill('Amendment with supplement (QA automation)');
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`FA save: ${saved || 'no message'}`);
  if (!/is saved|success/i.test(saved)) throw new Error(`FA save refused: ${saved || 'no message'}`);
  for (let i = 0; i < 12 && faStatus(ct) !== 51000; i++) await page.waitForTimeout(5000);
  return saved;
}

/**
 * A reviewer / approver task on the FA (e.g. "Review FA" → Approve): open the contract's task from My Task, write a
 * remark on Approver Settings and Checklist when the box is empty, press `button` and answer its dialogs; then wait for
 * the FA status to leave `fromStatus`. Screen of "Review FA" probed 2026-11-28: Save, Approve, Revise, Reject.
 */
export async function faTaskAction(ctx: StageCtx, ct: string, button: string, fromStatus: number): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  if (faStatus(ct) !== fromStatus) throw new Error(`${ct} FA is at ${faStatus(ct)}, not ${fromStatus}: nothing to ${button}`);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  if (await page.locator('li.ui-tabmenuitem:visible a', { hasText: /^\s*Approver Settings and Checklist\s*$/ }).count()) {
    await sideMenu(page, 'Approver Settings and Checklist', /^remarks$/i);
    const remark = page.locator('textarea:visible:enabled').last();
    if ((await remark.count()) && !(await remark.inputValue()).trim()) await remark.fill(`${button} (QA automation)`);
  }
  const msgs = await pressAndConfirm(page, button, log);
  log(`${button}: ${msgs.join(' | ') || 'no message'}`);
  if (msgs.some((m) => /ERR-|mandatory|required/i.test(m)) && !msgs.some((m) => /success/i.test(m))) throw new Error(`${button}: ${msgs.join(' | ')}`);
  for (let i = 0; i < 24 && faStatus(ct) === fromStatus; i++) await page.waitForTimeout(5000);
  return { messages: [...msgs, `${ct} FA ${faStatus(ct)}`].map(clean) };
}

/** Pick today (or the next open day) in the date picker of `input`. */
async function pickToday(page: Page, input: string) {
  const box = page.locator(input).first();
  if ((await box.inputValue()).trim()) return;
  await box.locator('xpath=following-sibling::button[contains(@class,"ui-datepicker-trigger")]').click();
  const picker = page.locator('#ui-datepicker-div');
  await picker.waitFor({ state: 'visible' });
  const today = new Date().getDate();
  const days = picker.locator('td:not(.ui-datepicker-other-month):not(.ui-datepicker-unselectable):not(.ui-state-disabled) a');
  for (let i = 0; i < (await days.count()); i++) {
    if (Number((await days.nth(i).innerText()).trim()) >= today) {
      await days.nth(i).click();
      await pfIdle(page);
      return;
    }
  }
  throw new Error(`no selectable date from today in ${input}`);
}

/** FA committee: chairperson + two members (SIT QT Specification Committee users, log in with the shared password). */
export const FA_COMMITTEE = [
  { ic: '711105085487', role: /chair|pengerusi/i },
  { ic: '770614135921', role: /member|ahli/i },
  { ic: '770614135925', role: /member|ahli/i },
];

/**
 * CT-103 (Confirm FA Meeting, committee secretary): Meeting Details → meeting row (today, location, status Done) →
 * Approving Authority: add the committee from "New Approving Authority" (search by IC → tick → Select), role per row →
 * Save → Submit → 51250. Screen probed 2026-11-28 on CT260000000002328 (status options Cancelled/Done/Pending/Postpone).
 */
export async function confirmFaMeeting(ctx: StageCtx, ct: string, committee = FA_COMMITTEE): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  if (faStatus(ct) !== 51200) throw new Error(`${ct} FA is at ${faStatus(ct)}, not 51200 Pending Meeting Confirmation`);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  await sideMenu(page, 'Meeting Details', /^approving authority$/i);
  // meeting row
  if (!(await page.locator('[id$="meetingTable:0:calMeeting_input"]').count())) {
    await page.getByRole('button', { name: 'Add', exact: true }).first().click();
    await pfIdle(page);
  }
  await pickToday(page, '[id$="meetingTable:0:calMeeting_input"]');
  const ids = await page.evaluate(() => {
    const row = [...document.querySelectorAll('[id*="meetingTable:0:"]')];
    return {
      loc: row.find((e) => e.matches('input[type=text]') && !e.id.includes('cal'))?.id ?? '',
      status: (row.find((e) => e.matches('select')) as HTMLSelectElement | undefined)?.id.replace(/_input$/, '') ?? '',
    };
  });
  if (!ids.loc || !ids.status) throw new Error(`meeting row fields not found (${JSON.stringify(ids)})`);
  const loc = page.locator(`[id="${ids.loc}"]`);
  if (!(await loc.inputValue()).trim()) await loc.fill('Bilik Mesyuarat (QA automation)');
  await pfSelect(page, ids.status, 'Done');
  await pfIdle(page);
  // approving authority members: the data table after the "Approving Authority" header
  const authRows = () => page.locator('xpath=//*[normalize-space()="APPROVING AUTHORITY" or normalize-space()="Approving Authority"]/following::tbody[1]/tr[@data-ri]');
  // "Role is mandatory" before the next Add (SIT 2026-11-28): set each member's role right after adding them
  const setRole = async (m: (typeof committee)[number]) => {
    const row = authRows().filter({ hasText: m.ic }).first();
    const sel = await row.evaluate((r) => {
      const s = r.querySelector('select') as HTMLSelectElement | null;
      return s ? { id: s.id.replace(/_input$/, ''), opts: [...s.options].map((o) => o.text.trim()), cur: s.selectedOptions[0]?.text.trim() ?? '' } : null;
    });
    if (!sel) return; // fixed role (e.g. the desk officer)
    const want = sel.opts.find((o) => m.role.test(o));
    if (!want) throw new Error(`role for ${m.ic}: none of ${sel.opts.join(' / ')} matches ${m.role}`);
    if (sel.cur !== want) {
      await pfSelect(page, sel.id, want);
      await pfIdle(page);
    }
    log(`role ${m.ic} = ${want} (options ${sel.opts.join(' / ')})`);
  };
  for (const m of committee) {
    if (await authRows().filter({ hasText: m.ic }).count()) {
      await setRole(m);
      continue;
    }
    await page.getByRole('button', { name: 'Add', exact: true }).last().click();
    await pfIdle(page);
    const dlg = page.locator('[id$="form:modelDialog"]');
    await dlg.waitFor({ state: 'visible', timeout: 20_000 });
    const type = await dlg.evaluate((d) => (d.querySelector('select[id$="idenType_input"]') as HTMLSelectElement | null)?.id.replace(/_input$/, '') ?? '');
    if (type) await pfSelect(page, type, 'Identification Card');
    await dlg.locator('input[id$="idenNo"]').fill(m.ic);
    await dlg.getByRole('button', { name: 'Search', exact: true }).click();
    await pfIdle(page);
    const hit = dlg.locator('tr[data-ri]').filter({ hasText: m.ic }).first();
    await hit.waitFor({ timeout: 20_000 });
    await hit.locator('.ui-chkbox-box').click();
    await pfIdle(page);
    await dlg.getByRole('button', { name: 'Select', exact: true }).click();
    await pfIdle(page);
    log(`approving authority + ${m.ic}`);
    await setRole(m);
  }
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`meeting save: ${saved || 'no message'}`);
  if (/mandatory|ERR-|required/i.test(saved) && !/success|saved/i.test(saved)) throw new Error(`meeting save refused: ${saved}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  log(`meeting submit: ${msgs.join(' | ') || 'no message'}`);
  // SIT answers "Approving Authority Information … has been updated." (2026-11-28)
  if (!msgs.some((x) => /success|submitted|has been updated/i.test(x))) throw new Error(`meeting submit: ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && faStatus(ct) === 51200; i++) await page.waitForTimeout(5000);
  return { messages: [saved, ...msgs, `${ct} FA ${faStatus(ct)}`].filter(Boolean).map(clean) };
}

const DECISION_PDF = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'files', 'File_pdf_for_testing.pdf');

/**
 * Upload through an upload dialog (SIT 2026-11-28, Decision Paper): the upload icon button opens `dialog`
 * (e.g. uploadPbqcDecisionLetterDlg) → file input → its "Upload" (.start) button → Close. Setting the hidden input
 * alone does nothing (ERR-100022 "Decision Paper is mandatory").
 */
async function dialogUpload(page: Page, dialog: string, file: string, log: (m: string) => void, trigger?: Locator) {
  // `dialog` = id suffix of the upload dialog, or '' for "the visible dialog that holds a file input" (opened by `trigger`)
  const dlg = dialog
    ? page.locator(`[id$="${dialog}"]`)
    : page.locator('.ui-dialog').filter({ has: page.locator('input[type=file]') }).filter({ visible: true }).first();
  if (!dialog || !(await dlg.isVisible())) {
    // the given trigger, else the visible upload icon button whose onclick opens this dialog, else the only visible one
    const btn = trigger ?? page.locator(`button:visible:has(.ui-icon-upload)[onclick*="${dialog}"]`).or(page.locator('button:visible:has(.ui-icon-upload)')).first();
    await btn.click();
    await pfIdle(page);
  }
  await dlg.waitFor({ state: 'visible', timeout: 20_000 });
  await dlg.locator('input[type=file]').first().setInputFiles(file);
  await pfIdle(page);
  await dlg.locator('button.start:visible, td.start button:visible').first().click();
  await pfIdle(page);
  await page.waitForTimeout(1500);
  const msgs = (await pageMessages(page)).join(' | ');
  const close = dlg.getByRole('button', { name: 'Close', exact: true });
  if (await close.isVisible().catch(() => false)) {
    await close.click();
    await pfIdle(page);
  }
  log(`upload ${path.basename(file)} via ${dialog || "dialog"}: ${msgs || "no message"}`);
}

/**
 * CT-104 (Update FA Result, committee secretary): Decision → decision date (today), Decision = approve option, remarks,
 * Decision Paper (PDF), attendance and endorsement ticked for every member → Save → Submit → 51300.
 * Screen probed 2026-11-28 on CT260000000002328.
 */
export async function updateFaResult(ctx: StageCtx, ct: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  if (faStatus(ct) !== 51250) throw new Error(`${ct} FA is at ${faStatus(ct)}, not 51250 Pending Decision by the Approving Authority`);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  await sideMenu(page, 'Decision', /^list of committee members$/i);
  await pickToday(page, 'input[id$="calPbqDecision_input"]');
  const dec = await page.evaluate(() => {
    const s = document.querySelector('select[id$="pqQcDecisionId_input"]') as HTMLSelectElement | null;
    return s ? { id: s.id.replace(/_input$/, ''), opts: [...s.options].map((o) => o.text.trim()) } : null;
  });
  if (!dec) throw new Error('Decision menu not found');
  const approve = dec.opts.find((o) => /^(approved?|lulus|diluluskan|agree|setuju)/i.test(o));
  if (!approve) throw new Error(`no approve option in Decision: ${dec.opts.join(' / ')}`);
  await pfSelect(page, dec.id, approve);
  await pfIdle(page);
  log(`decision = ${approve} (options ${dec.opts.join(' / ')})`);
  const just = page.locator('textarea[id$="justificationPbQCC"]').first();
  if (!(await just.inputValue()).trim()) await just.fill('Amendment with supplement approved by the committee (QA automation)');
  await dialogUpload(page, 'uploadPbqcDecisionLetterDlg', DECISION_PDF, log);
  // attendance and endorsement of every member (the secretary's box is read-only)
  // each tick re-renders the table (AJAX): find the next open box by id every time
  let ticked = 0;
  for (let guard = 0; guard < 20; guard++) {
    const id = await page.evaluate((ics) => {
      for (const tr of document.querySelectorAll('tr')) {
        if (!(tr as HTMLElement).offsetParent || !ics.some((ic) => (tr as HTMLElement).innerText.includes(ic))) continue;
        const inp = [...tr.querySelectorAll('.ui-chkbox input')].find((i) => !(i as HTMLInputElement).disabled && !(i as HTMLInputElement).checked);
        if (inp) return inp.id;
      }
      return '';
    }, FA_COMMITTEE.map((m) => m.ic));
    if (!id) break;
    await page.locator(`[id="${id}"]`).locator('xpath=ancestor::div[contains(@class,"ui-chkbox")][1]').locator('.ui-chkbox-box').click();
    await pfIdle(page);
    ticked++;
  }
  log(`attendance and endorsement ticked: ${ticked}`);
  // "Update Committee" opens a screen to change the committee (Original / Update Committee Member): not part of the result
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`result save: ${saved || 'no message'}`);
  if (/mandatory|ERR-|required/i.test(saved) && !/success|saved|updated/i.test(saved)) throw new Error(`result save refused: ${saved}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  log(`result submit: ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && faStatus(ct) === 51250; i++) await page.waitForTimeout(5000);
  // judge by the DB (submit texts vary: "has been updated", "successfully submitted")
  if (faStatus(ct) === 51250) throw new Error(`result submit: FA still 51250 (${msgs.join(' | ') || 'no message'})`);
  return { messages: [saved, ...msgs, `${ct} FA ${faStatus(ct)}`].filter(Boolean).map(clean) };
}

/**
 * CT-105 (Sign Off, committee members): every open "Sign Off" task with a named assignee → log in as that member →
 * My Task → Acknowledge. SIT 2026-11-28 on CT260000000002328: three Sign Off tasks at 51300 (two members by name, one
 * without assignee); screen buttons Acknowledge / Revise. Returns when the FA leaves 51300 or no named task is left.
 */
export async function signOffFa(ctx: StageCtx & { as: (u: string) => Promise<void> }, ct: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  if (faStatus(ct) !== 51300) throw new Error(`${ct} FA is at ${faStatus(ct)}, not 51300 Pending Verification`);
  const out: string[] = [];
  const done = new Set<string>();
  for (let round = 0; round < 6 && faStatus(ct) === 51300; round++) {
    const named = openTasks(ct, 'Sign Off').flatMap((t) => t.assignees).filter((u) => !done.has(u));
    if (!named.length) break;
    for (const u of named) {
      await ctx.as(u);
      await openTask(page, ctx.baseURL, ct, log);
      await page.getByRole('button', { name: 'Acknowledge', exact: true }).waitFor({ timeout: 60_000 });
      const msgs = await pressAndConfirm(page, 'Acknowledge', log);
      log(`sign off ${u}: ${msgs.join(' | ') || 'no message'}`);
      if (msgs.some((m) => /ERR-|mandatory|required/i.test(m)) && !msgs.some((m) => /success|acknowledged|updated/i.test(m))) throw new Error(`sign off ${u}: ${msgs.join(' | ')}`);
      out.push(...msgs);
      done.add(u);
    }
    for (let i = 0; i < 6 && faStatus(ct) === 51300 && openTasks(ct, 'Sign Off').some((t) => t.assignees.some((u) => !done.has(u))) === false; i++) await page.waitForTimeout(5000);
  }
  const left = openTasks(ct, 'Sign Off');
  log(`after sign off: FA ${faStatus(ct)}; open Sign Off tasks ${left.length} (${left.map((t) => t.assignees.join(',') || 'no assignee').join('; ')})`);
  return { messages: [...out, `${ct} FA ${faStatus(ct)}`].map(clean) };
}

/**
 * CT-107 (Prepare LOA = supplemental contract letter, Contract Administrator): Supplemental Contract Letter Details →
 * File Reference No. (signer and acknowledge officer keep their defaults) → Supplemental Contract Letter Content →
 * letter date (today), response period default 7, the signed letter PDF through the row's attach button → Save →
 * Submit → 51405. Screens probed 2026-11-28 on CT260000000002328.
 */
export async function prepareSupplementalLetter(ctx: StageCtx, ct: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  if (faStatus(ct) !== 51400) throw new Error(`${ct} FA is at ${faStatus(ct)}, not 51400 Pending Supplemental Contract Letter Submission`);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  const ref = `QA/SCL/${ct.slice(-6)}`;
  await sideMenu(page, 'Supplemental Contract Letter Details', /^supplemental contract letter signer$/i);
  // the only editable text box of the details section is File Reference No.
  const fileRef = page.locator('xpath=//label[contains(normalize-space(),"File Reference No")]/following::input[@type="text"][not(@readonly) and not(@disabled)][1]').first();
  if (!(await fileRef.inputValue()).trim()) await fileRef.fill(ref);
  await sideMenu(page, 'Supplemental Contract Letter Content', /Response Due Date/i);
  const ref2 = page.locator('xpath=//label[contains(normalize-space(),"File Reference No")]/following::input[@type="text"][1]').first();
  if ((await ref2.isEditable().catch(() => false)) && !(await ref2.inputValue()).trim()) await ref2.fill(ref);
  await pickToday(page, 'input[id$="signDateLoaId_input"]');
  const attach = page.locator('tr').filter({ hasText: /^\s*Supplemental Contract Letter\s/ }).locator('button:visible, a:visible').last();
  await dialogUpload(page, '', DECISION_PDF, log, attach);
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`letter save: ${saved || 'no message'}`);
  if (/mandatory|ERR-|required/i.test(saved) && !/success|saved|updated/i.test(saved)) throw new Error(`letter save refused: ${saved}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  log(`letter submit: ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && faStatus(ct) === 51400; i++) await page.waitForTimeout(5000);
  if (faStatus(ct) === 51400) throw new Error(`letter submit: FA still 51400 (${msgs.join(' | ') || 'no message'})`);
  return { messages: [saved, ...msgs, `${ct} FA ${faStatus(ct)}`].filter(Boolean).map(clean) };
}

/**
 * CT-108 (Ack FA, supplier company admin, e.g. firstallied123): log in as the "Ack FA" assignee → My Task → bank account
 * (Supplemental Contract Letter Details, only when still "Select One") → Declaration: tick the terms → Acknowledge (sign
 * dialogs answered) → 51500. Screens probed 2026-11-28 on CT260000000002328 (SL260000000000967): Acknowledge stays
 * disabled until the letter PDF is downloaded from the Content menu.
 */
export async function ackFaSupplier(ctx: StageCtx & { as: (u: string) => Promise<void> }, ct: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  if (faStatus(ct) !== 51450) throw new Error(`${ct} FA is at ${faStatus(ct)}, not 51450 Pending Supplemental Contract Letter Acknowledgement`);
  const task = openTasks(ct, 'Ack FA')[0];
  const user = task?.claimedBy || task?.assignees[0];
  if (!user) throw new Error(`no open "Ack FA" task with a user for ${ct}`);
  await ctx.as(user);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  await sideMenu(page, 'Supplemental Contract Letter Details', /^payment details$/i);
  const bank = await page.evaluate(() => {
    const s = document.querySelector('select[id$="accountNo_input"]') as HTMLSelectElement | null;
    if (!s || !/Select One/i.test(s.selectedOptions[0]?.text ?? '')) return null;
    return { id: s.id.replace(/_input$/, ''), opt: [...s.options].find((o) => o.value && !/Select One/i.test(o.text))?.text.trim() ?? '' };
  });
  if (bank?.opt) {
    await pfSelect(page, bank.id, bank.opt);
    await pfIdle(page);
    log(`bank account: ${bank.opt}`);
  }
  // Acknowledge is enabled only after the supplier downloads the letter (Content menu → the PDF link); the declaration
  // tick and Save do not enable it (SIT 2026-11-28, probe: disabled=true → false right after the download)
  await sideMenu(page, 'Supplemental Contract Letter Content', /Response Due Date/i);
  const link = page.locator('a:visible', { hasText: /\.pdf\s*$/i }).first();
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), link.click()]);
  await pfIdle(page);
  log(`letter downloaded: ${dl.suggestedFilename()}`);
  await sideMenu(page, 'Declaration', /^terms and condition$/i);
  const decl = page.locator('.ui-chkbox:visible').first();
  if (!(await decl.locator('input').isChecked())) {
    await decl.locator('.ui-chkbox-box').click();
    await pfIdle(page);
  }
  const ackDisabled = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => (x as HTMLElement).innerText.trim() === 'Acknowledge' && (x as HTMLElement).offsetWidth);
    return !b || (b as HTMLButtonElement).disabled || b.classList.contains('ui-state-disabled');
  });
  if (ackDisabled) throw new Error('Acknowledge is still disabled after downloading the letter and ticking the declaration (nothing acknowledged)');
  const msgs = await pressAndConfirm(page, 'Acknowledge', log);
  log(`supplier acknowledge (${user}): ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && faStatus(ct) === 51450; i++) await page.waitForTimeout(5000);
  if (faStatus(ct) === 51450) throw new Error(`supplier acknowledge: FA still 51450 (${msgs.join(' | ') || 'no message'})`);
  return { messages: [...msgs, `${ct} FA ${faStatus(ct)}`].map(clean) };
}

/** Current SA (supplemental agreement) status of a contract (CT_AGREEMENT → CT_WORKFLOW_STATUS doc_type SA). */
export function saStatus(ct: string): number | undefined {
  const v = sitQuery(`select w.status_id from ngep_sit.ct_workflow_status w join ngep_sit.ct_agreement a on a.agreement_id = w.doc_id
    join ngep_sit.ct_contract c on c.contract_id = a.contract_id where c.contract_no = '${ct.replace(/'/g, '')}' and w.doc_type = 'SA'
    order by w.created_date desc, w.workflow_status_id desc`)[0]?.[0];
  return v ? Number(v) : undefined;
}

/**
 * CT-110 (Create Draft AC/SA → supplemental agreement, Contract Administrator): same portlet as the agreement (KAT-042,
 * whose selectors are reused): Signer Information → agency witness row; Contract Document → contract document upload,
 * date signing, signing page, stamping page; Approver Settings → move the approver into Selected Approver → Save →
 * Submit. Screens probed 2026-11-28 on CT260000000002328 (SA 57750 Pending Supplemental Agreement Creation).
 */
export async function createSa(ctx: StageCtx, ct: string, approver = 'Shamsul Azri Bin Abu Bakar'): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const before = saStatus(ct);
  if (before !== 57750) throw new Error(`${ct} SA is at ${before}, not 57750 Pending Supplemental Agreement Creation`);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  // agency witness (KAT-042: Witness Add → name / IC / designation in AgWitnessTable row 1)
  await sideMenu(page, 'Supplemental Agreement Signer Information', /^agency signing details$/i);
  const witnessRow = page.locator('tbody[id$="AgWitnessTable_data"] > tr').first();
  if (!(await witnessRow.locator('input').count())) {
    await page.locator('xpath=(//label[normalize-space()="Witness"]/following::span[normalize-space()="Add"][1]/ancestor::button)[1]').click();
    await pfIdle(page);
  }
  const cells: [number, string][] = [[2, 'Saksi Agensi QA'], [3, '900101015555'], [4, 'Penolong Pegawai']];
  for (const [td, v] of cells) {
    const f = page.locator(`xpath=//tbody[contains(@id,"AgWitnessTable_data")]//tr[1]/td[${td}]//input`).first();
    if (!(await f.inputValue()).trim()) {
      await f.fill(v);
      await f.blur();
      await pfIdle(page);
    }
  }
  log('agency witness filled');
  // supplier witness: ERR-100023 "At least one row should be in Supplier Witness section" (SIT 2026-11-28)
  const supRow = page.locator('tbody[id$="supplierWitnesTable_data"] > tr').first();
  if (!(await supRow.locator('input').count())) {
    await page.locator('xpath=(//tbody[contains(@id,"supplierWitnesTable_data")]/following::button[.//span[normalize-space()="Add"]])[1]').click();
    await pfIdle(page);
  }
  const supCells: [number, string][] = [[2, 'Saksi Pembekal QA'], [3, '900101016666'], [4, 'Pengurus']];
  for (const [td, v] of supCells) {
    const f = page.locator(`xpath=//tbody[contains(@id,"supplierWitnesTable_data")]//tr[1]/td[${td}]//input`).first();
    if (!(await f.inputValue()).trim()) {
      await f.fill(v);
      await f.blur();
      await pfIdle(page);
    }
  }
  log('supplier witness filled');
  // contract document, date signing, signing page, stamping page (KAT-042 dialogs upContractDocumentDlg / upAgrSignedPageDlg / upStampedPageDlg)
  await sideMenu(page, 'Supplemental Agreement Contract Document', /^final supplemental agreement contract document$/i);
  await dialogUpload(page, 'upContractDocumentDlg', DECISION_PDF, log, page.locator('xpath=//button[.//span[normalize-space()="Upload"]]').first());
  const dateId = await page.evaluate(() =>
    [...document.querySelectorAll('input[type=text]')].find((e) => (e as HTMLElement).offsetParent && !(e as HTMLInputElement).value && (e.nextElementSibling as HTMLElement | null)?.classList.contains('ui-datepicker-trigger'))?.id ?? '',
  );
  if (dateId) await pickToday(page, `[id="${dateId}"]`);
  // a saved draft shows the uploaded page instead of the upload button: upload only when the button is there
  for (const [label, dlg] of [['Signing Page', 'upAgrSignedPageDlg'], ['Stamping Page', 'upStampedPageDlg']] as const) {
    const btn = page.locator(`xpath=//label[normalize-space()="${label}"]/following::button[contains(@class,"ui-button-icon-only")][1]`).filter({ visible: true });
    if (await btn.count()) await dialogUpload(page, dlg, DECISION_PDF, log, btn.first());
    else log(`${label}: already uploaded (no upload button)`);
  }
  // No Save in this session: with a Save before or after choosing the approver, Submit was refused ERR-750010 and the
  // Selected Approver list came back empty (SIT 2026-11-28, four attempts). KAT-042 (agreement, same portlet) chooses the
  // approver and submits straight away; this step does the same.
  const saved = '';
  await sideMenu(page, 'Approver Settings', /Available Approver/i);
  // KAT-042: li.ui-picklist-item with the exact name, then the "Add" (title) button
  const selected = page.locator('ul.ui-picklist-target li.ui-picklist-item');
  // an approver shown from an earlier attempt is not known to the server (ERR-750010 on Submit, SIT 2026-11-28): the
  // server records the transfer event only, so empty the target and add the approver again
  if (await selected.count()) {
    await page.locator('button.ui-picklist-button-remove-all[title="Remove All"]').filter({ visible: true }).first().click();
    await pfIdle(page);
    await page.waitForTimeout(1000);
  }
  {
    const item = page.locator(`xpath=//ul[contains(@class,"ui-picklist-source")]/li[contains(@class,"ui-picklist-item") and normalize-space()="${approver}"]`).filter({ visible: true }).first();
    await item.click();
    await page.locator('button.ui-picklist-button-add[title="Add"]').filter({ visible: true }).first().click();
    await pfIdle(page);
    // the picklist moves items with a fade animation: wait for the target, else double-click the item (also moves it)
    const inTarget = selected.filter({ hasText: approver }).first();
    if (!(await inTarget.waitFor({ timeout: 5_000 }).then(() => true).catch(() => false))) {
      await item.dblclick().catch(() => {});
      await pfIdle(page);
      await inTarget.waitFor({ timeout: 5_000 }).catch(() => {});
    }
  }
  const chosen = await selected.allInnerTexts();
  log(`selected approver: ${chosen.join(', ')}`);
  if (!chosen.some((t) => t.includes(approver))) throw new Error(`approver ${approver} not in Selected Approver (nothing submitted)`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  log(`SA submit: ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && saStatus(ct) === 57750; i++) await page.waitForTimeout(5000);
  if (saStatus(ct) === 57750) throw new Error(`SA submit: still 57750 (${msgs.join(' | ') || 'no message'})`);
  return { messages: [saved, ...msgs, `${ct} SA ${saStatus(ct)}`].filter(Boolean).map(clean) };
}

/** CT-111 (Review AC/SA, Contract Approver): open the task → Approve → the SA leaves `fromStatus`. */
export async function approveSa(ctx: StageCtx, ct: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const from = saStatus(ct);
  await openTask(page, ctx.baseURL, ct, log);
  await page.locator('li.ui-tabmenuitem:visible').first().waitFor({ timeout: 60_000 });
  const msgs = await pressAndConfirm(page, 'Approve', log);
  log(`SA approve: ${msgs.join(' | ') || 'no message'}`);
  for (let i = 0; i < 24 && saStatus(ct) === from; i++) await page.waitForTimeout(5000);
  if (saStatus(ct) === from) throw new Error(`SA approve: still ${from} (${msgs.join(' | ') || 'no message'})`);
  return { messages: [...msgs, `${ct} SA ${saStatus(ct)}`].map(clean) };
}
