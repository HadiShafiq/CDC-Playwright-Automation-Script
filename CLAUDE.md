# CLAUDE.md — ePerolehan Playwright QA framework

Read `docs/phase1-plan.md` first: it is the live plan (stage, done, open, blockers, next action). Check `git log` and
`npm run qa -- runs --env sit` before continuing; never assume an earlier task succeeded.

## Safety rules (non-negotiable)
- **SIT only.** `--env`/`TEST_ENV` is always explicit; never fall back between SIT and UAT; production is not configured.
  UAT has no credentials yet and is unverified.
- **Never repeat a state-changing step blindly** (Submit, Approve, Acknowledge, Verify, Declare…). `retries: 0`, one worker.
  **Self-heal** (runner, on evidence only, max 1 automatic retry per step and run, `QA_SELF_HEAL=0` = off): the SIT DB
  shows the checkpoint reached → recorded as done; the DB shows the status unchanged since before the attempt, or the
  attempt failed before opening the document (not in the task list) → one retry. Otherwise as before: interrupted →
  UNCERTAIN → `qa reconcile`; failed → `qa retry` by a person. Officer steps wait for the BPM task and log in as its
  assignee; My Task searches claim the document's group task first; every failure writes `runs/<id>/diagnosis-<step>.md`.
- **Backend-only statuses are simulated, never invented:** `qa simulate --doc --status` prints a data patch (status row
  only, no BPM task) that the TESTER runs in DBeaver; `--check` confirms and logs it in `knowledge/data-change-audit.md`.
- **Gates:** PO/CO/DO/DN lookups and officer assignment are answered from the SIT DB (read-only). SQL date moves
  (SC_QUOTE START/END) and status simulations: since 2026-11-24 the user allows Claude to run them, but ONLY through
  `sitExecute` (allow-list, one transaction, SIT only) with `QA_AUTO_SQL=1` or `qa simulate --run`; every change is
  logged in `knowledge/data-change-audit.md` automatically. Any other SQL: ask first.
- **English first.** BM flows (`tests/flows/bm`) stay fixme until every EN flow passes AND the user allows it.
- **Never invent** statuses, roles, messages or expected results. Registry facts carry a verification level
  (`execution` | `source` | `documentation` | `unverified`); raise it only with evidence (run ID).
- **Live dates only** (user rule 2026-11-23): every date/time a step uses comes from the live date. Use the tokens of
  `support/katalon/runtime.ts` in `data-overrides.json`: `{yyyy-MM-dd}`, `{yyyy-MM-dd+30d}`, `{MI+1m}`/`{YI+1m}` (schedule month/year
  index); they win over the Excel rows. SQ gates use the next quarter hour. Unit test: `tests/unit/live-dates.spec.ts`.
