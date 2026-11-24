---
name: live-dates-rule
description: "User rule 2026-11-23 — every date/time in the scripts must come from the live date (tokens in data-overrides), never fixed values"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2994701e-b854-448e-8f2a-e70c31cc0517
  modified: 2026-11-23T10:11:49.571Z
---

All dates and times the automation enters must be computed from the live date/time, never hard-coded or taken from old Katalon defaults / Excel rows.

**Why:** fixed Katalon dates went stale and SIT rejected them (ERR-760348 Fulfilment Schedule outside the contract period; past dates not offered by datepickers).

**How to apply:** use the tokens of `support/katalon/runtime.ts` (`liveValue`) in `support/katalon/data-overrides.json`: Java patterns `{yyyy-MM-dd}`, `{yyyy-MM-dd+180d}`, `{MMddHHmmss}`; schedule list indexes `{MI}`, `{MI+1m}` (month number) and `{YI}`, `{YI+1m}` (year index, 1 = current year). Live tokens are re-applied after the Excel row, so they always win. SQ date SQL uses the next quarter hour ([[sq-date-sql-procedure]]). When a new date field shows up, add a token, never a literal date. Related: [[phase1-framework]].
