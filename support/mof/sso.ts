import { expect, type Page } from '@playwright/test';
import type { EnvConfig } from '../../config/environments';
import { waitForAjaxIdle } from '../primefaces';

const onLogin = (u: URL, env: EnvConfig) => u.host === env.ssoHost || u.pathname.toLowerCase().startsWith('/ssologin');

/**
 * SSO login with an explicit username/password (the MOF registration chain logs in as the new
 * supplier and as several officers in one run). Passwords are never logged.
 */
export async function ssoLogin(page: Page, env: EnvConfig, username: string, password: string, log: (m: string) => void) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.goto(`${env.baseURL}/web/epapp/dashboard`);
    await waitForAjaxIdle(page);
    if (!onLogin(new URL(page.url()), env)) {
      // Someone else's session is still open in this browser: end it first.
      await ssoLogout(page, env);
      await page.goto(`${env.baseURL}/web/epapp/dashboard`);
      await waitForAjaxIdle(page);
    }
    await page.getByRole('textbox', { name: /ID Log Masuk|Login ID/ }).fill(username);
    await page.getByRole('textbox', { name: /Kata Laluan|Password/ }).fill(password);
    await page.getByRole('button', { name: /^(Log Masuk|Login)$/ }).click();
    const ok = await page.waitForURL((u) => !onLogin(u, env), { timeout: 60_000 }).then(() => true, () => false);
    if (!ok) throw new Error(`Login as ${username} failed: still on the SSO page (wrong password, or the account is not active yet)`);
    await waitForAjaxIdle(page);
    await closeAnnouncement(page);
    if (/^\/web\/epapp\//.test(new URL(page.url()).pathname)) {
      log(`Logged in as ${username}`);
      await ensureEnglish(page);
      return;
    }
    log(`SIT ended the new session of ${username} straight away; signing out of SSO and retrying (${attempt}/3)`);
    await ssoLogout(page, env);
  }
  throw new Error(`SIT keeps ending the ${username} session right after login`);
}

/** Ends the SSO session (not just the portal one), so the next login starts clean. */
export async function ssoLogout(page: Page, env: EnvConfig) {
  const back = encodeURIComponent(`${env.baseURL}/c/portal/logout`);
  await page.goto(`http://${env.ssoHost}/oam/server/logout?end_url=${back}`).catch(() => {});
  await waitForAjaxIdle(page);
}

/** The TERKINI announcement modal that SIT shows after login. */
export async function closeAnnouncement(page: Page) {
  const modal = page.locator('.yui3-widget-modal').filter({ has: page.locator('h3', { hasText: 'TERKINI' }) });
  if (await modal.isVisible().catch(() => false)) {
    await modal.locator('.modal-footer button', { hasText: 'OK' }).click();
    await waitForAjaxIdle(page);
  }
}

/** Switch the portal to English (the CDC page objects use English labels). */
export async function ensureEnglish(page: Page) {
  const lang = page.locator('#_82_languageId');
  if ((await lang.count()) && (await lang.inputValue()) !== 'en_US') {
    await lang.selectOption('en_US');
    await page.waitForLoadState('load');
    await waitForAjaxIdle(page);
    await closeAnnouncement(page);
  }
}

/** "Welcome, NAME" on the dashboard (the account-menu label used by the logout menu). */
export async function displayName(page: Page): Promise<string> {
  const welcome = page.locator('div.portlet-body > div').filter({ hasText: /Welcome,|Selamat Datang,/ }).first();
  await expect(welcome).toBeVisible({ timeout: 20_000 });
  const text = (await welcome.innerText()).trim();
  return text.match(/(?:Welcome|Selamat Datang),\s*(.+)/i)?.[1]?.trim() ?? '';
}
