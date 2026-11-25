# Flow run fl-contract_20261125-123300

| | |
|---|---|
| Flow | fl-contract — Contract fulfilment: CR → CO → delivery → FRN → invoice → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-25T12:33:00+08:00 / 2026-11-25T12:36:40+08:00 |
| Documents | LA LA260000000004240, CT CT260000000002315 |

**Waiting for:** KAT-057 failed in an earlier attempt (LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run fl-contract_20261125-123300 --step KAT-057

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-25T12:33:08+08:00 | | LA LA260000000004240 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | FAILED |  |  | officer 131020145098 (given for this run) | LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT) <br>locator.click: Timeout 30000ms exceeded. |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | not run |  |  |  |   |
| 4 | GATE CO_LOOKUP | waiting | |  | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | not run |  |  |  |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | not run |  |  |  |   |
| 7 | GATE DO_LOOKUP | waiting | |  | | |
| 8 | KAT-061 Receiving Officer acknowledges the contract Delivery Order (FRN) | not run |  |  |  |   |
| 9 | KAT-062 Acknowledge Officer approves the contract FRN | not run |  |  |  |   |
| 10 | KAT-063 Supplier creates the contract invoice | not run |  |  |  |   |
| 11 | KAT-064 Payment match (contract) | not run |  |  |  |   |

## Application messages per step

**KAT-057** attempt 2026-11-25T12:33:09+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract\02_KAT-057\2026-11-25_123300`

