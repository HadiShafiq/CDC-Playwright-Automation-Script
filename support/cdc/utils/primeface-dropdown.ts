import { expect, Page } from '@playwright/test';

export async function pfSelectOneMenu(
  page: Page,
  baseIdSuffix: string,
  optionText: string
): Promise<void> {

  const nativeSelect = page.locator(`select[id$="${baseIdSuffix}"]`);

  if (await nativeSelect.count()) {
    await expect(nativeSelect.first()).toBeVisible({ timeout: 15000 });
    await nativeSelect.first().selectOption({ label: optionText });
    return;
  }

  // Fallback to PF menu if native select is not found (original implementation)
  const menu = page.locator(`div[id$="${baseIdSuffix}"]`).first();
  const trigger = menu.locator('.ui-selectonemenu-trigger').first();
  const label = page.locator(`label[id$="${baseIdSuffix}_label"]`).first();

  await expect(menu).toBeVisible({ timeout: 15000 });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await trigger.click();

      const panel = page.locator(`div[id$="${baseIdSuffix}_panel"]:visible`).last();
      await expect(panel).toBeVisible({ timeout: 10000 });

      const items = panel.locator('li.ui-selectonemenu-item');
      await expect(items.first()).toBeAttached({ timeout: 10000 });

      const option = items.filter({ hasText: optionText }).first();

      if ((await option.count()) === 0) {
        const availableOptions = (await items.allTextContents())
          .map(t => t.trim())
          .filter(Boolean);

        throw new Error(
          `Option "${optionText}" not found in dropdown "${baseIdSuffix}". ` +
          `Available options: ${availableOptions.join(' | ')}`
        );
      }

      if (!(await option.isVisible())) {
        await option.evaluate((el) => {
          el.scrollIntoView({ block: 'center', inline: 'nearest' });
        });
      }

      await expect(option).toBeVisible({ timeout: 10000 });
      await option.click();
      // Case-insensitive: SIT labels differ in case from the UAT data (e.g. "Registered With SKM").
      await expect(label).toContainText(new RegExp(optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 10000 });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.keyboard.press('Escape').catch(() => { });
      await page.waitForTimeout(500);
    }
  }
}

export async function pfSelectOneMenuByIndex(
  page: Page,
  baseIdSuffix: string,
  index: number
): Promise<void> {

  const nativeSelect = page.locator(`select[id$="${baseIdSuffix}"]`);

  // Native HTML select
  if (await nativeSelect.count()) {
    await expect(nativeSelect.first()).toBeVisible({ timeout: 15000 });
    await nativeSelect.first().selectOption({ index });
    return;
  }

  // PrimeFaces selectOneMenu
  const menu = page.locator(`div[id$="${baseIdSuffix}"]`).first();
  const trigger = menu.locator(".ui-selectonemenu-trigger").first();
  const label = page.locator(`label[id$="${baseIdSuffix}_label"]`).first();

  await expect(menu).toBeVisible({ timeout: 15000 });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await trigger.click();

      const panel = page.locator(`div[id$="${baseIdSuffix}_panel"]:visible`).last();
      await expect(panel).toBeVisible({ timeout: 10000 });

      const items = panel.locator("li.ui-selectonemenu-item");
      await expect(items.first()).toBeAttached({ timeout: 10000 });

      const count = await items.count();

      if (index < 0 || index >= count) {
        throw new Error(
          `Index ${index} is out of range. Dropdown contains ${count} options.`
        );
      }

      const option = items.nth(index);
      const optionText = (await option.textContent())?.trim() ?? "";

      await option.scrollIntoViewIfNeeded();
      await expect(option).toBeVisible({ timeout: 10000 });

      await option.click();
      await expect(label).toContainText(optionText, { timeout: 10000 });

      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.keyboard.press("Escape").catch(() => { });
      await page.waitForTimeout(500);
    }
  }
}

export async function pfGetSelectedOneMenuValue(
  page: Page,
  baseIdSuffix: string
): Promise<string> {
  const label = page.locator(`label[id$="${baseIdSuffix}_label"]`).first();
  return (await label.textContent())?.trim() ?? "";
}