import { expect } from '@playwright/test';
import type { Evidence } from '../../../fixtures/test';
import type { Page } from '@playwright/test';
import type { EnvConfig } from '../../../config/environments';
import { OnlineRegistrationAction } from '../../../support/cdc/library/2-object/online-registration/action';
import { DROPDOWN_OPTIONS } from '../../../support/cdc/library/2-object/online-registration/data';
import { extractActivationLink, extractActivationKey, extractOldPassword } from '../../../support/cdc/library/utils/email-helper';
import { readYopmail, yopmailAddress } from '../../../support/mof/yopmail';
import { loadMailboxes, readOutlook } from '../../../support/mof/outlook';
import { mofRegistrationAction } from '../../../support/cdc/library/2-object/webb/epapp/supptemp-mof-registration/action';
import { DECLARATION_DATA, LOCATION, LABELS, ROLES, FILL_TEXT, MANDATORY_DOCUMENTS } from '../../../support/cdc/library/2-object/webb/epapp/supptemp-mof-registration/data';
import { generateApplicantData } from '../../../support/cdc/library/generator/applicant-generator';
import { MofAppAction } from '../../../support/cdc/library/2-object/webb/epapp/mof-application/action';
import { VirtualCertAction } from '../../../support/cdc/library/2-object/webb/epapp/view-virtual-certification/action';
import { ssoLogin, ssoLogout, displayName, closeAnnouncement, ensureEnglish } from '../../../support/mof/sso';
import { currentAccount, loadAccounts, saveAccount, noteAccount, audit } from '../../../support/mof/accounts';
import { waitForAjaxIdle } from '../../../support/primefaces';
import { loadSharedOfficerPassword } from '../../../support/credentials';

/*
 * Stages of the new MOF supplier registration (moved from tests/sm/registration/mof-registration.spec.ts on 2026-11-24 so
 * the flow runner can run them as SM module steps; the spec now only calls these functions).
 * New MOF supplier registration, end to end on SIT:
 *   REG-001  Online Registration (MOF Account, Contractor, Cooperative) → activation e-mail (Gmail IMAP)
 *            → activate → first-time-login e-mail → log in and change the password
 *   REG-002  Log in as the new supplier, fill the MOF application, Declare, pay the processing fee
 *   REG-003  Officer stages found with Task Status Search: verify documents, review, approve
 *   REG-004  Pay the registration fee and view the virtual certificate
 *
 * DATA-CHANGING (SIT): creates a supplier account, an MOF application and officer decisions.
 * Every stage appends a row to knowledge/data-change-audit.md.
 *
 * E-mails go to a disposable YOPmail inbox (mofreg<timestamp>@yopmail.com), read through its web page
 * (support/mof/yopmail.ts). Officer logins use MOF_OFFICER_PASSWORD from .env, else the shared officer
 * password of .auth/credentials.xlsx.
 *
 * Ported from CDC-Playwright: tests/01-test-data-script/Automate Account Creation Until First Login/MOF Account/
 * mof-acc-contractor-COOPERATIVE.spec.ts, Automate-Declare-Application/Declare-MOF-Kontraktor.spec.ts and
 * VERIFY-SUPP-DOCUMENT/verify_declare.spec.ts (page objects in support/cdc).
 */
const MOF_SUPPLIER_TYPE = 'Contractor';
const BUSINESS_TYPE = 'Cooperative';
const SALUTATION = 'Cik';
const WHO = 'User ("run create mof … until he got cert")';

/** What a stage needs: the page, the environment and an evidence recorder (spec fixture or flow runner). */
export interface RegCtx {
  page: Page;
  env: EnvConfig;
  evidence: Evidence;
}

const digits = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Password set at first login: MOF_NEW_PASSWORD, else the team's standard SIT test password, which is the shared
 * password row (Username "*") of .auth/credentials.xlsx (user, 2026-11-18). Kept in .auth/mof-accounts.json.
 */
async function newPassword(env: EnvConfig): Promise<string> {
  const p = process.env.MOF_NEW_PASSWORD || (await loadSharedOfficerPassword(env.name));
  if (!p) throw new Error('No new-account password: set MOF_NEW_PASSWORD or the Username "*" row of .auth/credentials.xlsx');
  return p;
}

/** MOF_OFFICER_PASSWORD from .env, else the shared officer password of .auth/credentials.xlsx (row Username "*"). */
async function officerPassword(env: EnvConfig): Promise<string> {
  const p = process.env.MOF_OFFICER_PASSWORD || (await loadSharedOfficerPassword(env.name));
  if (!p) throw new Error('No officer password: set MOF_OFFICER_PASSWORD in .env or the Username "*" row of .auth/credentials.xlsx');
  return p;
}

/** Same registration data as the CDC script, with a unique company and owner. */
function generateOnlineRegData(email: string) {
  const uniq = `${Date.now().toString().slice(-6)}${digits(2)}`;
  return {
    ownerIc: `900101${digits(6)}`,
    companyName: `Test Company ${uniq}`,
    regNo: `2020${digits(8)}`,
    ownerName: `Owner ${digits(4)}`,
    email,
    establishmentYear: '2015',
    establishmentDay: '15',
    compAddress: 'No 1, Jalan Ujana 1',
    compPostcode: '91000',
    telAreaCode: '89',
    telPhoneNo: '1234567',
    bankAccNo: digits(12),
    dobYear: '1985',
    dobDay: '10',
    adminAddress: 'No 1, Jalan Pusat 2',
    adminPostcode: '83000',
    position: 'Director',
    mobileAreaCode: '12',
    mobilePhoneNo: '3456789',
    mobileTelco: 'Digi',
  };
}

/** Pick year + day in the PrimeFaces calendar that is currently open (DOB needs a proper past year). */
async function pickCalendarDate(page: Page, year: string, day: string) {
  await page.getByRole('button', { name: 'ui-button' }).click();
  await page.getByRole('combobox').nth(1).selectOption(year);
  await page.getByRole('link', { name: day, exact: true }).click();
  await page.waitForTimeout(1000);
}

/** The green/blue info banner, if any. */
async function infoMessage(page: Page): Promise<string> {
  const banner = page.locator('.ui-messages-info-detail, .ui-messages-error-detail, .ui-messages-warn-detail');
  return clean((await banner.allInnerTexts().catch(() => [])).join(' | '));
}

