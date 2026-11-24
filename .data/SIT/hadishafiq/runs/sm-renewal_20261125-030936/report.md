# Flow run sm-renewal_20261125-030936

| | |
|---|---|
| Flow | sm-renewal — Renewal MOF Account to Registered |
| Module | sm |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T03:09:36+08:00 / 2026-11-25T03:21:40+08:00 |
| Documents | AP KR-25112026-0001 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | SM-024 Create the Renewal MOF Account application (draft) | VERIFIED (3 attempts) | APPL_DRAFT | AP KR-25112026-0001 | Katalon default account of the step |   |
| 2 | SM-002 Declare the application and pay the processing fee | VERIFIED | PROCESSING_FEE_PAID |  | Katalon default account of the step |   |
| 3 | SM-005 SDO verifies the supporting documents | VERIFIED (2 attempts) | DOCS_VERIFIED |  | Katalon default account of the step |   |
| 4 | SM-006 Processing Officer reviews and recommends | VERIFIED | PO_REVIEWED |  | Katalon default account of the step |   |
| 5 | SM-011 Approver approves (registration fee to pay) | VERIFIED | APPROVED_FEE |  | Katalon default account of the step |   |
| 6 | SM-012 Pay the registration fee | VERIFIED | REGISTERED |  | Katalon default account of the step |   |

## Application messages per step

**SM-024** attempt 2026-11-25T03:09:43+08:00 → failed · evidence `evidence\SIT\FLOW\sm-renewal\01_SM-024\2026-11-25_030936`

**SM-024** attempt 2026-11-25T03:12:03+08:00 → failed · evidence `evidence\SIT\FLOW\sm-renewal\01_SM-024\2026-11-25_031154`
- info: Please click HERE or navigate to Task List Menu in order to proceed with Renew MOF Account KR-25112026-0001.

**SM-024** attempt 2026-11-25T03:14:51+08:00 → verified · evidence `evidence\SIT\FLOW\sm-renewal\01_SM-024\2026-11-25_031441`
- error: This application cannot continue because the same application already existed with "Pending" status. Please check this application in your Task List or Application Status menu. (ERR-722542)

**SM-002** attempt 2026-11-25T03:15:03+08:00 → verified · evidence `evidence\SIT\FLOW\sm-renewal\02_SM-002\2026-11-25_031441`
- info: Renew MOF Account : KR-25112026-0001 has been successfully saved
- error: Your page has expired! Please reload again. (ERR-100056)
- info: Your Renew MOF Account (KR-25112026-0001) has been successfully declared. Please pay RM50.00 processing fee within 365 days to avoid your application being cancelled automatically by the system. Please click HERE or go Task List menu to do payment.
- info: Processing fee was successful made. Your application has been submitted to the Unit Pendaftaran Syarikat, BPK, Ministry of Finance for processing. You can check the application status via e-mail or in ePerolehan System.

**SM-005** attempt 2026-11-25T03:16:08+08:00 → failed · evidence `evidence\SIT\FLOW\sm-renewal\03_SM-005\2026-11-25_031441`

**SM-005** attempt 2026-11-25T03:18:18+08:00 → verified · evidence `evidence\SIT\FLOW\sm-renewal\03_SM-005\2026-11-25_031809`
- info: Application No. KR-25112026-0001 is successfully sent to the Processing Officer(PO TEST CR28775 (C)) for approval

**SM-006** attempt 2026-11-25T03:19:00+08:00 → verified · evidence `evidence\SIT\FLOW\sm-renewal\04_SM-006\2026-11-25_031809`
- info: Application No. (KR-25112026-0001) is recommended for approval and has been sent to 1) Ku Harmizan Bin Ku Haron 2) Mohd Alif Aziz 3) Shafiza binti Arshad 4) Massliana Binti Mohamed Mansor 5) Wan Mohd Asri Bin Wan Yusof 6) Nor Haffezul Bin Shafie 7) Do Not Use By Mmz - Processing Officer 8) Othman Bin Semail

**SM-011** attempt 2026-11-25T03:19:49+08:00 → verified · evidence `evidence\SIT\FLOW\sm-renewal\05_SM-011\2026-11-25_031809`
- info: Application No.KR-25112026-0001 has been approved.

**SM-012** attempt 2026-11-25T03:20:43+08:00 → verified · evidence `evidence\SIT\FLOW\sm-renewal\06_SM-012\2026-11-25_031809`
- info: Your registration fee has been successfully made. Please click HERE or go to the Overview menu to retrieve the MOF Accounts Virtual Certificate of your company.

