# Flow run ct-amendment-supplement_20261128-135322

| | |
|---|---|
| Flow | ct-amendment-supplement — Contract amendment with supplement (FA) to supplemental contract letter completed (51700) |
| Module | ct |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-28T13:53:22+08:00 / 2026-11-28T16:05:12+08:00 |
| Documents | CT CT260000000002328 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | CT-101 Contract Amendment With Supplement: create and submit (FA) | VERIFIED | FA_SUBMITTED |  | account of KAT-040 |   |
| 2 | CT-102 Contract Approver approves the amendment with supplement (Review FA) | VERIFIED | FA_APPROVED |  | officer 690127065209: BPM task "Review FA" of CT260000000002328 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 3 | CT-103 Committee secretary confirms the FA meeting and the approving authority (Confirm FA Meeting) | VERIFIED (2 attempts) |  |  | officer 881204115188: BPM task "Confirm FA Meeting" of CT260000000002328 is ASSIGNED to 881204115188 (SIT WFTASK) | UNKNOWN (low): no rule matched; read the error, screenshot and trace <br>meeting submit: Approving Authority Information for Supplementary Contract Amendment With CT260000000002328 has been updated. |
| 4 | CT-104 Committee secretary records the approving authority decision (Update FA Result) | VERIFIED (4 attempts) | FA_RESULT_UPDATED |  | officer 881204115188: BPM task "Update FA Result" of CT260000000002328 is ASSIGNED to 881204115188 (SIT WFTASK) |   |
| 5 | CT-105 Committee members sign off the amendment decision (Sign Off → Acknowledge) | VERIFIED | FA_SIGNED_OFF |  | Katalon default account of the step |   |
| 6 | CT-106 Committee chairperson signs off the amendment decision (Chairperson SignOff → Acknowledge) | VERIFIED | FA_CHAIR_SIGNED_OFF |  | officer 711105085487: BPM task "Chairperson SignOff" of CT260000000002328 is ASSIGNED to 711105085487 (SIT WFTASK) |   |
| 7 | CT-107 Contract Administrator prepares and submits the supplemental contract letter (Prepare LOA) | VERIFIED (2 attempts) | FA_LETTER_SUBMITTED |  | account of KAT-040 |   |
| 8 | CT-108 Supplier acknowledges the supplemental contract letter (Ack FA) | VERIFIED (3 attempts) | FA_LETTER_ACKNOWLEDGED |  | Katalon default account of the step |   |
| 9 | CT-109 Contract Administrator verifies the supplier acknowledgement (Verify FA) | VERIFIED | FA_COMPLETED |  | account of KAT-040 |   |
| 10 | CT-110 Contract Administrator creates and submits the supplemental agreement (Create Draft AC/SA) | FAILED (8 attempts) |  |  | account of KAT-040 | APPLICATION_VALIDATION (medium): the application showed ERR-750010: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010) <br>SA submit: still 57750 (Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)) |
| 11 | CT-111 Contract Approver approves the supplemental agreement (Review AC/SA) | not run |  |  |  |   |

## Application messages per step

**CT-101** attempt 2026-11-28T13:53:30+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\01_CT-101\2026-11-28_135323`
- info: Amendment With Supplementary Contract CT260000000002328 is successfully submitted to Contract Approver.

**CT-102** attempt 2026-11-28T13:57:16+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\02_CT-102\2026-11-28_135706`
- info: Amendment With Supplementary Contract CT260000000002328 is approved and sent to the Desk Officer of the Quotation Committee / Procurement Board for the preparation of the meeting.

**CT-103** attempt 2026-11-28T14:05:22+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\03_CT-103\2026-11-28_140509`
- error: Role is mandatory.

**CT-103** attempt 2026-11-28T14:06:55+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\03_CT-103\2026-11-28_140643`
- info: Amendment With Supplementary Contract CT260000000002328 is saved.
- info: Approving Authority Information for Supplementary Contract Amendment With CT260000000002328 has been updated.

**CT-104** attempt 2026-11-28T14:11:03+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\04_CT-104\2026-11-28_141050`

**CT-104** attempt 2026-11-28T14:12:58+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\04_CT-104\2026-11-28_141243`

**CT-104** attempt 2026-11-28T14:15:12+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\04_CT-104\2026-11-28_141450`
- info: Amendment With Supplementary Contract CT260000000002328 is saved.
- error: Decision Paper is mandatory. (ERR-100022)

**CT-104** attempt 2026-11-28T14:21:35+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\04_CT-104\2026-11-28_142122`
- info: Amendment With Supplementary Contract CT260000000002328 is saved.
- info: The decision of Approving Authorities at the Ministry / Jabatan Level for Amendment With Supplemental Contract CT260000000002328 has been updated.

**CT-105** attempt 2026-11-28T14:24:51+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\05_CT-105\2026-11-28_142441`
- info: Amendment With Supplementary Contract CT260000000002328 is acknowledged.

**CT-106** attempt 2026-11-28T14:27:16+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\06_CT-106\2026-11-28_142702`
- info: Amendment With Supplementary Contract CT260000000002328 is acknowledged.

**CT-107** attempt 2026-11-28T14:30:56+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\07_CT-107\2026-11-28_143044`

**CT-107** attempt 2026-11-28T14:32:30+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\07_CT-107\2026-11-28_143218`
- info: Supplemental Contract Letter CT260000000002328 is saved.
- info: Supplemental Contract Letter CT260000000002328 is successfully submitted for acknowledgment.

**CT-108** attempt 2026-11-28T14:36:32+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\08_CT-108\2026-11-28_143619`

**CT-108** attempt 2026-11-28T14:39:15+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\08_CT-108\2026-11-28_143904`
- info: Supplemental Contract Letter CT260000000002328 is saved.

**CT-108** attempt 2026-11-28T15:34:47+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\08_CT-108\2026-11-28_153434`
- info: Supplemental Contract Letter CT260000000002328 is acknowledged.

**CT-109** attempt 2026-11-28T15:37:21+08:00 → verified · evidence `evidence\SIT\FLOW\ct-amendment-supplement\09_CT-109\2026-11-28_153707`
- info: Supplemental Contract Letter CT260000000002328 is completed.

**CT-110** attempt 2026-11-28T15:41:02+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_154049`

**CT-110** attempt 2026-11-28T15:42:43+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_154231`
- info: Supplemental Agreement CT260000000002328 is saved.
- error: At least one row should be in Supplier Witness section. (ERR-100023)

**CT-110** attempt 2026-11-28T15:46:43+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_154632`

**CT-110** attempt 2026-11-28T15:48:16+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_154805`

**CT-110** attempt 2026-11-28T15:49:53+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_154942`
- info: Supplemental Agreement CT260000000002328 is saved.
- error: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)

**CT-110** attempt 2026-11-28T15:53:27+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_155316`
- info: Supplemental Agreement CT260000000002328 is saved.
- error: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)

**CT-110** attempt 2026-11-28T15:56:57+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_155646`
- info: Supplemental Agreement CT260000000002328 is saved.
- error: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)

**CT-110** attempt 2026-11-28T16:02:26+08:00 → failed · evidence `evidence\SIT\FLOW\ct-amendment-supplement\10_CT-110\2026-11-28_160139`
- error: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)

