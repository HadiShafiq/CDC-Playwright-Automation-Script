# Flow run qt-doc-revision_20261125-033605

| | |
|---|---|
| Flow | qt-doc-revision — QT documents sent back for revision by the Publication Approver |
| Module | qt |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-25T03:36:05+08:00 / 2026-11-25T03:52:15+08:00 |
| Documents | QT QT260000000004536 |

**Waiting for:** QT-107 failed in an earlier attempt (BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run qt-doc-revision_20261125-033605 --step QT-107

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | QT-001 Create the Quotation / Tender draft (General Information, Save) | VERIFIED | QT_DRAFT | QT QT260000000004536 | Katalon default account of the step |   |
| 2 | QT-002 Complete the QT tabs and Submit | VERIFIED | QT_SUBMITTED |  | officer 881204115188: BPM task "Submit Quotation Tender" of QT260000000004536 is ASSIGNED to 881204115188 (SIT WFTASK) |   |
| 3 | QT-003 Approve the QT and its committee formation | VERIFIED | QT_APPROVED |  | officer 580401035583: BPM task "Approve Committee" of QT260000000004536 is ASSIGNED to 580401035583 (SIT WFTASK) |   |
| 4 | QT-004 Prepare the specification | VERIFIED | SPEC_PREPARED |  | officer 810626015517: BPM task "Finalize Scoring" of QT260000000004536 is ASSIGNED to 810626015517 (SIT WFTASK) |   |
| 5 | QT-005 Every Specification Committee member endorses | VERIFIED | SPEC_ENDORSED |  | officer 770614135921 (QT role user from ngep-runner's SIT presets; BPM did not name a single assignee) |   |
| 6 | QT-006 Specification Committee chair signs off | VERIFIED | SPEC_SIGNED_OFF |  | officer 711105085487: BPM task "SignOff Scoring" of QT260000000004536 is ASSIGNED to 711105085487 (SIT WFTASK) |   |
| 7 | QT-107 Prepare the QT documents and submit (no BPK needed) | FAILED |  |  | officer 881204115188: BPM task "Prepare QT Schedule" of QT260000000004536 is ASSIGNED to 881204115188 (SIT WFTASK) | BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one <br>Expected outcome not in the database for QT-107: QT260000000004536 is at 60030 Pending BPK Approval, expected 60005 Pending Document Approval for Publication (DOCS_PREPARED_NO_BPK) |
| 8 | QT-109 Publication Approver sends the documents back for revision | not run |  |  |  |   |

## Application messages per step

**QT-001** attempt 2026-11-25T03:36:12+08:00 → verified · evidence `evidence\SIT\FLOW\qt-doc-revision\01_QT-001\2026-11-25_033606`
- info: Quotation/Tender QT260000000004536 has been successfully saved. Further action needs to be taken through Task List.

**QT-002** attempt 2026-11-25T03:36:42+08:00 → verified · evidence `evidence\SIT\FLOW\qt-doc-revision\02_QT-002\2026-11-25_033606`
- info: Quotation/Tender QT260000000004536 has been successfully saved.
- info: Quotation/Tender QT260000000004536 is successfully submitted.

**QT-003** attempt 2026-11-25T03:39:42+08:00 → verified · evidence `evidence\SIT\FLOW\qt-doc-revision\03_QT-003\2026-11-25_033606`
- info: Quotation/Tender QT260000000004536 is approved.

**QT-004** attempt 2026-11-25T03:41:10+08:00 → verified · evidence `evidence\SIT\FLOW\qt-doc-revision\04_QT-004\2026-11-25_033606`
- info: Specification Details for QT260000000004536 is successfully saved.
- info: Template Specification is successfully saved.
- info: Scores is successfully saved.
- info: Specification Details for QT260000000004536 is successfully saved.
- info: Specification, Checklist and Scoring For QT260000000004536 is successfully submitted.

**QT-005** attempt 2026-11-25T03:45:01+08:00 → verified · evidence `evidence\SIT\FLOW\qt-doc-revision\05_QT-005\2026-11-25_033606`
- info: Specification, Checklist and Scoring For QT260000000004536 is successfully endorsed.

**QT-006** attempt 2026-11-25T03:46:08+08:00 → verified · evidence `evidence\SIT\FLOW\qt-doc-revision\06_QT-006\2026-11-25_033606`
- info: Specification, Checklist and Scoring For QT260000000004536 is successfully signed off.

**QT-107** attempt 2026-11-25T03:46:43+08:00 → failed · evidence `evidence\SIT\FLOW\qt-doc-revision\07_QT-107\2026-11-25_033606`
- info: Quotation/Tender QT260000000004536 has been successfully saved.
- info: Quotation/Tender QT260000000004536 is successfully submitted.

