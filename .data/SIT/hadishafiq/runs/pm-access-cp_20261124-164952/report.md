# Flow run pm-access-cp_20261124-164952

| | |
|---|---|
| Flow | pm-access-cp — Company Profile access: submit, approve, activate |
| Module | pm |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-24T16:49:52+08:00 / 2026-11-24T17:09:57+08:00 |
| Documents | AA AP261124000001579 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | PM-001 Agency user submits an Access Application for Company Profile access | VERIFIED (3 attempts) | CP_SUBMITTED | AA AP261124000001579 | Katalon default account of the step |   |
| 2 | PM-011 UPS Approver approves the Company Profile access (new IC) | VERIFIED | CP_APPROVED_PENDING_ACTIVATION |  | Katalon default account of the step |   |
| 3 | PM-021 Applicant activates the Company Profile access (email link) | FAILED (2 attempts) |  |  | Katalon default account of the step | UNKNOWN (low): no rule matched; read the error, screenshot and trace <br>Activation not confirmed: Skip to Content Log Masuk Portal dikemaskini kali terakhir pada 6 November 2026 04:54:51 PM UTAMA MENGENAI eP PENGGUNA eP PERKHIDMATAN TAMBAHAN BANTUAN DAN RUJUKAN MUAT TURUN PAUTAN SEGERA CARIAN UTAMA/Pengaktifan Akaun Pengaktifan Akaun Sila masukkan maklumat berikut untuk |

## Application messages per step

**PM-001** attempt 2026-11-24T16:50:00+08:00 → failed · evidence `evidence\SIT\FLOW\pm-access-cp\01_PM-001\2026-11-24_164953`
- error: Salinan Kad Pengenalan yang disahkan oleh Ketua Jabatan adalah wajib. (ERR-100022)

**PM-001** attempt 2026-11-24T16:58:08+08:00 → failed · evidence `evidence\SIT\FLOW\pm-access-cp\01_PM-001\2026-11-24_165801`

**PM-001** attempt 2026-11-24T17:05:24+08:00 → verified · evidence `evidence\SIT\FLOW\pm-access-cp\01_PM-001\2026-11-24_170518`
- info: Permohonan bagi Akses Maklumat Syarikat AP261124000001578 anda telah berjaya diserahkan kepada pelulus. Pihak Kementerian Kewangan akan berurusan melalui emel selepas permohonan diproses. Sila semak emel anda dalam tempoh 14 hari bagi notifikasi berkaitan dengan permohonan anda. Sebarang pertanyaan, sila hubungi: Tel: +603 7985 7777/7888 Emel: bantuan@eperolehan.gov.my
- info: Permohonan bagi Akses Maklumat Syarikat AP261124000001579 anda telah berjaya diserahkan kepada pelulus. Pihak Kementerian Kewangan akan berurusan melalui emel selepas permohonan diproses. Sila semak emel anda dalam tempoh 14 hari bagi notifikasi berkaitan dengan permohonan anda. Sebarang pertanyaan, sila hubungi: Tel: +603 7985 7777/7888 Emel: bantuan@eperolehan.gov.my

**PM-011** attempt 2026-11-24T17:05:42+08:00 → verified · evidence `evidence\SIT\FLOW\pm-access-cp\02_PM-011\2026-11-24_170518`
- info: Application AP261124000001579 for Company Profile Information Access is approved.

**PM-021** attempt 2026-11-24T17:06:09+08:00 → failed · evidence `evidence\SIT\FLOW\pm-access-cp\03_PM-021\2026-11-24_170518`

**PM-021** attempt 2026-11-24T17:09:43+08:00 → failed · evidence `evidence\SIT\FLOW\pm-access-cp\03_PM-021\2026-11-24_170937`

