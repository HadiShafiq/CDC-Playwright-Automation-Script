# Flow run fl-contract-inv-maint_20261125-185249

| | |
|---|---|
| Flow | fl-contract-inv-maint — Contract: invoice update and cancel |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T18:52:49+08:00 / 2026-11-25T19:13:57+08:00 |
| Documents | LA LA260000000004233, CT CT260000000002308, CR CR260000000006066, CO CO260000000006664, DO 01400K003S2600004, FN FN260000000005822, IN 01400K003S2600003 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-25T18:52:53+08:00 | | LA LA260000000004233 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | VERIFIED | CR_SUBMITTED | CR CR260000000006066 | Katalon default account of the step |   |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | VERIFIED | CR_APPROVED | CR CR260000000006066 | Katalon default account of the step |   |
| 4 | GATE CO_LOOKUP | done by SIT database (automatic lookup) 2026-11-25T18:55:32+08:00 | | CO CO260000000006664 | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | VERIFIED (2 attempts) | CO_ACKNOWLEDGED | CO CO260000000006664 | account of KAT-008 |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | VERIFIED | DELIVERY_SUBMITTED |  | account of KAT-008 |   |
| 7 | GATE DO_LOOKUP | done by SIT database (automatic lookup) 2026-11-25T19:00:00+08:00 | | DO 01400K003S2600004 | | |
| 8 | KAT-061 Receiving Officer acknowledges the contract Delivery Order (FRN) | VERIFIED | FRN_CREATED | FN FN260000000005822 | officer 831221115096: BPM task "Create FRN" of 01400K003S2600004 is ASSIGNED to 831221115096 (SIT WFTASK) |   |
| 9 | KAT-062 Acknowledge Officer approves the contract FRN | VERIFIED | FRN_APPROVED |  | officer 180220145443: BPM task "Approve FRN" of FN260000000005822 is ASSIGNED to 180220145443 (SIT WFTASK) |   |
| 10 | KAT-063 Supplier creates the contract invoice | COMPLETED-UNVERIFIED | INVOICE_CREATED |  | account of KAT-008 |   |
| 11 | FL-111 Supplier updates the invoice (Fulfilment Maintenance) | VERIFIED (4 attempts) | INVOICE_MODIFY_REQUESTED |  | account of KAT-008 (given for this run) |   |
| 12 | FL-112 FL Approver approves the invoice modification | VERIFIED | INVOICE_MODIFIED |  | officer 690127065209: BPM task "ACK Modified Invoice" of 01400K003S2600003 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 13 | FL-113 Supplier cancels the invoice | VERIFIED | INVOICE_CANCEL_REQUESTED |  | account of KAT-008 (given for this run) |   |
| 14 | FL-114 FL Approver approves the invoice cancellation | VERIFIED | INVOICE_CANCELLED |  | officer 690127065209: BPM task "Review Cancel Invoice" of 01400K003S2600003 is ASSIGNED to 690127065209 (SIT WFTASK) |   |

## Application messages per step

**KAT-057** attempt 2026-11-25T18:52:54+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\02_KAT-057\2026-11-25_185250`
- info: Selected Charge Line Items updated.
- info: Contract Request CR260000000006066 is successfully submitted.

**KAT-058** attempt 2026-11-25T18:54:19+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\03_KAT-058\2026-11-25_185250`
- info: Contract Request CR260000000006066 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

**KAT-059** attempt 2026-11-25T18:55:33+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\05_KAT-059\2026-11-25_185250`
- error: Record has already been updated by other user. Please retrieve the information again (ERR-100048)

**KAT-059** attempt 2026-11-25T18:58:48+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\05_KAT-059\2026-11-25_185839`
- info: Purchase Order CO260000000006664 is acknowledged.

**KAT-060** attempt 2026-11-25T18:59:20+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\06_KAT-060\2026-11-25_185839`
- info: Delivery Order DO-CO260000000006664 is successfully submitted for acknowledgment. View Delivery Order

**KAT-061** attempt 2026-11-25T19:00:01+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\08_KAT-061\2026-11-25_185839`
- info: Fulfilment Received Note for Products / Services FN260000000005822 is successfully submitted for approval.

**KAT-062** attempt 2026-11-25T19:00:39+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\09_KAT-062\2026-11-25_185839`
- info: Fulfilment Received Note for Products / Services FN260000000005822 is acknowledged and has been sent for posting at iGFMAS. Please click Alert/Notification to print the Fulfilment Received Note/Service and CoGSTR (if any).

**KAT-063** attempt 2026-11-25T19:01:13+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\10_KAT-063\2026-11-25_185839`
- info: Invoice IN-CO260000000006664 is successfully submitted.

**FL-111** attempt 2026-11-25T19:05:23+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\11_FL-111\2026-11-25_190517`

**FL-111** attempt 2026-11-25T19:07:27+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\11_FL-111\2026-11-25_190720`

**FL-111** attempt 2026-11-25T19:09:35+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\11_FL-111\2026-11-25_190925`

**FL-111** attempt 2026-11-25T19:12:56+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\11_FL-111\2026-11-25_191250`
- info: Update for Invoice IN-CO260000000006664-M963 is successfully submitted for acknowledgment.

**FL-112** attempt 2026-11-25T19:13:15+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\12_FL-112\2026-11-25_191250`
- info: Update for Invoice IN-CO260000000006664-M963 is acknowledged.

**FL-113** attempt 2026-11-25T19:13:28+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\13_FL-113\2026-11-25_191250`
- info: Invoice Cancellation IN-CO260000000006664-M963 has been sent for approval.

**FL-114** attempt 2026-11-25T19:13:45+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract-inv-maint\14_FL-114\2026-11-25_191250`
- info: Invoice IN-CO260000000006664-M963 has been cancelled.

