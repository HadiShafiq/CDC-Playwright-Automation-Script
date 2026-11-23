// Phase 1 flows of module "direct-loa" in Bahasa Melayu. Flows and steps come from registry/workflows/direct-loa.json; the step logic is
// support/katalon/steps (the verified Katalon scripts). Usually run through the CLI: npm run qa -- run --flow <id>
import { test } from '../../../fixtures/flow';
import { flowItems, flowTags, flowTitle, runItem, setupFlow } from '../../../support/core/flow-runner';
import { flowsOf } from '../../../support/core/workflow-registry';

const LANG = 'BM';
for (const flow of flowsOf('direct-loa')) {
  test.describe(flowTitle(flow, LANG), { tag: flowTags(flow, LANG) }, () => {
    const runId = setupFlow(flow, LANG);
    for (const { item, index, title, details } of flowItems(flow)) {
      test(title, details, async ({ page, appMessages, evidence }, testInfo) => {
        await runItem(flow, item, index, runId(), { page, appMessages, evidence }, testInfo);
      });
    }
  });
}
