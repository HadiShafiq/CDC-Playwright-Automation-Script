import path from 'node:path';
import type { Page } from '@playwright/test';
import type { EnvConfig } from '../../../config/environments';
import type { Evidence } from '../../../fixtures/test';
import { MofApplicationPage } from '../../../pages/MofApplicationPage';
import { mofRegistrationAction } from '../../cdc/library/2-object/webb/epapp/supptemp-mof-registration/action';
import { audit, loadAccounts } from '../../mof/accounts';
import { loadCredentials, loadPasswordFor } from '../../credentials';
import { sitQuery } from '../../core/sit-db';
import { ssoLogin, ssoLogout, ensureEnglish } from '../../mof/sso';
import { waitForAjaxIdle } from '../../primefaces';

/*
 * SM supplier applications of an already REGISTERED MOF supplier (Update MOF Profile KU-…, later add category, delete…).
 * Supplier: the "Supplier Administrator (MOF)" row of .auth/credentials.xlsx (MOFCTOO16), or MOF_ACCOUNT=<login> of
 * .auth/mof-accounts.json. Our new suppliers cannot be used: SIT shows no "Update MOF Profile Application" link within
 * 6 months of registration (checked 2026-11-25 on 900101921645, 900101370499, 900101010815).
 * Officer stages reuse reg003 (registration.ts) with the KU number and this supplier.
 * SIT path read 2026-11-25 from KU-06112026-0014: 20100 → Declare → 20101 → SDO 20104 → PO 20108 → Approver 20199.
 */
export interface AppCtx {
  page: Page;
  env: EnvConfig;
  evidence: Evidence;
}

const PDF = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'files', 'File_pdf_for_testing.pdf');
const WHO = 'Claude (SM application flows, user: "resume until finish")';
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

async function banner(page: Page) {
  return clean((await page.locator('.ui-messages:visible, .ui-growl-item:visible').allInnerTexts().catch(() => [])).join(' | '));
}

export interface Supplier { username: string; password: string; companyName: string }

/** The supplier of the update flows; companyName filled from the DB once an application exists. */
export async function updateSupplier(env: EnvConfig, apNo?: string): Promise<Supplier> {
  const wanted = process.env.MOF_ACCOUNT;
  const own = wanted ? loadAccounts().find((a) => a.env === env.name && a.username === wanted) : undefined;
  const cred = own ? { username: own.username, password: own.password } : await loadCredentials(env.name);
  if (!cred?.username || !cred.password) throw new Error('No supplier login: add the "Supplier Administrator (MOF)" row to .auth/credentials.xlsx or set MOF_ACCOUNT');
  const companyName = apNo ? companyOf(apNo) : '';
  return { username: cred.username, password: cred.password, companyName };
}

/** Password of a supplier login: our accounts (.auth/mof-accounts.json) first, then .auth/credentials.xlsx. */
async function supplierLogin(env: EnvConfig, login: string): Promise<{ username: string; password: string }> {
  const own = loadAccounts().find((a) => a.env === env.name && a.username.toLowerCase() === login.toLowerCase());
  if (own) return { username: own.username, password: own.password };
  const cred = await loadCredentials(env.name);
  if (cred && cred.username.toLowerCase() === login.toLowerCase()) return { username: cred.username, password: cred.password };
  const pwd = await loadPasswordFor(env.name, login);
  if (pwd) return { username: login, password: pwd };
  throw new Error(`No password for supplier ${login} (not in .auth/mof-accounts.json or credentials.xlsx)`);
}

/** The supplier who owns an SM application (SM_APPL → PM_USER_ORG → PM_USER), with its password and company name. */
export async function supplierOfAppl(env: EnvConfig, apNo: string): Promise<Supplier> {
  const logins = sitQuery(`select u.login_id from ngep_sit.sm_appl a join ngep_sit.pm_user_org o on o.org_profile_id = a.supplier_id join ngep_sit.pm_user u on u.user_id = o.user_id where a.appl_no = '${apNo.replace(/'/g, '')}'`).map((r) => r[0]);
  for (const l of logins) {
    const c = await supplierLogin(env, l).catch(() => undefined);
    if (c) return { ...c, companyName: companyOf(apNo) };
  }
  throw new Error(`No known login among the users of the supplier of ${apNo}: ${logins.join(', ') || 'none'}`);
}

