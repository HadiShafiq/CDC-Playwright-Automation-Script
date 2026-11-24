import type { Page } from '@playwright/test';
import { sitQuery } from '../../core/sit-db';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm } from './pf';
import { openTask } from './tasklist';

/**
 * QT stages ported from ngep-runner (QT_Tender-DirectLOA.zip stages/create.mjs, submit.mjs, approve.mjs).
 * SIT people: ngep-runner lib/targets.mjs SIT presets (QA's users on SIT QT260000000004253, read from SIT's SC_ACTOR /
 * WFTASK by the colleague); all log in with the shared SIT officer password (`*` row of .auth/credentials.xlsx).
 */
export const QT_SIT = {
  users: {
    DESK_OFFICER: '881204115188',
    COMMITTEE_APPROVER: '580401035583',
    PUBLICATION_APPROVER: '580401035583',
    SC_CHAIR: '711105085487',
    SC_SECRETARY: '810626015517',
    SC_MEMBER1: '770614135921',
    SC_MEMBER2: '770614135925',
    BPK_APPROVER: '800912129080',
    OC_CHAIR: '780513015364',
    OC_SECRETARY: '840404085154',
    TEC_CHAIR: '661027035165',
    FEC_CHAIR: '740217035890',
    TECH_SUPPORT: '830830112233', // ngep-runner TECH_SUPPORT_USER; active on SIT (PM_USER 435491)
  } as Record<string, string>,
  // suppliers with the QT's category code on SIT (ngep-runner SUPPLIER1/2); passwords in .auth/credentials.xlsx
  suppliers: ['firstallied1234', 'mahmood84'],
  // Specification Committee (QT_COMMITTEE): chair, secretary, member, member
  committee: [
    { ic: '711105085487', role: /^Chair/i },
    { ic: '810626015517', role: /^Secret/i },
    { ic: '770614135921', role: /^Member/i },
    { ic: '770614135925', role: /^Member/i },
  ],
  approver: 'Hashmuddin', // Committee Appointment Approver offered on SIT (QT_APPROVER)
  publicationApprover: 'Hashmuddin', // QT_PUBLICATION_APPROVER on SIT
  // SIT QT260000000004253's committees (SC_ACTOR / WFTASK): chair, secretary, member, member
  committees: {
    OC: ['780513015364', '840404085154', '770614135921', '840506145824'],
    TEC: ['661027035165', '840202015713', '760901017398', '770614135921'],
    FEC: ['740217035890', '780517025690', '770714025664', '770714025666'],
    EC: ['780513015364', '840404085154', '840506145824', '760901017398'],
  } as Record<string, string[]>,
  contractType: 'Ministry',
  procCategory: 'Security',
  fulfilment: 'Periodic (Schedule)',
  procTypeCategory: 'Supply of Goods',
  categoryCode: '220801', // Kawalan Keselamatan
  price: '100000', // quotation range (≤ RM500,000)
  tier: 2, // SIT QT260000000004342 ran 2 Tier
};

export interface StageCtx {
  page: Page;
  baseURL: string;
  log: (m: string) => void;
}

const nsOf = (page: Page) =>
  page.evaluate(() => (document.querySelector('[id$=":form:title1"]') as HTMLElement).id.replace('title1', ''));
const clickId = (page: Page, id: string) => page.evaluate((x) => (document.getElementById(x) as HTMLElement).click(), id);

