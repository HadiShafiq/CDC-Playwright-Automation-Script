// Read-only check of the SIT status reader against documents created by QA flow runs on 2026-11-23.
// Needs the DBeaver "SIT" connection. Run: npx cross-env TEST_ENV=SIT playwright test tests/unit/doc-status.sit.spec.ts
import { test, expect } from '@playwright/test';
import { currentStatus, ordersOfRequest, statusAt, statusHistory } from '../../support/core/doc-status';
import { sitDbAvailable } from '../../support/core/sit-db';

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

  test('rejects anything that is not a document number', () => {
    expect(() => statusHistory('LA', "LA1' or 1=1 --")).toThrow(/not a LA number/);
  });
});
