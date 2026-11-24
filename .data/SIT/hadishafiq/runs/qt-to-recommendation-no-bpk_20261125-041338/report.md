# Flow run qt-to-recommendation-no-bpk_20261125-041338

| | |
|---|---|
| Flow | qt-to-recommendation-no-bpk — Quotation / Tender without BPK to Pending Recommendation |
| Module | qt |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-25T04:13:38+08:00 / 2026-11-25T04:56:48+08:00 |
| Documents | QT QT260000000004539 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | QT-001 Create the Quotation / Tender draft (General Information, Save) | VERIFIED | QT_DRAFT | QT QT260000000004539 | Katalon default account of the step |   |
| 2 | QT-002 Complete the QT tabs and Submit | VERIFIED | QT_SUBMITTED |  | officer 881204115188: BPM task "Submit Quotation Tender" of QT260000000004539 is ASSIGNED to 881204115188 (SIT WFTASK) |   |
| 3 | QT-003 Approve the QT and its committee formation | VERIFIED | QT_APPROVED |  | officer 580401035583: BPM task "Approve Committee" of QT260000000004539 is ASSIGNED to 580401035583 (SIT WFTASK) |   |
| 4 | QT-004 Prepare the specification | VERIFIED | SPEC_PREPARED |  | officer 810626015517: BPM task "Finalize Scoring" of QT260000000004539 is ASSIGNED to 810626015517 (SIT WFTASK) |   |
| 5 | QT-005 Every Specification Committee member endorses | VERIFIED | SPEC_ENDORSED |  | officer 770614135921 (QT role user from ngep-runner's SIT presets; BPM did not name a single assignee) |   |
| 6 | QT-006 Specification Committee chair signs off | VERIFIED | SPEC_SIGNED_OFF |  | officer 711105085487: BPM task "SignOff Scoring" of QT260000000004539 is ASSIGNED to 711105085487 (SIT WFTASK) |   |
| 7 | QT-107 Prepare the QT documents and submit (no BPK needed) | VERIFIED | DOCS_PREPARED_NO_BPK |  | officer 881204115188: BPM task "Prepare QT Schedule" of QT260000000004539 is ASSIGNED to 881204115188 (SIT WFTASK) |   |
| 8 | QT-009 Approve the documents for publication | VERIFIED | PUBLICATION_APPROVED |  | officer 580401035583: BPM task "Approve Publication" of QT260000000004539 is ASSIGNED to 580401035583 (SIT WFTASK) |   |
| 9 | QT-010 Publish the notice | VERIFIED | NOTICE_PUBLISHED |  | Katalon default account of the step |   |
| 10 | QT-011 Suppliers submit proposals; the QT closes | VERIFIED | QT_CLOSED |  | Katalon default account of the step |   |
| 11 | QT-012 Opening committee formed and approved | VERIFIED | OC_FORMED |  | Katalon default account of the step |   |
| 12 | QT-013 Opening committee: compliance verification, endorse, sign off | VERIFIED | OC_COMPLETED |  | Katalon default account of the step |   |
| 13 | QT-014 Technical evaluation committee: evaluate, endorse, sign off | VERIFIED | TEC_COMPLETED |  | Katalon default account of the step |   |
| 14 | QT-015 Financial evaluation committee: evaluate, endorse, sign off | VERIFIED | PENDING_RECOMMENDATION |  | Katalon default account of the step |   |

## Application messages per step

**QT-001** attempt 2026-11-25T04:13:45+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\01_QT-001\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 has been successfully saved. Further action needs to be taken through Task List.

**QT-002** attempt 2026-11-25T04:14:12+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\02_QT-002\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 has been successfully saved.
- info: Quotation/Tender QT260000000004539 is successfully submitted.

**QT-003** attempt 2026-11-25T04:15:17+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\03_QT-003\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 is approved.

**QT-004** attempt 2026-11-25T04:15:43+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\04_QT-004\2026-11-25_041338`
- info: Specification Details for QT260000000004539 is successfully saved.
- info: Template Specification is successfully saved.
- info: Scores is successfully saved.
- info: Specification Details for QT260000000004539 is successfully saved.
- info: Specification, Checklist and Scoring For QT260000000004539 is successfully submitted.

**QT-005** attempt 2026-11-25T04:19:17+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\05_QT-005\2026-11-25_041338`
- info: Specification, Checklist and Scoring For QT260000000004539 is successfully endorsed.

**QT-006** attempt 2026-11-25T04:20:08+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\06_QT-006\2026-11-25_041338`
- info: Specification, Checklist and Scoring For QT260000000004539 is successfully signed off.

**QT-107** attempt 2026-11-25T04:20:37+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\07_QT-107\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 has been successfully saved.
- info: Quotation/Tender QT260000000004539 is successfully submitted.

**QT-009** attempt 2026-11-25T04:22:35+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\08_QT-009\2026-11-25_041338`
- info: Publication notice for Quotation/Tender QT260000000004539 has successfully approved.

**QT-010** attempt 2026-11-25T04:23:03+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\09_QT-010\2026-11-25_041338`
- info: QT260000000004539 Publishing Started. Please wait a while for QT publishing.

**QT-011** attempt 2026-11-25T04:23:28+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\10_QT-011\2026-11-25_041338`
- info: The file was uploaded successfully.
- info: Proposal No. PN260000000008241 is successfully submitted.
- info: The file was uploaded successfully.
- info: Proposal No. PN260000000008242 is successfully submitted.
- info: QT260000000004539 Closing Started. Please wait a while for QT closing.

**QT-012** attempt 2026-11-25T04:29:40+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\11_QT-012\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 is successfully submitted.
- info: Quotation/Tender QT260000000004539 is approved.

**QT-013** attempt 2026-11-25T04:35:37+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\12_QT-013\2026-11-25_041338`
- info: Confirmation committee member and meeting schedule for QT260000000004539 is successfully submitted.
- info: Proposal Evaluation QT260000000004539 is successfully saved.
- info: Proposal Evaluation Compliance is successfully saved.
- info: Proposal Evaluation for QT260000000004539 is submitted successfully.
- info: Proposal Evaluation for QT260000000004539 is successfully endorsed.
- info: Proposal Evaluation for QT260000000004539 is successfully signed off.

**QT-014** attempt 2026-11-25T04:38:15+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\13_QT-014\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 is successfully submitted.
- info: Quotation/Tender QT260000000004539 is approved.
- info: Confirmation committee member and meeting schedule for QT260000000004539 is successfully submitted.
- info: Proposal Evaluation QT260000000004539 is successfully saved.
- info: Proposal Evaluation Scores is successfully saved.
- info: Proposal Evaluation for QT260000000004539 is submitted successfully.
- info: Proposal Evaluation for QT260000000004539 is successfully endorsed.
- info: Proposal Evaluation for QT260000000004539 is successfully signed off.

**QT-015** attempt 2026-11-25T04:48:11+08:00 → verified · evidence `evidence\SIT\FLOW\qt-to-recommendation-no-bpk\14_QT-015\2026-11-25_041338`
- info: Quotation/Tender QT260000000004539 is successfully submitted.
- info: Quotation/Tender QT260000000004539 is approved.
- info: Confirmation committee member and meeting schedule for QT260000000004539 is successfully submitted.
- info: Proposal Evaluation QT260000000004539 is successfully saved.
- info: Proposal Evaluation for QT260000000004539 is submitted successfully.
- info: Proposal Evaluation for QT260000000004539 is successfully endorsed.
- info: Proposal Evaluation for QT260000000004539 is successfully signed off.

