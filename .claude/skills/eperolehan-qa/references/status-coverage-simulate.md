---
name: status-coverage-simulate
description: 2026-11-23 user rule — every active status (NGEPSIT_Active_Status_All_Modules.xlsx) must be reachable for test cases; backend-only ones are simulated by a tester-run data patch
metadata:
  type: project
---

The user gave `Downloads\NGEPSIT_Active_Status_All_Modules.xlsx` (804 active statuses from PM_STATUS, modules SM/SC/CT/FL/CM/CD/PM/PP) as the status reference and said some statuses are only set by the backend (developers): those must be **simulated back** so each test case can get a document at its status. Imported to `registry/active-statuses.json`; `docs/status-coverage.md` classifies each (FLOW / FLOW_MANUAL / UI_NO_FLOW / SYSTEM / NEVER_USED).

Facts (SIT, read-only, 2026-11-23): all 7 *_WORKFLOW_STATUS tables have the same columns + *_WORKFLOW_STATUS_SEQ, audit triggers disabled; only SM_APPL also stores status_id. `qa simulate` builds the patch (status row only, no BPM task) — the tester runs it, `--check` logs it in knowledge/data-change-audit.md. 91 statuses SIT writes are NOT in the active list (e.g. PM 75010/75015/75020).

**Why:** QA needs data at any status, including ones no screen produces.
**How to apply:** never run the patch yourself unless the user asks (data change); prefer a real flow when one exists. Related: [[sit-db-access]], [[phase1-framework]], [[ngep-runner-comparison]].
