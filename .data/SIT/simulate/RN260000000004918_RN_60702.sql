-- SIMULATE RN260000000004918 (RN, doc_id 11648347): 60703 → 60702 Pending Revision / Menunggu Kaji Semula
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.sc_workflow_status SET is_current = 0, changed_by = 23924, changed_date = systimestamp WHERE doc_type = 'RN' AND doc_id = 11648347 AND is_current = 1;
INSERT INTO ngep_sit.sc_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.SC_WORKFLOW_STATUS_SEQ.nextval, 'RN', 11648347, 1, 60702, 1, 23924, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.sc_workflow_status WHERE doc_type = 'RN' AND doc_id = 11648347 ORDER BY created_date;

-- ROLLBACK (back to 60703):
-- DELETE FROM ngep_sit.sc_workflow_status WHERE doc_type = 'RN' AND doc_id = 11648347 AND is_current = 1 AND status_id = 60702;
-- UPDATE ngep_sit.sc_workflow_status SET is_current = 1 WHERE workflow_status_id = 785542;
-- COMMIT;