// ----------------------------------------------------------------------------------------------
// REG-001  Online registration until first login
// ----------------------------------------------------------------------------------------------
export async function reg001({ page, env, evidence }: RegCtx) {
    // Resume the latest account of this environment if its registration was submitted but it has not
    // logged in yet (activation stays valid for 7 days); otherwise register a new one.
    let acct = loadAccounts().filter((a) => a.env === env.name).at(-1);
    const did = (what: string) => !!acct?.notes?.some((n) => n.includes(what));
    const resume = !!acct && did('registration submitted') && !did('first login OK') && Date.now() - Date.parse(acct.createdAt) < 7 * 86_400_000;
    if (resume && acct) evidence.log(`Resuming ${acct.username} (${acct.companyName}, ${acct.email}); last note: ${acct.notes?.at(-1)}`);
    if (!resume) {
    // Outlook mailboxes from credentials.xlsx (user's choice 2026-11-18): MOF_MAILBOX, else the one used
    // least so far. Without any, a disposable YOPmail inbox (needs the tester to read the mails by hand).
    const boxes = await loadMailboxes(env.name);
    const used = (e: string) => loadAccounts().filter((a) => a.email.toLowerCase() === e.toLowerCase()).length;
    const box = boxes.find((b) => b.email === process.env.MOF_MAILBOX) ?? [...boxes].sort((a, b) => used(a.email) - used(b.email))[0];
    const EMAIL = box?.email ?? yopmailAddress(`mofreg${Date.now().toString().slice(-8)}`);
    const reg = new OnlineRegistrationAction(page, 'en');
    const data = generateOnlineRegData(EMAIL);
    const loginId = data.ownerIc;
    const password = await newPassword(env);
    evidence.log(`Registering ${data.companyName} (reg no ${data.regNo}), owner ${data.ownerName}, login ID ${loginId}, e-mail ${EMAIL}`);

    // Steps 1–4: home, English, Online Registration, MOF Account, terms
    await reg.goToHome();
    await reg.selectLanguage();
    await reg.goToOnlineRegistration();
    await reg.selectAccountTypeMOF();
    await reg.checkTnC();
    await evidence.capture('account_information', { step: 'MOF Account selected, terms accepted', expected: 'Account Information form' });

    // Step 5: account, company, owner, nature of business, bank
    await reg.selectBusinessTypeMOF(MOF_SUPPLIER_TYPE);
    await reg.selectBusinessType(DROPDOWN_OPTIONS.BUSINESS_TYPE.COOPERATIVE);
    await reg.fillBusinessRegNo(data.regNo);
    await page.locator('.ui-chkbox-box').first().click(); // business network declaration
    await page.waitForTimeout(1000);
    await reg.fillCompanyName(data.companyName);
    await pickCalendarDate(page, data.establishmentYear, data.establishmentDay);
    await reg.selectBusinessState('JOHOR');
    await reg.selectBusinessDistrict('BATU PAHAT');
    await reg.selectBusinessCity('AYER HITAM');
    await reg.fillCompanyAddress(data.compAddress);
    await reg.fillBusinessPostcode(data.compPostcode);
    await reg.clickViewMap();
    await reg.closeMapDialog();
    await reg.fillPhoneNumber('60', data.telAreaCode, data.telPhoneNo);
    await reg.fillOwnerName(data.ownerName);
    await reg.fillOwnerIdNo(data.ownerIc);
    await reg.clickAddNob();
    await reg.regPage.getLovTable().locator('.ui-chkbox-box').first().click();
    await reg.clickSelectNob();
    await reg.clickAddBank();
    await reg.selectBankName('AGROBANK');
    await reg.fillBankAccNo(data.bankAccNo);
    await evidence.capture('company_information', { step: 'Account, company, owner, NOB and bank filled', expected: 'All mandatory fields filled' });
    await reg.clickNext();

    // Step 6: supplier administrator
    await reg.clickSupplierCell();
    await reg.selectSuppSalutation(SALUTATION);
    await reg.clickBumiputeraRadio();
    await pickCalendarDate(page, data.dobYear, data.dobDay);
    await reg.clickMuslimRadio();
    await reg.fillSuppAddress(data.adminAddress);
    await reg.selectSuppState('JOHOR');
    await reg.selectSuppDistrict('BATU PAHAT');
    await reg.selectSuppCity('AYER HITAM');
    await reg.fillSuppPostcode(data.adminPostcode);
    await reg.fillSuppPosition(data.position);
    await reg.fillSuppMobileNo('60', data.mobileAreaCode, data.mobilePhoneNo);
    // SIT has no Telco dropdown next to Mobile No. (UAT does)
    if (await page.locator('div[id$="telcoCompId"]').count()) await reg.selectSuppTelco(data.mobileTelco);
    else evidence.log('No Telco dropdown on this form; skipped');
    await reg.fillSuppEmail(data.email);
    await reg.checkSuppAddr();
    await evidence.capture('supplier_administrator', { step: 'Supplier Administrator filled', expected: 'Ready to submit' });
    await reg.clickSubmit();

    // Step 7: final confirmation
    await page.locator('.ui-chkbox-box').first().click();
    await reg.clickProceed();
    await waitForAjaxIdle(page);
    const submitted = await infoMessage(page);
    evidence.log(`After Proceed: ${submitted || clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 300)}`);
    await evidence.capture('registration_submitted', { step: 'Final confirmation → Proceed', expected: 'Registration submitted; activation e-mail sent', actual: submitted });
    audit(env.name, WHO, 'REG-001 Online Registration (MOF, Contractor, Cooperative)', `**New supplier account submitted: ${data.companyName}, reg no ${data.regNo}, login ID ${loginId}** (e-mail ${EMAIL})`, 'Submit + Proceed', 'Activation by e-mail');

    acct = {
      env: env.name, createdAt: new Date().toISOString(), supplierType: MOF_SUPPLIER_TYPE, businessType: BUSINESS_TYPE,
      companyName: data.companyName, regNo: data.regNo, ownerName: data.ownerName, username: loginId, password, email: EMAIL,
      notes: ['registration submitted'],
    };
    saveAccount(acct);
    }
    if (!acct) throw new Error('No account to continue with');
    const mailbox = acct.email.split('@')[0];
    const loginId = acct.username;
    const password = acct.password;
    const outlookBox = (await loadMailboxes(env.name)).find((b) => b.email.toLowerCase() === acct!.email.toLowerCase());
    // The Outlook mailboxes are reused, so only a mail that names this registration counts
    const ours = [acct.companyName, acct.ownerName, loginId].filter(Boolean).map(escapeRegExp).join('|');
    const readMail = (subject: RegExp, mustContain: RegExp) =>
      outlookBox
        ? readOutlook(outlookBox, subject, evidence.log, { mustContain: new RegExp(`^(?=[\\s\\S]*(?:${ours}))[\\s\\S]*(?:${mustContain.source})`, 'i') })
        : readYopmail(page.context(), mailbox, subject, evidence.log, { mustContain });

    // Steps 8–11: activation e-mail → activation page
    if (!did('activated')) {
    // YOPmail blocks automated browsers (Cloudflare), so the tester reads the e-mail in their own browser
    // and passes ACTIVATION_LINK (+ ACTIVATION_KEY) to the run.
    let activation: { activationLink: string; activationKey: string };
    if (process.env.ACTIVATION_LINK) {
      activation = { activationLink: process.env.ACTIVATION_LINK, activationKey: process.env.ACTIVATION_KEY ?? '' };
      evidence.log('Using the activation link/key given by the tester (from the YOPmail e-mail)');
    } else {
    evidence.log(`Waiting for the activation e-mail in ${acct.email}`);
    const actMail = await readMail(/Activation|Pengaktifan/i, /supplier-user-activation/);
    activation = { activationLink: extractActivationLink(actMail.html), activationKey: extractActivationKey(actMail.html) || extractActivationKey(actMail.text) };
    }
    evidence.log(`Activation key received; link ${activation.activationLink.slice(0, 80)}…`);
    await page.goto(activation.activationLink);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[id$="j_idt20"]').fill(activation.activationKey);
    await page.locator('[id$="loginId"]').fill(loginId);
    await page.locator('button[onclick*="confirmDlg.show"]').click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /^(Yes|Ya)$/ }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(5000);
    const activated = await infoMessage(page);
    evidence.log(`After activation: ${activated || clean(await page.locator('body').innerText()).slice(0, 200)}`);
    await evidence.capture('activated', { step: 'Activation key + login ID submitted', expected: 'Account activated', actual: activated });
    noteAccount(acct, 'activated');
    }

    if (!did('password changed')) {
    // Trigger createliferay (speeds up the first-time-login e-mail), then read the temporary password
    await page.goto(`${env.baseURL}/NGeP-portlet/rest/pm/createliferay`).catch(() => {});
    await page.waitForTimeout(5000);
    evidence.log(`Waiting for the first-time-login e-mail in ${acct.email}`);
    let firstLogin: { oldPassword: string };
    if (process.env.TEMP_PASSWORD) {
      firstLogin = { oldPassword: process.env.TEMP_PASSWORD };
      evidence.log('Using the temporary password given by the tester (from the YOPmail e-mail)');
    } else if (process.env.ACTIVATION_LINK && !outlookBox) {
      noteAccount(acct, 'waiting for the first-time-login e-mail (temporary password)');
      throw new Error(`Account activated. Now open ${acct.email} in your own browser, copy the "Temporary Password" from the first-time-login e-mail and rerun REG-001 with TEMP_PASSWORD=<it>`);
    } else {
    const loginMail = await readMail(/First|Login|Log Masuk|Kata Laluan|Password/i, /Temporary\s+Password|Kata Laluan Sementara/i);
    firstLogin = { oldPassword: extractOldPassword(loginMail.text) };
    }
    evidence.log('Temporary password received');

    // First login and password change
    await page.goto(`${env.baseURL}/web/epapp/dashboard`);
    await waitForAjaxIdle(page);
    await page.getByRole('textbox', { name: /ID Log Masuk|Login ID/ }).fill(loginId);
    await page.getByRole('textbox', { name: /Kata Laluan|Password/ }).fill(firstLogin.oldPassword);
    await page.getByRole('button', { name: /^(Log Masuk|Login)$/ }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await evidence.capture('first_login', { step: 'First login with the temporary password', expected: 'Change-password page' });
    await page.getByRole('textbox', { name: /Old Password|Kata Laluan Lama/ }).fill(firstLogin.oldPassword);
    await page.getByRole('textbox', { name: /^(New Password|Kata Laluan Baharu)$/ }).fill(password);
    await page.getByRole('textbox', { name: /Re-?Type New Password|Taip Semula/ }).fill(password);
    await page.getByRole('link', { name: /^(Submit|Serah|Hantar)$/ }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
    evidence.log(`After password change: ${(await infoMessage(page)) || new URL(page.url()).pathname}`);
    noteAccount(acct, 'password changed');
    }

    // Prove the new password works
    await ssoLogout(page, env);
    await ssoLogin(page, env, loginId, password, evidence.log);
    const name = await displayName(page).catch(() => '');
    await evidence.capture('dashboard', { step: 'Login with the new password', expected: 'Supplier dashboard', actual: `Welcome, ${name}` });
    noteAccount(acct, `first login OK, display name "${name}"`);
    audit(env.name, WHO, `REG-001 activation + first login of ${loginId}`, `**Account ${loginId} (${acct.companyName}) activated and password changed**; saved in .auth/mof-accounts.json`, 'Activate, change password', 'REG-002 Declare');
    evidence.actual(`Account ${loginId} for ${acct.companyName} registered, activated and logged in`);
}

// ----------------------------------------------------------------------------------------------
// REG-002  Declare the MOF application and pay the processing fee
// ----------------------------------------------------------------------------------------------
/** `stopBeforeDeclare`: save the draft only (SM-001); otherwise resume it, Declare and pay the processing fee. */
export async function reg002({ page, env, evidence }: RegCtx, opts: { stopBeforeDeclare?: boolean } = {}) {
    const acct = currentAccount(env.name);
    const D = DECLARATION_DATA.en;
    const management = generateApplicantData();
    const staff = generateApplicantData();
    const company = generateApplicantData();
    await ssoLogin(page, env, acct.username, acct.password, evidence.log);
    const mr = new mofRegistrationAction(page, 'en');

    let docNo = acct.applicationNo ?? '';
    if (docNo) {
      // Resume the saved draft (a rerun after a failure) instead of creating a second application.
      evidence.log(`Resuming the saved application ${docNo} from Task List`);
      await mr.clickTaskByDocNo(docNo);
      await waitForAjaxIdle(page);
      await evidence.capture('application_resumed', { step: `Open ${docNo} from Task List`, expected: 'Company Info of the draft', actual: docNo });
    } else {
    // Company information
    await mr.declareApplicationMenu();
    await mr.fillIncomeTax(company.tin);
    await mr.fillAnnualRevenue(D.ANNUAL_REVENUE);
    await mr.fillBumiStaff(D.BUMI_STAFF);
    await mr.selectOwnershipType(D.PREMISE_TYPE);
    await mr.fillFacility(D.OWNER, D.PRICE, D.FACILITY_TYPE);
    await mr.clickSave();
    docNo = await mr.getDocNo();
    evidence.log(`Application number ${docNo}`);
    acct.applicationNo = docNo;
    noteAccount(acct, `application ${docNo} saved`);
    audit(env.name, WHO, `REG-002 MOF application of ${acct.username} (${acct.companyName})`, `**Application ${docNo} created and saved**`, 'Save', 'Declare');
    await evidence.capture('application_saved', { step: 'Company Info saved', expected: 'Application number shown', actual: docNo });
    await mr.clickHereLink();
    }
    await mr.clickNextsection(); // Assocs / Projects
    await mr.clickNextsection(); // Personnel / Branch

    // A rerun skips the sections a previous run already saved (their notes are in .auth/mof-accounts.json).
    const saved = (section: string) => !!acct.notes?.some((n) => n.includes(`${docNo} ${section} saved`));
    const markSaved = (section: string) => noteAccount(acct, `${docNo} ${section} saved`);

    // Personnel: edit the equity owner, add a management person and a staff
    if (saved('personnel')) evidence.log('Personnel / Branch already saved by an earlier run; skipped');
    else {
    await mr.processAvailableEdits();
    await mr.clickAddEmployee();
    await mr.fillBasicInfo(management.fullName, management.myKad);
    await mr.selectSalutation(D.SALUTATION);
    await mr.selectRace(D.RACE);
    await mr.fillDOB();
    await mr.fillPosition(management.designation);
    await mr.fillEPFNo(management.epf);
    await mr.selectBumiputera(LABELS.en.YES);
    await mr.selectReligion(D.RELIGION);
    await mr.clickRole(ROLES.en.MANAGEMENT);
    // Cooperative offers Director / Higher Management / Management / Staff only
    if (await mr.hasRole(ROLES.en.EQUITY_OWNER)) await mr.clickRole(ROLES.en.EQUITY_OWNER);
    else evidence.log('No "Equity Owner" role for this business type; Management only');
    await mr.fillAddress(LOCATION.ADDR);
    await mr.FillEmpState(LOCATION.STATE_1);
    await mr.FillEmpDist(LOCATION.DISTRICT_1);
    await mr.FillEmpCity(LOCATION.CITY_1);
    await mr.fillAddress(LOCATION.ADDR);
    await mr.fillAddress(LOCATION.ADDR);
    await mr.fillEmpPost(LOCATION.POSTCODE_1);
    // Residential / office address sections only exist for an Equity Owner
    if (await page.locator('[id$="resiAddrPan"]').count()) {
      await mr.selectResidentAddress(LABELS.en.RESIDENTIAL_ADDRESS);
      await mr.selectOfficeAddress(LABELS.en.OFFICE_ADDRESS);
    } else evidence.log('No residential/office address sections for this person; skipped');
    await mr.clickAddWorkExperience();
    await mr.fillWorkExperience(management.companyName, FILL_TEXT.DESIG_DEF, D.DATE_FROM, D.DATE_FUTURE);
    await mr.clickAddAcademic();
    await mr.fillAcademic(D.YEAR, management.institute, D.QUALIFICATION_LEVEL, D.EDUCATION_FIELD);
    await mr.clickSave();

    await mr.clickAddEmployee();
    await mr.fillBasicInfo(staff.fullName, staff.myKad);
    await mr.selectSalutation(D.SALUTATION);
    await mr.selectRace(D.RACE);
    await mr.fillDOB();
    await mr.fillPosition(staff.designation);
    await mr.fillEPFNo(staff.epf);
    await mr.selectBumiputera(LABELS.en.YES);
    await mr.selectReligion(D.RELIGION);
    await mr.clickRole(ROLES.en.STAFF);
    await mr.fillAddressStaff(LOCATION.ADDR);
    await mr.FillEmpStateStaff(LOCATION.STATE_1);
    await mr.FillEmpDistStaff(LOCATION.DISTRICT_1);
    await mr.FillEmpCityStaff(LOCATION.CITY_1);
    await mr.fillAddressStaff(LOCATION.ADDR);
    await mr.fillEmpPostStaff(LOCATION.POSTCODE_1);
    await mr.clickAddWorkExperience();
    await mr.fillWorkExperience(staff.companyName, FILL_TEXT.DESIG_DEF, D.DATE_FROM, D.DATE_FUTURE);
    await mr.clickAddAcademic();
    await mr.fillAcademic(D.YEAR, staff.institute, D.QUALIFICATION_LEVEL, D.EDUCATION_FIELD);
    await mr.clickSave();
    await mr.clickSave();
    await evidence.capture('personnel', { step: 'Personnel / Branch saved', expected: 'Equity owner, management and staff listed' });
    markSaved('personnel');
    }

    // Capital / equity
    await mr.clickNextsection();
    if (saved('capital')) evidence.log('Capital already saved; skipped');
    else {
    await mr.fillBumiCapital(FILL_TEXT.CAPITAL_VALUE);
    const totalShare = page.locator('input[id$=":totalShrAmt"]');
    if (await totalShare.isVisible().catch(() => false)) {
      // Cooperative: Total Share + Total Members, all capital Bumiputera; no shareholder rows to edit
      await totalShare.fill(FILL_TEXT.CAPITAL_VALUE);
      await page.locator('input[id$=":bumiAmt"]').fill(FILL_TEXT.CAPITAL_VALUE);
      await page.locator('input[id$=":bumiAmt"]').press('Tab');
      await waitForAjaxIdle(page, 30_000, { dialogOpen: true });
      // "Capital / Equity Status Change: Equity info was changed…" → OK
      const equityDialog = page.locator('.ui-dialog:visible').filter({ hasText: /Equity info was changed|Capital \/ Equity Status Change/i });
      if (await equityDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
        evidence.log(`Dialog: ${clean(await equityDialog.innerText()).slice(0, 160)} → OK`);
        await equityDialog.getByRole('button', { name: /^OK$/ }).click();
        await waitForAjaxIdle(page);
      }
      // Total Members is reset by the refresh above; fill it last
      const members = page.locator('xpath=//*[normalize-space(.)="Total Members"]/following::input[1]').first();
      await members.fill('3');
      await members.press('Tab');
      await waitForAjaxIdle(page, 30_000, { dialogOpen: true });
      if (await equityDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        await equityDialog.getByRole('button', { name: /^OK$/ }).click();
        await waitForAjaxIdle(page);
      }
      await mr.clickSave();
      evidence.log(`Capital: total share ${FILL_TEXT.CAPITAL_VALUE}, 3 members, 100% Bumiputera; ${await infoMessage(page)}`);
    } else {
      await mr.editAndFillShareAmount(0, FILL_TEXT.FIRST_CAP_VAL);
      await mr.clickSave();
      await mr.editAndFillShareAmount(1, FILL_TEXT.SECOND_CAP_VAL);
      await mr.clickSave();
    }
    await evidence.capture('capital', { step: 'Capital / Equity saved', expected: 'Share amounts saved', actual: await infoMessage(page) });
    markSaved('capital');
    }

    // Bank
    await mr.clickNextsection();
    if (saved('bank')) evidence.log('Bank already saved; skipped');
    else {
    await mr.clickEdit();
    await mr.fillBankDetails(D.BNK_PURPOSE, D.BNK_BRANCH, D.BNK_ADDRESS, D.STATE_BANK, D.DISTRICT_BANK, D.CITY_BANK, D.POST_BANK, FILL_TEXT.BANK_TERM);
    // The City/Town AJAX re-renders the dialog and can clear Postcode / Bank Branch (SIT 2026-11-24, KN-24112026-0035):
    // fill them again once the queue is idle, then save, and count the section only when the dialog has closed.
    const bankDialog = page.locator('.ui-dialog:visible').filter({ hasText: 'Bank Information' });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await waitForAjaxIdle(page, 30_000, { dialogOpen: true });
      for (const [box, value] of [[page.locator('[id$="suppBankPostCodeMy"]:visible'), D.POST_BANK], [page.locator('[id$="smBankBranchName"]:visible'), D.BNK_BRANCH]] as const) {
        if ((await box.count()) && !(await box.first().inputValue()).trim()) {
          await box.first().fill(value);
          await box.first().press('Tab');
          await waitForAjaxIdle(page, 30_000, { dialogOpen: true });
        }
      }
      await mr.clickBankDialogSave();
      await waitForAjaxIdle(page);
      if (!(await bankDialog.isVisible().catch(() => false))) break;
      const errs = clean((await page.locator('.ui-dialog:visible .ui-messages-error-detail, .ui-dialog:visible .ui-message-error-detail, .ui-messages-error-detail').allInnerTexts().catch(() => [])).join(' | '));
      evidence.log(`Bank dialog still open after Save (attempt ${attempt}): ${errs || 'no message'}`);
      if (attempt === 3) throw new Error(`Bank information not saved: ${errs || 'dialog still open'}`);
    }
    await evidence.capture('bank', { step: 'Bank information saved', expected: 'Bank details saved', actual: await infoMessage(page) });
    markSaved('bank');
    }

    // Category codes
    await mr.clickNextsection();
    if (saved('category')) evidence.log('Category codes already saved; skipped');
    else {
    await mr.clickAdd();
    await mr.selectCategoryCodes(FILL_TEXT.BIDANG, FILL_TEXT.SUB_BIDANG, FILL_TEXT.PECAHAN);
    await mr.clickOK();
    await mr.clickSave();
    await mr.processMissingOverlapDocs(page, 'Surat rayuan pertindihan bidang untuk kelulusan MOF');
    await mr.clickSave();
    await evidence.capture('category_codes', { step: 'Category code added', expected: `${FILL_TEXT.BIDANG} / ${FILL_TEXT.SUB_BIDANG} / ${FILL_TEXT.PECAHAN}`, actual: await infoMessage(page) });
    markSaved('category');
    }

    // Supporting documents: upload every row that still has none
    await mr.clickNextsection();
    // The mandatory table can render after the section opens: wait for its rows first, or the loop finds nothing and
    // Declare is refused with ERR-722537 "Missing document(s)" (SIT 2026-11-24, KN-24112026-0035: 6 rows left empty).
    const mandatoryRows = page.locator('tbody[id$="mandatoryTableId_data"] tr[data-ri]');
    await mandatoryRows.first().waitFor({ state: 'visible', timeout: 60_000 });
    await waitForAjaxIdle(page);
    evidence.log(`Mandatory supporting documents: ${await mandatoryRows.count()} rows`);
    for (const doc of Object.values(MANDATORY_DOCUMENTS)) {
      if (await mr.isDocumentAvailable(page, doc)) await mr.uploadMandatoryDocument(page, doc);
    }
    for (let pass = 1; pass <= 3; pass++) {
      const emptyRows = await mr.getEmptyDocumentRows(page);
      if (!emptyRows.length) break;
      if (pass === 3) throw new Error(`Supporting documents still empty after 2 upload passes: ${emptyRows.map((r) => r.description.slice(0, 60)).join(' | ')}`);
      for (const row of emptyRows) {
        evidence.log(`Uploading the missing document on row ${row.dataRi}: ${row.description}`);
        await mr.uploadMissingDocumentByDataRi(page, row.dataRi);
      }
      await waitForAjaxIdle(page);
    }
    await evidence.capture('supporting_documents', { step: 'Supporting documents uploaded', expected: 'No row without a document' });

    if (opts.stopBeforeDeclare) {
      evidence.actual(`${docNo} saved as a draft (not declared)`);
      await ssoLogout(page, env);
      return docNo;
    }
    // Declaration
    await mr.clickNextsection();
    await evidence.capture('declaration_page', { step: 'Declaration page', expected: 'Declare button' });
    await mr.clickDeclare();
    await mr.clickProceed();
    await waitForAjaxIdle(page);
    const declared = await infoMessage(page);
    evidence.log(`After Declare → Proceed: ${declared}`);
    await evidence.capture('declared', { step: 'Declare → Proceed', expected: 'Application declared', actual: declared });
    audit(env.name, WHO, `REG-002 Declare ${docNo}`, `**Application ${docNo} DECLARED** (${declared.slice(0, 120)})`, 'Declare + Proceed', 'Processing fee');
    noteAccount(acct, `declared: ${declared.slice(0, 160)}`);

    // Processing fee: the banner's HERE link opens the payment page
    await mr.clickHereLink();
    await waitForAjaxIdle(page);
    await evidence.capture('processing_fee_page', { step: 'Processing fee page', expected: 'Fee details and Proceed' });
    await mr.clickProceed();
    await waitForAjaxIdle(page);
    await page.waitForTimeout(3000);
    const paid = (await infoMessage(page)) || clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 400);
    evidence.log(`After processing fee Proceed: ${paid}`);
    await evidence.capture('processing_fee_done', { step: 'Processing fee → Proceed', expected: 'Fee paid / application sent for processing', actual: paid.slice(0, 200) });
    audit(env.name, WHO, `REG-002 processing fee of ${docNo}`, `**Processing fee step done** (${paid.slice(0, 120)})`, 'Proceed', 'REG-003 officers');
    noteAccount(acct, `processing fee: ${paid.slice(0, 160)}`);
    evidence.actual(`${docNo} declared; ${paid.slice(0, 150)}`);
    await ssoLogout(page, env);
    return docNo;
}

