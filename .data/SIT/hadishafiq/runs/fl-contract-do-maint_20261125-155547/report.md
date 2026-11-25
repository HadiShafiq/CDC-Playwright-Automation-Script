# Flow run fl-contract-do-maint_20261125-155547

| | |
|---|---|
| Flow | fl-contract-do-maint — Contract: DO update and cancel (Fulfilment Maintenance, P2 Contract Order) |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-25T15:55:47+08:00 / 2026-11-25T15:59:53+08:00 |
| Documents | LA LA260000000004240, CT CT260000000002315 |

**Waiting for:** KAT-057 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-740031: The PTJ has utilized the Schedule No. 1 of this Periodic Contract with Schedule. (ERR-740031)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run fl-contract-do-maint_20261125-155547 --step KAT-057

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-25T15:55:57+08:00 | | LA LA260000000004240 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | FAILED |  |  | officer 131020145098 (given for this run) | APPLICATION_VALIDATION (medium): the application showed ERR-740031: The PTJ has utilized the Schedule No. 1 of this Periodic Contract with Schedule. (ERR-740031) <br>locator.click: Timeout 30000ms exceeded. |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | not run |  |  |  |   |
| 4 | GATE CO_LOOKUP | waiting | |  | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | not run |  |  |  |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | not run |  |  |  |   |
| 7 | GATE DO_LOOKUP | waiting | |  | | |
| 8 | FL-101 Supplier updates the Delivery Order (Fulfilment Maintenance) | not run |  |  |  |   |
| 9 | FL-102 FL Approver approves the DO modification | not run |  |  |  |   |
| 10 | FL-103 Supplier cancels the Delivery Order | not run |  |  |  |   |
| 11 | FL-104 FL Approver approves the DO cancellation | not run |  |  |  |   |

## Application messages per step

**KAT-057** attempt 2026-11-25T15:56:27+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract-do-maint\02_KAT-057\2026-11-25_155548`
- error: The PTJ has utilized the Schedule No. 1 of this Periodic Contract with Schedule. (ERR-740031)

