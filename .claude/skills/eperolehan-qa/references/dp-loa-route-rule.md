---
name: dp-loa-route-rule
description: Which DP Simple Quote leads to an LOA vs a Purchase Request on SIT; also supplier must price every SQ line
metadata:
  node_type: memory
  type: project
  originSessionId: 9583e3b5-4126-491e-ba50-3a006c0702c9
  modified: 2026-11-11T10:07:44.063Z
---

The user explained (2026-11-11) that a DP Simple Quote's RN only goes down the **LOA route** (KAT-025 Prepare LOA → KAT-026 → KAT-027) when it is a **Services** SQ with fulfilment type **Schedule or As And When**. Product items or a One Off service go down the **Purchase Request route** (Submit PR KAT-033 → Approve PR KAT-034 → PO acknowledge KAT-035).

- KAT-021's `Fulfilmenttype` variable (dropdown index) defaults to 1 = One Off. Set it to 2 or 3 in support/katalon/data-overrides.json for an LOA chain.
- Example: SQ260000000002305 (one-off) → RN260000000004698 → PR260000000004856.

**Supplier reply:** the supplier must price **every** SQ line. If any line is left unpriced, the RN can't be submitted (ERR-760356 "Recommended Supplier is required") and that SQ is wasted. KAT-022 now counts the price fields and fills them all.

**Why:** a whole SQ cycle was lost each time on 2026-11-11 (SQ…2304 and SQ…2305), and each cycle needs the user to run SQL.

**How to apply:** check the fulfilment type and line count before creating an SQ for a chain.

Related: [[sq-date-sql-procedure]], [[katalon-conversion-project]]