// ----------------------------------------------------------------------------------------------
// REG-003  Officer stages, found with Task Status Search
// ----------------------------------------------------------------------------------------------
interface TaskRow { taskId: string; taskName: string; assignees: string[]; status: string }

/** Task Status Search on the dashboard: every workflow task of the document and who holds it. */
async function taskStatus(page: Page, env: EnvConfig, docNo: string): Promise<TaskRow[]> {
  await page.goto(`${env.baseURL}/web/epapp/dashboard`);
  await waitForAjaxIdle(page);
  await closeAnnouncement(page);
  const portlet = page.locator('#portlet_taskStatusSearch_WAR_NGePportlet');
  await expect(portlet, 'Task Status Search portlet on the dashboard').toBeVisible({ timeout: 20_000 });
  await portlet.locator('xpath=.//*[contains(normalize-space(.),"Document N")]/following::input[@type="text"][1]').first().fill(docNo);
  await portlet.getByRole('button', { name: /Search|Cari/i }).first().click();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(3000);
  const rows: TaskRow[] = [];
  for (const row of await portlet.locator('tbody tr').all()) {
    const cells = (await row.locator('td').allInnerTexts()).map(clean);
    if (cells.length < 5 || /^No records/i.test(cells[0])) continue;
    const statusIdx = cells.findIndex((c) => /^(ASSIGNED|RESERVED|COMPLETED|IN_PROGRESS|READY|SUSPENDED|EXITED|OBSOLETE)$/i.test(c));
    rows.push({
      taskId: cells[0],
      taskName: cells[1],
      assignees: cells[2].replace(/[[\]]/g, '').split(',').map((s) => s.trim()).filter(Boolean),
      status: statusIdx >= 0 ? cells[statusIdx] : cells[4],
    });
  }
  return rows;
}

