-- SIMULATE KN-24112026-0035 (AP:SR, doc_id 1990765): 20199 → 20189 Deleted by Contractor / Dihapuskan oleh Kontraktor
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.sm_workflow_status SET is_current = 0, changed_by = 471284, changed_date = systimestamp WHERE doc_type = 'SR' AND doc_id = 1990765 AND is_current = 1;
INSERT INTO ngep_sit.sm_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.SM_WORKFLOW_STATUS_SEQ.nextval, 'SR', 1990765, 1, 20189, 1, 471284, systimestamp);
UPDATE ngep_sit.sm_appl SET status_id = 20189 WHERE appl_id = 1990765;
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.sm_workflow_status WHERE doc_type = 'SR' AND doc_id = 1990765 ORDER BY created_date;

-- ROLLBACK (back to 20199):
-- DELETE FROM ngep_sit.sm_workflow_status WHERE doc_type = 'SR' AND doc_id = 1990765 AND is_current = 1 AND status_id = 20189;
-- UPDATE ngep_sit.sm_workflow_status SET is_current = 1 WHERE workflow_status_id = 1069300;
-- UPDATE ngep_sit.sm_appl SET status_id = 20199 WHERE appl_id = 1990765;
-- COMMIT;
