import { test, scenario } from '../../../fixtures/test';
import { reg001, reg002, reg003, reg004 } from '../../../support/modules/sm/registration';

/*
 * New MOF supplier registration, end to end on SIT (REG-001..004). The stage code lives in
 * support/modules/sm/registration.ts (shared with the SM flows of the flow runner: SM-001, SM-002, SM-005/006/011, SM-012).
 * DATA-CHANGING (SIT): creates a supplier account, an MOF application and officer decisions (audited).
 */
test.describe.configure({ mode: 'serial' });

const meta = (id: string, role: string, expected: string) =>
  scenario({ cr: 'MOF-REG', id, module: 'Supplier Management / New MOF Registration', role, tags: ['@mof-registration'], expected: `Proposed — Pending QA Review: ${expected}` });

test('REG-001 Register a new MOF account (Contractor, Cooperative) until first login', meta('REG-001', 'Supplier (new)', 'Online Registration → activation e-mail → activation → first-time-login e-mail → password changed; the new account can log in'), async ({ page, env, evidence }) => {
  test.setTimeout(45 * 60_000);
  await reg001({ page, env, evidence });
});

test('REG-002 Fill the MOF application, Declare and pay the processing fee', meta('REG-002', 'Supplier Administrator (MOF)', 'Company info, personnel, capital, bank, category codes and documents saved; Declare → Proceed; processing fee paid'), async ({ page, env, evidence }) => {
  test.setTimeout(30 * 60_000);
  await reg002({ page, env, evidence });
});

test('REG-003 Officers verify, review and approve the application', meta('REG-003', 'MOF officers', 'Each officer task found by Task Status Search is completed (verify supporting documents, review/recommend, approve) until none is pending'), async ({ page, env, evidence }) => {
  test.setTimeout(75 * 60_000);
  await reg003({ page, env, evidence });
});

test('REG-004 Pay the registration fee and view the virtual certificate', meta('REG-004', 'Supplier Administrator (MOF)', 'Registration fee paid (if asked) and the virtual MOF certificate is shown'), async ({ page, env, evidence }) => {
  test.setTimeout(20 * 60_000);
  await reg004({ page, env, evidence });
});
