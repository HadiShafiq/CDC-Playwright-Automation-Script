import path from 'node:path';
import type { Page } from '@playwright/test';
import { openTasks } from '../../core/bpm-tasks';
import { currentStatus } from '../../core/doc-status';
import { sitQuery } from '../../core/sit-db';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm } from './pf';
import type { StageCtx } from './stages';
import { openTask } from './tasklist';

/*
 * Letter of Acceptance of a QT (LA, after the LOI is completed 62405). BPM: "Prepare LOA" (QT task, Desk Officer) →
 * "Prepare Letter Of Acceptance" → the LOA form (General Information, Letter Of Acceptance And Attachment, Zone / Item,
 * Payment Deduction, Bank Details, Fulfilment Schedule, Performance Bond, Verification And Approval, Approval).
 * Mapped on SIT 2026-11-25 with QT260000000004539; defaults kept: warranty No, bond No, approval No, agreement Yes.
 */

/** The newest LA of a QT (SC_LOA → SC_LOI_LOA.DOC_ID = SC_QT.QT_ID), or ''. */
export function loaOf(qt: string): string {
  return sitQuery(`select a.loa_no from ngep_sit.sc_loa a join ngep_sit.sc_loi_loa x on x.loi_loa_id = a.loi_loa_id join ngep_sit.sc_qt q on q.qt_id = x.doc_id where q.qt_no = '${qt.replace(/'/g, '')}' order by a.created_date desc`)[0]?.[0] ?? '';
}

async function pickDate(page: Page, input: string) {
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
}

const SIGNED_LOA_PDF = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'files', 'File_pdf_for_testing.pdf');

/**
 * Tab "Letter Of Acceptance And Attachment" (Submit: ERR-760441 "Surat Setuju Terima (Termasuk Lampiran A) is mandatory
 * to upload"): LOA Signing Date By Government, LOA Signer (search pop-up "Listing - User" → row → Select), designation,
 * and the signed Surat Setuju Terima on contents row 0 (upload button → "Choose Files" → start icon). SIT 2026-11-25.
 */
async function loaSignerAndLetter(page: Page, log: (m: string) => void) {
  await openTab(page, 'Letter Of Acceptance And Attachment');
  await pfIdle(page);
  await pickDate(page, 'input[id$="govSignDate_input"]');
  const signer = page.locator('input[id$="lovUser:lovUserlov"]').first();
  if (!(await signer.inputValue()).trim()) {
    await page.locator('[id$="lovUser:lovUserlovLink"]').click();
    await pfIdle(page).catch(() => {});
    const dlg = page.locator('.ui-dialog:visible').filter({ hasText: 'Listing - User' }).last();
    await dlg.waitFor({ timeout: 20_000 });
    const row = dlg.locator('tr[data-ri]').filter({ hasText: 'Aidid Bin Tajuddin' }).or(dlg.locator('tr[data-ri]').first()).first();
    await row.locator('td').first().click();
    await pfIdle(page).catch(() => {});
    await dlg.getByRole('button', { name: 'Select', exact: true }).click();
    await pfIdle(page);
  }
  const desig = page.locator('input[id$="loaSignerDesigId"]').first();
  if (!(await desig.inputValue()).trim()) await desig.fill('Pengarah');
  log(`LOA signer: ${await signer.inputValue()} (${await desig.inputValue()})`);
  const row0 = page.locator('tbody[id$="contentsTbl_data"] > tr[data-ri="0"]');
  if (!/\.pdf/i.test(await row0.innerText().catch(() => ''))) {
    await page.locator('[id$="0:scDocUploadBtn:scDocUploadBtnBtn"]').first().click();
    await pfIdle(page).catch(() => {});
    const up = page.locator('.ui-dialog:visible').filter({ has: page.locator('input[type=file]') }).last();
    await up.waitFor({ timeout: 20_000 });
    await up.locator('input[type=file]').setInputFiles(SIGNED_LOA_PDF);
    const start = up.locator('td.start button, button.start, .ui-fileupload-upload').or(up.locator('table.files button').first()).first();
    await start.waitFor({ timeout: 15_000 });
    await start.click();
    await pfIdle(page).catch(() => {});
    for (let i = 0; i < 30 && (await up.isVisible().catch(() => false)) && (await up.locator('td.start button').count()); i++) await page.waitForTimeout(500);
    await page.waitForTimeout(1500);
    if (await up.isVisible().catch(() => false)) await up.getByRole('button', { name: 'Close', exact: true }).click().catch(() => {});
    await pfIdle(page).catch(() => {});
    log(`Surat Setuju Terima uploaded: ${(await row0.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 80)}`);
  }
}

