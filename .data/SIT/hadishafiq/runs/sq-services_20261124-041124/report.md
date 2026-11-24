# Flow run sq-services_20261124-041124

| | |
|---|---|
| Flow | sq-services — Simple Quote (Services): create, open, supplier reply, close |
| Module | sq |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T04:11:24+08:00 / 2026-11-24T05:16:30+08:00 |
| Documents | SQ SQ260000000002365 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-021 Create Simple Quote - Services | VERIFIED | SQ_SUBMITTED | SQ SQ260000000002365 | Katalon default account of the step |   |
| 2 | GATE SQ_START_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T04:16:30+08:00 | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | VERIFIED | SQ_SUPPLIER_RESPONDED |  | Katalon default account of the step | LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT) <br>locator.fill: Timeout 30000ms exceeded. |
| 4 | GATE SQ_END_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T05:16:30+08:00 | |  | | |

## Application messages per step

**KAT-021** attempt 2026-11-24T04:11:28+08:00 → verified · evidence `evidence\SIT\FLOW\sq-services\01_KAT-021\2026-11-24_041124`
- info: Simple Quote SQ260000000002365 is successfully submitted.

**KAT-022** attempt 2026-11-24T04:16:31+08:00 → failed · evidence `evidence\SIT\FLOW\sq-services\03_KAT-022\2026-11-24_041124`
- info: Simple Quote will start on 24 Nov 2026 at 20:15. Kindly log in on time setting.

