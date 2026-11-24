import type { Page } from '@playwright/test';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm, settledEval } from './pf';
import { SPEC } from './spec';
import type { StageCtx } from './stages';

/**
 * QT-010 / QT-011 helpers, ported from ngep-runner stages/supplier.mjs (60009 proposal) and lib/techsupport.mjs
 * (Admin > Technical Support > Quotation / Tender Search: Publish / Close without waiting for the real dates).
 */

// ---------- Technical Support ----------
async function searchQt(page: Page, baseURL: string, qt: string) {
  await page.goto(`${baseURL}/web/epapp/admin`);
  await pfIdle(page);
  await page.getByRole('link', { name: 'Quotation / Tender Search', exact: true }).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  await page.locator('xpath=//*[normalize-space()="Document No."]/following::input[@type="text"][1]').first().fill(qt);
  await page.getByRole('button', { name: 'Search', exact: true }).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  return settledEval(page, (qt: string) => {
    const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && /Procurement Title/.test(x.tHead?.innerText || ''));
    if (!t) return null;
    const i = [...t.tBodies[0].rows].findIndex((r) => (r.cells[0] as HTMLElement | undefined)?.innerText.trim() === qt);
    if (i < 0) return null;
    const c = [...t.tBodies[0].rows[i].cells].map((x) => (x as HTMLElement).innerText.trim());
    return { row: i, published: c[4], closing: c[5], status: c[6] };
  }, qt);
}

/** Run a Technical Support Option action (Publish, Close …) on a QT; returns before/after status and messages. */
export async function techAction({ page, baseURL, log }: StageCtx, qt: string, action: string) {
  const r = await searchQt(page, baseURL, qt);
  if (!r) throw new Error(`${qt} not found in Technical Support > Quotation / Tender Search`);
  await page.locator(`[id*=":searchQTs:${r.row}:"][id$="_button"]`).first().click();
  const item = page.locator('.ui-menu:visible a, [id$="_menu"]:visible a', { hasText: new RegExp(`^\\s*${action}\\s*$`) }).first();
  if (!(await item.count())) throw new Error(`"${action}" not offered for ${qt} at "${r.status}"`);
  await item.click();
  await pfIdle(page);
  const dlg = await settledEval(page, () => [...document.querySelectorAll('.ui-dialog')].find((d) => (d as HTMLElement).offsetWidth && d.getAttribute('aria-hidden') !== 'true')?.querySelector('button')?.innerText.trim() ?? null, undefined);
  let msgs = await pageMessages(page);
  if (dlg) msgs = await pressAndConfirm(page, dlg || 'Yes', log);
  const after = await searchQt(page, baseURL, qt);
  log(`technical support ${action}: ${r.status} → ${after?.status ?? '?'} ${msgs.join(' | ')}`);
  return { messages: [...msgs, `${qt} ${action}: ${r.status} → ${after?.status ?? '?'}`] };
}

// ---------- Supplier proposal ----------
async function openProposal(page: Page, baseURL: string, qt: string) {
  await page.goto(`${baseURL}/web/epapp/quotation-tender-proposal-preparation`);
  await pfIdle(page);
  const row = page.locator('tr', { hasText: qt }).first();
  await row.waitFor({ timeout: 15000 }).catch(() => {
    throw new Error(`${qt} is not on this supplier's proposal list`);
  });
  await row.locator('a').first().click({ force: true });
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
}

