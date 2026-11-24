-- SIMULATE QT260000000004537 (QT:BPK, doc_id 176405): 60153 → 60153 Pending Document Revision (BPK) / Menunggu Kaji Semula Dokumen (BPK)
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.sc_workflow_status SET is_current = 0, changed_by = 456517, changed_date = systimestamp WHERE doc_type = 'BPK' AND doc_id = 176405 AND is_current = 1;
INSERT INTO ngep_sit.sc_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.SC_WORKFLOW_STATUS_SEQ.nextval, 'BPK', 176405, 1, 60153, 1, 456517, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.sc_workflow_status WHERE doc_type = 'BPK' AND doc_id = 176405 ORDER BY created_date;

-- ROLLBACK (back to 60153):
-- DELETE FROM ngep_sit.sc_workflow_status WHERE doc_type = 'BPK' AND doc_id = 176405 AND is_current = 1 AND status_id = 60153;
-- UPDATE ngep_sit.sc_workflow_status SET is_current = 1 WHERE workflow_status_id = 785914;
-- COMMIT;
