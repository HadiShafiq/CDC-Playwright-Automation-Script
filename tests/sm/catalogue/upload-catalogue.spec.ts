import path from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { test, expect, scenario } from '../../../fixtures/test';
import type { EnvConfig } from '../../../config/environments';
import { ssoLogin, ssoLogout } from '../../../support/mof/sso';
import { currentAccount, noteAccount, audit } from '../../../support/mof/accounts';
import { waitForAjaxIdle } from '../../../support/primefaces';

/*
 * Upload Catalogue for a newly registered MOF supplier (the latest account in .auth/mof-accounts.json,
 * or MOF_ACCOUNT=<loginId>), on SIT:
 *   CAT-001  Overview → Upload Catalogue → add a product and a service, no extension code (user, 2026-11-18:
 *            "dont use extension just add to catalogue"; extension codes are for later test cases)
 *            → price, UOM, image + basic specification, start/end date → Save → tick → Publish (declare)
 *
 * The product must still pass the "Choose Item" step, which only adds ticked extension rows
 * (ERR-715014 otherwise): every attribute set to "N A" gives one generic row, i.e. no real extension.
 * Items: CATALOGUE_ITEMS="14111512:product:10.00,85151501:service:150.00".
 *
 * DATA-CHANGING (SIT): creates and publishes catalogue items; each step is logged in knowledge/data-change-audit.md.
 */
test.describe.configure({ mode: 'serial' });

const CR = 'MOF-CAT';
const MODULE = 'Supplier Management / Upload Catalogue';
const WHO = 'User ("proceed to upload catalogue": 14111512 product, 85151501 service, no extension)';
const IMAGE = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'files', 'catalogue_item.png');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

interface Item { code: string; type: 'product' | 'service'; price: string }
const ITEMS: Item[] = (process.env.CATALOGUE_ITEMS ?? '14111512:product:10.00,85151501:service:150.00').split(',').map((s) => {
  const [code, type, price] = s.split(':');
  return { code, type: type as Item['type'], price };
});

async function messages(page: Page): Promise<string> {
  const m = page.locator('.ui-messages-info-detail, .ui-messages-error-detail, .ui-messages-warn-detail, .ui-growl-message');
  return clean((await m.allInnerTexts().catch(() => [])).join(' | '));
}

const draftRows = (page: Page) => page.locator('tbody[id$=":draftSupplierItemID_data"] > tr');
const draftRow = (page: Page, code: string) => draftRows(page).filter({ hasText: code }).first();

async function openUploadCatalogue(page: Page, env: EnvConfig) {
  await page.goto(`${env.baseURL}/web/epapp/dashboard`);
  await waitForAjaxIdle(page);
  await page.locator('a').filter({ hasText: /Upload Catalogue|Muat Naik Katalog/ }).first().click();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(2500);
}

/** Step 1 (Select Item) → step 2 (Choose Item) → Add to Catalogue; lands on the Draft list. */
async function addItem(page: Page, item: Item, log: (m: string) => void) {
  // From the Draft list, "Add new item" goes back to step 1
  const addNew = page.getByRole('button', { name: 'Add new item' });
  if (await addNew.isVisible().catch(() => false)) {
    await addNew.click();
    await waitForAjaxIdle(page);
    await page.waitForTimeout(2000);
  }
  await page.locator('[id$=":autocompleteId_input"]').fill(item.code);
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Search' }).click();
  await waitForAjaxIdle(page);
  await page.waitForTimeout(1500);
  await page.locator('tbody[id$="_data"] tr a').filter({ hasText: item.code }).first().click();
  await page.waitForTimeout(2500);

  const confirm = page.locator('.ui-dialog:visible').filter({ hasText: /add this service/i });
  if (await confirm.count()) {
    // Service: "Are you sure you want to add this service to catalogue?"
    await confirm.getByRole('button', { name: /^(OK|Yes|Ya)$/ }).first().click();
  } else {
    // Product: no extension; every attribute "N A" gives the one generic row
    await waitForAjaxIdle(page);
    const menus = page.locator('div.ui-selectonemenu').filter({ visible: true });
    for (let i = 0; i < (await menus.count()); i++) {
      await menus.nth(i).click();
      await page.locator('.ui-selectonemenu-panel:visible li').filter({ hasText: /N\s*\/?\s*A/ }).first().click();
      await waitForAjaxIdle(page);
      await page.waitForTimeout(600);
    }
    await page.getByRole('button', { name: 'Search' }).click();
    await waitForAjaxIdle(page);
    await page.waitForTimeout(2000);
    const rows = page.locator('tbody[id*="itemTableID"] tr');
    log(`Choose Item: ${clean((await rows.allInnerTexts()).join(' | '))}`);
    await rows.first().locator('.ui-chkbox-box').click();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: 'Add to Catalogue' }).click();
    await page.waitForTimeout(2000);
    const dlg = page.locator('.ui-dialog:visible').filter({ has: page.getByRole('button', { name: /^(OK|Yes|Ya)$/ }) });
    if (await dlg.count()) await dlg.getByRole('button', { name: /^(OK|Yes|Ya)$/ }).first().click();
  }
  await waitForAjaxIdle(page).catch(() => {});
  await page.waitForTimeout(3000);
  const msg = await messages(page);
  if (/ERR-/.test(msg)) throw new Error(`Adding ${item.code}: ${msg}`);
  await expect(draftRow(page, item.code), `${item.code} in the Draft list`).toBeVisible({ timeout: 30_000 });
}

