import type { Page } from '@playwright/test';
import { sitQuery } from '../../core/sit-db';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm, settledEval } from './pf';
import { addCategory, addCommitteeMember, QT_SIT, selectApprover, type StageCtx } from './stages';
import { openTask } from './tasklist';

/**
 * QT-007 (60004 → 60030 BPK / 60005): desk officer prepares the documents for publishing and submits.
 * QT-008 (60030 → 60005): BPK approver claims, decides Approve per row, submits.
 * Ported from ngep-runner stages/docprep.mjs and stages/bpk.mjs.
 */
const ROLES = [/^Chair/i, /^Secret/i, /^Member/i, /^Member/i];

async function setPublishDate(page: Page, inDays = 1) {
  await openTab(page, 'Publishing Detail');
  const input = page.locator('[id$=":noticePublish_input"]');
  if ((await input.inputValue()).trim()) return `publish date already ${await input.inputValue()}`;
  const target = new Date(Date.now() + inDays * 86400000);
  await input.locator('xpath=following-sibling::button[contains(@class, "ui-datepicker-trigger")]').click();
  const picker = page.locator('#ui-datepicker-div');
  await picker.waitFor({ state: 'visible' });
  for (let i = 0; i < 12; i++) {
    const [mon, yr] = (await picker.locator('.ui-datepicker-title').innerText()).trim().split(/\s+/);
    const shown = new Date(`${mon} 1, ${yr}`);
    if (shown.getFullYear() === target.getFullYear() && shown.getMonth() === target.getMonth()) break;
    await picker.locator('.ui-datepicker-next').click();
  }
  const days = picker.locator('td:not(.ui-datepicker-other-month):not(.ui-datepicker-unselectable):not(.ui-state-disabled) a');
  let picked = false;
  for (let i = 0; i < (await days.count()); i++) {
    if (Number((await days.nth(i).innerText()).trim()) >= target.getDate()) {
      await days.nth(i).click();
      picked = true;
      break;
    }
  }
  if (!picked) throw new Error(`No selectable publish date on or after ${target.toDateString()}`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  return `publish ${await input.inputValue()}, closing ${await page.locator('[id$=":closingDate"]').inputValue()} ${await page.locator('[id$=":closingTime"]').inputValue()}`;
}

async function setProposalValidity(page: Page, days: string) {
  await openTab(page, 'Quotation / Tender Details');
  const box = page.locator('[id$=":proposalvalidity"]');
  if (!(await box.count())) throw new Error('Proposal Validity field not found');
  if ((await box.inputValue()).replace(/_/g, '').trim()) return `validity already ${await box.inputValue()}`;
  const enter = async (v: string) => {
    await box.click();
    await box.fill('');
    await box.pressSequentially(v, { delay: 60 });
    await box.blur();
    await page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(page);
  };
  await enter(days);
  const msgs = await pageMessages(page);
  const max = msgs.join(' ').match(/ERR-760044[^\d]*?(\d+)|(\d+)[^\d]*ERR-760044/);
  if (max) await enter(max[1] || max[2]); // capped by rule QTPVD: use the stated maximum
  return `validity ${(await box.inputValue()).replace(/_/g, '')} days`;
}

async function setQualificationScope(page: Page, categoryCode: string, openFor = 'All', localityCoverage = 'State') {
  await openTab(page, 'Supplier Qualification Criteria');
  const out: string[] = [];
  const codes = () =>
    page.evaluate(() => {
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Category Code/.test(x.tHead?.innerText || ''));
      return t ? [...t.tBodies[0].rows].map((r) => (r.cells[1] as HTMLElement | undefined)?.innerText.trim() ?? '').filter((c) => /^\d{6}$/.test(c)) : [];
    });
  if (!(await codes()).includes(categoryCode)) {
    await addCategory(page, categoryCode);
    out.push(`category ${categoryCode} added`);
  }
  const others = (await codes()).filter((c) => c !== categoryCode);
  if (others.length) {
    const table = page.locator('xpath=//table[thead//*[normalize-space()="Category Code"]]').first();
    for (const c of others) {
      await table.locator('tbody tr', { hasText: c }).first().locator('.ui-chkbox-box').first().click({ force: true });
      await pfIdle(page);
    }
    await page.evaluate(() => {
      document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Category Code/.test(x.tHead?.innerText || ''))!;
      [...document.querySelectorAll('button')].find((x) => (x as HTMLElement).offsetWidth && (x as HTMLElement).innerText.trim() === 'Delete' && !(x as HTMLButtonElement).disabled && t.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING)?.setAttribute('data-pw-target', '1');
    });
    await page.locator('[data-pw-target="1"]').click();
    await pfIdle(page);
    await page.locator('.ui-dialog:not([aria-hidden="true"]) button', { hasText: /^\s*Yes\s*$/ }).first().click();
    await pfIdle(page);
    out.push(`removed ${others.join(', ')}`);
  }
  const checked = await page.evaluate(() => [...document.querySelectorAll('input[type=radio]')].filter((r) => (r as HTMLInputElement).checked && /Open For/.test((r.closest('tr') as HTMLElement | null)?.innerText || '')).map((r) => (r.closest('td') as HTMLElement | null)?.innerText.trim() || '')[0] || '');
  if (!checked.includes(openFor)) {
    await page.locator(`xpath=//tr[.//*[contains(normalize-space(), "Open For")]]//label[normalize-space()="${openFor}"]`).first().click();
    await pfIdle(page);
    await page.waitForTimeout(800);
    const warn = await page.evaluate(() => {
      const d = document.querySelector('[id$=":doEditdlg"]') as HTMLElement | null;
      return d && d.offsetWidth && d.getAttribute('aria-hidden') !== 'true' ? d.id : null;
    });
    if (warn) await clickButton(page, 'Yes', { inDialog: warn });
    out.push(`open for ${openFor}`);
  }
  const loc = await page.evaluate(() => {
    const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && /Location/.test(x.tHead?.innerText || ''));
    return !!t && !/No records found/.test((t.tBodies[0] as HTMLElement).innerText);
  });
  const hasLocality = await page.locator('[id$=":locLevels_input"]').count();
  if (!loc && hasLocality) {
    const id = await page.evaluate(() => (document.querySelector('[id$=":locLevels_input"]') as HTMLElement).id.replace(/_input$/, ''));
    await pfSelect(page, id, localityCoverage);
    await page.evaluate(() => {
      document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && /Location/.test(x.tHead?.innerText || ''))!;
      [...document.querySelectorAll('button')].find((x) => (x as HTMLElement).offsetWidth && (x as HTMLElement).innerText.trim() === 'Add' && t.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING)!.setAttribute('data-pw-target', '1');
    });
    await page.locator('[data-pw-target="1"]').click();
    await pfIdle(page);
    const dlg = await page.evaluate(() => (document.querySelector('[id$=":popupCheckAll_input"]') as HTMLElement).closest('.ui-dialog')!.id);
    await page.locator(`[id="${dlg}"] [id$=":popupCheckAll"] .ui-chkbox-box`).click({ force: true });
    await pfIdle(page);
    await clickButton(page, 'OK', { inDialog: dlg });
    out.push(`locality ${localityCoverage}, all locations`);
  } else if (!loc) out.push('no locality coverage on this QT');
  await clickButton(page, 'Save');
  await page.waitForTimeout(1000);
  out.push(`save: ${(await pageMessages(page)).join(' ')}`);
  return out.join(', ');
}

