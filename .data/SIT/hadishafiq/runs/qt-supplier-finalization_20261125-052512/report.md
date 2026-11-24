# Flow run qt-supplier-finalization_20261125-052512

| | |
|---|---|
| Flow | qt-supplier-finalization — QT at Pending Recommendation (60023) to Supplier Finalization signed off (SF 62213) |
| Module | qt |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-25T05:25:12+08:00 / 2026-11-25T05:57:50+08:00 |
| Documents | QT QT260000000004539 |

**Waiting for:** QT-016 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-770271: Please upload the endorsement report signed by the committee members. (ERR-770271)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run qt-supplier-finalization_20261125-052512 --step QT-016

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | QT-016 Supplier Finalization: consolidate report, FC meeting, finalize, endorse, sign off | FAILED (9 attempts) |  |  | Katalon default account of the step | APPLICATION_VALIDATION (medium): the application showed ERR-770271: Please upload the endorsement report signed by the committee members. (ERR-770271) <br>Finalize FC Selection submit: Please upload the endorsement report signed by the committee members. (ERR-770271) |

## Application messages per step

**QT-016** attempt 2026-11-25T05:25:20+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_052512`

**QT-016** attempt 2026-11-25T05:26:39+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_052635`

**QT-016** attempt 2026-11-25T05:31:32+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_053125`
- info: Quotation/Tender QT260000000004539 is successfully saved.
- error: Please give ranking to at least 1 suppliers - Item : PENSEL KAYU 2B BERPEMADAM (ERR-760384)

**QT-016** attempt 2026-11-25T05:35:40+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_053533`
- info: Quotation/Tender QT260000000004539 is successfully saved.
- error: LATAR BELAKANG, TUJUAN, METODOLOGI PENILAIAN, ULASAN DAN PENGESYORAN URUSETIA PEROLEHAN is mandatory. (ERR-775149)

**QT-016** attempt 2026-11-25T05:40:00+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_053953`
- info: Quotation/Tender QT260000000004539 is successfully saved.
- info: Desk Officer recommendation for Quotation/Tender QT260000000004539 has been submitted successfully.

**QT-016** attempt 2026-11-25T05:44:34+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_054427`
- info: Quotation/Tender QT260000000004539 has been successfully saved.
- info: Quotation/Tender QT260000000004539 is successfully submitted.

**QT-016** attempt 2026-11-25T05:48:42+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_054835`
- info: Meeting details and Authorized Authority for Quotation/Tender QT260000000004539 has been submitted successfully.

**QT-016** attempt 2026-11-25T05:53:27+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_055320`
- info: Supplier Finalization QT260000000004539 is successfully saved.
- error: ULASAN DAN PERAKUAN URUSETIA PIHAK BERKUASA MELULUS is mandatory. (ERR-775149)

**QT-016** attempt 2026-11-25T05:56:02+08:00 → failed · evidence `evidence\SIT\FLOW\qt-supplier-finalization\01_QT-016\2026-11-25_055555`
- info: Supplier Finalization QT260000000004539 is successfully saved.
- error: Please upload the endorsement report signed by the committee members. (ERR-770271)

