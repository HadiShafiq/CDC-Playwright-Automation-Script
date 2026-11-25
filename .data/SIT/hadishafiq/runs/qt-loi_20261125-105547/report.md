# Flow run qt-loi_20261125-105547

| | |
|---|---|
| Flow | qt-loi — QT at SF 62213 (Pending LOI Preparation) to LOI submitted (LI 62401) |
| Module | qt |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **IN-PROGRESS** |
| Started / updated | 2026-11-25T10:55:47+08:00 / 2026-11-25T11:29:40+08:00 |
| Documents | QT QT260000000004539 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | QT-017 Prepare the Letter of Intent and submit it for approval | COMPLETED-UNVERIFIED (4 attempts) |  |  | Katalon default account of the step | BUSINESS_ASSERTION (high): the step finished but its proof query is not satisfied <br>Expected outcome not in the database for QT-017: its proof query found nothing (select count(*) from ngep_sit.sc_workflow_status w join ngep_sit.sc_loi l on l.loi_id = w.doc_id join ngep_sit.sc_loi_loa x on x.loi_loa_id = l.loi_loa_id join ngep_sit.sc_qt q on q.qt_id = x.doc_id where w.doc_type = 'L |

## Application messages per step

**QT-017** attempt 2026-11-25T10:56:03+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loi\01_QT-017\2026-11-25_105548`
- info: Quotation/Tender QT260000000004539 is saved.
- info: Letter of Intent (LOI) LI260000000000781 is successfully saved.
- error: Please add at least one Negotiation Term. (ERR-760289)

**QT-017** attempt 2026-11-25T11:22:36+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loi\01_QT-017\2026-11-25_112226`
- error: Date Minute is mandatory.

**QT-017** attempt 2026-11-25T11:24:52+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loi\01_QT-017\2026-11-25_112440`
- error: Date Minute is mandatory.

**QT-017** attempt 2026-11-25T11:26:40+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\qt-loi\01_QT-017\2026-11-25_112626`
- info: Letter of Intent (LOI) LI260000000000781 is successfully saved.
- info: Letter of Intent (LOI) LI260000000000781 is submitted successfully.

