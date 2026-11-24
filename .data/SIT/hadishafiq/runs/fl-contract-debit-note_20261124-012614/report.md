# Flow run fl-contract-debit-note_20261124-012614

| | |
|---|---|
| Flow | fl-contract-debit-note — Contract fulfilment with a debit note: invoice above the order → DN approval → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T01:26:14+08:00 / 2026-11-24T01:28:10+08:00 |
| Documents | CO CO260000000006653, DN DN260000000004802, PA PA260000000006413 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | waiting | |  | | |
| 2 | KAT-057 Prepare Contract Request from a contract | not run |  |  |  |   |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | not run |  |  |  |   |
| 4 | GATE CO_LOOKUP | waiting | |  | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | not run |  |  |  |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | not run |  |  |  |   |
| 7 | GATE DO_LOOKUP | waiting | |  | | |
| 8 | KAT-061 Receiving Officer acknowledges the contract Delivery Order (FRN) | not run |  |  |  |   |
| 9 | KAT-062 Acknowledge Officer approves the contract FRN | not run |  |  |  |   |
| 10 | KAT-063 Supplier creates the contract invoice | not run |  |  |  |   |
| 11 | GATE DN_LOOKUP | done by SIT database (automatic lookup) 2026-11-24T01:26:24+08:00 | | DN DN260000000004802 | | |
| 12 | KAT-056 Approve Debit Note | COMPLETED-UNVERIFIED | DN_APPROVED |  | officer 690127065209: BPM task "Review DAN" of DN260000000004802 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 13 | KAT-064 Payment match (contract) | COMPLETED-UNVERIFIED | PAYMENT_MATCHED | PA PA260000000006413 | Katalon default account of the step |   |

## Application messages per step

**KAT-056** attempt 2026-11-24T01:26:25+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract-debit-note\12_KAT-056\2026-11-24_012615`
- info: Debit Note DN260000000004802 is successfully submitted and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Debit Note document.

**KAT-064** attempt 2026-11-24T01:27:16+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract-debit-note\13_KAT-064\2026-11-24_012615`
- info: Payment Advice PA260000000006413 is successfully submitted and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Payment Match document.

