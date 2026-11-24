# Flow run ct-fd-agreement_20261123-203135

| | |
|---|---|
| Flow | ct-fd-agreement — Contract from a verified LOA: FD submit/approve, Agreement submit/approve, Amendment |
| Module | ct |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-23T20:31:35+08:00 / 2026-11-24T01:17:21+08:00 |
| Documents | LA LA260000000004225, CT CT260000000002301 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | GATE LA_LOOKUP | done by hadishafiq (--input) 2026-11-23T20:31:43+08:00 | | LA LA260000000004225 | | |
| 2 | KAT-040 Submit Fulfilment Details (FD) for a verified LOA | VERIFIED (7 attempts) | FD_SUBMITTED | CT CT260000000002301 | Katalon default account of the step |   |
| 3 | KAT-041 Approve Fulfilment Details | VERIFIED | FD_APPROVED | CT CT260000000002301 | Katalon default account of the step |   |
| 4 | KAT-042 Submit Agreement | VERIFIED | AGREEMENT_SUBMITTED | CT CT260000000002301 | Katalon default account of the step |   |
| 5 | KAT-043 Approve Agreement | VERIFIED | AGREEMENT_APPROVED | CT CT260000000002301 | Katalon default account of the step |   |
| 6 | KAT-045 Contract Amendment with Supplement: fill the form (the Katalon script never submits) | COMPLETED-UNVERIFIED | AMENDMENT_FORM_FILLED |  | account of KAT-040 |   |

## Application messages per step

**KAT-040** attempt 2026-11-23T20:31:43+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-23_203135`

**KAT-040** attempt 2026-11-23T21:21:20+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-23_212113`

**KAT-040** attempt 2026-11-23T21:25:10+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-23_212503`
- error: Frequency Schedule Start Period is mandatory. (ERR-100022)

**KAT-040** attempt 2026-11-23T21:29:22+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-23_212912`
- error: Frequency Schedule Start Period is mandatory. (ERR-100022)

**KAT-040** attempt 2026-11-24T01:01:49+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-24_010142`
- error: Frequency Schedule Start Period is mandatory. (ERR-100022)

**KAT-040** attempt 2026-11-24T01:06:35+08:00 → failed · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-24_010627`
- error: Frequency Schedule Start Period is mandatory. (ERR-100022)

**KAT-040** attempt 2026-11-24T01:12:07+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\02_KAT-040\2026-11-24_011159`
- info: Fulfilment Details Creation CT260000000002301 is successfully submitted to Contract Approver.

**KAT-041** attempt 2026-11-24T01:13:50+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\03_KAT-041\2026-11-24_011159`
- info: Fulfilment Details Creation CT260000000002301 is approved.

**KAT-042** attempt 2026-11-24T01:14:35+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\04_KAT-042\2026-11-24_011159`
- info: Agreement CT260000000002301 is successfully submitted to Contract Approver.

**KAT-043** attempt 2026-11-24T01:15:47+08:00 → verified · evidence `evidence\SIT\FLOW\ct-fd-agreement\05_KAT-043\2026-11-24_011159`
- info: Agreement CT260000000002301 is approved.

**KAT-045** attempt 2026-11-24T01:16:31+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\ct-fd-agreement\06_KAT-045\2026-11-24_011159`

