import type { BrowserContext, Page } from '@playwright/test';

/**
 * YOPmail (https://yopmail.com): disposable inboxes, no password, no IMAP. The inbox is read
 * through its web page in a tab of the test's own browser context: the message list is in
 * iframe#ifinbox, the opened message in iframe#ifmail.
 */
export const yopmailAddress = (local: string) => `${local}@yopmail.com`;

export interface YopMail {
  subject: string;
  from: string;
  /** Body HTML (links keep their href). */
  html: string;
  /** Body text. */
  text: string;
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Open the inbox of `local` on a new tab (closed by the caller). */
async function openInbox(context: BrowserContext, local: string): Promise<Page> {
  const tab = await context.newPage();
  await tab.goto(`https://yopmail.com/en/?login=${encodeURIComponent(local)}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  // Consent / cookie dialogs, if any
  for (const name of [/Accept|Agree|Consent|I agree/i]) {
    const btn = tab.getByRole('button', { name }).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) await btn.click().catch(() => {});
  }
  // Some landings show the login box instead of the inbox: submit the name
  const login = tab.locator('#login');
  if (await login.isVisible({ timeout: 3000 }).catch(() => false)) {
    await login.fill(local);
    await tab.keyboard.press('Enter');
  }
  await tab.locator('iframe#ifinbox').waitFor({ state: 'attached', timeout: 60_000 });
  return tab;
}

/**
 * YOPmail sits behind a Cloudflare "Verify you are human" check that headless browsers cannot pass.
 * Try to tick it; if it stays, wait (up to YOPMAIL_HUMAN_WAIT_MS, default 4 min) for the tester to
 * tick it in the visible browser.
 */
async function passHumanCheck(tab: Page, log: (m: string) => void) {
  const challenge = tab.locator('iframe[src*="challenges.cloudflare.com"], :text("Verify you are human"), :text("confirm you\'re human")').first();
  if (!(await challenge.isVisible({ timeout: 3000 }).catch(() => false))) return;
  const box = tab.frameLocator('iframe[src*="challenges.cloudflare.com"]').locator('input[type="checkbox"], .ctp-checkbox-label, body').first();
  await box.click({ timeout: 5000 }).catch(() => {});
  const waitMs = Number(process.env.YOPMAIL_HUMAN_WAIT_MS ?? 240_000);
  log(`YOPmail shows a Cloudflare "Verify you are human" check. Please tick it in the YOPmail tab (waiting up to ${waitMs / 1000}s)`);
  const started = Date.now();
  while (Date.now() - started < waitMs) {
    await tab.waitForTimeout(3000);
    if (!(await challenge.isVisible().catch(() => false))) {
      log('Cloudflare check passed');
      return;
    }
  }
  throw new Error('YOPmail: the Cloudflare "Verify you are human" check was not passed; run with --headed and tick it');
}

/**
 * Wait for a mail whose subject matches `subject` (and whose body contains `mustContain`, if given),
 * reloading the inbox every `pollMs`. Returns the newest match.
 */
export async function readYopmail(
  context: BrowserContext,
  local: string,
  subject: RegExp,
  log: (m: string) => void,
  { timeoutMs = 15 * 60_000, pollMs = 20_000, mustContain = '' as string | RegExp } = {},
): Promise<YopMail> {
  const tab = await openInbox(context, local);
  await passHumanCheck(tab, log);
  const started = Date.now();
  let attempt = 0;
  try {
    while (Date.now() - started < timeoutMs) {
      attempt++;
      await passHumanCheck(tab, log);
      const inbox = tab.frameLocator('iframe#ifinbox');
      const rows = inbox.locator('div.m');
      const n = await rows.count().catch(() => 0);
      const seen: string[] = [];
      for (let i = 0; i < n; i++) {
        const row = rows.nth(i);
        const subj = clean(await row.locator('.lms').innerText().catch(async () => clean(await row.innerText())));
        const from = clean(await row.locator('.lmf').innerText().catch(() => ''));
        seen.push(subj);
        if (!subject.test(subj)) continue;
        await row.locator('button, a, .lm').first().click().catch(() => row.click());
        await tab.waitForTimeout(3000);
        const mail = tab.frameLocator('iframe#ifmail');
        const body = mail.locator('#mail, #mailmillieu, body').first();
        const html = await body.innerHTML().catch(() => '');
        const text = clean(await body.innerText().catch(() => ''));
        const ok = !mustContain || (mustContain instanceof RegExp ? mustContain.test(text) || mustContain.test(html) : text.includes(mustContain) || html.includes(mustContain));
        if (ok) {
          log(`YOPmail ${local}: found "${subj}" from ${from}`);
          return { subject: subj, from, html, text };
        }
      }
      log(`YOPmail ${local}: attempt ${attempt}, ${n} mail(s)${seen.length ? ` [${seen.slice(0, 5).join(' | ')}]` : ''}, no match for ${subject}; next check in ${pollMs / 1000}s`);
      await tab.waitForTimeout(pollMs);
      const refresh = tab.locator('#refresh');
      if (await refresh.isVisible().catch(() => false)) await refresh.click().catch(() => {});
      else await tab.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await tab.waitForTimeout(3000);
    }
    await tab.screenshot({ path: `test-results/yopmail_${local}_timeout.png`, fullPage: true }).catch(() => {});
    throw new Error(`YOPmail ${local}: no mail matching ${subject} after ${Math.round(timeoutMs / 60_000)} min`);
  } finally {
    await tab.close().catch(() => {});
  }
}
