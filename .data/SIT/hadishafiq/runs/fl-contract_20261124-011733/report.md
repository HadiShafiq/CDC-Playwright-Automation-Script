# Flow run fl-contract_20261124-011733

| | |
|---|---|
| Flow | fl-contract — Contract fulfilment: CR → CO → delivery → FRN → invoice → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-24T01:17:33+08:00 / 2026-11-24T01:25:01+08:00 |
| Documents | LA LA260000000004225, CR CR260000000006054, CO CO260000000006653, DO 01400K003S2600003, FN FN260000000005811 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-24T01:17:39+08:00 | | LA LA260000000004225 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | VERIFIED | CR_SUBMITTED | CR CR260000000006054 | Katalon default account of the step |   |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | VERIFIED | CR_APPROVED | CR CR260000000006054 | Katalon default account of the step |   |
| 4 | GATE CO_LOOKUP | done by SIT database (automatic lookup) 2026-11-24T01:20:30+08:00 | | CO CO260000000006653 | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | VERIFIED | CO_ACKNOWLEDGED | CO CO260000000006653 | account of KAT-008 |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | COMPLETED-UNVERIFIED | DELIVERY_SUBMITTED |  | account of KAT-008 |   |
| 7 | GATE DO_LOOKUP | done by SIT database (automatic lookup) 2026-11-24T01:21:54+08:00 | | DO 01400K003S2600003 | | |
| 8 | KAT-061 Receiving Officer acknowledges the contract Delivery Order (FRN) | COMPLETED-UNVERIFIED | FRN_CREATED | FN FN260000000005811 | officer 831221115096: BPM task "Create FRN" of 01400K003S2600003 is ASSIGNED to 831221115096 (SIT WFTASK) |   |
| 9 | KAT-062 Acknowledge Officer approves the contract FRN | COMPLETED-UNVERIFIED | FRN_APPROVED |  | officer 180220145443: BPM task "Approve FRN" of FN260000000005811 is ASSIGNED to 180220145443 (SIT WFTASK) |   |
| 10 | KAT-063 Supplier creates the contract invoice | COMPLETED-UNVERIFIED | INVOICE_CREATED |  | account of KAT-008 |   |
| 11 | KAT-064 Payment match (contract) | FAILED |  |  | Katalon default account of the step | LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT) <br>locator.fill: Timeout 30000ms exceeded. |

## Application messages per step

**KAT-057** attempt 2026-11-24T01:17:41+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\02_KAT-057\2026-11-24_011734`
- info: Selected Charge Line Items updated.
- info: Contract Request CR260000000006054 is successfully submitted.

**KAT-058** attempt 2026-11-24T01:19:20+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\03_KAT-058\2026-11-24_011734`
- info: Contract Request CR260000000006054 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

**KAT-059** attempt 2026-11-24T01:20:31+08:00 → verified · evidence `evidence\SIT\FLOW\fl-contract\05_KAT-059\2026-11-24_011734`
- info: Purchase Order CO260000000006653 is acknowledged.

**KAT-060** attempt 2026-11-24T01:21:06+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\06_KAT-060\2026-11-24_011734`
- info: Delivery Order DO-CO260000000006653 is successfully submitted for acknowledgment. View Delivery Order

**KAT-061** attempt 2026-11-24T01:21:55+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\08_KAT-061\2026-11-24_011734`
- info: Fulfilment Received Note for Products / Services FN260000000005811 is successfully submitted for approval.

**KAT-062** attempt 2026-11-24T01:22:39+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\09_KAT-062\2026-11-24_011734`
- info: Fulfilment Received Note for Products / Services FN260000000005811 is acknowledged and has been sent for posting at iGFMAS. Please click Alert/Notification to print the Fulfilment Received Note/Service and CoGSTR (if any).

**KAT-063** attempt 2026-11-24T01:23:16+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\10_KAT-063\2026-11-24_011734`
- info: Invoice IN-CO260000000006653 is successfully submitted.

**KAT-064** attempt 2026-11-24T01:23:55+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract\11_KAT-064\2026-11-24_011734`

