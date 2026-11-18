import path from 'node:path';
import fs from 'node:fs';
import ExcelJS from 'exceljs';
import type { Page } from '@playwright/test';
import { test, expect, scenario } from '../../fixtures/test';
import { ssoLogin, ssoLogout } from '../../support/mof/sso';
import { currentAccount, noteAccount, saveAccount, audit } from '../../support/mof/accounts';
import { waitForAjaxIdle } from '../../support/primefaces';
import { CREDENTIALS_XLSX } from '../../support/credentials';
import { loadMailboxes, readOutlook } from '../../support/mof/outlook';

/*
 * Soft certificate for a newly registered MOF supplier (latest account of .auth/mof-accounts.json, or MOF_ACCOUNT):
 *   SC-001  SIT: Soft Certificate Application → Proceed → Online, upload Copy of MyKad + Authorization Letter → Request SoftCert
 *   SC-002  MSC Trustgate pilot ePRA (https://digitalid.msctrustgate.com/v2/pilot/ePRA/, user 2026-11-18): find the
 *           request by IC in New/Renew → Select → Approve. Login: credentials.xlsx row Role "MSC Trustgate ePRA (pilot)".
 *   SC-003  SIT soft cert status after approval, and the approval e-mail in the supplier's Outlook mailbox
 *   SC-004  Enrolment link from that e-mail: 5 security questions + PIN → Submit. PIN and answers are generated once
 *           and kept with the account in .auth/mof-accounts.json (git-ignored), or MOF_SOFTCERT_PIN.
 *
 * DATA-CHANGING (SIT + Trustgate pilot); each step is logged in knowledge/data-change-audit.md.
 */
test.describe.configure({ mode: 'serial' });

const CR = 'MOF-SC';
const MODULE = 'Supplier Management / Soft Certificate';
const WHO = 'User ("yes" to soft cert; ePRA pilot to approve)';
const EPRA = 'https://digitalid.msctrustgate.com/v2/pilot/ePRA/';
const DOC = path.resolve(__dirname, '..', '..', 'fixtures', 'files', 'File_pdf_for_testing.pdf');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const meta = (id: string, role: string, expected: string) =>
  scenario({ cr: CR, id, module: MODULE, role, tags: ['@mof-registration', '@soft-cert'], expected: `Proposed — Pending QA Review: ${expected}` });

async function messages(page: Page): Promise<string> {
  const m = page.locator('.ui-messages-info-detail, .ui-messages-error-detail, .ui-messages-warn-detail, .ui-growl-message, .alert');
  return clean((await m.allInnerTexts().catch(() => [])).join(' | '));
}

