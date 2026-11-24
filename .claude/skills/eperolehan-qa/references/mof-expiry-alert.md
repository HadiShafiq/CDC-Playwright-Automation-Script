---
name: mof-expiry-alert
description: MOF account expiry alert (Redmine #10724): countdown rule is (MOF end date + 1) − today, so SIT results of 2026-11-18 are correct; open point is the scheduler / negative countdown
metadata:
  type: project
---

Redmine #10724 "To display the countdown MOF account expiry date" (enhancement, R6). Read via the Redmine REST API with the user's login in .auth/credentials.xlsx (Role "Redmine"): `/issues/10724.json?include=journals,attachments`.

**Agreed rule (note 56 + developer table in note 97):** MOF *expiry* date = MOF *end* date (sm_mof_account.EXP_DATE) **+ 1 day**; countdown = expiry − today. On the end date itself it shows "1 day"; the day after, the active alert stops and, once the overnight scheduler sets the MOF status inactive, the "already expired … N days to renew" alert (365/366 → 1) shows. Alert 1 shows only for counts 90 → 1, so end date = today+89 shows "90", today+90 shows nothing.

**SIT 2026-11-18 on 900101010815 matches this rule:** end today+1 → "2 days", +43 → "44", +89 → "90", +90/+91 → none. Text blue, span.blink_text, 1s blink. My first report called these off-by-one failures; that was wrong — the +1 is per CR.

**Still open in the ticket (status 37 - In Progress (SIT), Melody Lee, last activity 18/06/2026):** negative countdown when the scheduler has not downgraded an expired MOF account (root cause: scheduler; "wait for the scheduler next morning"). To test: set EXP_DATE in the past, wait for the morning scheduler, then check alert 2.

**How to apply:** after a SQL date change re-login until "MOF Status Expiry" shows the new date (cache ~1–3 min). Evidence: evidence/SIT/MOF-EXPIRY-ALERT/2026-11-18/. Related: [[sit-db-access]].

**2026-11-18 17:28–17:36 expired-alert tests (900101010815, MOF 357-0002294532):**
- End date 17/11/2026 (yesterday), status 1, before scheduler: alert 1 shows "within **0** days" (ticket note 60 says 0 → no alert) — likely defect.
- SQL imitation RECORD_STATUS=3 (no role downgrade): alert 2 EN "…is already expired. Your expiry date is on 18/11/2026. You have 365 days to renew your MOF Account." / BM "…telah tamat. Tarikh tamat adalah pada 18/11/2026. Anda mempunyai 365 hari untuk memperbaharui Akaun MOF anda." Blue, blinking; MOF Status Expiry shows "-".
- Status set back to 1 at 17:36 so the real scheduler (daily ~00:45, logs type A rows in SM_MOF_BASIC_SCHEDULER, sets RECORD_STATUS 1→3) processes it the night of 18→19/11/2026. **Pending:** on 19/11 check that scheduler row (IS_SUCCESS, ERR_MSG), the alert 2 text/countdown (expect 365), no negative number; then restore the account (e.g. EXP 31/12/2026, status 1) if the user wants it active again.
- **Plan agreed for 19/11/2026 morning (user "yes"):** (1) real-scheduler check on 900101010815 as above; (2) on second supplier 900101370499 / MOF 357-0002294531: end date = today → expect "within 1 days"; end date = yesterday (after the 00:45 run) → expect no alert 1 (re-confirm the "0 days" finding); then restore it to 18/11/2026–17/11/2029, status 1. A session-only reminder was set for 09:13; if the session ended, do it when the user asks.

**2026-11-19 results:**
- The real scheduler ran 19/11 00:45: type A row for 357-0002294532, status 1 → 3, IS_SUCCESS 1.
- Alert 2 shows "364 days" (expiry 18/11, so 365 on 18/11), blue, blinking, EN and BM, no 0 or negative number. Pass.
- 900101370499 cannot be used: it is still in temp-supplier onboarding, so there is no alert portlet. Restored.
- "Within 0 days" before the scheduler is still unconfirmed; it needs a fully registered supplier.
- 900101010815 is left expired (status 3, EXP 17/11/2026) until the user decides.
