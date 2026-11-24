-- SIMULATE CT260000000002301 (CT:AC, doc_id 27572): 56600 → 56970 Pending Final Agreement Update Cancelled / Menunggu Kemaskini Perjanjian Dibatalkan
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.ct_workflow_status SET is_current = 0, changed_by = 23924, changed_date = systimestamp WHERE doc_type = 'AC' AND doc_id = 27572 AND is_current = 1;
INSERT INTO ngep_sit.ct_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.CT_WORKFLOW_STATUS_SEQ.nextval, 'AC', 27572, 1, 56970, 1, 23924, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.ct_workflow_status WHERE doc_type = 'AC' AND doc_id = 27572 ORDER BY created_date;

-- ROLLBACK (back to 56600):
-- DELETE FROM ngep_sit.ct_workflow_status WHERE doc_type = 'AC' AND doc_id = 27572 AND is_current = 1 AND status_id = 56970;
-- UPDATE ngep_sit.ct_workflow_status SET is_current = 1 WHERE workflow_status_id = 191545;
-- COMMIT;
