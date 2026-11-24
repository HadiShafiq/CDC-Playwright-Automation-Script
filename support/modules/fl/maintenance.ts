import type { Page } from '@playwright/test';
import { currentStatus } from '../../core/doc-status';
import { pageMessages, pfIdle, pressAndConfirm } from '../qt/pf';
import { openTask } from '../qt/tasklist';
import type { StageCtx } from '../qt/stages';

/**
 * FL-101..114 (Fulfilment Maintenance: DO / invoice update and cancel, and the FL Approver's approval) and FL-121/122
 * (payment match whose description makes the iGFMAS stub answer with a query / IDD failure). Ported from the fl-data
 * skill (FL fullfilment and PM.zip, scripts/steps.py: _maint_open, _maint, _maint_approve, payment_match, wait_status),
 * verified there on DEV. Eligibility (FulfilmentDocumentSO): DO update only at 42000; DO cancel at 42000, or 42005 when
 * its FRN is not with iGFMAS; invoice update/cancel at 44005 while the order waits for payment match / DAN approval.
 */
export type MaintKind = 'DO' | 'IN';
const LABEL: Record<MaintKind, { docType: string; ref: string }> = {
  DO: { docType: 'Delivery Order', ref: 'Delivery Order No. (Supplier)' },
  IN: { docType: 'Invoice', ref: 'Invoice No. (Supplier)' },
};

/** First input/textarea after a label with this exact text (fl-data `field`). */
const field = (page: Page, label: string, tag = 'input') =>
  page.locator(`xpath=(//label[normalize-space(.)='${label}'] | //*[normalize-space(text())='${label}'])/following::${tag}[not(@type='hidden')][1]`).first();

/** PrimeFaces selectOneMenu after a label: open it and click the option (fl-data `pf_choose`). */
async function choose(page: Page, label: string, option: string) {
  const menu = page.locator(`xpath=(//label[normalize-space(.)='${label}'] | //*[normalize-space(text())='${label}'])/following::div[contains(@class,'ui-selectonemenu')][1]`).first();
  for (let i = 0; i < 3; i++) {
    await menu.locator('.ui-selectonemenu-trigger').click();
    const item = page.locator(`li.ui-selectonemenu-item:visible[data-label="${option}"]`).first();
    await (await item.count() ? item : page.locator('li.ui-selectonemenu-item:visible', { hasText: option }).first()).click();
    await pfIdle(page);
    if ((await menu.locator('.ui-selectonemenu-label').innerText()).trim() === option) return;
  }
  throw new Error(`could not select "${option}" in "${label}"`);
}

const statusText = (kind: MaintKind, no: string) => {
  const s = currentStatus(kind, no);
  return s ? `${s.statusId} ${s.en}` : 'unknown';
};

/** As the supplier: Fulfilment Maintenance → the order's DO / invoice → Option → Update | Cancel. */
async function openMaintenance({ page, baseURL }: StageCtx, kind: MaintKind, docNo: string, contract: boolean, action: 'Update' | 'Cancel') {
  await page.goto(`${baseURL}/web/epapp/fullfillment`);
  await pfIdle(page);
  await page.getByRole('link', { name: 'Fulfilment Maintenance' }).locator('visible=true').first().click();
  await pfIdle(page);
  await choose(page, 'Transaction Type', contract ? 'P2 - Contract Order' : 'P1 - Purchase Order');
  await choose(page, 'Document Type', LABEL[kind].docType);
  await field(page, 'Document No.').fill(docNo);
  await page.getByRole('button', { name: 'Search', exact: true }).first().click();
  await pfIdle(page);
  const row = page.locator('tr', { hasText: docNo }).locator('visible=true').last();
  await row.waitFor({ timeout: 30_000 }).catch(() => {
    throw new Error(`${docNo} not found in Fulfilment Maintenance (status ${statusText(kind, docNo)})`);
  });
  await row.getByRole('button').last().click();
  const menu = page.locator('.ui-menuitem-link:visible');
  await menu.first().waitFor({ timeout: 10_000 }).catch(() => {});
  const offered = (await menu.allInnerTexts()).map((t) => t.trim());
  if (!offered.includes(action)) throw new Error(`"${action}" not offered for ${LABEL[kind].docType} ${docNo} (status ${statusText(kind, docNo)}); menu: ${offered.join(', ') || 'none'}`);
  await menu.filter({ hasText: action }).first().click();
  await pfIdle(page);
}

