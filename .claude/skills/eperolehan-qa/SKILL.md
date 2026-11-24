---
name: eperolehan-qa
description: Everything learned building and running this ePerolehan (eP / NGEP) SIT Playwright QA framework - flows, modules (SQ, DP, Direct LOA, CT, FL, QT, SM, PM), the flow runner and self-heal, SIT DB reads and allow-listed writes, BPM task lookup, status simulation for the 804 active statuses, Outlook mailboxes, PrimeFaces tricks, known SIT pitfalls and user rules. Use for ANY work in this repo - running or resuming flows, porting steps, fixing failures, simulating statuses, reporting progress.
---

# ePerolehan SIT QA framework - working knowledge

Read first, in this order: `CLAUDE.md` (rules), `docs/phase1-plan.md` (live plan; **Handoff** section = where we stopped),
then `npm run qa -- runs --env sit`. The `references/` folder holds the detailed notes (one topic per file, listed at the end).

## User rules (non-negotiable)
- **SIT only.** Never UAT/PROD. Credentials only in `.auth/` (git-ignored, repo is PUBLIC). Never print passwords in chat, logs, screenshots, commits.
- **English first.** BM only after every EN flow passes AND the user says so. PM public pages must be switched to English too.
- **Never repeat a state-changing step blindly.** Self-heal only on DB evidence (see below).
- **SQL writes** only via `sitExecute` allow-list (SQ START/END dates, workflow_status simulate/restore, sm_appl status), audited in `knowledge/data-change-audit.md`. Anything else: ask.
- **Live dates only** - date tokens `{yyyy-MM-dd}`, `{MI+1m}`, `{YI}` etc., never literals ([references/live-dates-rule.md]).
- **Simulate one module at a time** (saves tokens); skip statuses already proven.
- Don't use other teams' documents as sandboxes; only our own run documents / `transactions.json`.
- If Claude Code kills a background task for low memory, **don't restart it unless the user asks.**
- Don't commit unless asked. User talks Malay/English mix - answer in the same mix, short.

## Architecture in one screen
- Registry JSON `registry/workflows/<module>.json`: steps (KAT-0xx Katalon-converted, or `"automation":"module"`), flows, checkpoints (`checkpoint.db` status id, `via` intermediate statuses, `proofSql`, `onlyIfStatus`, `waitSec`, `login`).
- Runner `support/core/flow-runner.ts`: per step login (BPM assignee from `SIT01_SOAINFRA.wftask@SITSOA`, role user, `{accountOf:'KAT-048'}`, or `selfLogin` steps that log in themselves via `ctx.as()`), runs the step, reads DB status, writes `.data/SIT/<tester>/runs/<id>/`.
- Module steps: `support/modules/index.ts` MODULE_STEPS -> `qt/`, `fl/maintenance.ts`, `sm/registration.ts`, `pm/access.ts`, LA-APPROVE.
- CLI `cli/qa.mjs`: run / resume / gate / doc-status / simulate / cr. Auto-resumes once 60 s after a fresh failure (task-list lag).
- Status coverage: `registry/active-statuses.json` (804), `docs/status-coverage.md`, by-status specs `tests/data-prep/en/by-status/...`.

## Self-heal (learned the hard way)
- A step is 'done' only when the DB status **moved** to the checkpoint, or `checkpoint.proofSql` returns > 0. Status unchanged / doc not opened -> one retry.
- Bug we had: SQ supplier step "proved" by status alone while no reply existed -> 3 SQs closed with no reply. Fix = `proofSql` on KAT-022 (`sc_quote_supplier.is_submitted = 1`). Add a proofSql whenever the status alone can't prove the action.
- Officer task not yet assigned to a user -> wait, don't throw. Task missing from My Task -> claim group task first; task list lags -> the CLI retry covers it.