- Credentials live in `.auth/`. **2026-11-25 user decision:** `.auth/` (dummy SIT logins) and `.data/` are committed so other PCs can continue (browser profiles, logs, Outlook sessions stay local). Still never put passwords in code, logs, screenshots or chat. Playwright traces are off by
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
| `support/modules/` | Typed step functions for steps without a Katalon script (`"automation": "module"`): QT ported from ngep-runner (`qt/`: create, submit, approve, spec, docprep, BPK, publish/close via Technical Support, proposals, evaluation phase), LA-APPROVE, FL maintenance + payment failure (`fl/`, from fl-data), SM new MOF registration (`sm/registration.ts`, the REG chain; `selfLogin`). The runner logs in (BPM assignee / role user / per-user password from credentials.xlsx) and checks the DB |
| `support/core/` | Flow runner, run state, data registry, events, app messages, classifier, SIT DB reader (`sit-db`, `doc-status`, `bpm-tasks`) |
| `tests/flows/{en,bm}/<module>.flow.spec.ts` | Flows from the registry, one test per step/gate, serial |
| `tests/data-prep/en/<module>/<sub-module>/<flow>/NN-<STATUS>.spec.ts` | Generated: run a flow up to one status and stop (data prep). Modules: pm, sm, qt, sq, dp, direct-loa, ct, fl |
| `tests/data-prep/en/by-status/<module>/<doc type>/<status id>-<name>.spec.ts` | Generated: one spec per ACTIVE status (804, `scripts/gen-status-specs.mjs`): flow to it, or flow/QA_INPUT + simulation (tester runs the patch; rerun the spec to confirm). `qa prepare --status-id <id> [--doc-type] [--plan]` |
| `tests/sm/{registration,catalogue,soft-cert,update-profile}/` | The automated MOF chain (REG/CAT/SC, Update MOF Profile); `npm run sm:sit` |
| `tests/cr-suites/<CR>/` | `cr.json` (edit, or pick and choose with `qa cr add --cr <CR>`) → generated `data-prep/`, `execution/`, `README.md`. `_TEMPLATE/` to copy; `EXAMPLE/` is a demo |
| `registry/active-statuses.json`, `docs/status-coverage.md` | The active-status list (NGEPSIT_Active_Status_All_Modules.xlsx, 804) crossed with SIT usage and our flows: FLOW / FLOW_MANUAL / UI_NO_FLOW / SYSTEM / NEVER_USED (`node scripts/status-coverage.mjs`) |
| `docs/zip-mapping.md` | What the colleagues' zips (ngep-runner, claude-skills fl-data, kapitan) contain and what was taken |
| `registry/db-schema.json`, `db-statuses.json` | Where each document's status lives in the SIT DB; every status per doc type (generated by `qa db-catalog`) |
| `sql/status/<DOC>.sql` | Generated read-only DBeaver queries: status history, BPM tasks, all statuses of the type |
| `cli/qa.mjs` | `npm run qa -- help` |
| `.data/<ENV>/<tester>/` | Git-ignored: `runs/<id>/{state.json,events.jsonl,report.md}`, `transactions.json` |
| `evidence/<ENV>/<CR>/<flow>/<NN_item>/<RUN_ID>/` | Screenshots `CR_Scenario_Module_Lang_StepNN_Action_time_rand.png`, `summary.{md,json}` |
| `knowledge/` | Application map, defects, repair log, data-change audit |

## Conventions
- Locators: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId` → `byJsfIdSuffix` → XPath (with a reason).
  PrimeFaces: wait with `waitForAjaxIdle`; no `waitForTimeout`/`force: true` in new code.
- A step is VERIFIED only when its expected application message/document was observed, or its checkpoint's SIT DB
  status (`checkpoint.db`) was read; otherwise COMPLETED (not verified). A different DB status fails the step.
  Never weaken an assertion to make a run green.
- `checkpoint.db` only from a real document's history (document number as evidence). DB access is read-only, SIT only.
- QT steps QT-001..015 are ported (`support/modules/qt`, verified on SIT to 60010+ 2026-11-24); FL-101..122 and SM-001/002/005/006/011/012 are
  ported (SIT run pending); the other SM application steps and PM are still `automation: manual` (sources in
  `docs/zip-mapping.md`). `checkpoint.db.observeOnly` = expectation not yet seen on SIT (e.g. from DEV): reported, not failed.
- PO/CO/DO lookup gates are answered from the SIT DB automatically (read-only; `QA_AUTO_LOOKUP=0` to ask the tester).
- After changing `registry/` or a `cr.json`: `npm run suites:gen`.
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
npm run qa -- cr add --cr <CR>                      # pick and choose: module → sub-module → flow → statuses
npm run qa -- cr --env sit --cr <CR> --scenario S01 --prep|--exec
npm run qa -- doc-status --env sit --doc LA26…      # DB status EN/BM + BPM tasks (read-only)
npm run qa -- db-usage --env sit                    # refresh SIT usage + docs/status-coverage.md
npm run qa -- simulate --env sit --doc <no> --status <id> [--type OC] [--check]   # backend-only status (tester runs SQL)
npm run suites:gen                                 # data-prep specs, CR suites, sql/status, status catalogue
npm run katalon:sit -- --grep @KAT-021      # original runner
npm run typecheck
```
