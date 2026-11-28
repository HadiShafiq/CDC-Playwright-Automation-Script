# Flow run ct-fd-agreement_20261128-123147

| | |
|---|---|
| Flow | ct-fd-agreement — Contract from a verified LOA: FD submit/approve, Agreement submit/approve, Amendment |
| Module | ct |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-28T12:31:47+08:00 / 2026-11-28T12:44:44+08:00 |
| Documents | LA LA260000000004254, CT CT260000000002328 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE LA_LOOKUP | done by hadishafiq (--input) 2026-11-28T12:31:57+08:00 | | LA LA260000000004254 | | |
| 2 | KAT-040 Submit Fulfilment Details (FD) for a verified LOA | VERIFIED | FD_SUBMITTED | CT CT260000000002328 | Katalon default account of the step |   |
| 3 | KAT-041 Approve Fulfilment Details | VERIFIED (3 attempts) | FD_APPROVED | CT CT260000000002328 | officer 690127065209: BPM task "Review FD" of CT260000000002328 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 4 | KAT-042 Submit Agreement | VERIFIED | AGREEMENT_SUBMITTED | CT CT260000000002328 | Katalon default account of the step |   |
| 5 | KAT-043 Approve Agreement | VERIFIED | AGREEMENT_APPROVED | CT CT260000000002328 | officer 690127065209: BPM task "Review AC/SA" of CT260000000002328 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 6 | KAT-045 Contract Amendment with Supplement: fill the form (the Katalon script never submits) | COMPLETED-UNVERIFIED | AMENDMENT_FORM_FILLED |  | account of KAT-040 |   |

## Application messages per step

**KAT-040** attempt 2026-11-28T12:31:59+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-28_123148`
- info: Fulfilment Details Creation CT260000000002328 is successfully submitted to Contract Approver.

**KAT-041** attempt 2026-11-28T12:33:44+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-28_123148`

**KAT-041** attempt 2026-11-28T12:36:45+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-28_123634`

**KAT-041** attempt 2026-11-28T12:41:06+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-28_124056`
- info: Fulfilment Details Creation CT260000000002328 is approved.

**KAT-042** attempt 2026-11-28T12:41:55+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\04_KAT-042\2026-11-28_124056`
- info: Agreement CT260000000002328 is successfully submitted to Contract Approver.

**KAT-043** attempt 2026-11-28T12:43:08+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\05_KAT-043\2026-11-28_124056`
- info: Agreement CT260000000002328 is approved.

**KAT-045** attempt 2026-11-28T12:43:54+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\ct-fd-agreement\06_KAT-045\2026-11-28_124056`

