-- SIMULATE PA260000000006414 (PA, doc_id 11878839): 46005 → 46100 Awaiting iGFMAS Response / Menunggu antaramuka dengan iGFMAS
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.fl_workflow_status SET is_current = 0, changed_by = 23924, changed_date = systimestamp WHERE doc_type = 'PA' AND doc_id = 11878839 AND is_current = 1;
INSERT INTO ngep_sit.fl_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.FL_WORKFLOW_STATUS_SEQ.nextval, 'PA', 11878839, 1, 46100, 1, 23924, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.fl_workflow_status WHERE doc_type = 'PA' AND doc_id = 11878839 ORDER BY created_date;

-- ROLLBACK (back to 46005):
-- DELETE FROM ngep_sit.fl_workflow_status WHERE doc_type = 'PA' AND doc_id = 11878839 AND is_current = 1 AND status_id = 46100;
-- UPDATE ngep_sit.fl_workflow_status SET is_current = 1 WHERE workflow_status_id = 74783171;
-- COMMIT;
