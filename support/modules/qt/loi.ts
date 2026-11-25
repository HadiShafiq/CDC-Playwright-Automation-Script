import type { Page } from '@playwright/test';
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

/** QT-017: Prepare LOI → LOI Required = Yes → Prepare Letter Of Intent → fill the four tabs → Save → Submit. Returns the LI number. */
export async function prepareLoi(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const req = page.locator('select[id$="isLoiReq"]').first();
  if (await req.count()) {
    if ((await req.inputValue()) !== 'Y' && !/Yes/.test((await req.locator('option:checked').innerText().catch(() => '')) || '')) {
      await req.selectOption({ label: 'Yes' });
      await pfIdle(page);
    }
    await clickButton(page, 'Save');
    log(`LOI required = Yes; save: ${(await pageMessages(page)).join(' | ') || 'no message'}`);
  }
  await page.locator('a, button').filter({ hasText: /^\s*Prepare Letter Of Intent\s*$/ }).first().click();
  await pfIdle(page);
  await page.locator('[id$="contractSigner_input"]').waitFor({ state: 'attached', timeout: 30_000 });
  // Letter Of Intent tab: title, online verification Yes (the supplier must acknowledge: 62403), signer + designation
  const title = page.locator('textarea[id$=":title"]');
  if (!(await title.inputValue()).trim()) await title.fill(`Letter of Intent ${qt} (QA automation)`);
  await page.locator('xpath=//tr[.//*[contains(normalize-space(),"Required Online Verification")]]//label[normalize-space()="Yes"]').first().click().catch(() => {});
  await pfIdle(page);
  await fillRequired(page, log, 'Letter Of Intent');
  for (const tab of ['Zone / Item Details', 'Negotiation Terms', 'Verification And Approval']) {
    await openTab(page, tab);
    await pfIdle(page);
    await fillRequired(page, log, tab);
  }
  await clickButton(page, 'Save');
  const saved = (await pageMessages(page)).join(' | ');
  log(`LOI save: ${saved || 'no message'}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  const all = [saved, ...msgs].join(' | ');
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`LOI submit: ${msgs.join(' | ') || 'no message'}`);
  const li = all.match(/\bLI\d{15}\b/)?.[0] ?? loiOf(qt);
  return { messages: [...msgs, `LOI ${li || '(number not shown)'}`] };
}

/** The LOI numbers of a QT (SC_LOI → SC_LOI_LOA.DOC_ID = SC_QT.QT_ID), newest first. */
export function loiOf(qt: string): string {
  return sitQuery(`select l.loi_no from ngep_sit.sc_loi l join ngep_sit.sc_loi_loa x on x.loi_loa_id = l.loi_loa_id join ngep_sit.sc_qt q on q.qt_id = x.doc_id where q.qt_no = '${qt.replace(/'/g, '')}' order by l.created_date desc`)[0]?.[0] ?? '';
}

export const LOI_TEXT = clean;
