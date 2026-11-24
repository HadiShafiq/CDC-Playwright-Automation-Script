# Flow run dp-sq-pr_20261124-020224

| | |
|---|---|
| Flow | dp-sq-pr — DP from Simple Quote, Purchase Request route (One Off / product) |
| Module | dp |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T02:02:24+08:00 / 2026-11-24T02:41:20+08:00 |
| Documents | SQ SQ260000000002364, RN RN260000000004917, PR PR260000000005073, PO PO260000000007217 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-021 Create Simple Quote - Services | VERIFIED | SQ_SUBMITTED | SQ SQ260000000002364 | Katalon default account of the step |   |
| 2 | GATE SQ_START_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T02:16:30+08:00 | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | VERIFIED | SQ_SUPPLIER_RESPONDED | SQ SQ260000000002364 | Katalon default account of the step |   |
| 4 | GATE SQ_END_SQL | done by hadishafiq via automatic SQL (user permission) 2026-11-24T02:31:30+08:00 | |  | | |
| 5 | KAT-023 Prepare Request Note from a closed Simple Quote | VERIFIED | RN_SUBMITTED | RN RN260000000004917 | account of KAT-021 |   |
| 6 | KAT-024 Approve Request Note (SQ route) | VERIFIED | RN_APPROVED | RN RN260000000004917 | officer 690127065209: BPM task "Review Direct Purchase" of RN260000000004917 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 7 | KAT-033 Submit Purchase Request from the approved Request Note | VERIFIED | PR_SUBMITTED | PR PR260000000005073 | officer 710527085562: BPM task "Submit PR" of RN260000000004917 is ASSIGNED to 710527085562 (SIT WFTASK) |   |
| 8 | KAT-034 Approve Purchase Request (sent to iGFMAS) | VERIFIED | PR_APPROVED | PR PR260000000005073 | officer 690127065209: BPM task "Review PR" of PR260000000005073 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 9 | GATE PO_LOOKUP | done by SIT database (automatic lookup) 2026-11-24T02:40:45+08:00 | | PO PO260000000007217 | | |
| 10 | KAT-035 Supplier acknowledges the Purchase Order | VERIFIED | PO_ACKNOWLEDGED | PO PO260000000007217 | Katalon default account of the step |   |

## Application messages per step

**KAT-021** attempt 2026-11-24T02:02:31+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\01_KAT-021\2026-11-24_020225`
- info: Simple Quote SQ260000000002364 is successfully submitted.

**KAT-022** attempt 2026-11-24T02:16:31+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\03_KAT-022\2026-11-24_020225`
- info: Simple Quote SQ260000000002364 is successfully submitted.

**KAT-023** attempt 2026-11-24T02:31:31+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\05_KAT-023\2026-11-24_020225`
- info: Request Note RN260000000004917 is successfully submitted.

**KAT-024** attempt 2026-11-24T02:32:33+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\06_KAT-024\2026-11-24_020225`
- info: Request Note RN260000000004917 is approved.

**KAT-033** attempt 2026-11-24T02:38:13+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\07_KAT-033\2026-11-24_020225`
- info: Selected Charge Line Items updated.
- info: Purchase Request PR260000000005073 is successfully submitted.

**KAT-034** attempt 2026-11-24T02:39:32+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\08_KAT-034\2026-11-24_020225`
- info: Purchase Request PR260000000005073 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

**KAT-035** attempt 2026-11-24T02:40:46+08:00 → verified · evidence `evidence\SIT\FLOW\dp-sq-pr\10_KAT-035\2026-11-24_020225`
- info: Purchase Order PO260000000007217 is acknowledged.

