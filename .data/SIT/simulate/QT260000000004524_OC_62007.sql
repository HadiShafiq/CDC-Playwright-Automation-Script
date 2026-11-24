-- SIMULATE QT260000000004524 (QT:OC, doc_id 176396): 62004 → 62007 Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) / Sebutharga Telah Dibatalkan Disebabkan Tamat Tempoh Sahlaku. Kelulusan Daripada Mof Perlu Diperolehi Sekiranya Perlu Tindakan Selanjutnya
-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is
-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.
UPDATE ngep_sit.sc_workflow_status SET is_current = 0, changed_by = 56351, changed_date = systimestamp WHERE doc_type = 'OC' AND doc_id = 176396 AND is_current = 1;
INSERT INTO ngep_sit.sc_workflow_status (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (ngep_sit.SC_WORKFLOW_STATUS_SEQ.nextval, 'OC', 176396, 1, 62007, 1, 56351, systimestamp);
COMMIT;
-- Check: SELECT doc_type, status_id, is_current, created_date FROM ngep_sit.sc_workflow_status WHERE doc_type = 'OC' AND doc_id = 176396 ORDER BY created_date;

-- ROLLBACK (back to 62004):
-- DELETE FROM ngep_sit.sc_workflow_status WHERE doc_type = 'OC' AND doc_id = 176396 AND is_current = 1 AND status_id = 62007;
-- UPDATE ngep_sit.sc_workflow_status SET is_current = 1 WHERE workflow_status_id = 785539;
-- COMMIT;