const rows = (page: Page) =>
  settledEval(page, () => {
    document.querySelectorAll('[data-pw-table]').forEach((e) => e.removeAttribute('data-pw-table'));
    const t = [...document.querySelectorAll('table')].filter((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && x.tBodies[0]?.querySelector('button') && !x.tBodies[0].querySelector('table')).pop();
    t?.setAttribute('data-pw-table', '1');
    return t
      ? [...t.tBodies[0].rows].map((r, i) => ({
          i,
          text: (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim(),
          prepare: [...r.querySelectorAll('button')].some((b) => (b as HTMLElement).innerText.trim() === 'Prepare'),
          upload: [...r.querySelectorAll('button')].some((b) => /^(ui-button)?$/.test((b as HTMLElement).innerText.trim()) && !(b as HTMLButtonElement).disabled && !b.classList.contains('ui-state-disabled')),
        }))
      : [];
  }, undefined);

async function openedForm(page: Page) {
  await page.getByRole('button', { name: '<< Back' }).waitFor();
  await pfIdle(page);
}

async function back(page: Page) {
  await clickButton(page, '<< Back').catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
}

async function backToProposal(page: Page) {
  if (!(await page.locator('li.ui-tabmenuitem').count()) && (await page.getByRole('button', { name: '<< Back' }).count())) await back(page);
}

async function uploadRow(page: Page, i: number) {
  await page.locator('table[data-pw-table="1"] > tbody > tr').nth(i).locator('button').last().click({ force: true });
  await pfIdle(page);
  const input = page.locator('.ui-dialog:not([aria-hidden="true"]) input[type=file]').first();
  await input.waitFor({ state: 'attached', timeout: 15000 });
  await input.setInputFiles(SPEC.schemaPdf);
  await page.locator('.ui-dialog:not([aria-hidden="true"]) table.files td.start button').first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  await page.waitForTimeout(500);
  const dlg = await settledEval(page, () => [...document.querySelectorAll('.ui-dialog')].find((d) => (d as HTMLElement).offsetWidth && d.getAttribute('aria-hidden') !== 'true')?.id ?? null, undefined);
  if (dlg) await clickButton(page, 'Close', { inDialog: dlg }).catch(() => {});
}

async function fillTechnical(page: Page) {
  await backToProposal(page);
  await openTab(page, 'Technical Proposal');
  const out: string[] = [];
  for (const r of await rows(page)) {
    if (/Completed|\.pdf/i.test(r.text)) continue;
    await rows(page);
    if (r.prepare) {
      await page.locator('table[data-pw-table="1"] > tbody > tr').nth(r.i).getByRole('button', { name: 'Prepare' }).click();
      await openedForm(page);
      // No. of Employees: Total Employees defaults to 0 and must be at least 1 (SIT)
      const employees = page.locator('input[id$=":totalEmployees"]:not([disabled])');
      if (await employees.count()) {
        await employees.first().fill('10');
        await employees.first().blur();
        await pfIdle(page);
      }
      const sels = await settledEval(page, () => [...document.querySelectorAll('select[id$=":answerCompliance"]')].map((s) => s.id), undefined);
      for (const id of sels) await pfSelect(page, id, 'Yes');
      const msgs = await pressAndConfirm(page, 'Complete');
      await back(page);
      out.push(`${r.text.slice(0, 30)}: ${msgs.join(' ')}`);
      await openTab(page, 'Technical Proposal');
    } else if (r.upload) {
      await uploadRow(page, r.i);
      out.push(`${r.text.slice(0, 30)}: uploaded`);
    }
  }
  return out;
}

async function fillFinancialForm(page: Page, unitPrices: string[], figure = '10000') {
  const boxes = page.locator('input[type=text]:visible:not([readonly]):not([disabled])');
  let item = 0;
  for (let k = 0; k < (await boxes.count()); k++) {
    const box = boxes.nth(k);
    if ((await box.inputValue()).trim()) continue;
    const id = (await box.getAttribute('id')) || '';
    if (!/:form:/.test(id) || /taskStatus|tempUser/.test(id)) continue;
    await box.click();
    const price = /ratePerUom/.test(id) ? (unitPrices[item++] ?? unitPrices.at(-1)) : undefined;
    await box.pressSequentially(price || figure);
    await box.press('Tab');
    await pfIdle(page);
  }
  const sels = await settledEval(page, () => [...document.querySelectorAll('select')].filter((x) => !x.disabled && [...x.options].some((op) => op.text.trim() === 'Yes') && /^- Select/.test(x.selectedOptions[0]?.text || '')).map((x) => x.id.replace(/_input$/, '')), undefined);
  for (const id of sels) await pfSelect(page, id, 'Yes');
  const hasComplete = await page.getByRole('button', { name: 'Complete', exact: true }).count();
  const msgs = await pressAndConfirm(page, hasComplete ? 'Complete' : 'Save');
  await back(page);
  return msgs;
}

async function fillFinancial(page: Page) {
  await backToProposal(page);
  await openTab(page, 'Financial Proposal');
  const out: string[] = [];
  // 5% under the indicative unit price (RM500), inside the ±10% band
  const unitPrices = SPEC.unitPrices.map((p) => String(Number(p) * 0.95));
  for (const r of (await rows(page)).filter((x) => x.prepare)) {
    await rows(page);
    await page.locator('table[data-pw-table="1"] > tbody > tr').nth(r.i).getByRole('button', { name: 'Prepare' }).click();
    await openedForm(page);
    out.push(`${r.text.slice(0, 30)}: ${(await fillFinancialForm(page, unitPrices)).join(' ') || 'done'}`);
    await openTab(page, 'Financial Proposal');
  }
  for (const r of (await rows(page)).filter((x) => x.upload && !x.prepare)) {
    try {
      await rows(page);
      await uploadRow(page, r.i);
      out.push(`${r.text.slice(0, 30)}: uploaded`);
    } catch {
      await page.keyboard.press('Escape');
      out.push(`${r.text.slice(0, 30)}: upload failed`);
    }
  }
  return out;
}

async function acknowledgeAndSubmit(page: Page, log: (m: string) => void) {
  await backToProposal(page);
  for (const tab of ['Declaration', 'Integrity Pact']) {
    await openTab(page, tab);
    const id = await settledEval(page, () => [...document.querySelectorAll('.ui-chkbox')].find((c) => (c as HTMLElement).offsetWidth && !c.closest('.ui-dialog') && !(c.querySelector('input') as HTMLInputElement).checked)?.id ?? null, undefined);
    if (id) {
      await page.locator(`[id="${id}"] .ui-chkbox-box`).click({ force: true });
      await pfIdle(page);
    }
  }
  return pressAndConfirm(page, 'Submit', log);
}

/** One supplier (already logged in) prepares and submits its proposal for the QT. */
export async function submitProposal({ page, baseURL, log }: StageCtx, qt: string): Promise<string[]> {
  await openProposal(page, baseURL, qt);
  log(`technical: ${(await fillTechnical(page)).join('; ')}`);
  log(`financial: ${(await fillFinancial(page)).join('; ')}`);
  const msgs = await acknowledgeAndSubmit(page, log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`Proposal submit: ${msgs.join(' | ') || 'no message'}`);
  return msgs;
}
