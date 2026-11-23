import type { AppMessage } from './app-messages';

/**
 * First-pass failure classification from the error text and the application's messages. It is a hint for the
 * person triaging, with the evidence that led to it; it never decides severity or root cause.
 */
export type FailureClass =
  | 'BUSINESS_ASSERTION' // the expected outcome (message/document) was not observed
  | 'APPLICATION_VALIDATION' // the application rejected the action with its own error (ERR-…)
  | 'LOCATOR_OR_TIMING' // element not found/clickable in time
  | 'TEST_DATA' // the document is not where the script expects it (not in this account's My Task, …)
  | 'AUTHENTICATION' // login, session or SSO problem
  | 'ENVIRONMENT' // network, VPN, server error
  | 'AUTOMATION_DEFECT' // script defect (Katalon defect kept, missing variable)
  | 'BLOCKED_PREREQUISITE' // a needed input, gate or officer was not available
  | 'INTERRUPTED'
  | 'UNKNOWN';

export interface Classification {
  class: FailureClass;
  confidence: 'high' | 'medium' | 'low';
  because: string;
}

export function classify(error: string, messages: AppMessage[] = []): Classification {
  const e = error ?? '';
  const appErrors = messages.filter((m) => m.severity === 'error' || m.severity === 'fatal');
  const errCode = appErrors.map((m) => m.text.match(/ERR-\d+/)?.[0]).find(Boolean);
  const rules: [RegExp, FailureClass, Classification['confidence'], string][] = [
    [/^BLOCKED:/, 'BLOCKED_PREREQUISITE', 'high', 'the flow runner stopped before the step: a prerequisite is missing'],
    [/expected (success )?message|expected outcome/i, 'BUSINESS_ASSERTION', 'high', 'the step finished but its expected message/document was not observed'],
    [/Katalon script defect|katalonMissing/i, 'AUTOMATION_DEFECT', 'high', 'the Katalon script uses a value it never defines'],
    [/not in this account's My Task|No records found|not found in the task list/i, 'TEST_DATA', 'medium', "the document is not in this account's task list (wrong account, not assigned yet, or already done)"],
    [/Redirected to SSO|ssologin|session (has )?expired|Login ID|ID Log Masuk|not set for KAT-/i, 'AUTHENTICATION', 'medium', 'login or session problem'],
    [/net::ERR_|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ERR_CONNECTION|page\.goto: Timeout|NS_ERROR|502|503|504/i, 'ENVIRONMENT', 'medium', 'network/VPN or server problem'],
    [/Target page, context or browser has been closed|Test was interrupted|SIGINT|SIGTERM/i, 'INTERRUPTED', 'medium', 'the run was stopped or the browser closed'],
  ];
  for (const [re, cls, conf, because] of rules) if (re.test(e)) return { class: cls, confidence: conf, because };
  if (errCode) return { class: 'APPLICATION_VALIDATION', confidence: 'medium', because: `the application showed ${errCode}: ${appErrors[0].text.slice(0, 200)}` };
  if (/Timeout \d+ms exceeded|waiting for locator|strict mode violation|element is not (visible|enabled|attached)|not clickable|Element not found|Unable to find/i.test(e))
    return { class: 'LOCATOR_OR_TIMING', confidence: 'low', because: 'an element was not found or not ready in time (could also be a slow SIT)' };
  return { class: 'UNKNOWN', confidence: 'low', because: 'no rule matched; read the error, screenshot and trace' };
}
