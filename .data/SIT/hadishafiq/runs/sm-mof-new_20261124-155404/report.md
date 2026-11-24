# Flow run sm-mof-new_20261124-155404

| | |
|---|---|
| Flow | sm-mof-new — New MOF supplier (contractor or consultant) to Registered |
| Module | sm |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-24T15:54:04+08:00 / 2026-11-24T16:42:46+08:00 |
| Documents | AP KN-24112026-0035 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | SM-001 Register the supplier and start the MOF application (draft) | VERIFIED (5 attempts) | APPL_DRAFT | AP KN-24112026-0035 | Katalon default account of the step |   |
| 2 | SM-002 Declare the application and pay the processing fee | VERIFIED (3 attempts) | PROCESSING_FEE_PAID |  | Katalon default account of the step |   |
| 3 | SM-005 SDO verifies the supporting documents | VERIFIED | DOCS_VERIFIED |  | Katalon default account of the step |   |
| 4 | SM-006 Processing Officer reviews and recommends | VERIFIED | PO_REVIEWED |  | Katalon default account of the step |   |
| 5 | SM-011 Approver approves (registration fee to pay) | VERIFIED | APPROVED_FEE |  | Katalon default account of the step |   |
| 6 | SM-012 Pay the registration fee | VERIFIED | REGISTERED |  | Katalon default account of the step |   |

## Application messages per step

**SM-001** attempt 2026-11-24T15:54:07+08:00 → failed · evidence `evidence\SIT\FLOW\sm-mof-new\01_SM-001\2026-11-24_155404`
- info: Your application to register as MOF Account supplier has been accepted. Activation information has been sent to your e-mail (newsupplier002@commercedc.com.my). Please activate your account within 7 days from the submitted date.

**SM-001** attempt 2026-11-24T16:17:46+08:00 → failed · evidence `evidence\SIT\FLOW\sm-mof-new\01_SM-001\2026-11-24_161743`
- info: Anda telah berjaya mengaktifkan Akaun MOF anda dengan No. eP berikut: eP-0101L0017 . Sila semak emel anda untuk kata laluan log masuk kali pertama.
- info: Please click HERE or navigate to Task List Menu in order to proceed with New MOF Account Registration KN-24112026-0035.
- info: New MOF Account Registration : KN-24112026-0035 has been successfully saved
- error: Bank Branch is mandatory. Postcode is mandatory.

**SM-001** attempt 2026-11-24T16:24:18+08:00 → failed · evidence `evidence\SIT\FLOW\sm-mof-new\01_SM-001\2026-11-24_162412`

**SM-001** attempt 2026-11-24T16:27:06+08:00 → failed · evidence `evidence\SIT\FLOW\sm-mof-new\01_SM-001\2026-11-24_162659`

**SM-001** attempt 2026-11-24T16:30:47+08:00 → verified · evidence `evidence\SIT\FLOW\sm-mof-new\01_SM-001\2026-11-24_163039`
- info: New MOF Account Registration : KN-24112026-0035 has been successfully saved

**SM-002** attempt 2026-11-24T16:31:42+08:00 → failed · evidence `evidence\SIT\FLOW\sm-mof-new\02_SM-002\2026-11-24_163039`
- error: Missing document(s) : The following documents are mandatory, please upload a valid document for the following list before submitting : 1.)BORANG PENGISYTIHARAN MOF (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide) 2.)MINIT MESYUARAT AGUNG TAHUNAN PERTUBUHAN TERKINI 3.)PERJANJIAN SEWA DIMATIKAN SETEM/ GERAN/ S&P/ BIL UTILITI YANG MENGANDUNGI NAMA DAN ALAMAT SYARIKAT/ SURAT KEBENARAN YANG DITANDATANGAN OLEH PEMILIK PREMIS 4.)SIJIL PENDAFTARAN PERTUBUHAN 5.)SURAT AKUAN SYARIKAT - LAMPIRAN 11 (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide.) 6.)UNDANG-UNDANG TUBUH/ PERLEMBAGAAN PERTUBUHAN (ERR-722537)

**SM-002** attempt 2026-11-24T16:33:36+08:00 → failed · evidence `evidence\SIT\FLOW\sm-mof-new\02_SM-002\2026-11-24_163330`
- error: Missing document(s) : The following documents are mandatory, please upload a valid document for the following list before submitting : 1.)BORANG PENGISYTIHARAN MOF (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide) 2.)MINIT MESYUARAT AGUNG TAHUNAN PERTUBUHAN TERKINI 3.)PERJANJIAN SEWA DIMATIKAN SETEM/ GERAN/ S&P/ BIL UTILITI YANG MENGANDUNGI NAMA DAN ALAMAT SYARIKAT/ SURAT KEBENARAN YANG DITANDATANGAN OLEH PEMILIK PREMIS 4.)SIJIL PENDAFTARAN PERTUBUHAN 5.)SURAT AKUAN SYARIKAT - LAMPIRAN 11 (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide.) 6.)UNDANG-UNDANG TUBUH/ PERLEMBAGAAN PERTUBUHAN (ERR-722537)

**SM-002** attempt 2026-11-24T16:36:47+08:00 → verified · evidence `evidence\SIT\FLOW\sm-mof-new\02_SM-002\2026-11-24_163638`
- info: Your New MOF Account Registration (KN-24112026-0035) has been successfully declared. Please pay RM50.00 processing fee within 365 days to avoid your application being cancelled automatically by the system. Please click HERE or go Task List menu to do payment.
- info: Processing fee was successful made. Your application has been submitted to the Unit Pendaftaran Syarikat, BPK, Ministry of Finance for processing. You can check the application status via e-mail or in ePerolehan System.

**SM-005** attempt 2026-11-24T16:38:03+08:00 → verified · evidence `evidence\SIT\FLOW\sm-mof-new\03_SM-005\2026-11-24_163638`
- info: Application No. KN-24112026-0035 is successfully sent to the Processing Officer(Posit) for approval

**SM-006** attempt 2026-11-24T16:38:45+08:00 → verified · evidence `evidence\SIT\FLOW\sm-mof-new\04_SM-006\2026-11-24_163638`
- info: Application No. (KN-24112026-0035) is recommended for approval and has been sent to 1) Ku Harmizan Bin Ku Haron 2) Mohd Alif Aziz 3) Shafiza binti Arshad 4) Massliana Binti Mohamed Mansor 5) Wan Mohd Asri Bin Wan Yusof 6) Nor Haffezul Bin Shafie 7) Do Not Use By Mmz - Processing Officer 8) Othman Bin Semail

**SM-011** attempt 2026-11-24T16:40:05+08:00 → verified · evidence `evidence\SIT\FLOW\sm-mof-new\05_SM-011\2026-11-24_163638`
- info: Application No.KN-24112026-0035 has been approved.

**SM-012** attempt 2026-11-24T16:40:51+08:00 → verified · evidence `evidence\SIT\FLOW\sm-mof-new\06_SM-012\2026-11-24_163638`
- info: Your registration fee has been successfully made. Please click HERE or go to the Overview menu to retrieve the MOF Accounts Virtual Certificate of your company.

