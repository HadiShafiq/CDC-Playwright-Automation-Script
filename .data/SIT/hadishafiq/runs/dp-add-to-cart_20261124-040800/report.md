# Flow run dp-add-to-cart_20261124-040800

| | |
|---|---|
| Flow | dp-add-to-cart — DP Add to Cart (Services) to Purchase Request approval |
| Module | dp |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T04:08:00+08:00 / 2026-11-24T05:02:11+08:00 |
| Documents | RN RN260000000004918, PR PR260000000005074, PO PO260000000007218 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-028 Add to Cart (Services) and submit Request Note | VERIFIED | RN_SUBMITTED | RN RN260000000004918 | Katalon default account of the step |   |
| 2 | KAT-032 Approve Request Note (Compare / Add to Cart) | VERIFIED (3 attempts) | RN_APPROVED | RN RN260000000004918 | officer 690127065209: BPM task "Review Direct Purchase" of RN260000000004918 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 3 | KAT-046 Submit Purchase Request from an approved Request Note | VERIFIED | PR_SUBMITTED | PR PR260000000005074 | officer 710527085562: BPM task "Submit PR" of RN260000000004918 is ASSIGNED to 710527085562 (SIT WFTASK) |   |
| 4 | KAT-047 Approve Purchase Request (sent to iGFMAS) | VERIFIED | PR_APPROVED | PR PR260000000005074 | officer 690127065209: BPM task "Review PR" of PR260000000005074 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 5 | GATE PO_LOOKUP | done by SIT database (automatic lookup) 2026-11-24T05:02:11+08:00 | | PO PO260000000007218 | | |

## Application messages per step

**KAT-028** attempt 2026-11-24T04:08:08+08:00 → verified · evidence `evidence\SIT\FLOW\dp-add-to-cart\01_KAT-028\2026-11-24_040801`
- info: Request Note RN260000000004918 is successfully submitted.

**KAT-032** attempt 2026-11-24T04:09:53+08:00 → failed · evidence `evidence\SIT\FLOW\dp-add-to-cart\02_KAT-032\2026-11-24_040801`

**KAT-032** attempt 2026-11-24T04:52:37+08:00 → failed · evidence `evidence\SIT\FLOW\dp-add-to-cart\02_KAT-032\2026-11-24_045231`

**KAT-032** attempt 2026-11-24T04:54:42+08:00 → verified · evidence `evidence\SIT\FLOW\dp-add-to-cart\02_KAT-032\2026-11-24_045434`
- info: Request Note RN260000000004918 is approved.

**KAT-046** attempt 2026-11-24T05:00:22+08:00 → verified · evidence `evidence\SIT\FLOW\dp-add-to-cart\03_KAT-046\2026-11-24_045434`
- info: Selected Charge Line Items updated.
- info: Purchase Request PR260000000005074 is successfully submitted.

**KAT-047** attempt 2026-11-24T05:01:35+08:00 → verified · evidence `evidence\SIT\FLOW\dp-add-to-cart\04_KAT-047\2026-11-24_045434`
- info: Purchase Request PR260000000005074 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