/** FL-101/103/111/113: supplier updates (new supplier reference) or cancels the DO / invoice. */
export async function maintain(ctx: StageCtx, kind: MaintKind, docNo: string, contract: boolean, action: 'Update' | 'Cancel') {
  const { page, log } = ctx;
  await openMaintenance(ctx, kind, docNo, contract, action);
  const notes: string[] = [];
  if (action === 'Update') {
    const box = field(page, LABEL[kind].ref);
    const old = await box.inputValue();
    const next = `${old}-M${Date.now() % 1000}`.slice(0, 40);
    await box.fill(next);
    notes.push(`${LABEL[kind].ref}: ${old} → ${next}`);
  }
  await page.locator('textarea:visible:not([readonly])').last().fill(`QA automation: ${action.toLowerCase()} ${kind} ${docNo}`);
  const msgs = await pressAndConfirm(page, action, log);
  const errors = await page.locator('.ui-messages-error:visible, .ui-message-error:visible').allInnerTexts();
  if (errors.length) throw new Error(`rejected: ${errors.join(' | ').slice(0, 300)}`);
  if (!msgs.some((m) => /success|submitted|updated|cancel|sent for approval/i.test(m))) throw new Error(`${action} not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: [...msgs, ...notes, `${docNo} now ${statusText(kind, docNo)}`] };
}

/** FL-102/104/112/114: the FL Approver approves the supplier's request from the task list. */
export async function approveMaintenance(ctx: StageCtx, kind: MaintKind, docNo: string) {
  const { page, baseURL, log } = ctx;
  await openTask(page, baseURL, docNo, log);
  for (const name of ['Approve', 'Acknowledge', 'Agree']) {
    if (await page.getByRole('button', { name, exact: true }).locator('visible=true').count()) {
      const msgs = await pressAndConfirm(page, name, log);
      if (!msgs.some((m) => /approved|acknowledged|success|cancelled/i.test(m))) throw new Error(`${name} not confirmed: ${msgs.join(' | ') || 'no message'}`);
      return { messages: [...msgs, `${docNo} now ${statusText(kind, docNo)}`] };
    }
  }
  const buttons = (await page.locator('button:visible').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  throw new Error(`no Approve/Acknowledge button on the ${docNo} task; buttons: ${buttons.join(', ')}`);
}

/**
 * FL-121/122: payment match whose Payment Description ends MM516FAIL (iGFMAS query → PA 46002) or MM506FAIL (IDD
 * failure → back to 46000). Returns the PA; the runner then waits for the PA's DB status (checkpoint.db.waitSec).
 */
export async function paymentMatchWith(ctx: StageCtx, orderNo: string, description: string) {
  const { page, baseURL, log } = ctx;
  await openTask(page, baseURL, orderNo, log);
  await page.locator("xpath=.//label[normalize-space(.)='Payment Description']/following::input[@type='text'][2]").first().fill(description);
  const msgs = await pressAndConfirm(page, 'Match', log);
  const body = (await page.locator('body').innerText()) + ' ' + msgs.join(' ') + ' ' + (await pageMessages(page)).join(' ');
  const pa = body.match(/Payment Advice (PA\d+) is successfully submitted/)?.[1];
  if (!pa) throw new Error(`Payment match not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { outputs: { PA: pa }, messages: [...msgs, `Payment Advice ${pa} (description "${description}")`] };
}