async function ensureContactPerson(page: Page) {
  await openTab(page, 'Publishing Detail');
  const rows = await page.evaluate(() => {
    const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && /Telephone No/.test(x.tHead?.innerText || ''));
    return t ? [...t.tBodies[0].rows].map((r) => [...r.querySelectorAll('input[type=text]')].map((i) => (i as HTMLInputElement).value).join('|')) : [];
  });
  if (rows.some((r) => r.split('|')[0].trim())) return 'contact person present';
  await page.evaluate(() => {
    document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
    const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && /Telephone No/.test(x.tHead?.innerText || ''));
    if (!t) return;
    [...document.querySelectorAll('button')].find((x) => (x as HTMLElement).offsetWidth && (x as HTMLElement).innerText.trim() === 'Add' && t.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING)?.setAttribute('data-pw-target', '1');
  });
  if (await page.locator('[data-pw-target="1"]').count()) {
    await page.locator('[data-pw-target="1"]').click();
    await pfIdle(page);
  }
  return 'contact person row added';
}

export async function prepareDocuments(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const tier = sitQuery(`select evaluation_type from ngep_sit.sc_qt where qt_no = '${qt}'`)[0]?.[0];
  await openTask(page, ctx.baseURL, qt, log);
  await openTab(page, 'Committee Appointment');
  const labels = await page.evaluate(() => [...document.querySelectorAll('li.ui-tabmenuitem')].filter((li) => (li as HTMLElement).offsetWidth).map((li) => (li as HTMLElement).innerText.trim()));
  const find = (re: RegExp) => {
    const hit = labels.find((l) => re.test(l) && /Committee/i.test(l));
    if (!hit) throw new Error(`No committee tab matching ${re}; tabs shown: ${labels.join(' | ')}`);
    return hit;
  };
  const tabs: [string, string][] = String(tier) === '2' ? [[find(/Opening/i), 'OC'], [find(/Technical/i), 'TEC'], [find(/Financial/i), 'FEC']] : [['Evaluation Committee', 'EC']];
  for (const [tab, key] of tabs) for (const [i, ic] of QT_SIT.committees[key].entries()) log(`${tab}: ${await addCommitteeMember(page, ic, ROLES[i], tab)}`);
  log(`publication approver: ${await selectApprover(page, QT_SIT.publicationApprover, 'Publication Approval')}`);
  log(`validity: ${await setProposalValidity(page, '90')}`);
  log(`scope: ${await setQualificationScope(page, QT_SIT.categoryCode)}`);
  log(`schedule: ${await setPublishDate(page, 1)}`);
  log(`contact: ${await ensureContactPerson(page)}`);
  await clickButton(page, 'Save');
  await page.waitForTimeout(1000);
  log(`save: ${(await pageMessages(page)).join(' | ')}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`Document submit not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: msgs };
}

