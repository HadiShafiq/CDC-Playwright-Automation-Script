# Flow run dp-sq-pr_20261125-045819

| | |
|---|---|
| Flow | dp-sq-pr — DP from Simple Quote, Purchase Request route (One Off / product) |
| Module | dp |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T04:58:19+08:00 / 2026-11-25T04:59:31+08:00 |
| Documents | SQ SQ260000000002371, RN RN260000000004925 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-021 Create Simple Quote - Services | not run |  |  |  |   |
| 2 | GATE SQ_START_SQL | waiting | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | not run |  |  |  |   |
| 4 | GATE SQ_END_SQL | waiting | |  | | |
| 5 | KAT-023 Prepare Request Note from a closed Simple Quote | VERIFIED | RN_SUBMITTED | RN RN260000000004925 | account of KAT-021 |   |
| 6 | KAT-024 Approve Request Note (SQ route) | not run |  |  |  |   |
| 7 | KAT-033 Submit Purchase Request from the approved Request Note | not run |  |  |  |   |
| 8 | KAT-034 Approve Purchase Request (sent to iGFMAS) | not run |  |  |  |   |
| 9 | GATE PO_LOOKUP | waiting | |  | | |
| 10 | KAT-035 Supplier acknowledges the Purchase Order | not run |  |  |  |   |

## Application messages per step

**KAT-023** attempt 2026-11-25T04:58:28+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\05_KAT-023\2026-11-25_045820`
- info: Request Note RN260000000004925 is successfully submitted.