/** Open the officer's task for the company: claim it from Group Task if needed, then open it from My Task. */
async function openOfficerTask(page: Page, env: EnvConfig, companyName: string, log: (m: string) => void) {
  await page.goto(`${env.baseURL}/web/epapp/task-list`);
  await waitForAjaxIdle(page);
  await closeAnnouncement(page);
  await page.waitForTimeout(3000);
  const company = new RegExp(escapeRegExp(companyName), 'i');
  const groupRow = page.locator('tbody[id*="taskListGroupId_data"] tr').filter({ hasText: company }).first();
  if (await groupRow.isVisible().catch(() => false)) {
    log(`Group Task has it: claiming "${clean(await groupRow.innerText()).slice(0, 120)}"`);
    await groupRow.getByRole('button', { name: /Claim|Tuntut/ }).click();
    await waitForAjaxIdle(page);
    await page.waitForTimeout(3000);
  }
  const myRow = page.locator('tbody[id*="taskListMyTaskId_data"] tr').filter({ hasText: company }).first();
  await expect(myRow, `My Task row for ${companyName}`).toBeVisible({ timeout: 20_000 });
  const title = clean(await myRow.innerText());
  log(`Opening My Task "${title.slice(0, 140)}"`);
  await myRow.locator('a').first().click();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(3000);
  return title;
}