/** Renewal supplier: SM_RENEWAL_ACCOUNT, default our 900101010815 (MOF expiry moved to 18/02/2027 → renewal window open). */
export async function renewalSupplier(env: EnvConfig): Promise<Supplier> {
  return { ...(await supplierLogin(env, process.env.SM_RENEWAL_ACCOUNT ?? '900101010815')), companyName: '' };
}

export function companyOf(apNo: string): string {
  const name = sitQuery(`select s.company_name from ngep_sit.sm_appl a join ngep_sit.sm_supplier s on s.supplier_id = a.supplier_id where a.appl_no = '${apNo.replace(/'/g, '')}'`)[0]?.[0];
  if (!name) throw new Error(`No supplier company for ${apNo} in SM_APPL/SM_SUPPLIER`);
  return name;
}

/** SM-022: Update MOF Profile draft (Quick Link → Terms → Proceed → Save), supporting documents uploaded. Returns KU-…. */
export async function createUpdateDraft({ page, env, evidence }: AppCtx): Promise<string> {
  const acct = await updateSupplier(env);
  await ssoLogin(page, env, acct.username, acct.password, evidence.log);
  await ensureEnglish(page);
  const mof = new MofApplicationPage(page);
  const { via, applicationNo } = await mof.open(evidence.log);
  if (!/^K[UJ]-|^JU-/.test(applicationNo)) evidence.log(`Note: application number ${applicationNo} (expected KU-/JU-)`);
  evidence.log(`Update MOF Profile ${applicationNo} (${via})`);
  if (via === 'new') audit(env.name, WHO, `SM-022 Update MOF Profile of ${acct.username}`, `**Draft ${applicationNo} saved**`, 'Save', 'Declare');
  await evidence.capture('update_draft', { step: 'Update MOF Profile draft', expected: 'KU number', actual: `${applicationNo} (${via})` });

  const docs = await mof.goToSection('Supporting Documents');
  if (!docs.opened) throw new Error(`Supporting Documents did not open: ${docs.message || 'no message'}`);
  await page.locator('tbody[id*="mandatoryTableId_data"] > tr').first().waitFor({ timeout: 60_000 }).catch(() => {});
  const up = await mof.uploadMandatoryDocuments(PDF, evidence.log);
  const saved = await mof.save();
  evidence.log(`Supporting documents: uploaded ${up.length}; Save: ${saved || '(no message)'}`);
  await evidence.capture('update_documents', { step: 'Supporting Documents + Save', expected: 'Saved', actual: saved });
  await ssoLogout(page, env);
  return applicationNo;
}

/**
 * Every company branch must be linked to a payment bank account, else Declare answers ERR-722622 ("Branch SELANGOR
 * does not have any bank account for payment purpose", SIT 2026-11-25 on KU-02112026-0021). Bank Information → edit
 * the first account → select every branch in "banBranchVal" → the dialog's Save. Skipped when all are selected.
 */
