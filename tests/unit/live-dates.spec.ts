// Unit test (no browser): live-date tokens of support/katalon/runtime.ts. Run: npx cross-env TEST_ENV=SIT playwright test tests/unit
import { test, expect } from '@playwright/test';
import { liveValue } from '../../support/katalon/runtime';

test.describe('live date tokens @unit', () => {
  const nov23 = new Date(2026, 10, 23, 16, 4, 0); // 23 Nov 2026 16:04 local
  const dec15 = new Date(2026, 11, 15, 9, 0, 0);

  test('Java date patterns, today and +N days', () => {
    expect(liveValue('{yyyy-MM-dd}', nov23)).toBe('2026-11-23');
    expect(liveValue('{yyyy-MM-dd+180d}', nov23)).toBe('2027-05-22');
    expect(liveValue('Test{MMddHHmmss}', nov23)).toBe('Test1123160400');
  });

  test('month and year index for the Fulfilment Schedule lists', () => {
    expect(liveValue('{MI}', nov23)).toBe('11');
    expect(liveValue('{YI}', nov23)).toBe('1');
    expect(liveValue('{MI+1m}', nov23)).toBe('12');
    expect(liveValue('{YI+1m}', nov23)).toBe('1');
  });

  test('next month rolls over into the next year in December', () => {
    expect(liveValue('{MI+1m}', dec15)).toBe('1');
    expect(liveValue('{YI+1m}', dec15)).toBe('2');
  });

  test('non-string values and plain text are unchanged', () => {
    expect(liveValue(5, nov23)).toBe(5);
    expect(liveValue('no token', nov23)).toBe('no token');
  });
});
