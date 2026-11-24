---
name: ngep-runner-comparison
description: 2026-11-23 user compared our framework with a colleague's ngep-runner (QT_Tender-DirectLOA.zip); decided keep ours, borrow DB-status stops, BPM assignee, QT path
metadata:
  type: project
---

The user shared `Downloads\QT_Tender-DirectLOA.zip` = **ngep-runner** (a colleague's developer data-creation tool: plain Node + Chrome CDP, DEV/SIT, QT stages to 60023, Direct LOA, dashboard). Decision 2026-11-23: **do not revamp**; keep this Playwright framework and take its ideas: stop/verify by the real SIT DB status, find the officer from the BPM task, wait for tasks, and its SIT QT status path.

Facts learned (read-only SIT, 2026-11-23):
- BPM tasks: `SIT01_SOAINFRA.wftask@SITSOA` (DB link from NGEP_SIT) works; `NGEP_SIT.MV_WFTASK` is stale (2019): never use it.
- The SQ supplier reply and the RN approval do NOT change the SQ/RN DB status (60851 / 60701 stay).
- ngep-runner commits shared logins (`.env.shared`, db-query config.json): never copy those into our repo.

**Why:** QA (manual testers) must easily find where to stop data prep and start execution, per CR and per status.
**How to apply:** QT steps stay `automation: manual` until the user confirms SIT QT role accounts; then port ngep-runner `stages/*.mjs` one step at a time behind a parity run. Related: [[phase1-framework]], [[sit-db-access]].