export async function bpkApprove(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const claim = page.getByRole('button', { name: 'Claim', exact: true });
  await claim.or(page.getByRole('button', { name: 'Submit', exact: true })).first().waitFor({ timeout: 30000 });
  if (await claim.isVisible()) {
    await claim.click();
    await page.getByRole('button', { name: 'Submit', exact: true }).waitFor({ timeout: 30000 });
    await page.waitForTimeout(3000);
    await pfIdle(page);
  }
  const sels = await settledEval(page, () => [...document.querySelectorAll('select')].filter((s) => /Decision/.test((s.closest('table') as HTMLTableElement | null)?.tHead?.innerText || '')).map((s) => ({ id: s.id.replace(/_input$/, ''), opts: [...s.options].map((o) => o.text.trim()) })), undefined);
  for (const s of sels) {
    const opt = s.opts.find((o) => /^Approve/i.test(o));
    if (!opt) throw new Error(`No Approve decision offered: ${s.opts.join(' | ')}`);
    await pfSelect(page, s.id, opt);
  }
  await page.waitForTimeout(2000);
  await settledEval(page, (r: string) => document.querySelectorAll('textarea').forEach((t) => {
    if ((t as HTMLElement).offsetWidth && !t.disabled && !t.value) {
      t.value = r;
      t.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }), 'Approved (QA automation)');
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|approved|submitted/i.test(m))) throw new Error(`BPK submit: ${msgs.join(' | ') || 'no message'}`);
  return { messages: msgs };
}
