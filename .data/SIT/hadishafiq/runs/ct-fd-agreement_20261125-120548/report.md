# Flow run ct-fd-agreement_20261125-120548

| | |
|---|---|
| Flow | ct-fd-agreement — Contract from a verified LOA: FD submit/approve, Agreement submit/approve, Amendment |
| Module | ct |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T12:05:48+08:00 / 2026-11-25T12:12:43+08:00 |
| Documents | LA LA260000000004240, CT CT260000000002315 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE LA_LOOKUP | done by hadishafiq (--input) 2026-11-25T12:05:56+08:00 | | LA LA260000000004240 | | |
| 2 | KAT-040 Submit Fulfilment Details (FD) for a verified LOA | VERIFIED | FD_SUBMITTED | CT CT260000000002315 | Katalon default account of the step |   |
| 3 | KAT-041 Approve Fulfilment Details | VERIFIED (2 attempts) | FD_APPROVED | CT CT260000000002315 | Katalon default account of the step |   |
| 4 | KAT-042 Submit Agreement | VERIFIED | AGREEMENT_SUBMITTED | CT CT260000000002315 | Katalon default account of the step |   |
| 5 | KAT-043 Approve Agreement | VERIFIED | AGREEMENT_APPROVED | CT CT260000000002315 | Katalon default account of the step |   |
| 6 | KAT-045 Contract Amendment with Supplement: fill the form (the Katalon script never submits) | not run |  |  |  |   |

## Application messages per step

**KAT-040** attempt 2026-11-25T12:05:57+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-25_120549`
- info: Fulfilment Details Creation CT260000000002315 is successfully submitted to Contract Approver.

**KAT-041** attempt 2026-11-25T12:07:25+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-25_120549`

**KAT-041** attempt 2026-11-25T12:10:17+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-25_121012`
- info: Fulfilment Details Creation CT260000000002315 is approved.

**KAT-042** attempt 2026-11-25T12:10:59+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\04_KAT-042\2026-11-25_121012`
- info: Agreement CT260000000002315 is successfully submitted to Contract Approver.

**KAT-043** attempt 2026-11-25T12:12:02+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\05_KAT-043\2026-11-25_121012`
- info: Agreement CT260000000002315 is approved.

