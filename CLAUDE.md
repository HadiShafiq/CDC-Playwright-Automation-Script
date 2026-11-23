# CLAUDE.md — ePerolehan Playwright QA framework

Read `docs/phase1-plan.md` first: it is the live plan (stage, done, open, blockers, next action). Check `git log` and
`npm run qa -- runs --env sit` before continuing; never assume an earlier task succeeded.

## Safety rules (non-negotiable)
- **SIT only.** `--env`/`TEST_ENV` is always explicit; never fall back between SIT and UAT; production is not configured.
  UAT has no credentials yet and is unverified.
- **Never repeat a state-changing step blindly** (Submit, Approve, Acknowledge, Verify, Declare…). The flow runner
  refuses: interrupted → UNCERTAIN → `qa reconcile`; failed → `qa retry` by a person. `retries: 0`, one worker.
- **Gates are the tester's:** SQL date moves (SC_QUOTE START/END), PO/CO/DO lookups, officer assignment. Give the
  SQL; run it via the user's DBeaver SIT connection only when they ask (see memory `sit-db-access`). Log every data
  change in `knowledge/data-change-audit.md`.
- **English first.** BM flows (`tests/flows/bm`) stay fixme until every EN flow passes AND the user allows it.
- **Never invent** statuses, roles, messages or expected results. Registry facts carry a verification level
  (`execution` | `source` | `documentation` | `unverified`); raise it only with evidence (run ID).
- **Live dates only** (user rule 2026-11-23): every date/time a step uses comes from the live date. Use the tokens of
  `support/katalon/runtime.ts` in `data-overrides.json`: `{yyyy-MM-dd}`, `{yyyy-MM-dd+30d}`, `{MI+1m}`/`{YI+1m}` (schedule month/year
  index); they win over the Excel rows. SQ gates use the next quarter hour. Unit test: `tests/unit/live-dates.spec.ts`.
- No credentials in git, logs, screenshots or chat; they live in `.auth/` (git-ignored). Playwright traces are off by
  default because they record typed passwords (`TRACE=1` only for debugging, then delete `test-results/`).

## Layout
| Path | What |
|---|---|
| `original-scripts/` | Frozen copies of the original specs by module + `manifest.json`. Never edit or run |
| `tests/katalon/**` | Original runner: thin generated specs (KAT-001..064). **Generated — change `scripts/katalon/convert.mjs`** |
| `support/katalon/steps/KAT-0xx.ts` | The converted Katalon scripts as step functions (generated, shared by KAT specs and flows) |
| `support/katalon/runtime.ts` | Katalon API on Playwright + flow hooks (`setFlowInputs`, `observedTexts`) |
| `support/katalon/data-overrides.json` | Per-step data corrections for the KAT specs (flows pass documents themselves) |
| `registry/` | Modules, steps, flows, gates (JSON) — the workflow/status registry |
| `support/core/` | Flow runner, run state, data registry, events, app messages, classifier |
| `tests/flows/{en,bm}/<module>.flow.spec.ts` | Flows from the registry, one test per step/gate, serial |
| `cli/qa.mjs` | `npm run qa -- help` |
| `.data/<ENV>/<tester>/` | Git-ignored: `runs/<id>/{state.json,events.jsonl,report.md}`, `transactions.json` |
| `evidence/<ENV>/<CR>/<flow>/<NN_item>/<RUN_ID>/` | Screenshots `CR_Scenario_Module_Lang_StepNN_Action_time_rand.png`, `summary.{md,json}` |
| `knowledge/` | Application map, defects, repair log, data-change audit |

## Conventions
- Locators: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId` → `byJsfIdSuffix` → XPath (with a reason).
  PrimeFaces: wait with `waitForAjaxIdle`; no `waitForTimeout`/`force: true` in new code.
- A step is VERIFIED only when its expected application message/document was observed; otherwise
  COMPLETED (not verified). Never weaken an assertion to make a run green.
- New step logic goes in `support/modules/<module>/` (typed, role-based locators) and is registered in
  `registry/workflows/<module>.json`; keep the Katalon step until the new one passes a parity run.
- Every failure: classify, record in `knowledge/repair-log.md`; suspected application defects in `knowledge/defects.md`.

## Commands
```
npm run qa -- doctor --env sit
npm run qa -- list-flows
npm run qa -- run --env sit --flow <id> [--input RN=…] [--from KAT-0xx] [--to KAT-0xx] [--headed]
npm run qa -- gate --env sit --run <id> --gate SQ_START_SQL --done
npm run qa -- resume --env sit --run <id>
npm run katalon:sit -- --grep @KAT-021      # original runner
npm run typecheck
```