/** Pick a UOM in the "Listing - UOM (Packaging)" dialog: by name if found on the list, else the first row. */
async function pickUom(page: Page, row: Locator, want: RegExp, log: (m: string) => void) {
  await row.locator('a[id$="lovLink"]').click();
  const dlg = page.locator('.ui-dialog').filter({ hasText: 'UOM (Packaging)' }).filter({ visible: true }).first();
  await dlg.waitFor({ timeout: 20_000 });
  await page.waitForTimeout(1000);
  const lovRows = dlg.locator('tbody[id$="_data"] tr');
  let target = lovRows.filter({ hasText: want }).first();
  if (!(await target.count())) target = lovRows.first();
  const name = clean(await target.innerText());
  await target.click();
  await page.waitForTimeout(800);
  await dlg.getByRole('button', { name: 'Select' }).click();
  await waitForAjaxIdle(page).catch(() => {});
  await page.waitForTimeout(1500);
  log(`UOM: ${name}`);
}

/** Image & Basic Specification dialog: upload the image, type the specification, Close. */
async function fillSpecification(page: Page, row: Locator, text: string) {
  await row.locator('a[onclick*="imageBasicDialog"]').click();
  const dlg = page.locator('[id$=":imageAndBasicId"]');
  await dlg.waitFor({ state: 'visible', timeout: 20_000 });
  await dlg.locator('input[type=file][id$="uploadImageBasicDirect_input"]').setInputFiles(IMAGE);
  await waitForAjaxIdle(page).catch(() => {});
  await page.waitForTimeout(3000);
  await dlg.locator('textarea[id$=":basicDesc"]').fill(text);
  await dlg.locator('textarea[id$=":basicDesc"]').blur();
  await page.waitForTimeout(800);
  await dlg.locator('[id$=":closeAction"]').click();
  await waitForAjaxIdle(page).catch(() => {});
  await page.waitForTimeout(1500);
}

/** Start Date: first selectable day of its calendar (today); End Date is auto-filled from the validity rule. */
async function fillDates(page: Page, row: Locator, log: (m: string) => void) {
  const inputs = row.locator('input[id$="_input"]').filter({ hasNot: page.locator('[type=checkbox]') });
  const triggers = row.locator('button.ui-datepicker-trigger');
  await triggers.nth(0).click();
  await page.locator('#ui-datepicker-div td:not(.ui-datepicker-unselectable) a.ui-state-default').first().click();
  await waitForAjaxIdle(page).catch(() => {});
  await page.waitForTimeout(2000);
  const dateInputs = row.locator('input.hasDatepicker, span.ui-calendar input');
  let start = await dateInputs.nth(0).inputValue().catch(() => '');
  let end = await dateInputs.nth(1).inputValue().catch(() => '');
  if (!end) {
    await triggers.nth(1).click();
    await page.locator('#ui-datepicker-div td:not(.ui-datepicker-unselectable) a.ui-state-default').last().click();
    await waitForAjaxIdle(page).catch(() => {});
    await page.waitForTimeout(1500);
    end = await dateInputs.nth(1).inputValue().catch(() => '');
  }
  void inputs;
  log(`Dates: ${start} → ${end}`);
  start ||= '';
  return { start, end };
}

