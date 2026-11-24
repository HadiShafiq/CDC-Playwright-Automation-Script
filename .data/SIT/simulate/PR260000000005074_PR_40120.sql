-- SIMULATE PR260000000005074 (PR, doc_id 13456278): 40300 → 40120 Pending Query Verification / Menunggu Semakan Kuiri
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.fl_workflow_status SET is_current = 0, changed_by = 23924, changed_date = systimestamp WHERE doc_type = 'PR' AND doc_id = 13456278 AND is_current = 1;
INSERT INTO ngep_sit.fl_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.FL_WORKFLOW_STATUS_SEQ.nextval, 'PR', 13456278, 1, 40120, 1, 23924, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.fl_workflow_status WHERE doc_type = 'PR' AND doc_id = 13456278 ORDER BY created_date;

-- ROLLBACK (back to 40300):
-- DELETE FROM ngep_sit.fl_workflow_status WHERE doc_type = 'PR' AND doc_id = 13456278 AND is_current = 1 AND status_id = 40120;
-- UPDATE ngep_sit.fl_workflow_status SET is_current = 1 WHERE workflow_status_id = 74783184;
-- COMMIT;
