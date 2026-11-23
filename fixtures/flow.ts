import { test as base } from './katalon';
import { collectAppMessages, type AppMessage } from '../support/core/app-messages';

export { expect, scenario } from './test';

/**
 * Fixture for the Phase 1 flows (tests/flows). Same browser setup as the Katalon specs (runtime bound to the page,
 * TERKINI announcement handler, SSO sign-out after each step), plus the application's own messages collected
 * from the first page load, so the runner can assert a step's outcome from what the application said.
 */
export const test = base.extend<{ appMessages: AppMessage[] }>({
  appMessages: async ({ page }, use) => {
    await use(await collectAppMessages(page));
  },
});