/** QT-001 (60002): desk officer fills the Quotation/Tender Details tab and saves the draft; returns the QT number. */
export async function createDraft({ page, baseURL, log }: StageCtx, title: string): Promise<{ QT: string; messages: string[] }> {
  const o = QT_SIT;
  await page.goto(`${baseURL}/web/epapp/create-quotation-tender`);
  await pfIdle(page);
  const NS = await nsOf(page);
  await clickId(page, `${NS}panelTitle:1`); // Central Panel Contract Item = No
  await pfIdle(page);
  await page.locator(`[id="${NS}title1"]`).fill(title);
  await page.locator(`[id="${NS}fileno"]`).fill(`TEST/QA/${Date.now()}`);
  await page.locator(`[id="${NS}expIntendedPrice"]`).fill(o.price);
  await page.locator(`[id="${NS}expIntendedPrice"]`).blur();
  await pfIdle(page);
  await pfSelect(page, `${NS}qtmaintainprocTypeBoCategory`, o.procTypeCategory);
  await pfSelect(page, `${NS}procCategory`, o.procCategory);
  await clickId(page, `${NS}evalType:${o.tier === 2 ? 1 : 0}`); // 1 Tier / 2 Tier
  await pfIdle(page);
  await pfSelect(page, `${NS}contractType`, o.contractType);
  await pfSelect(page, `${NS}fulfilId`, o.fulfilment);
  const just = await page.evaluate(() => {
    const label = [...document.querySelectorAll('label, td, span')].find((e) => (e as HTMLElement).offsetWidth && /Procurement Justification/i.test(e.textContent ?? '') && (e.textContent ?? '').length < 200);
    let box = label as HTMLElement | null | undefined;
    while (box && !box.querySelector('textarea')) box = box.parentElement;
    const ta = box && [...box.querySelectorAll('textarea')].find((t) => (t as HTMLElement).offsetWidth && !(t as HTMLTextAreaElement).disabled && !(t as HTMLTextAreaElement).readOnly && !(t as HTMLTextAreaElement).value.trim());
    return ta ? ta.id : null;
  });
  if (just) {
    await page.locator(`[id="${just}"]`).fill('QA automation test data (justification)');
    await page.locator(`[id="${just}"]`).blur();
    await pfIdle(page);
  }
  await pfIdle(page);
  await page.waitForTimeout(1500);
  await page.locator('button:visible', { hasText: /^\s*Save\s*$/ }).first().click();
  await pfIdle(page);
  await page.waitForTimeout(2000);
  const msgs = await pageMessages(page);
  let qt = msgs.join(' ').match(/\bQT\d{12,}\b/)?.[0];
  for (let i = 0; i < 24 && !qt; i++) {
    // the save can land without a message (AJAX re-render): the title is unique, so read it from the DB
    qt = sitQuery(`select max(qt_no) from ngep_sit.sc_qt where qt_title = '${title.replace(/'/g, "''")}'`)[0]?.[0] || undefined;
    if (!qt) await page.waitForTimeout(10_000);
  }
  if (!qt) throw new Error(`Save did not report a QT number: ${msgs.join(' | ') || 'no message'}`);
  log(`QT draft saved: ${qt}`);
  return { QT: qt, messages: [...msgs, `QT draft ${qt} saved`] };
}

const committeeText = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('table')]
      .filter((t) => (t as HTMLElement).offsetWidth && !t.closest('.ui-dialog') && /Identification No/.test(t.tHead?.innerText || ''))
      .map((t) => (t as HTMLElement).innerText)
      .join(' '),
  );

export async function addCategory(page: Page, code: string, tab = 'Supplier Qualification Criteria') {
  await openTab(page, tab);
  const already = await page.locator('table', { hasText: 'Category Code' }).first().innerText().catch(() => '');
  if (already.includes(code)) return 'already present';
  await clickButton(page, 'Add');
  const dlgId = await page.evaluate(() => (document.querySelector('[id$=":catCodePopup"]') as HTMLElement).id);
  const base = dlgId.replace(':catCodePopup', '');
  for (const [lvl, part] of [[1, code.slice(0, 2)], [2, code.slice(2, 4)], [3, code.slice(4, 6)]] as const) {
    const id = `${base}:catCodeLvl${lvl}`;
    const label = await page.evaluate(({ id, part }) => [...((document.getElementById(`${id}_input`) || document.getElementById(id)) as HTMLSelectElement).options].map((o) => o.text.trim()).find((t) => t.startsWith(`${part} `)), { id, part });
    if (!label) throw new Error(`No option starting "${part}" in ${id}`);
    await pfSelect(page, id, label);
  }
  await clickButton(page, 'OK', { inDialog: dlgId });
  return (await pageMessages(page)).join(' | ') || 'added';
}

