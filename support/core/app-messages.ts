import type { Page } from '@playwright/test';

/**
 * Collects the application's own messages (PrimeFaces info/warn/error messages and growls) as they appear,
 * whatever the script does with them. They are the evidence for a step's outcome (success message with the
 * new document number) and for failure classification (ERR-… codes).
 */
export interface AppMessage {
  t: number;
  severity: 'info' | 'warn' | 'error' | 'fatal';
  text: string;
  url: string;
}

const SELECTOR = [
  '.ui-messages-info', '.ui-messages-warn', '.ui-messages-error', '.ui-messages-fatal',
  '.ui-growl-item', '.ui-message-error', '.ui-message-info',
].join(',');

export async function collectAppMessages(page: Page): Promise<AppMessage[]> {
  const messages: AppMessage[] = [];
  await page.exposeBinding('__qaAppMessage', (_src, m: { severity: AppMessage['severity']; text: string }) => {
    const text = m.text.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const last = messages.at(-1);
    if (last && last.text === text && last.severity === m.severity) return;
    messages.push({ t: Date.now(), severity: m.severity, text, url: page.url().split('?')[0] });
  });
  await page.addInitScript((selector: string) => {
    const reported = new Map<Element, string>();
    const severityOf = (el: Element) => {
      const c = el.className.toString();
      if (/fatal/.test(c)) return 'fatal';
      if (/error/.test(c)) return 'error';
      if (/warn/.test(c)) return 'warn';
      if (/growl/.test(c)) {
        const icon = el.querySelector('[class*="ui-growl-image-"]')?.className.toString() ?? '';
        return /error/.test(icon) ? 'error' : /warn/.test(icon) ? 'warn' : 'info';
      }
      return 'info';
    };
    const scan = () => {
      for (const el of Array.from(document.querySelectorAll(selector))) {
        const text = (el as HTMLElement).innerText ?? el.textContent ?? '';
        if (!text.trim() || reported.get(el) === text) continue;
        reported.set(el, text);
        (window as any).__qaAppMessage?.({ severity: severityOf(el), text });
      }
    };
    const start = () => new MutationObserver(scan).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    if (document.documentElement) start();
    else document.addEventListener('DOMContentLoaded', start);
  }, SELECTOR);
  return messages;
}
