-- SIMULATE PI260000000000804 (PI, doc_id 2886666): 60753 → 60756 Cancel Due To Ministry Restructuring / Dibatalkan Disebabkan Penyusunan Semula Kementerian
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.sc_workflow_status SET is_current = 0, changed_by = 907, changed_date = systimestamp WHERE doc_type = 'PI' AND doc_id = 2886666 AND is_current = 1;
INSERT INTO ngep_sit.sc_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.SC_WORKFLOW_STATUS_SEQ.nextval, 'PI', 2886666, 1, 60756, 1, 907, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.sc_workflow_status WHERE doc_type = 'PI' AND doc_id = 2886666 ORDER BY created_date;

-- ROLLBACK (back to 60753):
-- DELETE FROM ngep_sit.sc_workflow_status WHERE doc_type = 'PI' AND doc_id = 2886666 AND is_current = 1 AND status_id = 60756;
-- UPDATE ngep_sit.sc_workflow_status SET is_current = 1 WHERE workflow_status_id = 785465;
-- COMMIT;
