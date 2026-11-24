# Flow run fl-noncontract-inv-maint_20261124-135602

| | |
|---|---|
| Flow | fl-noncontract-inv-maint — Non-contract: invoice update and cancel (Fulfilment Maintenance) |
| Module | fl |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-24T13:56:02+08:00 / 2026-11-24T15:34:35+08:00 |
| Documents | RN RN260000000004927, PR PR260000000005075 |

**Waiting for:** KAT-047 is recorded as done, but PR260000000005075 is at 40110 Pending PR Review from iGFMAS, not 40300 Purchase Request Approved (PR_APPROVED). Finish it in the application, then: npm run qa -- resume --env sit --run fl-noncontract-inv-maint_20261124-135602

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-046 Submit Purchase Request from an approved Request Note | VERIFIED | PR_SUBMITTED | PR PR260000000005075 | officer 710527085562: BPM task "Submit PR" of RN260000000004927 is ASSIGNED to 710527085562 (SIT WFTASK) |   |
| 2 | KAT-047 Approve Purchase Request (sent to iGFMAS) | COMPLETED-UNVERIFIED |  |  | officer 690127065209: BPM task "Review PR" of PR260000000005075 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 3 | GATE PO_LOOKUP | waiting | |  | | |
| 4 | KAT-048 Supplier acknowledges the Purchase Order | not run |  |  |  |   |
| 5 | KAT-049 Supplier submits delivery (Pending Delivery List) | not run |  |  |  |   |
| 6 | GATE DO_LOOKUP | waiting | |  | | |
| 7 | KAT-050 Receiving Officer acknowledges the Delivery Order (creates FRN) | not run |  |  |  |   |
| 8 | KAT-051 Acknowledge Officer approves the FRN | not run |  |  |  |   |
| 9 | KAT-054 Supplier creates the invoice | not run |  |  |  |   |
| 10 | FL-111 Supplier updates the invoice (Fulfilment Maintenance) | not run |  |  |  |   |
| 11 | FL-112 FL Approver approves the invoice modification | not run |  |  |  |   |
| 12 | FL-113 Supplier cancels the invoice | not run |  |  |  |   |
| 13 | FL-114 FL Approver approves the invoice cancellation | not run |  |  |  |   |

## Application messages per step

**KAT-046** attempt 2026-11-24T14:01:15+08:00 → verified · evidence `evidence\SIT\FLOW\fl-noncontract-inv-maint\01_KAT-046\2026-11-24_135602`
- info: Selected Charge Line Items updated.
- info: Purchase Request PR260000000005075 is successfully submitted.

**KAT-047** attempt 2026-11-24T14:02:34+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\fl-noncontract-inv-maint\02_KAT-047\2026-11-24_135602`