async function assignBranchesToBank(page: Page, evidence: Evidence) {
  const mof = new MofApplicationPage(page);
  const r = await mof.goToSection('Bank Information');
  if (!r.opened) throw new Error(`Bank Information did not open: ${r.message || 'no message'}`);
  const edit = page.locator('[id$="0:edit"]').first();
  if (!(await edit.isVisible().catch(() => false))) return evidence.log('Bank Information: no bank account row to edit');
  await edit.click();
  await waitForAjaxIdle(page, 30_000, { dialogOpen: true });
  const dlg = page.getByRole('dialog', { name: /Bank Information/i });
  const menu = dlg.locator('[id$="banBranchVal"]');
  const items = menu.locator('li.ui-selectlistbox-item');
  const n = await items.count();
  const picked: string[] = [];
  for (let i = 0; i < n; i++) {
    const it = items.nth(i);
    if (/ui-state-highlight/.test((await it.getAttribute('class')) ?? '')) continue;
    await it.click({ modifiers: ['Control'] });
    picked.push(clean(await it.innerText()));
  }
  if (!picked.length) {
    evidence.log(`Bank Information: all ${n} branch(es) already linked to the bank account`);
    await dlg.locator('.ui-dialog-titlebar-close').click().catch(() => {});
    await waitForAjaxIdle(page);
    return;
  }
  await dlg.getByRole('button', { name: /^Save$/ }).click();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(1500);
  const still = await dlg.isVisible().catch(() => false);
  const msg = await banner(page);
  evidence.log(`Bank Information: linked branch(es) ${picked.join(', ')} to the bank account; ${still ? 'dialog still open' : 'saved'} ${msg}`);
  await evidence.capture('bank_branches', { step: 'Bank Information: link branches to the bank account', expected: 'Saved', actual: msg });
  if (still) throw new Error(`Bank account not saved after linking ${picked.join(', ')}: ${msg || 'dialog still open'}`);
}

/** Task List → My Task: open the draft whose row shows apNo (Update / Renewal / … drafts). */
async function openDraft(page: Page, apNo: string, log: (m: string) => void) {
  await page.getByRole('menuitem', { name: 'Task List' }).click();
  await waitForAjaxIdle(page);
  const row = page.locator('tbody[id*="taskListMyTaskId_data"] tr').filter({ hasText: apNo }).first();
  await row.waitFor({ timeout: 30_000 });
  log(`My Task: ${clean(await row.innerText()).slice(0, 140)}`);
  await row.locator('a').first().click();
  await waitForAjaxIdle(page);
  await new MofApplicationPage(page).expectOnApplication();
}

/**
 * SM-004 (no fee: update) / SM-002 on a renewal (payFee): open the draft, upload missing mandatory documents, link
 * branches to the bank account, overlap justification, Declare → Proceed; with payFee the banner's HERE → Proceed
 * pays the processing fee (as REG-002).
 */
export async function declareAppl({ page, env, evidence }: AppCtx, apNo: string, { payFee = false } = {}): Promise<string> {
  const acct = await supplierOfAppl(env, apNo);
  await ssoLogin(page, env, acct.username, acct.password, evidence.log);
  await ensureEnglish(page);
  const mof = new MofApplicationPage(page);
  await openDraft(page, apNo, evidence.log);
  const docs = await mof.goToSection('Supporting Documents');
  if (docs.opened) {
    await page.locator('tbody[id*="mandatoryTableId_data"] > tr').first().waitFor({ timeout: 60_000 }).catch(() => {});
    const up = await mof.uploadMandatoryDocuments(PDF, evidence.log);
    if (up.length) evidence.log(`Supporting documents: uploaded ${up.length}; Save: ${(await mof.save()) || '(no message)'}`);
  }
  await assignBranchesToBank(page, evidence);
  // Declare is refused until every overlapping category code has a justification + letter (SIT 2026-11-25:
  // "Please provide justification and upload the necessary supporting document … in category code section first").
  const cat = await mof.goToSection('Register Category Code(s)');
  if (!cat.opened) throw new Error(`Register Category Code(s) did not open: ${cat.message || 'no message'}`);
  const overlap = await page.locator('textarea[id*="overlapCatSuppDocDtId"][id*="overlapCaReasonId"]').count();
  if (overlap) {
    await mof.fillOverlapJustification('Testing Justification', PDF);
    const s = await mof.save();
    evidence.log(`Overlap justification on ${overlap} row(s) + letter uploaded; Save: ${s || '(no message)'}`);
    await evidence.capture('overlap_justification', { step: 'Register Category Code(s): justification + letter, Save', expected: 'Saved', actual: s });
  }
  const decl = await mof.goToSection('Declaration');
  if (!decl.opened) throw new Error(`Declaration did not open: ${decl.message || 'no message'}`);
  const mr = new mofRegistrationAction(page, 'en');
  await evidence.capture('declaration_page', { step: 'Declaration', expected: 'Declare button' });
  await mr.clickDeclare();
  await mr.clickProceed();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(2000);
  const msg = await banner(page);
  evidence.log(`Declare → Proceed: ${msg || '(no banner)'}`);
  await evidence.capture('declared', { step: 'Declare → Proceed', expected: 'Declared', actual: msg });
  if (/ERR-\d+/.test(msg) && !/success/i.test(msg)) throw new Error(`Declare refused: ${msg}`);
  audit(env.name, WHO, `Declare ${apNo}`, `**${apNo} DECLARED** (${msg.slice(0, 120)})`, 'Declare + Proceed', payFee ? 'Processing fee' : 'SDO verification');
  if (payFee) {
    await mr.clickHereLink();
    await waitForAjaxIdle(page);
    await evidence.capture('processing_fee_page', { step: 'Processing fee page', expected: 'Fee details and Proceed' });
    await mr.clickProceed();
    await waitForAjaxIdle(page);
    await page.waitForTimeout(3000);
    const paid = (await banner(page)) || clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 300);
    evidence.log(`Processing fee → Proceed: ${paid}`);
    await evidence.capture('processing_fee_done', { step: 'Processing fee → Proceed', expected: 'Fee paid', actual: paid.slice(0, 200) });
    audit(env.name, WHO, `Processing fee of ${apNo}`, `**Processing fee step done** (${paid.slice(0, 120)})`, 'Proceed', 'SDO verification');
  }
  await ssoLogout(page, env);
  return msg;
}

