# Flow run sm-update-profile_20261125-025110

| | |
|---|---|
| Flow | sm-update-profile — Update MOF Profile to approved |
| Module | sm |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-25T02:51:10+08:00 / 2026-11-25T03:05:53+08:00 |
| Documents | AP KU-02112026-0021 |

**Waiting for:** SM-004 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-722592: Bank Name and Account Number are not allowed to be updated because this information is still tied to active contracts belonging to this company. Check on Supplier’s Contract Maintenance.). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run sm-update-profile_20261125-025110 --step SM-004

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | SM-022 Create the Update MOF Profile application (draft) | VERIFIED (2 attempts) | APPL_DRAFT | AP KU-02112026-0021 | Katalon default account of the step |   |
| 2 | SM-004 Declare the application (no fee) | FAILED (4 attempts) |  |  | Katalon default account of the step | APPLICATION_VALIDATION (medium): the application showed ERR-722592: Bank Name and Account Number are not allowed to be updated because this information is still tied to active contracts belonging to this company. Check on Supplier’s Contract Maintenance. <br>Declare refused: Minimum 2 equity holding entities combination (i.e. company or personnel combination) is required for this supplier.Please satisfy any of the following scenario : 1. Add at least 2 equity owners 2. Add at least 2 equity companies 3. Add at least 1 equity owner and 1 equity company.  |
| 3 | SM-005 SDO verifies the supporting documents | not run |  |  |  |   |
| 4 | SM-006 Processing Officer reviews and recommends | not run |  |  |  |   |
| 5 | SM-013 Approver approves (no fee) | not run |  |  |  |   |

## Application messages per step

**SM-022** attempt 2026-11-25T02:51:18+08:00 → failed · evidence `evidence\SIT\FLOW\sm-update-profile\01_SM-022\2026-11-25_025111`

**SM-022** attempt 2026-11-25T02:57:06+08:00 → verified · evidence `evidence\SIT\FLOW\sm-update-profile\01_SM-022\2026-11-25_025656`
- error: This application cannot continue because the same application already existed with "Pending" status. Please check this application in your Task List or Application Status menu. (ERR-722542)
- info: Update MOF Profile : KU-02112026-0021 has been successfully saved

**SM-004** attempt 2026-11-25T02:57:25+08:00 → failed · evidence `evidence\SIT\FLOW\sm-update-profile\02_SM-004\2026-11-25_025656`
- error: Please provide justification and upload the necessary supporting document using company letterhead in category code section first before submit application (ERR-722654)

**SM-004** attempt 2026-11-25T02:58:55+08:00 → failed · evidence `evidence\SIT\FLOW\sm-update-profile\02_SM-004\2026-11-25_025847`
- error: Please provide justification and upload the necessary supporting document using company letterhead in category code section first before submit application (ERR-722654)

**SM-004** attempt 2026-11-25T03:00:13+08:00 → failed · evidence `evidence\SIT\FLOW\sm-update-profile\02_SM-004\2026-11-25_030004`
- error: Overlap category: Please provide justification and upload the necessary supporting document in order to proceed application (ERR-722661)
- error: Branch SELANGOR does not have any bank account for payment purpose. Please assigned bank account for this branch at Bank Information Section. (ERR-722622)

**SM-004** attempt 2026-11-25T03:04:16+08:00 → failed · evidence `evidence\SIT\FLOW\sm-update-profile\02_SM-004\2026-11-25_030407`
- error: Bank Name and Account Number are not allowed to be updated because this information is still tied to active contracts belonging to this company. Check on Supplier’s Contract Maintenance.
- info: Update MOF Profile : KU-02112026-0021 has been successfully saved
- error: Minimum 2 equity holding entities combination (i.e. company or personnel combination) is required for this supplier.Please satisfy any of the following scenario : 1. Add at least 2 equity owners 2. Add at least 2 equity companies 3. Add at least 1 equity owner and 1 equity company. (ERR-722592)