async function epraLogin(): Promise<{ username: string; password: string }> {
  if (!fs.existsSync(CREDENTIALS_XLSX)) throw new Error('No .auth/credentials.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(CREDENTIALS_XLSX);
  let found: { username: string; password: string } | undefined;
  wb.getWorksheet('Credentials')?.eachRow((r) => {
    if (/ePRA/i.test(String(r.getCell(2).value))) found = { username: String(r.getCell(3).value).trim(), password: String(r.getCell(4).value).trim() };
  });
  if (!found?.password) throw new Error('No "MSC Trustgate ePRA (pilot)" row in .auth/credentials.xlsx');
  return found;
}

/** Opens the page; false when the dashboard no longer offers it (request already submitted). */
/** ePRA list search the way the RA does it: IC in "User ID" → Search. */
async function epraSearch(p: Page, ic: string) {
  await p.locator('input#userid').fill(ic);
  await p.getByRole('button', { name: /^Search$/ }).first().click();
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.waitForTimeout(2000);
}

async function openSoftCert(page: Page): Promise<boolean> {
  const link = page.locator('a').filter({ hasText: /Soft Certificate Application|Permohonan Sijil Digital/ }).first();
  if (!(await link.isVisible({ timeout: 5000 }).catch(() => false))) return false;
  await link.click();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(2500);
  return true;
}
const softCertStatus = async (page: Page) => clean(await page.locator('tbody[id$="_data"] tr').first().innerText().catch(() => ''));

test(
  'SC-001 Request the soft certificate online with MyKad and authorization letter',
  meta('SC-001', 'Supplier Administrator (new MOF supplier)', 'Request SoftCert accepted; status leaves "Pending Request"'),
  async ({ page, env, evidence }) => {
    test.setTimeout(15 * 60_000);
    const acct = currentAccount(env.name);
    if (!acct) throw new Error('No MOF account in .auth/mof-accounts.json');
    await ssoLogin(page, env, acct.username, acct.password, evidence.log);
    try {
      if (!(await openSoftCert(page))) {
        evidence.log('No "Soft Certificate Application" on the dashboard: request already submitted');
        await evidence.capture('already_requested', { step: 'Dashboard', expected: 'Soft cert already requested' });
        evidence.actual('Already requested (no Soft Certificate Application link)');
        return;
      }
      const before = await softCertStatus(page);
      evidence.log(`Soft cert row: ${before}`);
      await evidence.capture('softcert_list', { step: 'Overview → Soft Certificate Application', expected: 'Supplier admin listed', actual: before });
      if (!/Pending Request/i.test(before)) {
        evidence.log('Already requested; nothing to do');
        evidence.actual(`Already requested: ${before}`);
        return;
      }
      await page.getByRole('button', { name: 'Proceed' }).click();
      await waitForAjaxIdle(page);
      await page.waitForTimeout(2500);
      // Submission Type: Online
      const online = page.locator('label').filter({ hasText: /^Online$/ });
      if (await online.count()) await online.first().click();
      await page.waitForTimeout(800);
      // Two documents: Copy of MyKad, Authorization Letter (upload icon → dialog with one file input)
      const icons = page.locator('[id*=":softcertUploadDtlId:0:"][id$=":j_idt109"], [id*=":softcertUploadDtlId:0:"] a[onclick*="uploadDialog"]');
      const n = await icons.count();
      evidence.log(`${n} upload icon(s)`);
      for (let i = 0; i < n; i++) {
        await icons.nth(i).click();
        const dlg = page.locator('[id$=":uploadDialog"]');
        await dlg.waitFor({ state: 'visible', timeout: 15_000 });
        await dlg.locator('input[type=file]').setInputFiles(DOC);
        // The file waits in the list until its "start" (upload) button is pressed
        await dlg.locator('tr.template-upload td.start button').first().click();
        await dlg.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
        await waitForAjaxIdle(page).catch(() => {});
        await page.waitForTimeout(2000);
        if (await dlg.isVisible().catch(() => false)) {
          await dlg.locator('.ui-dialog-titlebar-close').click();
          await page.waitForTimeout(1500);
        }
        evidence.log(`Document ${i + 1} uploaded: ${await messages(page)}`);
      }
      await evidence.capture('documents_uploaded', { step: 'Online, both documents uploaded', expected: 'Each document row shows its file' });
      await page.getByRole('button', { name: 'Request SoftCert' }).click();
      await page.waitForTimeout(2000);
      const confirm = page.locator('.ui-dialog:visible').filter({ has: page.getByRole('button', { name: /^(Yes|Ya|OK)$/ }) });
      if (await confirm.count()) {
        evidence.log(`Confirm: ${clean(await confirm.first().innerText()).slice(0, 150)}`);
        await confirm.first().getByRole('button', { name: /^(Yes|Ya|OK)$/ }).first().click();
      }
      await waitForAjaxIdle(page).catch(() => {});
      await page.waitForTimeout(4000);
      // Payment Selection: "Soft Cert Payment … 0.00 (First softcert is free)" → Submit
      if (await page.locator('text=PAYMENT SELECTION').isVisible().catch(() => false)) {
        const pay = clean(await page.locator('tbody[id$="_data"] tr, table tr').filter({ hasText: /Soft Cert Payment/ }).first().innerText().catch(() => ''));
        evidence.log(`Payment Selection: ${pay}`);
        await evidence.capture('payment_selection', { step: 'Request SoftCert → Payment Selection', expected: 'Soft cert payment listed (first one free)', actual: pay });
        await page.getByRole('button', { name: 'Submit', exact: true }).first().click();
        await page.waitForTimeout(2500);
        // Declaration dialog: tick the declaration, then confirm
        const decl = page.locator('.ui-dialog').filter({ hasText: /Declaration|Are you sure/i }).filter({ visible: true }).first();
        if (await decl.count()) {
          evidence.log(`Declaration: ${clean(await decl.innerText()).slice(0, 300)}`);
          const boxes = decl.locator('.ui-chkbox-box');
          for (let i = 0; i < (await boxes.count()); i++) await boxes.nth(i).click();
          await page.waitForTimeout(800);
          await evidence.capture('declaration', { step: 'Submit → Declaration ticked', expected: 'Declaration dialog' });
          await decl.getByRole('button', { name: /^(Declare|Yes|Ya|OK|Submit|Proceed|Confirm)$/i }).filter({ visible: true }).first().click();
        }
        await waitForAjaxIdle(page).catch(() => {});
        await page.waitForTimeout(4000);
        evidence.log(`After Submit: ${clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 400)}`);
      }
      const msg = await messages(page);
      evidence.log(`After Request SoftCert: ${msg}`);
      await evidence.capture('requested', { step: 'Request SoftCert', expected: 'Request accepted', actual: msg });
      if (/ERR-|mandatory|required|fail/i.test(msg)) throw new Error(`Request SoftCert: ${msg}`);
      expect(msg).toMatch(/successfully submitted/i);
      await page.goto(`${env.baseURL}/web/epapp/dashboard`);
      await waitForAjaxIdle(page);
      const after = (await openSoftCert(page)) ? await softCertStatus(page) : 'no Soft Certificate Application link any more';
      evidence.log(`Soft cert row now: ${after}`);
      audit(env.name, WHO, `SC-001 Soft cert request (${acct.username})`, `**Soft cert requested online** (MyKad + authorization letter): ${msg.slice(0, 100)}; row: ${after.slice(-40)}`, 'Request SoftCert', 'ePRA approval');
      noteAccount(acct, `soft cert requested: ${after.slice(-40)}`);
      evidence.actual(`${msg}; status ${after}`);
    } finally {
      await ssoLogout(page, env).catch(() => {});
    }
  },
);

test(
  'SC-002 Approve the soft certificate request in MSC Trustgate ePRA (pilot)',
  meta('SC-002', 'ePRA administrator (MSC Trustgate pilot)', 'Request found by IC in New, approved, and listed under Approved'),
  async ({ browser, env, evidence }) => {
    test.setTimeout(15 * 60_000);
    const acct = currentAccount(env.name);
    if (!acct) throw new Error('No MOF account');
    const ic = acct.username;
    const login = await epraLogin();
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    p.on('dialog', (d) => {
      evidence.log(`Browser dialog: ${d.message()} → accept`);
      d.accept().catch(() => {});
    });
    try {
      await p.goto(EPRA, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await p.locator('input[type=text]').first().fill(login.username);
      await p.locator('input[type=password]').fill(login.password);
      await p.getByRole('button', { name: /Sign in/i }).click();
      await p.waitForLoadState('networkidle').catch(() => {});
      await p.waitForTimeout(3000);
      // New list: search for the IC (table search box), up to 10 min for the request to arrive
      let row = p.locator('tbody tr').filter({ hasText: ic }).first();
      for (let i = 0; i < 20; i++) {
        await epraSearch(p, ic);
        row = p.locator('tbody tr').filter({ hasText: ic }).first();
        if (await row.count()) break;
        evidence.log(`ePRA: ${ic} not in New yet (check ${i + 1}); reloading in 30s`);
        await p.waitForTimeout(30_000);
        await p.reload({ waitUntil: 'domcontentloaded' });
        await p.waitForTimeout(3000);
      }
      if (!(await row.count())) throw new Error(`ePRA: no New request for ${ic}`);
      evidence.log(`ePRA request: ${clean(await row.innerText())}`);
      await evidence.capture('epra_new', { step: `ePRA New list, search ${ic}`, expected: 'Request of the new supplier listed', page: p });
      await row.getByRole('button', { name: /Select/i }).or(row.getByRole('link', { name: /Select/i })).first().click();
      await p.waitForLoadState('networkidle').catch(() => {});
      await p.waitForTimeout(3000);
      const detail = clean(await p.locator('body').innerText());
      const buttons = (await p.locator('button, input[type=submit], input[type=button], a.btn').allInnerTexts()).map(clean).filter(Boolean);
      evidence.log(`ePRA detail (${p.url()}): ${detail.slice(0, 600)}`);
      evidence.log(`ePRA buttons: ${buttons.join(' | ')}`);
      await evidence.capture('epra_detail', { step: 'Select', expected: 'Request detail with Approve', page: p });
      const approve = p.getByRole('button', { name: /^Approve/i }).or(p.locator('input[type=submit][value^="Approve" i], a.btn').filter({ hasText: /^Approve/i })).first();
      if (!(await approve.count())) throw new Error(`ePRA: no Approve button. Buttons: ${buttons.join(' | ')}`);
      await approve.click();
      await p.waitForTimeout(2500);
      // Modal confirmation, if any
      const modal = p.locator('.modal.show, .modal.in, [role=dialog]').filter({ visible: true }).first();
      if (await modal.count()) {
        evidence.log(`ePRA confirm: ${clean(await modal.innerText()).slice(0, 200)}`);
        await modal.getByRole('button', { name: /^(Yes|OK|Confirm|Approve|Submit)/i }).first().click();
        await p.waitForTimeout(3000);
      }
      await p.waitForLoadState('networkidle').catch(() => {});
      const after = clean(await p.locator('body').innerText()).slice(0, 400);
      evidence.log(`ePRA after Approve: ${after}`);
      await evidence.capture('epra_approved', { step: 'Approve', expected: 'Request approved', page: p });
      // Approved tab should list it
      const approvedTab = p.getByRole('link', { name: /^Approved$/ }).first();
      if (await approvedTab.count()) {
        await approvedTab.click();
        await p.waitForTimeout(3000);
        await epraSearch(p, ic);
      }
      const inApproved = clean(await p.locator('tbody tr').filter({ hasText: ic }).first().innerText().catch(() => ''));
      evidence.log(`Approved list: ${inApproved || '(not found)'}`);
      await evidence.capture('epra_approved_list', { step: 'Approved tab', expected: `${ic} listed`, actual: inApproved, page: p });
      audit(env.name, WHO, `SC-002 ePRA approval (${ic})`, `**Soft cert request of ${ic} approved in MSC Trustgate pilot ePRA**: ${inApproved.slice(0, 120)}`, 'Select → Approve', 'Activation e-mail / SIT status');
      noteAccount(acct, `soft cert approved in ePRA: ${inApproved.slice(0, 80)}`);
      evidence.actual(inApproved ? `Approved: ${inApproved}` : after);
      expect(inApproved, 'request listed under Approved').not.toBe('');
    } finally {
      await ctx.close().catch(() => {});
    }
  },
);

test(
  'SC-003 Soft cert status on SIT and the approval e-mail',
  meta('SC-003', 'Supplier Administrator (new MOF supplier)', 'SIT shows the soft cert approved/issued; the approval e-mail reaches the registered mailbox'),
  async ({ page, env, evidence }) => {
    test.setTimeout(25 * 60_000);
    const acct = currentAccount(env.name);
    if (!acct) throw new Error('No MOF account');
    await ssoLogin(page, env, acct.username, acct.password, evidence.log);
    try {
      const status = (await openSoftCert(page)) ? await softCertStatus(page) : 'no Soft Certificate Application link on the dashboard';
      evidence.log(`SIT soft cert row: ${status}`);
      await evidence.capture('sit_status', { step: 'Soft Certificate Application', expected: 'Status after ePRA approval', actual: status });
    } finally {
      await ssoLogout(page, env).catch(() => {});
    }
    const box = (await loadMailboxes(env.name)).find((b) => b.email.toLowerCase() === acct.email.toLowerCase());
    if (!box) {
      evidence.log(`${acct.email} is not an Outlook mailbox of credentials.xlsx; e-mail not checked`);
      return;
    }
    const mail = await readOutlook(box, /cert|sijil|digital|Trustgate|MSC/i, evidence.log, {
      mustContain: new RegExp(`${acct.username}|${acct.ownerName}|${acct.companyName}`, 'i'),
      timeoutMs: 15 * 60_000,
    });
    evidence.log(`Approval e-mail "${mail.subject.slice(0, 120)}": ${mail.text.slice(0, 600)}`);
    const links = [...mail.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => !/^mailto:/.test(h));
    evidence.log(`Links in the e-mail: ${links.slice(0, 5).join(' | ')}`);
    noteAccount(acct, `soft cert e-mail received: ${mail.subject.slice(0, 80)}`);
    evidence.actual(`E-mail "${mail.subject.slice(0, 100)}"`);
  },
);

test(
  'SC-004 Set the soft cert PIN and security questions from the enrolment e-mail',
  meta('SC-004', 'Supplier Administrator (new MOF supplier)', 'Enrolment form accepts 5 security questions and the PIN; certificate enrolment confirmed'),
  async ({ page, env, evidence }) => {
    test.setTimeout(20 * 60_000);
    const acct = currentAccount(env.name);
    if (!acct) throw new Error('No MOF account');
    const box = (await loadMailboxes(env.name)).find((b) => b.email.toLowerCase() === acct.email.toLowerCase());
    if (!box) throw new Error(`${acct.email} is not an Outlook mailbox of credentials.xlsx`);
    const mail = await readOutlook(box, /Sijil Digital|Digital Cert/i, evidence.log, {
      mustContain: new RegExp(`^(?=[\\s\\S]*${acct.username})[\\s\\S]*enrolment`, 'i'),
    });
    const link = [...mail.html.matchAll(/href="([^"]*certificate\/enrolment[^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))[0];
    if (!link) throw new Error('No enrolment link in the approval e-mail');
    evidence.log('Enrolment link found in the approval e-mail');

    // PIN + answers: generated once, stored with the account (git-ignored .auth/mof-accounts.json)
    // Trustgate field: pattern (?=.*\d)(?=.*[a-z]), exactly 8 characters
    const pinOk = (p: string) => p.length === 8 && /\d/.test(p) && /[a-z]/.test(p);
    if (!acct.softCert || !pinOk(acct.softCert.pin)) {
      const pin = (): string => {
        const letters = 'abcdefghjkmnpqrstuvwxyz'; // field pattern needs a lowercase letter; exactly 8 characters
        const pick = (set: string, n: number) => Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join('');
        return pick(letters, 4) + pick('23456789', 4);
      };
      acct.softCert = { pin: process.env.MOF_SOFTCERT_PIN ?? pin(), questions: [] };
      saveAccount(acct);
    }
    const soft = acct.softCert;
    await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(3000);
    await evidence.capture('enrolment_form', { step: 'Open the enrolment link', expected: 'Certificate Registration: 5 challenge questions + PIN' });
    const answerFor = (q: string) =>
      ([
        [/mother/i, 'Aminah'], [/teacher/i, 'Cikgu Rahman'], [/drink/i, 'Teh Tarik'], [/one word/i, 'Tester'],
        [/school/i, 'SK Ayer Hitam'], [/car/i, 'Proton'], [/food/i, 'Nasi Lemak'], [/watch/i, 'Casio'],
        [/birthday/i, 'Monday'], [/actor/i, 'P Ramlee'], [/nickname/i, 'Adik'], [/salary/i, '1500'],
        [/grandmother/i, 'Fatimah'], [/city/i, 'Kuala Lumpur'],
      ] as [RegExp, string][]).find(([re]) => re.test(q))?.[1] ?? 'Testing';
    const questions: { question: string; answer: string }[] = [];
    for (let i = 1; i <= 5; i++) {
      const sel = page.locator(`select#quest${i}`);
      const opts = (await sel.locator('option').allInnerTexts()).map(clean).filter((o) => o && !/Please Select/i.test(o));
      const q = opts.find((o) => !questions.some((x) => x.question === o));
      if (!q) throw new Error(`No unused question left for Challenge Response ${i}`);
      await sel.selectOption({ label: q });
      await page.locator(`#questAns${i}`).fill(answerFor(q));
      questions.push({ question: q, answer: answerFor(q) });
    }
    await page.locator('#pass1').fill(soft.pin);
    await page.locator('#pass2').fill(soft.pin);
    soft.questions = questions;
    saveAccount(acct);
    evidence.log(`Questions: ${questions.map((q) => q.question).join(' | ')}; PIN of ${soft.pin.length} characters (kept in .auth/mof-accounts.json)`);
    await evidence.capture('enrolment_filled', { step: '5 questions answered, PIN entered twice', expected: 'Ready to submit' });
    page.on('dialog', (d) => {
      evidence.log(`Browser dialog: ${d.message()} → accept`);
      d.accept().catch(() => {});
    });
    await page.locator('input[type=submit]').click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(5000);
    const result = clean(await page.locator('body').innerText()).slice(0, 800);
    evidence.log(`After Submit (${page.url().slice(0, 70)}): ${result}`);
    await evidence.capture('enrolment_result', { step: 'Submit', expected: 'Enrolment / certificate issued confirmation', actual: result.slice(0, 200) });
    if (await page.locator('#pass1').isVisible().catch(() => false)) throw new Error(`Enrolment form still shown: ${result.slice(0, 300)}`);
    audit(env.name, WHO, `SC-004 Soft cert enrolment (${acct.username})`, `**Soft cert PIN and 5 security questions set** via the MyTrust enrolment link: ${result.slice(0, 120)}`, 'Submit', 'Soft cert usable (sign with PIN)');
    noteAccount(acct, `soft cert enrolment submitted: ${result.slice(0, 100)}`);
    evidence.actual(result.slice(0, 300));
  },
);