## SIT DB facts
- Read: `sitQuery` (DBeaver "SIT" connection decrypted in memory + sqlplus). BPM: `wftask@SITSOA`.
- PO/CO/DO lookup: PR/CR -> `FL_FULFILMENT_REQUEST` -> `FL_FULFILMENT_ORDER` (FULFILMENT_REQ_ID) -> `FL_DELIVERY_ORDER` (FULFILMENT_ORDER_ID); FN via `fl_fulfilment_note.delivery_order_id`; invoice via `fl_invoice.fulfilment_order_id`.
- Supplier logins invited to an SQ: `SC_QUOTE_SUPPLIER -> PM_USER_ORG.ORG_PROFILE_ID -> PM_USER` (`invitedSupplierLogins`).
- PR after approval waits for **iGFMAS** (40110 "Pending PR Review from iGFMAS" -> 40300). Can take an hour or never (SIT side). Nothing to do but wait/watch.
- SQ dates: move START first, supplier replies, then END; next quarter hour ([references/sq-date-sql-procedure.md]).

## Status simulation (804 statuses)
- Tool: `QA_MODULE=<CT|SM|FL|SC|...> npx playwright test tests/tools/db.tool.spec.ts -g simulate-module` (QA_DRY=1 to plan only). Per status: plan -> patch -> check -> restore at once -> verify; stops on a restore mismatch. Results `.data/SIT/simulate/module-<M>.json`.
- 2026-11-24 result: 347/804 proven (44 flows + 303 simulated: CT 25, SM 33, FL 105, SC 130). Rest needs documents of other workflow types (CT 176, SC 114, FL 9, CM/PP 30), 98 never-used doc types, 7 unmapped.

## Module notes
- **QT** (ported from ngep-runner): create -> spec -> docprep -> BPK -> publish/close via Technical Support -> proposals -> `ecphase.ts` evaluation loop (Assign/Approve Committee, Coordinate Meeting, Finalize/Endorse/SignOff EC|OC|TEC|FEC; skip Update/View/Handle Error tasks). Verified to 60023.
- **Direct LOA**: zonal schedule services stop at 62501 -> LA-APPROVE step (62501 -> 62504). All 17 flows verified. LOA route rule: [references/dp-loa-route-rule.md].
- **FL**: maintenance `maintain(ctx,'DO'|'IN',docNo,contract,'Update'|'Cancel')`, `approveMaintenance`, payment failure `paymentMatchWith(..., 'Test Payment MM516FAIL'|'MM506FAIL')`. Debit note chain: [references/debit-credit-note-procedure.md].
- **SM** new MOF (`sm/registration.ts` reg001..004): bank dialog must refill postcode/branch after AJAX; documents table loads late (wait for `mandatoryTableId_data tr[data-ri]`); category level-1 dropdown can be empty -> retry; re-runs continue the last account instead of registering a new supplier. Verified KN-24112026-0035 -> 20199.
- **PM** access application (`pm/access.ts`): attachments via row link -> "Pilih Fail" -> `label.fileinput-button` filechooser -> `table.files td.start button`. Approval tasks 'Approve Company Profile' / 'Approve Market Research'. **Open:** activation needs the Kod Pengaktifan from the e-mail; pages still BM - switch with `/home` select `#_82_languageId` = `en_US` and re-probe labels.
- **Outlook** mailboxes newsupplier001/002/003@commercedc.com.my (rows Role "Outlook mailbox" in credentials.xlsx). `ensureInbox` waits up to 60 s for inbox OR sign-in page; never treat a sign-in page as an empty inbox.

## PrimeFaces / UI helpers
`support/modules/qt/pf.ts`: pfIdle, pfSelect, pressAndConfirm, openTab, settledEval, pageMessages, clickButton. `qt/tasklist.ts` openTask (with claim). Locate by id suffix for JSF ids. ERR-000001 on SIT = server error (environment, rerun later; around 06:00 the server restarts - resume from 07:00).

## Coding pitfalls seen
- Regex inside node heredocs loses backslashes - use the Edit tool for code edits.
- Never edit a file a running flow is about to import; stop the run first.
- Python is not installed on the main PC; use node for scripts.

## References
credentials-excel, sit-db-access, sq-date-sql-procedure, live-dates-rule, dp-loa-route-rule, debit-credit-note-procedure,
katalon-conversion-project, ngep-runner-comparison, phase1-framework, status-coverage-simulate, mof-registration-chain,
mof-upload-catalogue, mof-soft-cert, mof-end-to-end-plan, mof-expiry-alert (all in `references/`).
