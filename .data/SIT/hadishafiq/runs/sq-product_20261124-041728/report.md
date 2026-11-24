# Flow run sq-product_20261124-041728

| | |
|---|---|
| Flow | sq-product — Simple Quote (Product): create, open, supplier reply, close |
| Module | sq |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T04:17:28+08:00 / 2026-11-24T05:31:30+08:00 |
| Documents | SQ SQ260000000002366 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-036 Create Simple Quote - Product | VERIFIED | SQ_SUBMITTED | SQ SQ260000000002366 | Katalon default account of the step |   |
| 2 | GATE SQ_START_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T04:31:30+08:00 | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | VERIFIED | SQ_SUPPLIER_RESPONDED |  | Katalon default account of the step | UNKNOWN (low): no rule matched; read the error, screenshot and trace <br>❌ SQ Number not found from pagination 1 until 10: SQ260000000002366 |
| 4 | GATE SQ_END_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T05:31:30+08:00 | |  | | |

## Application messages per step

**KAT-036** attempt 2026-11-24T04:17:33+08:00 → verified · evidence `evidence\SIT\FLOW\sq-product\01_KAT-036\2026-11-24_041729`
- info: Simple Quote SQ260000000002366 is successfully submitted.

**KAT-022** attempt 2026-11-24T04:31:31+08:00 → failed · evidence `evidence\SIT\FLOW\sq-product\03_KAT-022\2026-11-24_041729`

