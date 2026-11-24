# Flow run fl-contract_20261123-170117

| | |
|---|---|
| Flow | fl-contract — Contract fulfilment: CR → CO → delivery → FRN → invoice → payment |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-23T17:01:17+08:00 / 2026-11-23T17:03:39+08:00 |
| Documents | LA LA260000000004216, CR CR260000000006053 |

**Waiting for:** GATE CO_LOOKUP — Contract Order number after iGFMAS verification. iGFMAS creates the CO some time after CR260000000006053 is approved. Find it in DBeaver (NGEP_SIT.FL_FULFILMENT_ORDER) or Task Status Search, then: npm run qa -- gate --run fl-contract_20261123-170117 --gate CO_LOOKUP --set CO=CO26… When done: npm run qa -- gate --run fl-contract_20261123-170117 --gate CO_LOOKUP --done

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE CT_LOOKUP | done by hadishafiq (--input) 2026-11-23T17:01:29+08:00 | | LA LA260000000004216 | | |
| 2 | KAT-057 Prepare Contract Request from a contract | COMPLETED-UNVERIFIED | CR_SUBMITTED | CR CR260000000006053 | Katalon default account of the step |   |
| 3 | KAT-058 Approve Contract Request (sent to iGFMAS) | COMPLETED-UNVERIFIED | CR_APPROVED | CR CR260000000006053 | Katalon default account of the step |   |
| 4 | GATE CO_LOOKUP | waiting | |  | | |
| 5 | KAT-059 Supplier acknowledges the Contract Order | not run |  |  |  |   |
| 6 | KAT-060 Supplier submits delivery against the Contract Order | not run |  |  |  |   |
| 7 | GATE DO_LOOKUP | waiting | |  | | |
| 8 | KAT-061 Receiving Officer acknowledges the contract Delivery Order (FRN) | not run |  |  |  |   |
| 9 | KAT-062 Acknowledge Officer approves the contract FRN | not run |  |  |  |   |
| 10 | KAT-063 Supplier creates the contract invoice | not run |  |  |  |   |
| 11 | KAT-064 Payment match (contract) | not run |  |  |  |   |

## Application messages per step

**KAT-057** attempt 2026-11-23T17:01:29+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\02_KAT-057\2026-11-23_170119`
- info: Selected Charge Line Items updated.
- info: Contract Request CR260000000006053 is successfully submitted.

**KAT-058** attempt 2026-11-23T17:03:02+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-contract\03_KAT-058\2026-11-23_170119`
- info: Contract Request CR260000000006053 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

