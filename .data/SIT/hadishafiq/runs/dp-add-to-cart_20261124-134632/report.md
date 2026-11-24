# Flow run dp-add-to-cart_20261124-134632

| | |
|---|---|
| Flow | dp-add-to-cart — DP Add to Cart (Services) to Purchase Request approval |
| Module | dp |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T13:46:32+08:00 / 2026-11-24T15:35:37+08:00 |
| Documents | RN RN260000000004926 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-028 Add to Cart (Services) and submit Request Note | VERIFIED | RN_SUBMITTED | RN RN260000000004926 | Katalon default account of the step |   |
| 2 | KAT-032 Approve Request Note (Compare / Add to Cart) | VERIFIED (2 attempts) | RN_APPROVED | RN RN260000000004926 | officer 690127065209: BPM task "Review Direct Purchase" of RN260000000004926 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 3 | KAT-046 Submit Purchase Request from an approved Request Note | not run |  |  |  |   |
| 4 | KAT-047 Approve Purchase Request (sent to iGFMAS) | not run |  |  |  |   |
| 5 | GATE PO_LOOKUP | waiting | |  | | |

## Application messages per step

**KAT-028** attempt 2026-11-24T13:46:44+08:00 → verified · evidence `evidence\SIT\FLOW\dp-add-to-cart\01_KAT-028\2026-11-24_134633`
- info: Request Note RN260000000004926 is successfully submitted.

**KAT-032** attempt 2026-11-24T13:49:28+08:00 → failed · evidence `evidence\SIT\FLOW\dp-add-to-cart\02_KAT-032\2026-11-24_134633`

**KAT-032** attempt 2026-11-24T15:34:51+08:00 → verified · evidence `evidence\SIT\FLOW\dp-add-to-cart\02_KAT-032\2026-11-24_153440`
- info: Request Note RN260000000004926 is approved.

