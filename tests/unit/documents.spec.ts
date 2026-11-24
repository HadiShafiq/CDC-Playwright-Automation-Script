// Document number patterns (support/core/documents.ts). Run: npx cross-env TEST_ENV=SIT playwright test tests/unit/documents.spec.ts
import { test, expect } from '@playwright/test';
import { findDocs, looksLike } from '../../support/core/documents';

test.describe('document numbers @unit', () => {
  test('SM application numbers (AP)', () => {
    expect(looksLike('AP', 'KN-06112026-0058')).toBe(true);
    expect(looksLike('AP', 'KN06112026-0058')).toBe(false);
    expect(findDocs('Application KA-06112026-0015 submitted', 'AP')).toEqual(['KA-06112026-0015']);
  });
  test('PM access applications (AA)', () => {
    expect(looksLike('AA', 'AP200204000000835')).toBe(true);
    expect(looksLike('AP', 'AP200204000000835')).toBe(false);
    expect(looksLike('AA', 'KN-06112026-0058')).toBe(false);
  });
  test('PID, plan, circular, cancellation and code request numbers', () => {
    expect(looksLike('PD', 'PD190000000000024')).toBe(true);
    expect(looksLike('PL', 'PP260000000000245')).toBe(true);
    expect(looksLike('PL', 'PE260000000000009')).toBe(true);
    expect(looksLike('TC', 'CQ260000000000669')).toBe(true);
    expect(looksLike('CX', 'CX200000000000007')).toBe(true);
    expect(looksLike('RC', 'RNC120118-1159')).toBe(true);
    expect(looksLike('RN', 'RNC120118-1159')).toBe(false);
  });
  test('credit notes (CN) in both SIT shapes', () => {
    expect(looksLike('CN', 'CN260000000001234')).toBe(true);
    expect(looksLike('CN', 'C0251152801170008')).toBe(true);
    expect(looksLike('CN', 'C025115280117000')).toBe(false);
  });
  test('classic and DO numbers are unchanged', () => {
    expect(looksLike('LA', 'LA260000000004216')).toBe(true);
    expect(looksLike('DO', '01400K003S2600002')).toBe(true);
    expect(looksLike('QT', 'QT260000000004342')).toBe(true);
  });
});
