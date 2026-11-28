// READ-ONLY screen probe (npm run qa -- probe): log in as a user, open a document's task from the Task List (claiming a
// group task, as the runner does), then read the screen and each side menu / tab given: menus, buttons (with their
// disabled state), editable fields with labels, select options, checkboxes, picklists, visible dialogs, messages, and a
// full-page screenshot. It clicks ONLY task-list links and menu / tab items: never Save, Submit, Approve, Add or uploads.
//   npm run qa -- probe --env sit --doc CT260000000002328 --user 881204115188 [--tabs "Meeting Details,Decision"]
//   npm run qa -- probe --env sit --doc CT260000000002328 --account KAT-040            (a Katalon step's account)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, type Page } from '@playwright/test';
import { getEnv } from '../../config/environments';
import { loadPasswordFor, loadSharedOfficerPassword } from '../../support/credentials';
import { closeAnnouncement, ssoLogin, ssoLogout } from '../../support/mof/sso';
import { pfIdle } from '../../support/modules/qt/pf';
import { openTask } from '../../support/modules/qt/tasklist';

const outDir = path.join(os.tmpdir(), 'qa-probe');

async function read(page: Page, where: string, n: number) {
  const info = await page.evaluate(() => {
    const vis = (e: Element) => !!(e as HTMLElement).offsetParent;
    const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
    // the label of a field: the nearest ancestor (up to 4 levels) that has text
    const label = (e: Element) => {
      let n: Element | null = e;
      for (let i = 0; i < 4 && n; i++) {
        n = n.parentElement;
        const t = clean((n as HTMLElement | null)?.innerText);
        if (t) return t.slice(0, 90);
      }
      return '';
    };
    const idTail = (e: Element) => (e as HTMLElement).id.split(':').slice(-2).join(':');
    return {
      url: location.pathname,
      title: clean((document.querySelector('#main-content h1, #main-content h2, .portlet-title') as HTMLElement | null)?.innerText),
      menus: [...new Set([...document.querySelectorAll('li.ui-tabmenuitem, ul.ui-tabs-nav li')].filter(vis).map((e) => clean((e as HTMLElement).innerText)).filter(Boolean))],
      buttons: [...document.querySelectorAll('button, input[type=submit]')]
        .filter((b) => vis(b) && !b.closest('.ui-dialog'))
        .map((b) => {
          const t = clean((b as HTMLElement).innerText || (b as HTMLInputElement).value || b.getAttribute('title'));
          const off = (b as HTMLButtonElement).disabled || b.classList.contains('ui-state-disabled');
          return t && t !== 'ui-button' ? `${t}${off ? ' (disabled)' : ''}` : '';
        })
        .filter(Boolean),
      fields: [...document.querySelectorAll('input:not([type=hidden]):not([type=password]):not([type=checkbox]):not([type=radio]), textarea')]
        .filter((e) => vis(e) && !e.closest('.ui-dialog') && !/_focus$/.test(e.id))
        .map((e) => {
          const i = e as HTMLInputElement;
          return `${i.readOnly || i.disabled ? '(read-only) ' : ''}${i.type} ${idTail(e)} = "${clean(i.value).slice(0, 40)}" | ${label(e)}`;
        }),
      selects: [...document.querySelectorAll('select')]
        .filter((s) => (s.closest('.ui-selectonemenu') as HTMLElement | null)?.offsetParent || vis(s))
        .filter((s) => !s.closest('.ui-dialog'))
        .map((s) => `${idTail(s)} [${(s as HTMLSelectElement).disabled ? 'disabled' : clean((s as HTMLSelectElement).selectedOptions[0]?.text)}] ${[...(s as HTMLSelectElement).options].map((o) => clean(o.text)).slice(0, 25).join(' / ')}`),
      checkboxes: [...document.querySelectorAll('.ui-chkbox, .ui-radiobutton')]
        .filter((c) => vis(c) && !c.closest('.ui-dialog'))
        .map((c) => {
          const i = c.querySelector('input') as HTMLInputElement | null;
          return `${i?.checked ? '[x]' : '[ ]'}${i?.disabled ? ' (disabled)' : ''} ${label(c)}`;
        }),
      picklists: [...document.querySelectorAll('.ui-picklist')].filter(vis).map((p) => ({
        available: [...p.querySelectorAll('ul.ui-picklist-source li')].map((l) => clean((l as HTMLElement).innerText)),
        selected: [...p.querySelectorAll('ul.ui-picklist-target li')].map((l) => clean((l as HTMLElement).innerText)),
      })),
      dialogs: [...document.querySelectorAll('.ui-dialog')]
        .filter((d) => (d as HTMLElement).offsetWidth && getComputedStyle(d).display !== 'none' && clean((d as HTMLElement).innerText))
        .map((d) => clean((d as HTMLElement).innerText).slice(0, 300)),
      messages: [...document.querySelectorAll('.ui-messages-error, .ui-messages-info, .ui-messages-warn, .portlet-msg-error, .portlet-msg-success')]
        .map((m) => clean((m as HTMLElement).innerText))
        .filter(Boolean),
      text: clean((document.querySelector('#main-content') as HTMLElement | null)?.innerText).slice(0, 1500),
    };
  });
  const shot = path.join(outDir, `${process.env.QA_DOC}-${String(n).padStart(2, '0')}-${where.replace(/\W+/g, '_')}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const lines = [
    `\n===== ${where} =====`,
    `url ${info.url}${info.title ? ` · ${info.title}` : ''}`,
    `menus: ${info.menus.join(' | ') || '-'}`,
    `buttons: ${info.buttons.join(' | ') || '-'}`,
    ...(info.messages.length ? [`messages: ${info.messages.join(' | ')}`] : []),
    ...(info.fields.length ? ['fields:', ...info.fields.map((f) => `  ${f}`)] : []),
    ...(info.selects.length ? ['selects:', ...info.selects.map((s) => `  ${s}`)] : []),
    ...(info.checkboxes.length ? ['checkboxes / radios:', ...info.checkboxes.map((c) => `  ${c}`)] : []),
    ...info.picklists.map((p) => `picklist: available [${p.available.join(', ')}] · selected [${p.selected.join(', ')}]`),
    ...(info.dialogs.length ? ['open dialogs:', ...info.dialogs.map((d) => `  ${d}`)] : []),
    `text: ${info.text}`,
    `screenshot: ${shot}`,
  ];
  console.log(lines.join('\n'));
}

test('probe @tool', async ({ page }) => {
  test.skip(process.env.QA_TOOL !== 'probe');
  test.setTimeout(10 * 60_000);
  const env = getEnv();
  if (env.name !== 'SIT') throw new Error('probe runs on SIT only');
  const doc = process.env.QA_DOC ?? '';
  if (!doc) throw new Error('give --doc <document number>');
  fs.mkdirSync(outDir, { recursive: true });
  // login: --account KAT-0xx (that Katalon step's account) or --user <login ID> (credentials.xlsx / shared officer password)
  const accountOf = process.env.QA_ACCOUNT;
  const acc = accountOf ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '.auth', 'katalon-variables.json'), 'utf8'))[accountOf] : undefined;
  if (accountOf && !acc?.Username) throw new Error(`no Katalon account for ${accountOf} in .auth/katalon-variables.json`);
  const user = acc ? String(acc.Username) : (process.env.QA_USER ?? '');
  if (!user) throw new Error('give --user <login ID> or --account KAT-0xx');
  const pw = acc ? String(acc.Password) : ((await loadPasswordFor(env.name, user)) ?? (await loadSharedOfficerPassword(env.name)));
  if (!pw) throw new Error(`no password for ${user} in .auth/credentials.xlsx`);
  await ssoLogin(page, env, user, pw, (m) => console.log(m));
  try {
    await closeAnnouncement(page).catch(() => {});
    await openTask(page, env.baseURL, doc, (m) => console.log(m));
    await pfIdle(page);
    await page.waitForTimeout(1500);
    let n = 1;
    await read(page, 'task', n++);
    for (const t of (process.env.QA_TABS ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
      const item = page.locator('li.ui-tabmenuitem:visible a, ul.ui-tabs-nav li:visible a', { hasText: new RegExp(`^\\s*${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i') }).first();
      if (!(await item.count())) {
        console.log(`\n===== ${t} =====\nno menu / tab "${t}" on this screen`);
        continue;
      }
      await item.click();
      await pfIdle(page);
      await page.waitForTimeout(1000);
      await read(page, t, n++);
    }
  } finally {
    await ssoLogout(page, env).catch(() => {});
  }
});
