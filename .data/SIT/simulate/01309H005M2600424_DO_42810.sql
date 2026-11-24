-- SIMULATE 01309H005M2600424 (DO, doc_id 12257869): 42005 → 42810 Rejected / Ditolak
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.fl_workflow_status SET is_current = 0, changed_by = 438360, changed_date = systimestamp WHERE doc_type = 'DO' AND doc_id = 12257869 AND is_current = 1;
INSERT INTO ngep_sit.fl_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.FL_WORKFLOW_STATUS_SEQ.nextval, 'DO', 12257869, 1, 42810, 1, 438360, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.fl_workflow_status WHERE doc_type = 'DO' AND doc_id = 12257869 ORDER BY created_date;

-- ROLLBACK (back to 42005):
-- DELETE FROM ngep_sit.fl_workflow_status WHERE doc_type = 'DO' AND doc_id = 12257869 AND is_current = 1 AND status_id = 42810;
-- UPDATE ngep_sit.fl_workflow_status SET is_current = 1 WHERE workflow_status_id = 74778881;
-- COMMIT;
