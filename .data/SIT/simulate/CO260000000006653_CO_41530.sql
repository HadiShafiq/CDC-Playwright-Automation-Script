-- SIMULATE CO260000000006653 (CO, doc_id 12783053): 41530 → 41530 Pending Payment / Menunggu Bayaran
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.fl_workflow_status SET is_current = 0, changed_by = 23924, changed_date = systimestamp WHERE doc_type = 'CO' AND doc_id = 12783053 AND is_current = 1;
INSERT INTO ngep_sit.fl_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.FL_WORKFLOW_STATUS_SEQ.nextval, 'CO', 12783053, 1, 41530, 1, 23924, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.fl_workflow_status WHERE doc_type = 'CO' AND doc_id = 12783053 ORDER BY created_date;

-- ROLLBACK (back to 41530):
-- DELETE FROM ngep_sit.fl_workflow_status WHERE doc_type = 'CO' AND doc_id = 12783053 AND is_current = 1 AND status_id = 41530;
-- UPDATE ngep_sit.fl_workflow_status SET is_current = 1 WHERE workflow_status_id = 74783152;
-- COMMIT;
