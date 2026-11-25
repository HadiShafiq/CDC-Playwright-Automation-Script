import type { Page } from '@playwright/test';
import { pfIdle, settledEval } from './pf';

/**
 * Task List (/web/epapp/task-list): find a document's task in My Task or Group Task (paging both), claim a group task
 * from its row, open it. Ported from ngep-runner lib/tasklist.mjs (without its direct-URL learning).
 */
interface Row {
  section: string;
  docNo: string;
  /** second column: e.g. the DO number when the first column is its order (CO/PO), SIT 2026-11-25 */
  refNo: string;
  status: string;
  linkId: string | null;
  claimId: string | null;
}

async function readRows(page: Page): Promise<Row[]> {
  return settledEval(
    page,
    () => {
      const out: { section: string; docNo: string; refNo: string; status: string; linkId: string | null; claimId: string | null }[] = [];
      for (const t of document.querySelectorAll('table')) {
        if (!(t as HTMLElement).offsetWidth || !/Document No|No Dokumen/.test(t.tHead?.innerText || '')) continue;
        const head = [...document.querySelectorAll('*')]
          .filter((e) => /^(GROUP TASK|MY TASK|TUGAS KUMPULAN|TUGAS SAYA)$/i.test((e.textContent ?? '').trim()))
          .filter((e) => e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING)
          .pop();
        for (const r of t.tBodies[0]?.rows ?? []) {
          const c = [...r.cells].map((x) => (x as HTMLElement).innerText.trim());
          if (c.length < 6) continue;
          const a = r.cells[2]?.querySelector('a');
          const claim = [...r.querySelectorAll('button')].find((b) => /^\s*(Claim|Tuntut)\s*$/i.test((b as HTMLElement).innerText));
          out.push({ section: (head?.textContent ?? '').trim(), docNo: c[0], refNo: c[1] ?? '', status: c[5], linkId: a?.id || null, claimId: claim?.id || null });
        }
      }
      return out;
    },
    undefined,
  );
}

export async function findTask(page: Page, baseURL: string, docNo: string, maxPages = 20): Promise<Row | null> {
  await page.goto(`${baseURL}/web/epapp/task-list`);
  await pfIdle(page);
  for (let p = 0; p < maxPages; p++) {
    // the number can share the first cell with its order ("CO260000000006663\n60000730212600002" for a DO, SIT
    // 2026-11-25) or sit in the second cell: exact first, then any whole word of the first two cells
    const rows = await readRows(page);
    const hit = rows.find((r) => r.docNo === docNo) ?? rows.find((r) => `${r.docNo} ${r.refNo}`.split(/\s+/).includes(docNo));
    if (hit) return hit;
    const nexts = page.locator('.ui-paginator-next:not(.ui-state-disabled)');
    if (!(await nexts.count())) return null;
    for (let i = 0; i < (await nexts.count()); i++) await nexts.nth(i).click().catch(() => {});
    await pfIdle(page);
  }
  return null;
}

/** Open docNo's task (claiming a group task first); waits up to waitMinutes for BPM to create it. */
export async function openTask(page: Page, baseURL: string, docNo: string, log: (m: string) => void, waitMinutes = 8): Promise<Row> {
  let hit = await findTask(page, baseURL, docNo);
  for (let waited = 0; !hit?.linkId && waited < waitMinutes * 60; waited += 20) {
    if (waited === 0) log(`${docNo} not on this user's task list yet: waiting up to ${waitMinutes} min`);
    await page.waitForTimeout(20_000);
    hit = await findTask(page, baseURL, docNo);
  }
  if (!hit?.linkId) throw new Error(`${docNo} is not in this account's My Task (no result)`);
  for (let i = 0; hit?.claimId && i < 3; i++) {
    await settledEval(page, (id: string) => (document.getElementById(id) as HTMLElement).click(), hit.claimId);
    await pfIdle(page);
    const yes = page.locator('.ui-dialog[aria-hidden="false"] button', { hasText: /^\s*(Yes|Ya|OK)\s*$/ });
    if (await yes.count()) {
      await yes.first().click();
      await pfIdle(page);
    }
    await page.waitForTimeout(2000);
    hit = await findTask(page, baseURL, docNo);
    log(`claimed ${docNo}: now in ${hit?.section || '?'}`);
  }
  if (hit?.claimId) throw new Error(`Could not claim ${docNo} from the task list`);
  if (!hit?.linkId) throw new Error(`Task for ${docNo} not found after claiming`);
  await settledEval(page, (id: string) => (document.getElementById(id) as HTMLElement).click(), hit.linkId);
  await page.waitForURL((u) => !/\/task-list/.test(u.pathname), { timeout: 45_000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  return hit;
}