/** `once`: complete only the next pending officer task (one SM step), else all of them. Returns what was done. */
export async function reg003(
  { page, env, evidence }: RegCtx,
  opts: { once?: boolean; docNo?: string; supplier?: { username: string; password: string; companyName: string } } = {},
): Promise<string[]> {
    // opts.supplier: another supplier than the latest registered one (e.g. MOFCTOO16 for Update MOF Profile, 2026-11-25)
    const acct = opts.supplier ? { ...currentAccount(env.name), ...opts.supplier } : currentAccount(env.name);
    // Any SM application of the current supplier (new KN, update KU, add category KA …); default: its registration.
    const docNo = opts.docNo ?? acct.applicationNo;
    if (!docNo) throw new Error(`Account ${acct.username} has no application number yet: run REG-002 first`);
    const pwd = await officerPassword(env);
    const ma = new MofAppAction(page, 'en');
    const done: string[] = [];

    let feeWaits = 0;
    for (let round = 1; round <= 30; round++) {
      await ssoLogin(page, env, acct.username, acct.password, evidence.log);
      const rows = await taskStatus(page, env, docNo);
      evidence.log(`Round ${round} Task Status of ${docNo}:\n` + rows.map((r) => `   ${r.taskName} [${r.assignees.join(', ')}] ${r.status}`).join('\n'));
      await evidence.capture(`task_status_${round}`, { step: `Task Status Search ${docNo} (round ${round})`, expected: 'Pending officer task, or none left', actual: rows.map((r) => `${r.taskName}: ${r.status}`).join('; ') });
      await ssoLogout(page, env);

      const pending = rows.find((r) => !/COMPLETED|EXITED|OBSOLETE/i.test(r.status) && r.assignees.length);
      if (!pending) {
        const unassigned = rows.find((r) => !/COMPLETED|EXITED|OBSOLETE/i.test(r.status));
        if (unassigned) throw new Error(`Task "${unassigned.taskName}" is ${unassigned.status} but has no assignee; cannot continue`);
        evidence.log('No pending officer task left');
        break;
      }
      // A fee task still on the supplier: REG-002 already paid, SIT closes the task once the payment is
      // confirmed. Wait for it (every minute, up to 15 min) instead of paying twice.
      // After approval the next task is the supplier's "Make Payment" (registration fee): REG-004's job.
      if (pending.assignees.includes(acct.username) && /Make Payment|Registration Fee/i.test(pending.taskName)) {
        evidence.log(`Officer stages done; "${pending.taskName}" is now with the supplier (REG-004)`);
        if (!opts.supplier) noteAccount(acct, `${docNo} approved; ${pending.taskName} pending`);
        break;
      }
      if (pending.assignees.includes(acct.username) && /Fee/i.test(pending.taskName)) {
        if (++feeWaits > 15) throw new Error(`"${pending.taskName}" is still open on the supplier after ${feeWaits - 1} min although REG-002 paid it; check the payment on SIT`);
        evidence.log(`"${pending.taskName}" still on the supplier (payment being confirmed); checking again in 60 s (${feeWaits}/15)`);
        await page.waitForTimeout(60_000);
        continue;
      }
      const officer = pending.assignees[0];
      evidence.log(`Pending: "${pending.taskName}" assigned to ${pending.assignees.join(', ')} → logging in as ${officer}`);
      await ssoLogin(page, env, officer, pwd, evidence.log);
      await ensureEnglish(page);
      const title = await openOfficerTask(page, env, acct.companyName, evidence.log);
      await evidence.capture(`task_${round}_opened`, { step: `${pending.taskName} as ${officer}`, expected: 'Task form', actual: title.slice(0, 120) });

      const receiveAll = page.getByRole('button', { name: /Receive All|Terima Semua/ });
      const approverMenu = page.getByRole('link', { name: 'Approver Decision', exact: true });
      const poMenu = page.getByRole('link', { name: 'PO Decision', exact: true });
      let flow: string;
      if (await receiveAll.isVisible().catch(() => false)) {
        flow = 'verify supporting documents';
        await ma.clickReceiveAll();
        await ma.selectTodayAsReceiveDate();
        await ma.clickVerify();
        await ma.clickYes();
      } else if (await approverMenu.isVisible().catch(() => false)) {
        flow = 'approver decision → Approve';
        await ma.clickApproverDecisionMenu();
        await ma.clickApprove();
        await ma.clickSubmit();
        await ma.clickYes();
      } else if (await poMenu.isVisible().catch(() => false)) {
        flow = 'review → category codes Approve All → All Valid → Recommend to Approve';
        // "Processing Officer Action for category code … is mandatory": approve the applied categories first
        await page.getByRole('link', { name: 'Register Category Code(s)', exact: true }).click();
        await waitForAjaxIdle(page);
        const approveAll = page.getByRole('button', { name: /^Approve All$/ });
        if (await approveAll.isVisible({ timeout: 10_000 }).catch(() => false)) {
          await approveAll.click();
          await waitForAjaxIdle(page, 30_000, { dialogOpen: true });
          const confirm = page.locator('.ui-dialog:visible').getByRole('button', { name: /^(Yes|OK)$/ }).first();
          if (await confirm.isVisible({ timeout: 3000 }).catch(() => false)) { await confirm.click(); await waitForAjaxIdle(page); }
          evidence.log(`Category codes: Approve All (${await infoMessage(page) || 'no banner'})`);
          await evidence.capture(`task_${round}_categories`, { step: 'Register Category Code(s) → Approve All', expected: 'Every category marked Approve' });
        }
        await ma.ensureAppVerifiedByPOChecked();
        await ma.clickSupportingDocumentMenu();
        await ma.clickAllValid();
        await ma.clickPODecisionMenu();
        await ma.clickRecommendToApprove();
        await ma.clickSubmit();
        await ma.clickYes();
      } else {
        const buttons = (await page.locator('button:visible, a.ui-commandlink:visible').allInnerTexts()).map(clean).filter(Boolean);
        await evidence.capture(`task_${round}_unknown`, { step: pending.taskName, expected: 'Known officer form', actual: `Unknown form. Buttons/links: ${buttons.join(' | ')}` });
        throw new Error(`Unknown officer form for "${pending.taskName}" (${officer}). Visible buttons/links: ${buttons.join(' | ')}`);
      }
      await waitForAjaxIdle(page);
      await page.waitForTimeout(3000);
      const msg = await infoMessage(page);
      evidence.log(`${officer} did "${flow}": ${msg || '(no banner)'}`);
      await evidence.capture(`task_${round}_done`, { step: `${pending.taskName}: ${flow}`, expected: 'Task completed', actual: msg });
      audit(env.name, WHO, `REG-003 ${pending.taskName} on ${docNo} as officer ${officer}`, `**${flow}** (${msg.slice(0, 120)})`, flow, 'next officer task');
      if (!opts.supplier) noteAccount(acct, `${pending.taskName} by ${officer}: ${flow}`);
      done.push(`${pending.taskName} (${officer})`);
      await ssoLogout(page, env);
      if (opts.once) break;
    }
    evidence.actual(done.length ? `Completed: ${done.join('; ')}` : 'No officer task was pending');
    return done;
}