export async function addCommitteeMember(page: Page, ic: string, roleRe: RegExp, tab = 'Committee Appointment') {
  await openTab(page, tab);
  if ((await committeeText(page)).includes(ic)) return `${ic} already in committee`;
  const dlgId = await page.evaluate(() => (document.querySelector('[id$=":newspecificationcommitteeid"]') as HTMLElement).id);
  const open = await page.evaluate((d) => getComputedStyle(document.getElementById(d)!).display !== 'none' && document.getElementById(d)!.getAttribute('aria-hidden') !== 'true', dlgId);
  if (!open) await clickButton(page, 'Add');
  const ids = await page.evaluate((d) => [...document.getElementById(d)!.querySelectorAll('input[type=text],select')].map((e) => e.id), dlgId);
  const idType = ids.find((i) => i.endsWith('_input') && !/ministryDD|PtjGroupDD|PtjDD/.test(i))!.replace(/_input$/, '');
  const idNo = ids.find((i) => /j_idt\d+$/.test(i))!;
  await pfSelect(page, idType, 'Identification Card');
  await page.locator(`[id="${idNo}"]`).fill(ic, { force: true });
  // SIT's search also needs the name (first two words)
  const name = sitQuery(`select user_name from ngep_sit.pm_user where login_id = '${ic.replace(/\D/g, '')}'`)[0]?.[0];
  if (name)
    await page.locator(`[id="${dlgId}"]`).locator('xpath=.//*[normalize-space(text())="Name"]/following::input[@type="text"][1]').first().fill(name.split(' ').slice(0, 2).join(' '), { force: true });
  await clickButton(page, 'Search', { inDialog: dlgId });
  const row = await page.evaluate(
    ({ d, ic }) => {
      const t = [...document.getElementById(d)!.querySelectorAll('table')].find((x) => /Identification No/.test(x.tHead?.innerText || ''));
      const r = t && [...t.tBodies[0].rows].find((x) => (x as HTMLElement).innerText.includes(ic));
      if (!r) return null;
      const s = r.querySelector('select');
      return { cb: (r.querySelector('input[type=checkbox]') as HTMLElement | null)?.id ?? '', sel: s ? s.id.replace(/_input$/, '') : '', opts: s ? [...s.options].map((o) => o.text.trim()) : [] };
    },
    { d: dlgId, ic },
  );
  if (!row) throw new Error(`${ic} not found in the committee search`);
  const roleLabel = row.opts.find((o) => roleRe.test(o));
  if (!roleLabel) throw new Error(`No role matching ${roleRe} for ${ic}: ${row.opts.join('|')}`);
  await pfSelect(page, row.sel, roleLabel);
  if (!(await page.locator(`[id="${row.cb}"]`).isChecked())) await page.locator(`[id="${row.cb.replace(/_input$/, '')}"] .ui-chkbox-box`).click({ force: true });
  await pfIdle(page);
  await clickButton(page, 'OK', { inDialog: dlgId });
  const stuck = await page.evaluate((d) => {
    const el = document.getElementById(d);
    if (!el || getComputedStyle(el).display === 'none' || el.getAttribute('aria-hidden') === 'true') return null;
    return [...el.querySelectorAll('.ui-messages, .ui-message, .ui-growl')].map((m) => (m as HTMLElement).innerText.trim()).filter(Boolean).join(' | ') || 'no message';
  }, dlgId);
  if (stuck) throw new Error(`${ic} as ${roleLabel} not accepted: ${stuck}`);
  return `${ic} added as ${roleLabel}`;
}

