# Flow run sq-product_20261124-123132

| | |
|---|---|
| Flow | sq-product — Simple Quote (Product): create, open, supplier reply, close |
| Module | sq |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T12:31:32+08:00 / 2026-11-24T13:01:31+08:00 |
| Documents | SQ SQ260000000002370 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-036 Create Simple Quote - Product | VERIFIED | SQ_SUBMITTED | SQ SQ260000000002370 | Katalon default account of the step |   |
| 2 | GATE SQ_START_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T12:46:30+08:00 | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | VERIFIED | SQ_SUPPLIER_RESPONDED | SQ SQ260000000002370 | account of KAT-030 (NURULAINMOF) — self-heal: the SQ was sent to the companies of NURULAINMOF, not to BASICFLROS3 |   |
| 4 | GATE SQ_END_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T13:01:30+08:00 | |  | | |

## Application messages per step

**KAT-036** attempt 2026-11-24T12:31:39+08:00 → verified · evidence `evidence\SIT\FLOW\sq-product\01_KAT-036\2026-11-24_123133`
- info: Simple Quote SQ260000000002370 is successfully submitted.

**KAT-022** attempt 2026-11-24T12:46:32+08:00 → verified · evidence `evidence\SIT\FLOW\sq-product\03_KAT-022\2026-11-24_123133`
- info: Simple Quote SQ260000000002370 is successfully submitted.

