# Flow run dloa-from-dp-rn_20261123-155431

| | |
|---|---|
| Flow | dloa-from-dp-rn — Direct LOA from a DP Simple Quote (Services, Schedule): SQ → RN → LOA → supplier → DO verify |
| Module | direct-loa |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-23T15:54:31+08:00 / 2026-11-23T16:22:10+08:00 |
| Documents | SQ SQ260000000002363, RN RN260000000004908, LA LA260000000004215 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-021 Create Simple Quote - Services | VERIFIED | SQ_SUBMITTED | SQ SQ260000000002363 | Katalon default account of the step |   |
| 2 | GATE SQ_START_SQL | done by hadishafiq 2026-11-23T16:04:38+08:00 | |  | | |
| 3 | KAT-022 Supplier responds to the Simple Quote (prices every line) | COMPLETED-UNVERIFIED | SQ_SUPPLIER_RESPONDED |  | Katalon default account of the step |   |
| 4 | GATE SQ_END_SQL | done by hadishafiq 2026-11-23T16:06:07+08:00 | |  | | |
| 5 | KAT-023 Prepare Request Note from a closed Simple Quote | VERIFIED | RN_SUBMITTED | RN RN260000000004908 | account of KAT-021 |   |
| 6 | KAT-024 Approve Request Note (SQ route) | VERIFIED | RN_APPROVED | RN RN260000000004908 | officer 690127065209 from data-overrides.json (seen in an earlier run; not checked for this document) |   |
| 7 | KAT-025 Prepare LOA from an approved Request Note (DP-LOA route) | VERIFIED | LA_SUBMITTED | LA LA260000000004215 | officer 710527085562 from data-overrides.json (seen in an earlier run; not checked for this document) |   |
| 8 | KAT-026 Supplier accepts the LOA (DP-LOA route) | COMPLETED-UNVERIFIED | LA_ACKNOWLEDGED |  | account of KAT-022 |   |
| 9 | KAT-027 Desk Officer verifies the LOA (DP-LOA route) | COMPLETED-UNVERIFIED | LA_VERIFIED |  | officer 710527085562 from data-overrides.json (seen in an earlier run; not checked for this document) |   |

## Application messages per step

**KAT-021** attempt 2026-11-23T15:54:38+08:00 → verified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\01_KAT-021\2026-11-23_155431`
- error: Maximum period allowed is not more than 3.00 days. (ERR-760430)
- error: Maximum period allowed is not more than 3 days. (ERR-760430)
- info: Simple Quote SQ260000000002363 is successfully submitted.

**KAT-022** attempt 2026-11-23T16:04:49+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\03_KAT-022\2026-11-23_160441`
- info: Simple Quote SQ260000000002363 is successfully submitted.

**KAT-023** attempt 2026-11-23T16:16:58+08:00 → verified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\05_KAT-023\2026-11-23_161651`
- info: Request Note RN260000000004908 is successfully submitted.

**KAT-024** attempt 2026-11-23T16:17:59+08:00 → verified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\06_KAT-024\2026-11-23_161651`
- info: Request Note RN260000000004908 is approved.

**KAT-025** attempt 2026-11-23T16:18:48+08:00 → verified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\07_KAT-025\2026-11-23_161651`
- info: Letter of Acceptance (LOA) LA260000000004215 is submitted successfully.

**KAT-026** attempt 2026-11-23T16:19:45+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\08_KAT-026\2026-11-23_161651`
- info: Letter Of Acceptance LA260000000004215 is accepted successfully.

**KAT-027** attempt 2026-11-23T16:20:38+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\dloa-from-dp-rn\09_KAT-027\2026-11-23_161651`
- info: Letter of Acceptance (LOA) LA260000000004215 is completed.

