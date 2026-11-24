---
name: sq-date-sql-procedure
description: "How to shorten a Simple Quote's wait in SIT with SQL on NGEP_SIT.SC_QUOTE — start first, supplier reply, then end; user runs the SQL"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0ce8a265-9ef0-4783-bc3d-bfd580046c7e
  modified: 2026-11-23T08:07:02.446Z
---

To avoid waiting for a Simple Quote's 20:15 start and its 3-day close, the user runs SQL in DBeaver (SIT connection): `UPDATE NGEP_SIT.SC_QUOTE SET START_DATE/END_DATE = TO_DATE(...) WHERE QUOTE_NO = ...; COMMIT;`. Claude gives the SQL; the user runs it.

The user's exact template (given 2026-11-23); keep its form (alias `mp`, `IN (...)` list, `TO_DATE(..., 'YYYY-MM-DD HH24:MI:SS')`):
```
UPDATE NGEP_SIT.SC_QUOTE mp
SET START_DATE = TO_DATE('2026-11-11 18:15:00', 'YYYY-MM-DD HH24:MI:SS'),
    END_DATE   = TO_DATE('2026-11-11 18:30:00', 'YYYY-MM-DD HH24:MI:SS')
WHERE mp.QUOTE_NO IN ('SQ260000000002309');
```
The Phase 1 gates SQ_START_SQL / SQ_END_SQL (registry/gates.json) use it with one column each, following the order below.

**Quarter-hour rule (user, 2026-11-23):** set START_DATE / END_DATE to the nearest upcoming quarter hour (:00, :15, :30, :45), e.g. at 16:04 use 16:15. SIT processes SQ dates on the quarter hour (CHANGED_DATE = END_DATE + 1 min for SQ…2305 and SQ…2309). Check DB time with SYSDATE first (it was Malaysia time). Claude may run it via DBeaver when the user allows ("u can run sql", 2026-11-23).

The order matters:
1. Move **only START_DATE** to the past. Leave END_DATE alone.
2. Wait until SIT processes it, i.e. the SQ appears in the supplier's Simple Quote Respond list.
3. Run the supplier reply (KAT-022).
4. Then move END_DATE to the past. That closes the SQ.
5. Wait until SIT processes the close, i.e. the Prepare Request Note task appears in My Task.
6. Run KAT-023.

**Why:** once the end time passes, SIT closes the SQ for good ("Pending Request Note Creation"). Moving END_DATE again doesn't reopen it. SQ260000000002276 was lost this way on 2026-11-04 because it closed before the supplier replied.

**How to apply:**
- Never suggest setting END_DATE before the supplier has replied.
- Always tell the user to COMMIT. The first attempt wasn't committed.
- Check progress read-only with the supplier list and Direct Purchase Search before running tests.

Related: [[katalon-conversion-project]]
