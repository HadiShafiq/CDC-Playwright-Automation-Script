# Flow run fl-contract_20261125-124511

| | |
|---|---|
| Flow | fl-contract — Contract fulfilment: CR → CO → delivery → FRN → invoice → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T12:45:11+08:00 / 2026-11-25T15:35:16+08:00 |
| Documents | LA LA260000000004240, CT CT260000000002315, CR CR260000000006060, CO CO260000000006658, DO 60000730212600001, FN FN260000000005817, PA PA260000000006421 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-25T12:45:17+08:00 | | LA LA260000000004240 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | VERIFIED | CR_SUBMITTED | CR CR260000000006060 | officer 131020145098 (given for this run) |   |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | VERIFIED | CR_APPROVED | CR CR260000000006060 | Katalon default account of the step |   |
| 4 | GATE CO_LOOKUP | done by SIT database (automatic lookup) 2026-11-25T12:48:09+08:00 | | CO CO260000000006658 | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | VERIFIED (3 attempts) | CO_ACKNOWLEDGED | CO CO260000000006658 | officer firstallied1234 (given for this run) |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | VERIFIED | DELIVERY_SUBMITTED |  | officer firstallied1234 (given for this run) |   |
| 7 | GATE DO_LOOKUP | done by SIT database (automatic lookup) 2026-11-25T12:55:42+08:00 | | DO 60000730212600001 | | |
| 8 | KAT-061 Receiving Officer acknowledges the contract Delivery Order (FRN) | VERIFIED | FRN_CREATED | FN FN260000000005817 | officer 831221115096 from data-overrides.json (seen in an earlier run; not checked for this document) |   |
| 9 | KAT-062 Acknowledge Officer approves the contract FRN | VERIFIED | FRN_APPROVED |  | officer 180220145443: BPM task "Approve FRN" of FN260000000005817 is ASSIGNED to 180220145443 (SIT WFTASK) |   |
| 10 | KAT-063 Supplier creates the contract invoice | COMPLETED-UNVERIFIED | INVOICE_CREATED |  | officer firstallied1234 (given for this run) |   |
| 11 | KAT-064 Payment match (contract) | VERIFIED | PAYMENT_MATCHED | PA PA260000000006421 | Katalon default account of the step |   |

## Application messages per step

**KAT-057** attempt 2026-11-25T12:45:17+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\02_KAT-057\2026-11-25_124512`
- info: Selected Charge Line Items updated.
- info: Contract Request CR260000000006060 is successfully submitted.

**KAT-058** attempt 2026-11-25T12:46:47+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\03_KAT-058\2026-11-25_124512`
- info: Contract Request CR260000000006060 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

**KAT-059** attempt 2026-11-25T12:48:10+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract\05_KAT-059\2026-11-25_124512`

**KAT-059** attempt 2026-11-25T12:51:15+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract\05_KAT-059\2026-11-25_125104`

**KAT-059** attempt 2026-11-25T12:54:13+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\05_KAT-059\2026-11-25_125408`
- info: Purchase Order CO260000000006658 is acknowledged.

**KAT-060** attempt 2026-11-25T12:54:52+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\06_KAT-060\2026-11-25_125408`
- info: Delivery Order DO-CO260000000006658 is successfully submitted for acknowledgment. View Delivery Order

**KAT-061** attempt 2026-11-25T15:32:26+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\08_KAT-061\2026-11-25_153137`
- info: Fulfilment Received Note for Products / Services FN260000000005817 is successfully submitted for approval.

**KAT-062** attempt 2026-11-25T15:33:12+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\09_KAT-062\2026-11-25_153137`
- info: Fulfilment Received Note for Products / Services FN260000000005817 is acknowledged and has been sent for posting at iGFMAS. Please click Alert/Notification to print the Fulfilment Received Note/Service and CoGSTR (if any).

**KAT-063** attempt 2026-11-25T15:33:49+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\10_KAT-063\2026-11-25_153137`
- info: Invoice IN-CO260000000006658 is successfully submitted.

**KAT-064** attempt 2026-11-25T15:34:26+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\11_KAT-064\2026-11-25_153137`
- info: Payment Advice PA260000000006421 is successfully submitted and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Payment Match document.

