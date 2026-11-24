---
name: sit-db-access
description: How SQL is run on SIT: the user's DBeaver "SIT" connection via SQL*Plus (only when the user asks), never PROD
metadata:
  type: feedback
---

2026-11-18 the user asked me to run SQL myself ("can u run it ?" → "use my dbeaver"). Overrides the old default "user runs SQL" only when they ask for a specific run.

**How:** DBeaver workspace `%APPDATA%\DBeaverData\workspace6\EP\.dbeaver\` has the connections; the one named **SIT** (rac-cluster-scan.eperolehan.com.my:1521/sitapp, user NGEP_SIT) is the only one to use. A scratch script decrypts its saved login in memory and pipes it to `C:\oracle\product\10.2.0\client_1\bin\sqlplus.exe -S /nolog` with `WHENEVER SQLERROR EXIT FAILURE ROLLBACK`; never print the password, never put it in a file or commit.

**Why:** the same list holds PRD_ ISLAND, PRE PROD and UAT connections; touching them would be a real-data change.

**How to apply:** SELECT first to show the before state, run, SELECT after, then add a row to knowledge/data-change-audit.md. Still ask before running SQL the user didn't ask to run. Related: [[sq-date-sql-procedure]].

**Update 2026-11-24:** the user said "for sql u can run it i give u permission". Implemented narrowly: `sitExecute` in support/core/sit-db.ts runs only allow-listed statements (SC_QUOTE START/END_DATE updates, *_WORKFLOW_STATUS simulation rows, SM_APPL.STATUS_ID) in one transaction on SIT, and logs each in knowledge/data-change-audit.md. Used via QA_AUTO_SQL=1 (runner gates, status specs) or `qa simulate --run`. Anything else still needs asking.
