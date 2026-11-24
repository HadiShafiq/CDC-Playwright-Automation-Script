# Flow run fl-contract_20261123-192148

| | |
|---|---|
| Flow | fl-contract — Contract fulfilment: CR → CO → delivery → FRN → invoice → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-23T19:21:48+08:00 / 2026-11-23T19:24:14+08:00 |
| Documents | LA LA260000000004216 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-23T19:21:54+08:00 | | LA LA260000000004216 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | FAILED |  |  | Katalon default account of the step | APPLICATION_VALIDATION (medium): the application showed ERR-740030: The PTJ has utilized this One Off Contract. (ERR-740030) <br>locator.click: Timeout 30000ms exceeded. |
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

**KAT-057** attempt 2026-11-23T19:21:55+08:00 → failed · evidence `evidence\SIT\FLOW\fl-contract\02_KAT-057\2026-11-23_192149`
- error: The PTJ has utilized this One Off Contract. (ERR-740030)

