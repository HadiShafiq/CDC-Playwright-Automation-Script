import path from 'node:path';
import type { Page } from '@playwright/test';
import { openTasks } from '../../core/bpm-tasks';
import { loadMailboxes, readOutlook } from '../../mof/outlook';
import { pageMessages, pfIdle, pfSelect, pressAndConfirm } from '../qt/pf';
import { openTask } from '../qt/tasklist';

/**
 * PM Access Application (Permohonan Akses Maklumat Profil Syarikat / Kajian Pasaran), PM-001..032.
 * Built 2026-11-24 from the SIT screens (public page /company-profile-market-research, read-only exploration) and the
 * flow notes of the claude-skills memory reference-pm-access-application-flow (FL fullfilment and PM.zip):
 * submit (CP 75005 / MR 75000) → approver approves (75020 Pending Activation for a new IC, else 75010) or rejects
 * (75015, remarks required) → applicant activates from the e-mail link (75010). Approvers come from the BPM task pool
 * ("Approve Company Profile": UPS_APPROVER users; "Approve Market Research": EP_ADMIN_2 / MARKET_RESEARCH_APVR users).
 */
export interface AccessKinds {
  companyProfile: boolean;
  marketResearch: boolean;
}
export const PM_SIT = {
  url: '/company-profile-market-research',
  orgType: 'Badan Berkanun Persekutuan',
  orgName: 'Agensi Kelayakan Malaysia', // used by earlier SIT applications (AP260716000001558/1559)
  salutation: 'Cik',
  state: 'JOHOR',
};

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const byIdEnd = (page: Page, end: string) => page.locator(`[id$="${end}"]`).first();
const menuId = (page: Page, end: string) =>
  page.evaluate((e) => document.querySelector(`select[id$="${e}_input"]`)?.id.replace(/_input$/, '') ?? '', end);

