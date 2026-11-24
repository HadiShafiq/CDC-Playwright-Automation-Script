# Flow run fl-noncontract_20261124-014141

| | |
|---|---|
| Flow | fl-noncontract — Non-contract fulfilment: PR → PO → delivery → FRN → invoice → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-24T01:41:41+08:00 / 2026-11-24T01:45:19+08:00 |
| Documents | PO PO260000000007216, DO 01309H005M2600504, FN FN260000000005812 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-046 Submit Purchase Request from an approved Request Note | not run |  |  |  |   |
| 2 | KAT-047 Approve Purchase Request (sent to iGFMAS) | not run |  |  |  |   |
| 3 | GATE PO_LOOKUP | waiting | |  | | |
| 4 | KAT-048 Supplier acknowledges the Purchase Order | not run |  |  |  |   |
| 5 | KAT-049 Supplier submits delivery (Pending Delivery List) | COMPLETED-UNVERIFIED | DELIVERY_SUBMITTED |  | account of KAT-048 |   |
| 6 | GATE DO_LOOKUP | done by SIT database (automatic lookup) 2026-11-24T01:42:40+08:00 | | DO 01309H005M2600504 | | |
| 7 | KAT-050 Receiving Officer acknowledges the Delivery Order (creates FRN) | COMPLETED-UNVERIFIED | FRN_CREATED | FN FN260000000005812 | Katalon default account of the step |   |
| 8 | KAT-051 Acknowledge Officer approves the FRN | COMPLETED-UNVERIFIED | FRN_APPROVED |  | officer 180220145443: BPM task "Approve FRN" of FN260000000005812 is ASSIGNED to 180220145443 (SIT WFTASK) |   |
| 9 | KAT-054 Supplier creates the invoice | FAILED |  |  | account of KAT-048 | LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT) <br>locator.fill: Timeout 30000ms exceeded. |
| 10 | KAT-055 Payment match (non-contract) | not run |  |  |  |   |

## Application messages per step

**KAT-049** attempt 2026-11-24T01:41:47+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract\05_KAT-049\2026-11-24_014142`
- info: Delivery Order DO-PO260000000007216 is successfully submitted for acknowledgment. View Delivery Order

**KAT-050** attempt 2026-11-24T01:42:41+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract\07_KAT-050\2026-11-24_014142`
- info: Fulfilment Received Note for Products / Services FN260000000005812 is successfully submitted for approval.

**KAT-051** attempt 2026-11-24T01:43:30+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract\08_KAT-051\2026-11-24_014142`
- info: Fulfilment Received Note for Products / Services FN260000000005812 is acknowledged and has been sent for posting at iGFMAS. Please click Alert/Notification to print the Fulfilment Received Note/Service and CoGSTR (if any).

**KAT-054** attempt 2026-11-24T01:44:07+08:00 → failed · evidence `evidence\SIT\FLOW\fl-noncontract\09_KAT-054\2026-11-24_014142`

