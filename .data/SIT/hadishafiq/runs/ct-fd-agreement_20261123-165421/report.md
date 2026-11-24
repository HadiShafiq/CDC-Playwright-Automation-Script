# Flow run ct-fd-agreement_20261123-165421

| | |
|---|---|
| Flow | ct-fd-agreement — Contract from a verified LOA: FD submit/approve, Agreement submit/approve, Amendment |
| Module | ct |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-23T16:54:21+08:00 / 2026-11-23T17:00:06+08:00 |
| Documents | LA LA260000000004216, CT CT260000000002293 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE LA_LOOKUP | done by hadishafiq (--input) 2026-11-23T16:54:33+08:00 | | LA LA260000000004216 | | |
| 2 | KAT-040 Submit Fulfilment Details (FD) for a verified LOA | VERIFIED | FD_SUBMITTED | CT CT260000000002293 | Katalon default account of the step |   |
| 3 | KAT-041 Approve Fulfilment Details | COMPLETED-UNVERIFIED | FD_APPROVED | CT CT260000000002293 | Katalon default account of the step |   |
| 4 | KAT-042 Submit Agreement | VERIFIED | AGREEMENT_SUBMITTED | CT CT260000000002293 | Katalon default account of the step |   |
| 5 | KAT-043 Approve Agreement | VERIFIED | AGREEMENT_APPROVED | CT CT260000000002293 | Katalon default account of the step |   |
| 6 | KAT-045 Contract Amendment with Supplement | COMPLETED-UNVERIFIED | CT_AMENDED |  | account of KAT-040 |   |

## Application messages per step

**KAT-040** attempt 2026-11-23T16:54:33+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-23_165423`
- info: Fulfilment Details Creation CT260000000002293 is successfully submitted to Contract Approver.

**KAT-041** attempt 2026-11-23T16:56:20+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-23_165423`
- info: Fulfilment Details Creation CT260000000002293 is approved.

**KAT-042** attempt 2026-11-23T16:57:06+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\04_KAT-042\2026-11-23_165423`
- info: Agreement CT260000000002293 is successfully submitted to Contract Approver.

**KAT-043** attempt 2026-11-23T16:58:22+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\05_KAT-043\2026-11-23_165423`
- info: Agreement CT260000000002293 is approved.

**KAT-045** attempt 2026-11-23T16:59:09+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\ct-fd-agreement\06_KAT-045\2026-11-23_165423`

