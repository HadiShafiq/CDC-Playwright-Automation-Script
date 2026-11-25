# Flow run qt-loa_20261125-115125

| | |
|---|---|
| Flow | qt-loa — QT with LOI completed (62405) to Letter of Acceptance verified (LA 62506) |
| Module | qt |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-25T11:51:25+08:00 / 2026-11-25T11:58:20+08:00 |
| Documents | QT QT260000000004539 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | QT-021 Prepare the Letter of Acceptance and submit it | not run |  |  |  |   |
| 2 | QT-022 Supplier accepts the Letter of Acceptance | VERIFIED (5 attempts) | QT_LOA_ACCEPTED |  | Katalon default account of the step |   |
| 3 | QT-023 Desk Officer verifies the accepted Letter of Acceptance | FAILED |  |  | Katalon default account of the step | UNKNOWN (low): no rule matched; read the error, screenshot and trace <br>Verify LOA not confirmed: Letter of Acceptance (LOA) LA260000000004240 is completed. |

## Application messages per step

**QT-022** attempt 2026-11-25T11:51:38+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loa\02_QT-022\2026-11-25_115125`
- error: LOA Signing Date By Supplier is required. (ERR-760400)

**QT-022** attempt 2026-11-25T11:52:38+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loa\02_QT-022\2026-11-25_115227`
- error: Account No. is required. (ERR-760400)

**QT-022** attempt 2026-11-25T11:54:14+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loa\02_QT-022\2026-11-25_115402`
- error: Fax No. is required. (ERR-760400)

**QT-022** attempt 2026-11-25T11:55:07+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loa\02_QT-022\2026-11-25_115457`
- error: That is item without item code, please make sure all item been assign with item code before accept the Letter Of Acceptance. (ERR-760436)

**QT-022** attempt 2026-11-25T11:57:09+08:00 → verified · evidence `evidence\SIT\FLOW\qt-loa\02_QT-022\2026-11-25_115702`
- info: Letter Of Acceptance LA260000000004240 is accepted successfully.

**QT-023** attempt 2026-11-25T11:57:58+08:00 → failed · evidence `evidence\SIT\FLOW\qt-loa\03_QT-023\2026-11-25_115702`
- info: Letter of Acceptance (LOA) LA260000000004240 is completed.

