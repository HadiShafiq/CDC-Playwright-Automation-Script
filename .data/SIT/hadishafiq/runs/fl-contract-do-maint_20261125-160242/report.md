# Flow run fl-contract-do-maint_20261125-160242

| | |
|---|---|
| Flow | fl-contract-do-maint — Contract: DO update and cancel (Fulfilment Maintenance, P2 Contract Order) |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T16:02:42+08:00 / 2026-11-25T18:47:39+08:00 |
| Documents | LA LA260000000004240, CT CT260000000002315, CR CR260000000006065, CO CO260000000006663, DO 60000730212600002 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-25T16:02:51+08:00 | | LA LA260000000004240 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | VERIFIED | CR_SUBMITTED | CR CR260000000006065 | officer 131020145098 (given for this run) |   |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | VERIFIED | CR_APPROVED | CR CR260000000006065 | Katalon default account of the step |   |
| 4 | GATE CO_LOOKUP | done by SIT database (automatic lookup) 2026-11-25T16:06:22+08:00 | | CO CO260000000006663 | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | VERIFIED | CO_ACKNOWLEDGED | CO CO260000000006663 | officer firstallied1234 (given for this run) |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | VERIFIED | DELIVERY_SUBMITTED |  | officer firstallied1234 (given for this run) |   |
| 7 | GATE DO_LOOKUP | done by SIT database (automatic lookup) 2026-11-25T16:08:35+08:00 | | DO 60000730212600002 | | |
| 8 | FL-101 Supplier updates the Delivery Order (Fulfilment Maintenance) | VERIFIED | DO_MODIFY_REQUESTED |  | officer firstallied1234 (given for this run) |   |
| 9 | FL-102 FL Approver approves the DO modification | VERIFIED (4 attempts) | DO_MODIFIED |  | officer 690127065209: BPM task "ACK Modified DO" of 60000730212600002 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 10 | FL-103 Supplier cancels the Delivery Order | VERIFIED (2 attempts) | DO_CANCEL_REQUESTED |  | officer firstallied1234 (given for this run) |   |
| 11 | FL-104 FL Approver approves the DO cancellation | VERIFIED | DO_CANCELLED |  | officer 690127065209: BPM task "Review Cancel DO" of 60000730212600002 is ASSIGNED to 690127065209 (SIT WFTASK) |   |

## Application messages per step

**KAT-057** attempt 2026-11-25T16:02:52+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\02_KAT-057\2026-11-25_160242`
- info: Selected Charge Line Items updated.
- info: Contract Request CR260000000006065 is successfully submitted.

**KAT-058** attempt 2026-11-25T16:05:04+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\03_KAT-058\2026-11-25_160242`
- info: Contract Request CR260000000006065 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

**KAT-059** attempt 2026-11-25T16:06:22+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\05_KAT-059\2026-11-25_160242`
- info: Purchase Order CO260000000006663 is acknowledged.

**KAT-060** attempt 2026-11-25T16:07:20+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\06_KAT-060\2026-11-25_160242`
- info: Delivery Order DO-CO260000000006663 is successfully submitted for acknowledgment. View Delivery Order

**FL-101** attempt 2026-11-25T16:08:35+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\08_FL-101\2026-11-25_160242`
- info: Update for Delivery Order DO-CO260000000006663-M978 is successfully submitted for acknowledgment.

**FL-102** attempt 2026-11-25T16:09:04+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-do-maint\09_FL-102\2026-11-25_160242`

**FL-102** attempt 2026-11-25T16:39:36+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-do-maint\09_FL-102\2026-11-25_163720`

**FL-102** attempt 2026-11-25T17:01:35+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-do-maint\09_FL-102\2026-11-25_170124`

**FL-102** attempt 2026-11-25T18:44:28+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\09_FL-102\2026-11-25_184409`
- info: Update for Delivery Order DO-CO260000000006663-M978 is acknowledged.

**FL-103** attempt 2026-11-25T18:44:45+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-do-maint\10_FL-103\2026-11-25_184409`

**FL-103** attempt 2026-11-25T18:47:08+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\10_FL-103\2026-11-25_184656`
- info: Cancellation for Delivery Order DO-CO260000000006663-M978 is successfully submitted for approval.

**FL-104** attempt 2026-11-25T18:47:27+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-do-maint\11_FL-104\2026-11-25_184656`
- info: Cancellation for Delivery Order DO-CO260000000006663-M978 is approved.