/** QT-021: Prepare LOA → Prepare Letter Of Acceptance → General Information (file reference, effective date) → Save → Submit. */
export async function prepareLoa(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const existing = loaOf(qt);
  if (existing) {
    // the first Save creates the LA and leaves the form ("Further action … through Task List"); reopen it from the
    // LOI / LOA list of the same Prepare LOA task (row button), never create a second LA (SIT 2026-11-25)
    log(`reopening the LOA draft ${existing}`);
    await page.locator('tr').filter({ hasText: existing }).locator('button').last().click();
  } else {
    await page.getByRole('button', { name: 'Prepare Letter Of Acceptance' }).first().click();
  }
  await pfIdle(page);
  await page.locator('[id$="fileExtNo"]').first().waitFor({ timeout: 30_000 });
  const ref = page.locator('input[id$="fileExtNo"]').first();
  if (!(await ref.inputValue()).trim()) await ref.fill(`QA/AUTO/${qt.slice(-6)}`);
  await pickDate(page, 'input[id$="effdate_input"]');
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`LOA save: ${saved || 'no message'}`);
  if (/mandatory|ERR-/i.test(saved) && !/success/i.test(saved)) throw new Error(`LOA save refused: ${saved}`);
  if (!existing) {
    // a brand-new LA leaves the form after its first Save: come back to it through the task
    await openTask(page, ctx.baseURL, qt, log);
    await page.locator('tr').filter({ hasText: loaOf(qt) }).locator('button').last().click();
    await pfIdle(page);
  }
  await loaSignerAndLetter(page, log);
  await clickButton(page, 'Save');
  log(`LOA save (signer + letter): ${(await pageMessages(page)).join(' | ') || 'no message'}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`LOA submit: ${msgs.join(' | ') || 'no message'}`);
  return { messages: [...msgs, `LOA ${loaOf(qt) || '(number not found)'}`] };
}

/**
 * QT-022: the supplier's company admin accepts the LOA (BPM "Accept LOA", e.g. firstallied123 for FIRST ALLIED; the
 * task names only that login, SIT shared default password, as ngep-runner's loa-run did) → 62505. SIT 2026-11-25.
 */
export async function acceptLoa(ctx: StageCtx & { as: (u: string) => Promise<void> }, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const la = loaOf(qt);
  if (!la) throw new Error(`${qt} has no LOA`);
  let task = openTasks(la, 'Accept LOA')[0];
  for (let i = 0; !task && i < 12; i++) {
    await page.waitForTimeout(10_000);
    task = openTasks(la, 'Accept LOA')[0];
  }
  const user = task?.claimedBy || task?.assignees[0];
  if (!user) throw new Error(`no open "Accept LOA" task with a user for ${la}`);
  log(`Accept LOA ${la} -> ${user}`);
  await ctx.as(user);
  await openTask(page, ctx.baseURL, la, log);
  const buttons = (await page.locator('button:visible').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  log(`Accept LOA form: ${await page.title()} | buttons: ${buttons.join(', ')}`);
  if (!buttons.includes('Accept')) throw new Error(`No Accept button on ${la} (nothing pressed). Buttons: ${buttons.join(' | ')}`);
  // items without an item code block Accept (ERR-760436); then the supplier's documents (as ngep-runner acceptLoa)
  await assignItemCodes(page, log);
  await loaMenu(page, 'Letter Of Acceptance And Attachment');
  for (const doc of ['Perakuan Penerimaan', 'Lampiran 7', 'Lampiran C']) log(`${doc}: ${await uploadRow(page, doc)}`);
  await loaMenu(page, 'General Information');
  // "LOA Signing Date By Supplier is required" (ERR-760400): every empty date picker on the form gets today or later
  const dates = await page.evaluate(() => [...document.querySelectorAll('input.hasDatepicker, input[id$="_input"]')].filter((e) => (e as HTMLElement).offsetParent && !(e as HTMLInputElement).value && !(e as HTMLInputElement).disabled && (e.nextElementSibling as HTMLElement | null)?.classList.contains('ui-datepicker-trigger')).map((e) => e.id));
  for (const id of dates) await pickDate(page, `[id="${id}"]`);
  log(`supplier dates filled: ${dates.length}`);
  // Bank Details (ERR-760400 "Account No. is required"), Supplier Signer and Supplier Witness Details (SIT 2026-11-25)
  for (const end of ['accountNoId', 'supplierContractSigner']) {
    const m = await page.evaluate((e) => {
      const s = document.querySelector(`select[id$="${e}_input"]`) as HTMLSelectElement | null;
      if (!s || !/Select One/i.test(s.selectedOptions[0]?.text ?? '')) return null;
      return { id: s.id.replace(/_input$/, ''), opt: [...s.options].find((o) => o.value && !/Select One/i.test(o.text))?.text.trim() ?? '' };
    }, end);
    if (m?.opt) {
      await pfSelect(page, m.id, m.opt);
      await pfIdle(page);
      log(`${end}: ${m.opt}`);
    }
  }
  const witness: [string, string][] = [['witnessName', 'Saksi Ujian QA'], ['identificationNo', '900101015555'], ['designation', 'Pengurus'], ['address', 'Aras 1, Kompleks Ujian QA, 81300 Johor'], ['phoneNo', '0379857777'], ['faxNo', '0379857888'], ['mobileNo', '0123456789'], ['email', 'qa.automation@example.com']];
  for (const [end, value] of witness) {
    const f = page.locator(`[id$="form:${end}"]`).first();
    if ((await f.count()) && (await f.isEditable()) && !(await f.inputValue()).trim()) await f.fill(value);
  }
  await page.evaluate(() => {
    for (const t of document.querySelectorAll('textarea')) {
      const ta = t as HTMLTextAreaElement;
      if (ta.offsetWidth && !ta.readOnly && !ta.disabled && !ta.value && !ta.closest('.ui-dialog')) { ta.value = 'Accepted (QA automation)'; ta.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });
  const msgs = await pressAndConfirm(page, 'Accept', log);
  if (!msgs.some((m) => /success|accepted|acknowledg/i.test(m))) throw new Error(`Accept LOA not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: [...msgs, `${la} at ${await waitLa(page, la, 62505)}`] };
}

