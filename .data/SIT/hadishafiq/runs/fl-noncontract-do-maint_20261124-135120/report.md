# Flow run fl-noncontract-do-maint_20261124-135120

| | |
|---|---|
| Flow | fl-noncontract-do-maint — Non-contract: DO update and cancel (Fulfilment Maintenance) |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-24T13:51:20+08:00 / 2026-11-24T13:53:33+08:00 |
| Documents | RN RN260000000004926 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-046 Submit Purchase Request from an approved Request Note | FAILED |  |  | officer 690127065209: BPM task "Review Direct Purchase" of RN260000000004926 is ASSIGNED to 690127065209 (SIT WFTASK) | LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT) <br>locator.click: Timeout 30000ms exceeded. |
| 2 | KAT-047 Approve Purchase Request (sent to iGFMAS) | not run |  |  |  |   |
| 3 | GATE PO_LOOKUP | waiting | |  | | |
| 4 | KAT-048 Supplier acknowledges the Purchase Order | not run |  |  |  |   |
| 5 | KAT-049 Supplier submits delivery (Pending Delivery List) | not run |  |  |  |   |
| 6 | GATE DO_LOOKUP | waiting | |  | | |
| 7 | FL-101 Supplier updates the Delivery Order (Fulfilment Maintenance) | not run |  |  |  |   |
| 8 | FL-102 FL Approver approves the DO modification | not run |  |  |  |   |
| 9 | FL-103 Supplier cancels the Delivery Order | not run |  |  |  |   |
| 10 | FL-104 FL Approver approves the DO cancellation | not run |  |  |  |   |

## Application messages per step

**KAT-046** attempt 2026-11-24T13:51:29+08:00 → failed · evidence `evidence\SIT\FLOW\fl-noncontract-do-maint\01_KAT-046\2026-11-24_135120`