export async function selectApprover(page: Page, name: string, tab = 'Approval') {
  await openTab(page, tab);
  const pl = page.locator('.ui-picklist:visible').first();
  if (await pl.locator('.ui-picklist-target li', { hasText: name }).count()) return `${name} already selected`;
  let item = pl.locator('.ui-picklist-source li', { hasText: name }).first();
  if (!(await item.count())) {
    const first = pl.locator('.ui-picklist-source li').first();
    if (!(await first.count())) throw new Error(`Approver "${name}" not in the Available list, and the list is empty`);
    name = (await first.innerText()).trim().replace(/\s+/g, ' ');
    item = first;
  }
  await item.click({ force: true });
  await pl.locator('.ui-picklist-button-add').first().click({ force: true });
  await page.waitForTimeout(1500);
  await pfIdle(page);
  if (!(await pl.locator('.ui-picklist-target li', { hasText: name }).count())) {
    await item.dblclick({ force: true });
    await pfIdle(page);
  }
  if (!(await pl.locator('.ui-picklist-target li', { hasText: name }).count())) throw new Error(`Approver "${name}" did not move to Selected`);
  return `${name} selected`;
}

/** QT-002 (60002 → 60024): open the draft from the task list, category, committee, approver, Save, Submit. */
export async function completeAndSubmit(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  log(`category: ${await addCategory(page, QT_SIT.categoryCode)}`);
  for (const m of QT_SIT.committee) log(`committee: ${await addCommitteeMember(page, m.ic, m.role)}`);
  log(`approver: ${await selectApprover(page, QT_SIT.approver)}`);
  await clickButton(page, 'Save');
  await page.waitForTimeout(1500);
  log(`save: ${(await pageMessages(page)).join(' | ')}`);
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (msgs.some((m) => /ERR-|mandatory|invalid|required|tidak/i.test(m))) throw new Error(`Submit rejected: ${msgs.join(' | ')}`);
  return { messages: msgs };
}

/** Generic approver (60024 committee approval, 60005 publication, 60030 BPK): open, claim if needed, remark, Approve. */
export async function approveTask(ctx: StageCtx, qt: string, { button = 'Approve', remark = 'Approved (QA automation)' } = {}): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  await page.evaluate((remark) => {
    for (const t of document.querySelectorAll('textarea')) {
      const ta = t as HTMLTextAreaElement;
      if (ta.offsetWidth && !ta.readOnly && !ta.disabled && !ta.value && !ta.closest('.ui-dialog')) {
        ta.value = remark;
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, remark);
  const msgs = await pressAndConfirm(page, button, log);
  if (!msgs.some((m) => /success|is approved|is verified|submitted|endorsed|signed off|published/i.test(m))) throw new Error(`${button} not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: msgs };
}

/**
 * QT-109: the Publication Approver sends the documents back (60005 → 60006). The button label is not known from SIT yet:
 * the first visible one of the candidates is pressed; none → fail BEFORE any click, listing the buttons on the form.
 */
export async function reviseTask(ctx: StageCtx, qt: string, candidates = ['Revise', 'Send for Revision', 'Return for Revision', 'Kaji Semula', 'Return']): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  await openTask(page, ctx.baseURL, qt, log);
  const visible = (await page.locator('button:visible').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  const button = candidates.find((c) => visible.includes(c));
  if (!button) throw new Error(`No revise button on ${qt} (nothing pressed). Buttons: ${visible.join(' | ')}`);
  await page.evaluate((remark) => {
    for (const t of document.querySelectorAll('textarea')) {
      const ta = t as HTMLTextAreaElement;
      if (ta.offsetWidth && !ta.readOnly && !ta.disabled && !ta.value && !ta.closest('.ui-dialog')) {
        ta.value = remark;
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, 'Please revise (QA automation)');
  const msgs = await pressAndConfirm(page, button, log);
  if (!msgs.some((m) => /success|revis|returned|sent back|submitted/i.test(m))) throw new Error(`${button} not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: msgs };
}
