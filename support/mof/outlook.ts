import fs from 'node:fs';
import path from 'node:path';
import { chromium, type Browser, type Page } from '@playwright/test';
import ExcelJS from 'exceljs';
import { CREDENTIALS_XLSX } from '../credentials';

/**
 * Microsoft 365 mailboxes (newsupplier00x@commercedc.com.my, user's choice 2026-11-18) read through
 * Outlook on the web in a separate headless browser. Mailbox logins are the rows of .auth/credentials.xlsx
 * whose Role is "Outlook mailbox" (Username = e-mail). The signed-in session is kept in
 * .auth/outlook-<local part>.json so later runs skip the sign-in.
 */
export interface Mailbox {
  email: string;
  password: string;
}

export interface OutlookMail {
  subject: string;
  html: string;
  text: string;
}

const AUTH_DIR = path.resolve(__dirname, '..', '..', '.auth');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const cellText = (v: ExcelJS.CellValue) => (v == null ? '' : String(typeof v === 'object' && 'text' in v ? v.text : v).trim());

export async function loadMailboxes(env: string): Promise<Mailbox[]> {
  if (!fs.existsSync(CREDENTIALS_XLSX)) return [];
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(CREDENTIALS_XLSX);
  const ws = wb.getWorksheet('Credentials');
  if (!ws) return [];
  const header = (ws.getRow(1).values as ExcelJS.CellValue[]).map(cellText);
  const [e, r, u, p] = ['Environment', 'Role', 'Username', 'Password'].map((n) => header.indexOf(n));
  const out: Mailbox[] = [];
  for (let i = 2; i <= ws.rowCount; i++) {
    const row = ws.getRow(i);
    if (cellText(row.getCell(e).value).toUpperCase() !== env.toUpperCase()) continue;
    if (!/outlook/i.test(cellText(row.getCell(r).value))) continue;
    const email = cellText(row.getCell(u).value);
    const password = cellText(row.getCell(p).value);
    if (email && password) out.push({ email, password });
  }
  return out;
}

const statePath = (email: string) => path.join(AUTH_DIR, `outlook-${email.split('@')[0]}.json`);

async function signIn(page: Page, box: Mailbox, log: (m: string) => void) {
  log(`Outlook: signing in as ${box.email}`);
  await page.locator('input[type=email]').fill(box.email);
  await page.locator('input[type=submit]').click();
  await page.locator('input[type=password]').waitFor({ timeout: 30_000 });
  await page.locator('input[type=password]').fill(box.password);
  await page.locator('input[type=submit]').click();
  await page.waitForTimeout(5000);
  const err = page.locator('#passwordError, #usernameError');
  if (await err.isVisible().catch(() => false)) throw new Error(`Outlook sign-in for ${box.email} failed: ${clean(await err.innerText())}`);
  const kmsi = page.locator('#idSIButton9'); // "Stay signed in?" → Yes
  if (await kmsi.isVisible().catch(() => false)) await kmsi.click();
}

/** Open the inbox (signing in if the saved session has expired). */
async function openInbox(browser: Browser, box: Mailbox, log: (m: string) => void) {
  const file = statePath(box.email);
  const context = await browser.newContext(fs.existsSync(file) ? { storageState: file } : {});
  const page = await context.newPage();
  await page.goto('https://outlook.office.com/mail/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(3000);
  if (/login\.microsoftonline|login\.live/.test(page.url())) await signIn(page, box, log);
  await page.locator('div[role=option]').first().waitFor({ timeout: 60_000 }).catch(() => {});
  await context.storageState({ path: file });
  return { context, page };
}

/**
 * Wait for the newest mail whose list entry matches `subject` and whose body matches `mustContain`
 * (use something unique to this registration, e.g. the company name, since the mailboxes are reused).
 */
export async function readOutlook(
  box: Mailbox,
  subject: RegExp,
  log: (m: string) => void,
  { timeoutMs = 20 * 60_000, pollMs = 20_000, mustContain }: { timeoutMs?: number; pollMs?: number; mustContain: RegExp },
): Promise<OutlookMail> {
  const browser = await chromium.launch({ headless: process.env.OUTLOOK_HEADED !== '1' });
  try {
    const { page } = await openInbox(browser, box, log);
    const started = Date.now();
    let attempt = 0;
    while (Date.now() - started < timeoutMs) {
      attempt++;
      const items = page.locator('div[role=option]');
      const n = Math.min(await items.count().catch(() => 0), 25);
      const seen: string[] = [];
      for (let i = 0; i < n; i++) {
        const item = items.nth(i);
        const label = clean((await item.innerText().catch(() => '')) || (await item.getAttribute('aria-label')) || '');
        seen.push(label.slice(0, 80));
        if (!subject.test(label)) continue;
        await item.click().catch(() => {});
        const body = page.locator('div[aria-label="Message body"]').first();
        await body.waitFor({ timeout: 15_000 }).catch(() => {});
        await page.waitForTimeout(1500);
        const html = await body.innerHTML().catch(() => '');
        const text = clean(await body.innerText().catch(() => ''));
        if (mustContain.test(text) || mustContain.test(html)) {
          log(`Outlook ${box.email}: found "${label.slice(0, 120)}"`);
          return { subject: label, html, text };
        }
        if (attempt === 1) log(`Outlook ${box.email}: "${label.slice(0, 80)}" is for another registration (${text.slice(0, 120)}…)`);
      }
      log(`Outlook ${box.email}: check ${attempt}, no mail matching ${subject} + ${mustContain} among ${n} [${seen.slice(0, 3).join(' | ')}]; next check in ${pollMs / 1000}s`);
      await page.waitForTimeout(pollMs);
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.locator('div[role=option]').first().waitFor({ timeout: 60_000 }).catch(() => {});
    }
    await page.screenshot({ path: `test-results/outlook_${box.email.split('@')[0]}_timeout.png` }).catch(() => {});
    throw new Error(`Outlook ${box.email}: no mail matching ${subject} + ${mustContain} after ${Math.round(timeoutMs / 60_000)} min`);
  } finally {
    await browser.close().catch(() => {});
  }
}
