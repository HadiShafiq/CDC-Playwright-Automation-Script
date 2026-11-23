import fs from 'node:fs';
import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';
import { getEnv, hasSavedSession } from './config/environments';
import lowMemoryArgs from './config/low-memory-chromium-args.json';

// Login credentials (E2E_USERNAME / E2E_PASSWORD) live in the git-ignored .env file.
// Values already set in the shell win over the file.
if (fs.existsSync('.env')) process.loadEnvFile('.env');
// EXTRA_ENV_FILE: another project's .env to load as well (e.g. the mailbox settings of the MOF
// registration chain), without copying its values into this repo. Values already set win.
if (process.env.EXTRA_ENV_FILE && fs.existsSync(process.env.EXTRA_ENV_FILE)) process.loadEnvFile(process.env.EXTRA_ENV_FILE);

const env = getEnv();

// One worker by default: most specs change SIT data and share accounts, and concurrency safety is not verified
// (Phase 1 rule). WORKERS=n raises it, capped by free RAM (~1 GB per browser worker).
const freeGb = os.freemem() / 1024 ** 3;
const workers = process.env.WORKERS ? Math.max(1, Math.min(Number(process.env.WORKERS), Math.floor(freeGb) || 1)) : 1;
if (process.env.WORKERS && workers < Number(process.env.WORKERS) && !process.env.PW_MEM_NOTICE) {
  process.env.PW_MEM_NOTICE = '1'; // print once, not in every worker
  console.log(`[config] ${freeGb.toFixed(1)} GB RAM free → ${workers} worker(s) instead of ${process.env.WORKERS}.`);
}
// Run ID in Malaysia time, e.g. 2026-10-28_153000
const runId =
  process.env.RUN_ID ??
  new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kuala_Lumpur', hour12: false }).replace(' ', '_').replace(/:/g, '');
process.env.RUN_ID = runId; // shared with workers so all evidence lands in one run folder

export default defineConfig({
  testDir: './tests',
  outputDir: `test-results/${env.name}/${runId}`,
  // Isolated workers (see above). Multi-step business workflows must opt into serial mode
  // (test.describe.configure({ mode: 'serial' })) and use dataLock() for shared records.
  workers,
  // Files may run in parallel only when WORKERS>1 is set on purpose; flows are serial inside (describe mode serial).
  fullyParallel: !!process.env.WORKERS,
  // No blind retries: a retry can re-submit a business transaction. Failures go through
  // the analyse → repair → rerun loop instead (see knowledge/repair-log.md).
  retries: 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: `reports/${env.name}/${runId}/results.json` }],
    ['junit', { outputFile: `reports/${env.name}/${runId}/junit.xml` }],
    ['./reporters/execution-report.ts', { outputDir: `reports/${env.name}/${runId}` }],
  ],
  use: {
    baseURL: env.baseURL,
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    screenshot: 'only-on-failure',
    // Traces are OFF by default: they record every typed value in plain text, including login passwords
    // (found 2026-11-23). TRACE=1 turns them on for a debugging session; delete test-results/ and reports/html afterwards.
    trace: process.env.TRACE ? 'retain-on-failure' : 'off',
    // Video recording costs memory and CPU for every test; enable with VIDEO=1 when needed.
    video: process.env.VIDEO ? 'retain-on-failure' : 'off',
    launchOptions: { args: lowMemoryArgs },
    viewport: { width: 1600, height: 900 },
    ignoreHTTPSErrors: true,
    locale: 'en-MY',
    timezoneId: 'Asia/Kuala_Lumpur',
  },
  projects: [
    // Interactive login: run headed once per environment to save the session.
    { name: 'auth', testMatch: /auth\.setup\.ts/, use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } } },
    {
      name: 'chromium',
      // Phase 1 flows and status preparations change SIT data in long chains: they run only in the "flows" project.
      testIgnore: [/auth\.setup\.ts/, /[\\/]tests[\\/](flows|status)[\\/]/],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 900 },
        storageState: hasSavedSession(env) ? env.storageStatePath : undefined,
      },
    },
    {
      // Flows (tests/flows) and "prepare to a status" specs (tests/status). Select explicitly: --project=flows
      // (the QA CLI does). Each step logs in by itself, so no saved session.
      name: 'flows',
      testMatch: /[\\/]tests[\\/](flows|status)[\\/].*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } },
    },
  ],
});