/** SM-024: Renewal MOF Account draft (T&C → Proceed → Save). Returns the application number (KR-…). */
export async function createRenewalDraft({ page, env, evidence }: AppCtx): Promise<string> {
  const acct = await renewalSupplier(env);
  await ssoLogin(page, env, acct.username, acct.password, evidence.log);
  await ensureEnglish(page);
  await page.goto(`${env.baseURL}/web/epapp/renew-mof-account`);
  await waitForAjaxIdle(page);
  const pending = page.getByText(/ERR-722542/);
  await page.locator('.ui-chkbox-box:visible').first().click();
  await waitForAjaxIdle(page);
  await page.getByRole('button', { name: 'Proceed' }).click();
  await waitForAjaxIdle(page);
  if (await pending.isVisible().catch(() => false)) {
    // A renewal draft already exists: find it in the DB (latest KR of this supplier at 20100) instead of a second one
    const ap = sitQuery(`select a.appl_no from ngep_sit.sm_appl a join ngep_sit.pm_user_org o on o.org_profile_id = a.supplier_id join ngep_sit.pm_user u on u.user_id = o.user_id where lower(u.login_id) = lower('${acct.username}') and a.appl_no like '_R-%' order by a.created_date desc`)[0]?.[0];
    if (!ap) throw new Error(`Renewal refused (${clean(await pending.innerText())}) and no renewal application found in the DB`);
    evidence.log(`Renewal draft already exists: ${ap}`);
    await ssoLogout(page, env);
    return ap;
  }
  // Title is 'Renewal MOF Account Application' here, so check the form's left menu instead of the title
  await new MofApplicationPage(page).sectionTab('Company Basic Information').waitFor({ timeout: 30_000 });
  const saved = await new MofApplicationPage(page).save();
  const ap = saved.match(/\b[KJ]R-\d{8}-\d{4}\b/)?.[0] ?? (await page.locator('body').innerText()).match(/\b[KJ]R-\d{8}-\d{4}\b/)?.[0];
  evidence.log(`Renewal Save: ${saved}`);
  await evidence.capture('renewal_draft', { step: 'Renewal MOF Account: Save', expected: 'KR number', actual: saved });
  if (!ap) throw new Error(`Renewal draft not confirmed: ${saved || 'no message'}`);
  audit(env.name, WHO, `SM-024 Renewal MOF Account of ${acct.username}`, `**Draft ${ap} saved**`, 'Save', 'Declare + processing fee');
  await ssoLogout(page, env);
  return ap;
}
