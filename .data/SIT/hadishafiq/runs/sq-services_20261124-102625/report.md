# Flow run sq-services_20261124-102625

| | |
|---|---|
| Flow | sq-services — Simple Quote (Services): create, open, supplier reply, close |
| Module | sq |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T10:26:25+08:00 / 2026-11-24T12:31:31+08:00 |
| Documents | SQ SQ260000000002368 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-021 Create Simple Quote - Services | VERIFIED | SQ_SUBMITTED | SQ SQ260000000002368 | Katalon default account of the step |   |
| 2 | GATE SQ_START_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T10:31:30+08:00 | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | VERIFIED (2 attempts) | SQ_SUPPLIER_RESPONDED | SQ SQ260000000002368 | Katalon default account of the step |   |
| 4 | GATE SQ_END_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T12:31:30+08:00 | |  | | |

## Application messages per step

**KAT-021** attempt 2026-11-24T10:26:31+08:00 → verified · evidence `evidence\SIT\FLOW\sq-services\01_KAT-021\2026-11-24_102626`
- error: Maximum period allowed is not more than 3.00 days. (ERR-760430)
- error: Maximum period allowed is not more than 3 days. (ERR-760430)
- info: Simple Quote SQ260000000002368 is successfully submitted.

**KAT-022** attempt 2026-11-24T10:31:32+08:00 → failed · evidence `evidence\SIT\FLOW\sq-services\03_KAT-022\2026-11-24_102626`

**KAT-022** attempt 2026-11-24T12:18:58+08:00 → verified · evidence `evidence\SIT\FLOW\sq-services\03_KAT-022\2026-11-24_121850`
- info: Simple Quote SQ260000000002368 is successfully submitted.