test(
  'CAT-001 Upload Catalogue: add a product and a service without extension, complete and publish',
  scenario({
    cr: CR, id: 'CAT-001', module: MODULE, role: 'Supplier Administrator (new MOF supplier)', tags: ['@mof-registration', '@catalogue'],
    expected: 'Proposed — Pending QA Review: both items in Draft with price, UOM, image, specification and dates; Save succeeds; Publish with declaration succeeds',
  }),
  async ({ page, env, evidence }) => {
    test.setTimeout(20 * 60_000);
    const acct = currentAccount(env.name);
    if (!acct) throw new Error('No MOF account in .auth/mof-accounts.json; run the MOF registration first');
    await ssoLogin(page, env, acct.username, acct.password, evidence.log);
    try {
      await openUploadCatalogue(page, env);
      await evidence.capture('upload_catalogue', { step: 'Overview → Upload Catalogue', expected: 'Create New Catalogue Item (search, or the Draft list)' });

      // Add the items not yet in the Draft list
      for (const item of ITEMS) {
        if (await draftRow(page, item.code).count()) {
          evidence.log(`${item.code} already in the Draft list`);
          continue;
        }
        evidence.log(`Adding ${item.type} ${item.code}`);
        await addItem(page, item, evidence.log);
        audit(env.name, WHO, `CAT-001 Upload Catalogue (${acct.username})`, `**Catalogue item ${item.code} (${item.type}) added to Draft** (no extension)`, 'Add to Catalogue', 'Complete details, Publish');
        await evidence.capture(`added_${item.code}`, { step: `${item.code} added`, expected: `${item.code} in the Draft list` });
      }

      // Complete each row
      for (const item of ITEMS) {
        const row = draftRow(page, item.code);
        await row.locator('input[id$=":stdPrice"]').fill(item.price);
        await row.locator('input[id$=":stdPrice"]').blur();
        await waitForAjaxIdle(page).catch(() => {});
        await pickUom(page, draftRow(page, item.code), item.type === 'service' ? /Activity unit/i : /^\s*(EA|PCE|UNT|PC)\b|\bunit\b|piece|each/i, evidence.log);
        await fillSpecification(page, draftRow(page, item.code), item.type === 'service'
          ? 'Perkhidmatan kawalan kebersihan makanan: pemeriksaan premis dan laporan. Automated test item.'
          : 'Kertas graf A4, 80gsm, 50 helai setiap pad. Automated test item.');
        await fillDates(page, draftRow(page, item.code), evidence.log);
        evidence.log(`${item.code}: ${clean(await draftRow(page, item.code).innerText())}`);
      }
      await evidence.capture('rows_completed', { step: 'Price, UOM, image + specification, dates filled', expected: 'Every mandatory column filled' });

      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await waitForAjaxIdle(page).catch(() => {});
      await page.waitForTimeout(2500);
      const saved = await messages(page);
      evidence.log(`After Save: ${saved}`);
      await evidence.capture('saved', { step: 'Save', expected: 'Draft saved', actual: saved });
      if (/ERR-|mandatory|required/i.test(saved)) throw new Error(`Save: ${saved}`);
      audit(env.name, WHO, `CAT-001 Upload Catalogue (${acct.username})`, `**Draft saved** for ${ITEMS.map((i) => i.code).join(', ')}: ${saved.slice(0, 120)}`, 'Save', 'Publish');

      // Tick the rows and Publish with the declaration
      for (const item of ITEMS) {
        const box = draftRow(page, item.code).locator('.ui-chkbox-box').first();
        if (!(await box.getAttribute('class'))?.includes('ui-state-active')) await box.click();
        await page.waitForTimeout(500);
      }
      await page.getByRole('button', { name: 'Publish', exact: true }).click();
      const pub = page.locator('.ui-dialog:visible').filter({ hasText: /publish this item/i }).first();
      await pub.waitFor({ timeout: 20_000 });
      const declare = pub.locator('.ui-chkbox-box').first();
      if (await declare.count()) await declare.click();
      await evidence.capture('publish_confirm', { step: 'Publish → declaration ticked', expected: '"Are you sure to publish this item?"' });
      await pub.getByRole('button', { name: /^(Yes|Ya)$/ }).click();
      await waitForAjaxIdle(page).catch(() => {});
      await page.waitForTimeout(4000);
      const published = await messages(page);
      evidence.log(`After Publish: ${published}`);
      await evidence.capture('published', { step: 'Publish → Yes', expected: 'Items published (moved out of Draft)', actual: published });
      if (/ERR-/.test(published)) throw new Error(`Publish: ${published}`);
      const left = (await draftRows(page).allInnerTexts()).map(clean).filter((t) => ITEMS.some((i) => t.includes(i.code)));
      audit(env.name, WHO, `CAT-001 Upload Catalogue (${acct.username})`, `**Catalogue published** ${ITEMS.map((i) => i.code).join(', ')}: ${published.slice(0, 140)}`, 'Publish (declared)', 'Officer approval, if any');
      noteAccount(acct, `catalogue published: ${ITEMS.map((i) => `${i.code} ${i.type}`).join(', ')} (${published.slice(0, 100)})`);
      evidence.actual(`Published: ${published}${left.length ? `; still in Draft: ${left.join(' | ')}` : ''}`);
      expect(left, 'items left in Draft after Publish').toEqual([]);
    } finally {
      await ssoLogout(page, env).catch(() => {});
    }
  },
);
