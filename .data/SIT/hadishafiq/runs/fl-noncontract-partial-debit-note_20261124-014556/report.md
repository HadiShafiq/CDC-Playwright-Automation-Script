# Flow run fl-noncontract-partial-debit-note_20261124-014556

| | |
|---|---|
| Flow | fl-noncontract-partial-debit-note — Non-contract, partial delivery above the order: stop delivery, invoice, debit note approval |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T01:45:56+08:00 / 2026-11-24T02:00:36+08:00 |
| Documents | PO PO260000000007216, SD SD260000000002802, PA PA260000000006414 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-049 Supplier submits delivery (Pending Delivery List) | not run |  |  |  |   |
| 2 | GATE DO_LOOKUP | waiting | |  | | |
| 3 | KAT-050 Receiving Officer acknowledges the Delivery Order (creates FRN) | not run |  |  |  |   |
| 4 | KAT-051 Acknowledge Officer approves the FRN | not run |  |  |  |   |
| 5 | KAT-052 Supplier submits Stop Delivery Instruction for the undelivered balance | COMPLETED-UNVERIFIED | SD_SUBMITTED | SD SD260000000002802 | account of KAT-048 |   |
| 6 | KAT-053 Approve Stop Delivery Instruction | COMPLETED-UNVERIFIED | SD_APPROVED |  | officer 690127065209: BPM task "Review SD" of SD260000000002802 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 7 | KAT-054 Supplier creates the invoice | COMPLETED-UNVERIFIED | INVOICE_CREATED |  | account of KAT-035 (nurulainmof) — self-heal: the open BPM task "Create Invoice" is assigned to nurulainmof, 880801029878, not to NURULAINMOF |   |
| 8 | GATE DN_LOOKUP | done by SIT database (no debit note: PO260000000007216 is at 41025 Pending Payment Match) 2026-11-24T01:59:03+08:00 | |  | | |
| 9 | KAT-056 Approve Debit Note | not run |  |  |  |   |
| 10 | KAT-055 Payment match (non-contract) | COMPLETED-UNVERIFIED | PAYMENT_MATCHED | PA PA260000000006414 | Katalon default account of the step |   |

## Application messages per step

**KAT-052** attempt 2026-11-24T01:46:05+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract-partial-debit-note\05_KAT-052\2026-11-24_014557`
- info: Stop Delivery Instruction SD260000000002802 is successfully submitted.

**KAT-053** attempt 2026-11-24T01:46:49+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract-partial-debit-note\06_KAT-053\2026-11-24_014557`
- info: Stop Delivery Instruction SD260000000002802 is approved and has been sent to iGFMAS for acknowledgement. Tax Invoice must be issued by Supplier within thirty (30) days after the Stop Delivery Instruction is approved by the Government and acknowledged at iGFMAS.

**KAT-054** attempt 2026-11-24T01:47:29+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract-partial-debit-note\07_KAT-054\2026-11-24_014557`
- info: Invoice IN-PO260000000007216 is successfully submitted.

**KAT-055** attempt 2026-11-24T01:59:54+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract-partial-debit-note\10_KAT-055\2026-11-24_015945`
- info: Payment Advice PA260000000006414 is successfully submitted and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Payment Match document.