/** First real option of a PrimeFaces menu (after its parent's AJAX filled it); prefers a plain place name over SIT test data. */
async function pickFirst(page: Page, end: string) {
  for (let i = 0; i < 20; i++) {
    const opts = await page.evaluate((e) => [...((document.querySelector(`select[id$="${e}_input"]`) as HTMLSelectElement | null)?.options ?? [])].map((o) => o.text.trim()).filter((t) => t && !/Pilih|Select/i.test(t)), end);
    const opt = opts.find((t) => /^[A-Z][A-Z .'()-]+$/.test(t) && !/TEST|AUDIT/i.test(t)) ?? opts[0] ?? '';
    if (opt) {
      await pfSelect(page, await menuId(page, end), opt);
      await pfIdle(page);
      return opt;
    }
    await page.waitForTimeout(500);
  }
  throw new Error(`no option in ${end}`);
}

async function tick(page: Page, end: string) {
  const box = page.locator(`[id$="${end}"] .ui-chkbox-box`).first();
  if (!(await box.getAttribute('class'))?.includes('ui-state-active')) await box.click();
  await pfIdle(page);
}

/** PM-001 / PM-002: an applicant (new IC) submits the public Access Application. Returns the application number. */
export async function submitAccessApplication(page: Page, baseURL: string, kinds: AccessKinds, log: (m: string) => void) {
  const box = (await loadMailboxes('SIT'))[0];
  if (!box) throw new Error('No Outlook mailbox in .auth/credentials.xlsx (Role "Outlook mailbox") for the activation e-mail');
  const ic = `9001${digits(8)}`;
  const name = `QA AUTO PEMOHON ${digits(4)}`;
  log(`applicant ${name}, IC ${ic}, e-mail ${box.email}, ${kinds.companyProfile ? 'Company Profile' : ''}${kinds.companyProfile && kinds.marketResearch ? ' + ' : ''}${kinds.marketResearch ? 'Market Research' : ''}`);
  await page.goto(`${baseURL}${PM_SIT.url}`, { waitUntil: 'networkidle' });
  await page.locator('.ui-chkbox-box').first().click(); // terms and conditions
  await page.getByRole('button', { name: /^(Seterusnya|Next)$/ }).first().click();
  await page.locator('select[id$="somAccessApplOrgType_input"]').waitFor({ state: 'attached', timeout: 60_000 });
  await pfIdle(page);

  await pfSelect(page, await menuId(page, 'somAccessApplOrgType'), PM_SIT.orgType);
  await pfIdle(page);
  await byIdEnd(page, 'lovOrglov').locator('xpath=following::a[1]').click();
  const dlg = page.locator('.ui-dialog:visible').filter({ hasText: /Organisasi|Organization/ }).last();
  await dlg.getByText(PM_SIT.orgName, { exact: true }).first().click();
  await dlg.getByRole('button', { name: /^(Pilih|Select)$/ }).click();
  await pfIdle(page);

  await pfSelect(page, await menuId(page, 'somSalutation'), PM_SIT.salutation);
  await byIdEnd(page, 'itName').fill(name);
  await byIdEnd(page, 'itIdentityNo').fill(ic);
  await byIdEnd(page, 'itDesignation').fill('Pegawai Ujian QA');
  await byIdEnd(page, 'userGrade').fill('N41');
  await byIdEnd(page, 'usrEmail').fill(box.email);
  await byIdEnd(page, 'conEmail').fill(box.email);
  const area = page.locator('[id$="areaCodeCompId"]');
  const phone = page.locator('[id$="phoneNoCompId"]');
  for (let i = 0; i < 2; i++) {
    await area.nth(i).fill('3');
    await phone.nth(i).fill(`8${digits(6)}`);
  }
  await byIdEnd(page, 'itAddress1').fill('Aras 1, Kompleks Ujian QA');
  await byIdEnd(page, 'dpostCode').fill('81300');
  await pfSelect(page, await menuId(page, 'dState'), PM_SIT.state);
  await pfIdle(page);
  log(`district ${await pickFirst(page, 'dDistrict')}, city ${await pickFirst(page, 'dCity')}`);
  if (kinds.companyProfile) await tick(page, 'isCompanyProfileChxBox');
  if (kinds.marketResearch) await tick(page, 'isMarketResearchChxBox');
  await uploadAttachments(page, log);
  await tick(page, 'isDeclChkBox');

  const msgs = await pressAndConfirm(page, 'Serah', log);
  const all = [...msgs, ...(await pageMessages(page)), (await page.locator('body').innerText()).slice(0, 3000)].join(' ');
  const appl = all.match(/\bAP\d{15}\b/)?.[0];
  if (!appl) throw new Error(`Access application not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { appl, messages: [...msgs, `${appl} submitted for ${name} (${ic})`], mailbox: box.email };
}

const PDF = path.join(__dirname, '..', '..', '..', 'fixtures', 'files', 'File_pdf_for_testing.pdf');

/**
 * Dokumen Sokongan: every mandatory row ("*Salinan Kad Pengenalan …", "*Surat Pengesahan oleh Ketua Jabatan") gets the
 * test PDF through its Lampiran link; checked afterwards (SIT ERR-100022 otherwise, 2026-11-24).
 */
async function uploadAttachments(page: Page, log: (m: string) => void) {
  // "Pilih Fail" dialog (SIT 2026-11-24): Pilih opens the file chooser, the file is listed with an upload button
  // (td.start), the dialog closes after the upload and the row's Lampiran cell shows the file name.
  const names = await page.locator('td', { hasText: /^\s*\*/ }).allInnerTexts();
  if (!names.length) throw new Error('No mandatory supporting document rows (Dokumen Sokongan) on the form');
  for (const raw of names) {
    const name = raw.trim();
    const row = () => page.locator('tr').filter({ has: page.locator('td', { hasText: name }) }).last();
    const cell = () => row().locator('td').nth(1);
    if ((await cell().innerText()).trim()) continue; // already attached
    await row().locator('a').last().click();
    await pfIdle(page);
    const dlg = page.locator('.ui-dialog:visible').filter({ hasText: 'Pilih Fail' });
    await dlg.waitFor({ timeout: 15_000 });
    const chooser = page.waitForEvent('filechooser', { timeout: 15_000 });
    await dlg.locator('label.fileinput-button').click();
    await (await chooser).setFiles(PDF);
    const upload = dlg.locator('table.files td.start button, table.files button').first();
    await upload.waitFor({ timeout: 15_000 });
    await upload.click();
    await pfIdle(page);
    for (let k = 0; k < 60 && !(await cell().innerText()).trim(); k++) await page.waitForTimeout(500);
    const got = (await cell().innerText()).trim();
    if (!got) throw new Error(`Attachment not accepted for "${name}"`);
    log(`attached ${got} to "${name.slice(0, 60)}"`);
  }
}

/** BPM activity of each track. */
export const TASK: Record<'CP' | 'MR', string> = { CP: 'Approve Company Profile', MR: 'Approve Market Research' };

/**
 * PM-011/012 (approve) and PM-031/032 (reject): one approver of the task's pool opens the application and decides the
 * track. The pool is read from the BPM task (SIT WFTASK); the first listed user is used (shared officer password).
 */
export async function decideAccess(
  ctx: { page: Page; baseURL: string; log: (m: string) => void; as: (u: string) => Promise<void> },
  appl: string,
  track: 'CP' | 'MR',
  decision: 'approve' | 'reject',
) {
  const { page, baseURL, log } = ctx;
  let task = openTasks(appl, TASK[track])[0];
  for (let i = 0; !task && i < 20; i++) {
    await page.waitForTimeout(15_000);
    task = openTasks(appl, TASK[track])[0];
  }
  if (!task) throw new Error(`no open "${TASK[track]}" task for ${appl} (SIT WFTASK)`);
  const user = task.claimedBy || task.assignees[0];
  if (!user) throw new Error(`"${TASK[track]}" of ${appl} has no user in its pool (${task.groupAssignees.join(', ') || 'none'})`);
  log(`${TASK[track]}: pool of ${task.assignees.length}, using ${user}`);
  await ctx.as(user);
  await openTask(page, baseURL, appl, log);
  const remark = page.locator('textarea:visible:enabled').last();
  if (decision === 'reject' || (await remark.count())) await remark.fill(decision === 'reject' ? 'Ditolak oleh ujian automasi QA' : 'Diluluskan oleh ujian automasi QA').catch(() => {});
  const names = decision === 'approve' ? ['Lulus', 'Approve', 'Luluskan'] : ['Tolak', 'Reject'];
  for (const n of names) {
    if (await page.getByRole('button', { name: n, exact: true }).locator('visible=true').count()) {
      const msgs = await pressAndConfirm(page, n, log);
      if (!msgs.some((m) => /berjaya|success|lulus|approved|tolak|reject/i.test(m))) throw new Error(`${n} not confirmed: ${msgs.join(' | ') || 'no message'}`);
      return { messages: msgs };
    }
  }
  const buttons = (await page.locator('button:visible').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  throw new Error(`no ${names.join('/')} button on ${appl}; buttons: ${buttons.join(', ')}`);
}

/** PM-021/022: the applicant opens the activation link from the e-mail. */
export async function activateAccess(page: Page, appl: string, log: (m: string) => void) {
  const boxes = await loadMailboxes('SIT');
  const box = boxes[0];
  if (!box) throw new Error('No Outlook mailbox in .auth/credentials.xlsx');
  const mail = await readOutlook(box, /Akses|Access|Pengaktifan|Activation/i, log, { mustContain: new RegExp(appl) });
  const link = mail.html.match(/href="([^"]*(activation|aktif)[^"]*)"/i)?.[1]?.replace(/&amp;/g, '&');
  if (!link) throw new Error(`No activation link in the e-mail "${mail.subject.slice(0, 80)}"`);
  log(`activation link ${link.slice(0, 90)}…`);
  await page.goto(link, { waitUntil: 'networkidle' });
  await pfIdle(page);
  const confirm = page.getByRole('button', { name: /^(Aktif|Aktifkan|Activate|Hantar|Submit|Ya|Yes)$/ }).first();
  const msgs = (await confirm.isVisible().catch(() => false)) ? await pressAndConfirm(page, (await confirm.innerText()).trim(), log) : await pageMessages(page);
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  if (![...msgs, text].some((m) => /berjaya|success|diaktifkan|activated/i.test(m))) throw new Error(`Activation not confirmed: ${(msgs.join(' | ') || text).slice(0, 300)}`);
  return { messages: msgs.length ? msgs : [text.slice(0, 200)] };
}