// ---- ported from ngep-runner stages/directloa.mjs (assignItemCodes, uploadRow, verifyLoa; SIT-proven there) ----

async function loaMenu(page: Page, label: string) {
  await page.getByText(label, { exact: true }).first().click({ timeout: 15_000 });
  await pfIdle(page);
  await page.waitForTimeout(1000);
}

/** Attach the test PDF on the document-table row whose title contains `title` (rows with an upload button only). */
async function uploadRow(page: Page, title: string): Promise<string> {
  const row = page.locator('tbody tr:visible', { hasText: title, has: page.locator('[id*="Upload"]') }).last();
  const attach = row.locator('[id*="Upload"]').locator('xpath=descendant-or-self::*[self::button or self::a]').first();
  if (!(await attach.count())) return 'no upload button';
  const input = page.locator('.ui-dialog:not([aria-hidden="true"]) input[type=file]').first();
  let fresh = false;
  for (let i = 0; i < 3 && !fresh; i++) {
    await page.locator('.ui-dialog:visible').first().waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
    await attach.click();
    await pfIdle(page);
    fresh = await input.waitFor({ state: 'attached', timeout: 10_000 }).then(() => true, () => false);
    if (!fresh) { await page.keyboard.press('Escape'); await page.waitForTimeout(2000); }
  }
  if (fresh) {
    await input.setInputFiles(SIGNED_LOA_PDF);
    await page.locator('.ui-dialog:not([aria-hidden="true"]) table.files td.start button').first().click();
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  await page.waitForTimeout(2000);
  const open = await page.evaluate(() => [...document.querySelectorAll('.ui-dialog')].find((d) => (d as HTMLElement).offsetWidth && d.getAttribute('aria-hidden') !== 'true' && d.querySelector('input[type=file]'))?.id);
  if (open) await page.locator(`[id="${open}"]`).getByRole('button', { name: 'Close', exact: true }).click().catch(() => {});
  return fresh ? 'uploaded' : 'already attached';
}

/** Supplier: give every unassigned product item a catalogue code (ERR-760436/760445 on Accept otherwise). */
async function assignItemCodes(page: Page, log: (m: string) => void, unspsc = process.env.LOA_UNSPSC || '44121703'): Promise<string[]> {
  const done: string[] = [];
  await loaMenu(page, 'Zone / Item Details');
  const items = await page.locator('button:visible', { hasText: /^\s*Assign\s*$/ }).count();
  for (let n = 0; n < items; n++) {
    await page.locator('button:visible', { hasText: /^\s*Assign\s*$/ }).nth(n).click();
    await pfIdle(page);
    await page.locator('xpath=//td[normalize-space()="Item Code"]/following::input[@type="text"][1]').first().fill(unspsc);
    await page.locator('button:visible', { hasText: /^\s*Search\s*$/ }).first().click();
    await pfIdle(page);
    await page.locator('tbody tr:visible a', { hasText: unspsc }).first().click();
    await pfIdle(page);
    const menus = await page.evaluate(() => [...document.querySelectorAll('select')].filter((s) => (s.closest('.ui-selectonemenu') as HTMLElement | null)?.offsetWidth)
      .map((s) => ({ id: s.id.replace(/_input$/, ''), opt: [...s.options].map((o) => o.text.trim()).find((o) => o && !/select one/i.test(o)) })));
    for (let k = 0; k <= menus.length; k++) {
      await page.locator('button:visible', { hasText: /^\s*Search\s*$/ }).first().click();
      await pfIdle(page);
      if (await page.locator('tbody tr:visible .ui-radiobutton-box').count()) break;
      if (k === menus.length) throw new Error(`No extension for UNSPSC ${unspsc}`);
      if (menus[k].opt) await pfSelect(page, menus[k].id, menus[k].opt!);
    }
    await page.locator('tbody tr:visible .ui-radiobutton-box').first().click();
    await pfIdle(page);
    await page.locator('button:visible', { hasText: 'Assign Code' }).first().click();
    const dlg = page.locator('.ui-dialog:visible', { hasText: /assign this item code|this code assignment/ }).first();
    await dlg.waitFor({ state: 'visible', timeout: 30_000 });
    done.push((await dlg.innerText()).match(/\d{18}.*/)?.[0] || '?');
    await dlg.locator('button:visible', { hasText: 'Yes' }).first().click();
    await pfIdle(page);
    await page.waitForTimeout(1500);
    const msgs = await pageMessages(page);
    if (msgs.some((m) => /ERR-/.test(m))) throw new Error(`Assign Code: ${msgs.join(' | ')}`);
    if (!(await page.locator('.ui-menuitem-text:visible', { hasText: 'Zone / Item Details' }).count())) {
      await page.locator('button:visible', { hasText: '<< Back' }).first().click();
      await pfIdle(page);
    }
    await loaMenu(page, 'Zone / Item Details');
  }
  log(`item codes assigned: ${done.length ? done.join('; ') : 'none needed'}`);
  return done;
}

/** QT-023: Desk Officer verifies the accepted LOA ("Download All And Print" enables Verify) → 62506. */
export async function verifyLoa(ctx: StageCtx & { as: (u: string) => Promise<void> }, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const la = loaOf(qt);
  if (!la) throw new Error(`${qt} has no LOA`);
  let task = openTasks(la)[0];
  for (let i = 0; !task && i < 12; i++) {
    await page.waitForTimeout(10_000);
    task = openTasks(la)[0];
  }
  const user = task?.claimedBy || task?.assignees[0];
  if (!user) throw new Error(`no open task with a user for ${la}`);
  log(`${task!.activity} ${la} -> ${user}`);
  await ctx.as(user);
  await openTask(page, ctx.baseURL, la, log);
  await loaMenu(page, 'Letter Of Acceptance And Attachment');
  page.once('download', (d) => d.cancel().catch(() => {}));
  await clickButton(page, 'Download All And Print');
  await page.waitForTimeout(3000);
  await pfIdle(page);
  await loaMenu(page, 'Verification And Approval');
  await page.evaluate((remark) => {
    for (const t of document.querySelectorAll('textarea')) {
      const ta = t as HTMLTextAreaElement;
      if (ta.offsetWidth && !ta.readOnly && !ta.disabled && !ta.value && !ta.closest('.ui-dialog')) { ta.value = remark; ta.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  }, 'Verified (QA automation)');
  const msgs = await pressAndConfirm(page, 'Verify', log);
  if (!msgs.some((m) => /success|verified|completed/i.test(m))) throw new Error(`Verify LOA not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: [...msgs, `${la} at ${await waitLa(page, la, 62506)}`] };
}

/** SIT writes the LA status up to ~2 min after the message (62506 at 12:00:17 for a 11:58 Verify, 2026-11-25): wait up to 4 min. */
async function waitLa(page: Page, la: string, statusId: number): Promise<number | undefined> {
  let st = currentStatus('LA', la)?.statusId;
  for (let i = 0; i < 24 && st !== statusId; i++) {
    await page.waitForTimeout(10_000);
    st = currentStatus('LA', la)?.statusId;
  }
  return st;
}