// ----------------------------------------------------------------------------------------------
// REG-004  Registration fee and virtual certificate
// ----------------------------------------------------------------------------------------------
export async function reg004(
  { page, env, evidence }: RegCtx,
  opts: { docNo?: string; supplier?: { username: string; password: string; companyName: string } } = {},
) {
    // opts: another application/supplier (e.g. a renewal KR-… of 900101010815, 2026-11-25); notes only for our latest account
    const base = currentAccount(env.name);
    const acct = opts.supplier ? { ...base, ...opts.supplier, applicationNo: opts.docNo } : { ...base, applicationNo: opts.docNo ?? base.applicationNo };
    const note = (a: typeof acct, m: string) => { if (!opts.supplier) noteAccount(base, m); void a; };
    await ssoLogin(page, env, acct.username, acct.password, evidence.log);
    await evidence.capture('supplier_dashboard', { step: 'Supplier dashboard after approval', expected: 'Registration fee / certificate menus' });

    // After approval SIT puts a "Make payment" task (registration fee) in the supplier's My Task
    await page.goto(`${env.baseURL}/web/epapp/task-list`);
    await waitForAjaxIdle(page);
    await closeAnnouncement(page);
    await page.waitForTimeout(3000);
    const payTask = page.locator('tbody[id*="taskListMyTaskId_data"] tr').filter({ hasText: /Make payment/i }).filter({ hasText: acct.applicationNo ?? acct.companyName }).first();
    if (await payTask.isVisible({ timeout: 10_000 }).catch(() => false)) {
      evidence.log(`My Task: ${clean(await payTask.innerText()).slice(0, 150)}`);
      await payTask.locator('a').first().click();
      await waitForAjaxIdle(page);
      await page.waitForTimeout(3000);
      await evidence.capture('registration_fee_page', { step: 'My Task → Make payment', expected: 'Registration fee page', actual: clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 200) });
      const proceed = page.getByRole('button', { name: /^(Proceed|Seterusnya)$/ });
      if (await proceed.isVisible().catch(() => false)) {
        await proceed.click();
        await waitForAjaxIdle(page);
        await page.waitForTimeout(3000);
      }
      const msg = (await infoMessage(page)) || clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 300);
      evidence.log(`Registration fee: ${msg}`);
      await evidence.capture('registration_fee_done', { step: 'Registration fee → Proceed', expected: 'Fee paid', actual: msg.slice(0, 200) });
      audit(env.name, WHO, `REG-004 registration fee of ${acct.applicationNo}`, `**Registration fee step done** (${msg.slice(0, 120)})`, 'Proceed', 'Certificate');
      note(acct, `registration fee: ${msg.slice(0, 160)}`);
    } else {
      evidence.log('No "Make payment" task in My Task (registration fee already paid?)');
    }

    // "Please click HERE or go to the Overview menu to retrieve the MOF Accounts Virtual Certificate"
    const viewCert = page.getByRole('link', { name: /View Virtual Certificate|Lihat Sijil Maya/ }).first();
    const here = page.locator('.ui-messages-info-detail a').filter({ hasText: /HERE|SINI/i }).first();
    const certPage = page.getByText(/Virtual Certificate|Sijil Maya/i).first();
    let viaHere = false;
    if (await here.isVisible({ timeout: 3000 }).catch(() => false)) {
      await here.click();
      await waitForAjaxIdle(page);
      await page.waitForTimeout(3000);
      viaHere = !(await viewCert.isVisible().catch(() => false)) && (await page.locator('table.ui-selectoneradio').count()) > 0;
      evidence.log(`Followed HERE → ${new URL(page.url()).pathname}`);
    }
    for (let attempt = 1; !viaHere && attempt <= 3 && !(await viewCert.isVisible().catch(() => false)); attempt++) {
      if (attempt === 2) {
        // The portal menu is built at login: log in again so the new certificate link shows
        await ssoLogout(page, env);
        await ssoLogin(page, env, acct.username, acct.password, evidence.log);
      }
      await page.goto(`${env.baseURL}/web/epapp/dashboard`);
      await waitForAjaxIdle(page);
      await closeAnnouncement(page);
      const overview = page.getByRole('menuitem', { name: /^Overview$/ }).or(page.getByRole('link', { name: /^Overview$/ })).first();
      if (await overview.isVisible().catch(() => false)) { await overview.click(); await waitForAjaxIdle(page); await page.waitForTimeout(2000); }
      if (await viewCert.isVisible({ timeout: 10_000 }).catch(() => false)) break;
    }
    if (!viaHere && !(await viewCert.isVisible().catch(() => false))) {
      const links = (await page.locator('a:visible').allInnerTexts()).map(clean).filter((t) => t && t.length < 50);
      await evidence.capture('no_certificate_link', { step: 'Dashboard after the registration fee', expected: 'View Virtual Certificate link', actual: links.join(' | ').slice(0, 300) });
      throw new Error(`No "View Virtual Certificate" link on the dashboard. Visible links: ${links.join(' | ')}`);
    }
    if (!viaHere) {
      await viewCert.click();
      await waitForAjaxIdle(page);
      await page.waitForTimeout(3000);
    }
    await evidence.capture('certificate_page', { step: 'View Virtual Certificate opened', expected: 'Declaration questions or the certificate', actual: clean(await page.locator('#main-content, #content').first().innerText().catch(() => '')).slice(0, 200) });
    // First view asks two Ya/Tidak declaration questions; later views show the certificate directly.
    // Right after the fee the list can still say "No records found": reload until the certificate is there.
    let certText = '';
    for (let i = 0; i < 20; i++) {
      if (await page.locator('table.ui-selectoneradio').count()) {
        const vvc = new VirtualCertAction(page);
        await vvc.selectAnswer(0, 'Ya');
        await vvc.selectAnswer(1, 'Ya');
        await vvc.clickSubmit();
        await vvc.clickYes();
        await waitForAjaxIdle(page);
        await page.waitForTimeout(5000);
      }
      certText = clean(await page.locator('#main-content, #content').first().innerText().catch(() => ''));
      if (!/No records found|Tiada rekod/i.test(certText)) break;
      evidence.log(`Certificate not released yet (check ${i + 1}); reloading in 30s`);
      await page.waitForTimeout(30_000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitForAjaxIdle(page);
      await page.waitForTimeout(3000);
    }
    void certPage;
    if (/No records found|Tiada rekod/i.test(certText)) {
      await evidence.capture('no_certificate', { step: 'View Virtual Certificate', expected: 'MOF certificate shown', actual: certText.slice(0, 200) });
      throw new Error('Virtual certificate still "No records found" after 10 minutes');
    }
    evidence.log(`Certificate page: ${certText.slice(0, 500)}`);
    await evidence.capture('virtual_certificate', { step: 'View Virtual Certificate', expected: 'MOF certificate shown', actual: certText.slice(0, 200) });
    const certNo = certText.match(/\b(?:No\.?\s*(?:Sijil|Certificate)[^A-Z0-9]*)?([A-Z]{1,4}-?\d{6,}[A-Z0-9-]*)/)?.[1] ?? '';
    note(acct, `certificate viewed${certNo ? ` (${certNo})` : ''}`);
    audit(env.name, WHO, `REG-004 virtual certificate of ${acct.applicationNo}`, `**Virtual certificate viewed** ${certNo}`, 'View', 'done');
    evidence.actual(`Virtual certificate shown${certNo ? `: ${certNo}` : ''}`);
    await ssoLogout(page, env);
    return certNo;
}
