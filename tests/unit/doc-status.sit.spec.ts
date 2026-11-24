// Read-only check of the SIT status reader against documents created by QA flow runs on 2026-11-23.
// Needs the DBeaver "SIT" connection. Run: npx cross-env TEST_ENV=SIT playwright test tests/unit/doc-status.sit.spec.ts
import { test, expect } from '@playwright/test';
import { currentStatus, deliveryOrdersOf, ordersOfRequest, statusAt, statusHistory } from '../../support/core/doc-status';
import { sitDbAvailable } from '../../support/core/sit-db';
import { bpmTasks } from '../../support/core/bpm-tasks';

test.describe('SIT document status reader @unit @sitdb', () => {
  test.skip(!sitDbAvailable(), 'no DBeaver SIT connection on this machine');

  test('LOA history with English and BM names', () => {
    const h = statusHistory('LA', 'LA260000000004216');
    expect(h.map((s) => s.statusId)).toEqual(expect.arrayContaining([62504, 62505, 62506]));
    expect(currentStatus('LA', 'LA260000000004216')).toMatchObject({ statusId: 62506, en: 'Letter of Acceptance Completed', bm: 'Surat Setuju Terima Telah Selesai' });
    expect(statusAt('LA', 'LA260000000004216', '2026-11-23 16:52:00')?.statusId).toBe(62504);
  });

  test('contract: fulfilment details and agreement', () => {
    expect(currentStatus('CT:FD', 'CT260000000002293')).toMatchObject({ statusId: 50300, en: 'Fulfilment Details Approved' });
    expect(currentStatus('CT:AC', 'CT260000000002293')).toMatchObject({ statusId: 56600, en: 'Agreement Completed', bm: 'Perjanjian Selesai' });
  });

  test('contract request and the contract order iGFMAS created from it', () => {
    expect(currentStatus('CR', 'CR260000000006053')).toMatchObject({ statusId: 40800, en: 'Contract Request Approved' });
    expect(ordersOfRequest('CR260000000006053')).toEqual([expect.objectContaining({ docType: 'CO', docNo: 'CO260000000006651' })]);
  });

  test('QT path with committee rows (registry/db-schema.json)', () => {
    const ids = statusHistory('QT:*', 'QT260000000004342').map((s) => `${s.docType}${s.statusId}`);
    expect(ids).toEqual(expect.arrayContaining(['QT60002', 'QT60024', 'CMT60202', 'BPK60151', 'OC62004', 'TEC62105', 'FEC62154', 'QT60023']));
    expect(currentStatus('QT', 'QT260000000004342')?.statusId).toBeGreaterThan(60000);
  });

  test('BPM tasks of an LOA over the SITSOA link', () => {
    const tasks = bpmTasks('LA260000000004216').map((t) => t.activity);
    expect(tasks).toEqual(expect.arrayContaining(['Accept Manual LOA', 'Verify Manual LOA']));
  });

  test('SM application path (AP, SM_WORKFLOW_STATUS SR)', () => {
    expect(statusHistory('AP', 'KN-06112026-0058').map((s) => s.statusId)).toEqual([20100, 20114, 20101, 20104, 20108, 20251, 20199]);
  });

  test('delivery order of a contract order (DO_LOOKUP)', () => {
    expect(deliveryOrdersOf('CO260000000005848').map((d) => d.docNo)).toContain('01400K003S2600002');
  });

  test('rejects anything that is not a document number', () => {
    expect(() => statusHistory('LA', "LA1' or 1=1 --")).toThrow(/not a LA number/);
  });
});
