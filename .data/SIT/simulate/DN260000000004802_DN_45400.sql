-- SIMULATE DN260000000004802 (DN, doc_id 225103): 45300 → 45400 Cancelled / Dibatalkan
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.fl_workflow_status SET is_current = 0, changed_by = 23924, changed_date = systimestamp WHERE doc_type = 'DN' AND doc_id = 225103 AND is_current = 1;
INSERT INTO ngep_sit.fl_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.FL_WORKFLOW_STATUS_SEQ.nextval, 'DN', 225103, 1, 45400, 1, 23924, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.fl_workflow_status WHERE doc_type = 'DN' AND doc_id = 225103 ORDER BY created_date;

-- ROLLBACK (back to 45300):
-- DELETE FROM ngep_sit.fl_workflow_status WHERE doc_type = 'DN' AND doc_id = 225103 AND is_current = 1 AND status_id = 45400;
-- UPDATE ngep_sit.fl_workflow_status SET is_current = 1 WHERE workflow_status_id = 74783147;
-- COMMIT;
