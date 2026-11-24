# Flow run fl-noncontract-do-maint_20261124-153540

| | |
|---|---|
| Flow | fl-noncontract-do-maint — Non-contract: DO update and cancel (Fulfilment Maintenance) |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-24T15:35:40+08:00 / 2026-11-24T15:54:00+08:00 |
| Documents | RN RN260000000004926, PR PR260000000005076 |

**Waiting for:** KAT-047 failed in an earlier attempt (BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run fl-noncontract-do-maint_20261124-153540 --step KAT-047

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-046 Submit Purchase Request from an approved Request Note | VERIFIED | PR_SUBMITTED | PR PR260000000005076 | officer 710527085562: BPM task "Submit PR" of RN260000000004926 is ASSIGNED to 710527085562 (SIT WFTASK) |   |
| 2 | KAT-047 Approve Purchase Request (sent to iGFMAS) | FAILED |  | PR PR260000000005076 | officer 690127065209: BPM task "Review PR" of PR260000000005076 is ASSIGNED to 690127065209 (SIT WFTASK) | BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one <br>Expected outcome not in the database for KAT-047: PR260000000005076 is at 40110 Pending PR Review from iGFMAS, expected 40300 Purchase Request Approved (PR_APPROVED) |
| 3 | GATE PO_LOOKUP | waiting | |  | | |
| 4 | KAT-048 Supplier acknowledges the Purchase Order | not run |  |  |  |   |
| 5 | KAT-049 Supplier submits delivery (Pending Delivery List) | not run |  |  |  |   |
| 6 | GATE DO_LOOKUP | waiting | |  | | |
| 7 | FL-101 Supplier updates the Delivery Order (Fulfilment Maintenance) | not run |  |  |  |   |
| 8 | FL-102 FL Approver approves the DO modification | not run |  |  |  |   |
| 9 | FL-103 Supplier cancels the Delivery Order | not run |  |  |  |   |
| 10 | FL-104 FL Approver approves the DO cancellation | not run |  |  |  |   |

## Application messages per step

**KAT-046** attempt 2026-11-24T15:40:39+08:00 → verified · evidence `evidence\SIT\FLOW\fl-noncontract-do-maint\01_KAT-046\2026-11-24_153540`
- info: Selected Charge Line Items updated.
- info: Purchase Request PR260000000005076 is successfully submitted.

**KAT-047** attempt 2026-11-24T15:42:00+08:00 → failed · evidence `evidence\SIT\FLOW\fl-noncontract-do-maint\02_KAT-047\2026-11-24_153540`
- info: Purchase Request PR260000000005076 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

