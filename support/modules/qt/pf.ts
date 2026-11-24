import type { Page } from '@playwright/test';

/**
 * PrimeFaces helpers for the QT screens, ported from ngep-runner (QT_Tender-DirectLOA.zip, lib/session.mjs and
 * stages/submit.mjs), which drove real SIT QTs to 60023. Selections go through the PrimeFaces widget so AJAX listeners
 * fire; buttons are clicked with real mouse events on the visible, enabled button only.
 */
export async function pfIdle(page: Page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page
    .waitForFunction(
      () => {
        const w = window as any;
        if (!w.PrimeFaces || !w.PrimeFaces.ajax) return true;
        const q = w.PrimeFaces.ajax.Queue;
        if (q.isEmpty()) return true;
        // a response whose update script throws never polls the queue: send the head after 2 s of nothing in flight
        if (w.jQuery && w.jQuery.active === 0) {
          w.__pwIdleSince ??= Date.now();
          if (Date.now() - w.__pwIdleSince > 2000) {
            w.__pwIdleSince = undefined;
            try {
              w.PrimeFaces.ajax.AjaxUtils.send(q.requests[0]);
            } catch {
              /* keep polling */
            }
          }
        } else w.__pwIdleSince = undefined;
        return false;
      },
      null,
      { timeout: 60_000, polling: 250 },
    )
    .catch(() => {});
}

export async function settledEval<A, R>(page: Page, fn: (arg: A) => R, arg: A, tries = 3): Promise<R> {
  for (let i = 1; ; i++) {
    try {
      await page.waitForLoadState('networkidle').catch(() => {});
      return (await page.evaluate(fn as any, arg)) as R;
    } catch (e) {
      if (i >= tries || !/context was destroyed|navigation/i.test(String((e as Error).message))) throw e;
    }
  }
}

/** Pick a PrimeFaces selectOneMenu option by label (case-insensitive), through the widget so AJAX listeners fire. */
export async function pfSelect(page: Page, id: string, label: string) {
  const ok = await page.evaluate(
    ({ id, label }) => {
      const sel = (document.getElementById(`${id}_input`) || document.getElementById(id)) as HTMLSelectElement | null;
      const opt = sel && [...sel.options].find((o) => o.text.trim().toLowerCase() === label.toLowerCase());
      if (!sel || !opt) return false;
      const w = window as any;
      const pool = (w.PrimeFaces && w.PrimeFaces.widgets) || w;
      const widget = Object.keys(pool)
        .map((k) => {
          try {
            return pool[k];
          } catch {
            return null;
          }
        })
        .find((x) => x && typeof x === 'object' && x.id === id && x.jq);
      if (widget && widget.selectValue) widget.selectValue(opt.value);
      else {
        sel.value = opt.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return true;
    },
    { id, label },
  );
  if (!ok) {
    const offered = await page
      .evaluate((x) => [...((document.getElementById(`${x}_input`) as HTMLSelectElement | null)?.options ?? [])].map((o) => o.text.trim()), id)
      .catch(() => [] as string[]);
    throw new Error(`"${label}" not offered in ${id} (offered: ${offered.join(' | ') || 'none'})`);
  }
  await pfIdle(page);
}

/** Visible PrimeFaces / Liferay messages (texts). */
export async function pageMessages(page: Page): Promise<string[]> {
  return (await page.locator('.ui-messages-error, .ui-messages-info, .ui-messages-warn, .ui-growl-item, .ui-message-error, .portlet-msg-error, .portlet-msg-success, .portlet-msg-info').allInnerTexts().catch(() => []))
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter(Boolean);
}

/** Click the visible, enabled button with this exact label (not one inside a hidden dialog). */
export async function clickButton(page: Page, label: string, { inDialog }: { inDialog?: string } = {}) {
  const ok = await settledEval(
    page,
    ({ label, inDialog }) => {
      document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
      const root: ParentNode = inDialog ? (document.getElementById(inDialog) as HTMLElement) : document;
      const b = [...root.querySelectorAll('button')].find(
        (x) => (x as HTMLElement).innerText.trim() === label && (x as HTMLElement).offsetWidth && !(x as HTMLButtonElement).disabled && !x.classList.contains('ui-state-disabled') && (inDialog || !x.closest('.ui-dialog')),
      );
      if (b) b.setAttribute('data-pw-target', '1');
      return !!b;
    },
    { label, inDialog },
  );
  if (!ok) throw new Error(`Button "${label}" not found${inDialog ? ` in ${inDialog}` : ''}`);
  await page.locator('[data-pw-target="1"]').click();
  await pfIdle(page);
}

/** Press a main action (Submit / Approve / …) and answer the confirm / sign dialogs that follow; returns the messages. */
export async function pressAndConfirm(page: Page, button: string, log: (m: string) => void = () => {}): Promise<string[]> {
  page.once('dialog', (d) => d.accept().catch(() => {}));
  await clickButton(page, button);
  const ANSWER = /^(Yes|Ya|OK|Confirm|Sahkan|Sign W\/O GPKI|Sign W\/O Token|Sign)$/i;
  let answered = 0;
  for (let i = 0; i < 40 && answered < 4; i++) {
    await pfIdle(page);
    const hit = await settledEval(
      page,
      (re) => {
        const ok = new RegExp(re, 'i');
        for (const d of document.querySelectorAll('.ui-dialog, .ui-confirm-dialog')) {
          const el = d as HTMLElement;
          if (!el.offsetWidth || getComputedStyle(el).display === 'none' || el.getAttribute('aria-hidden') === 'true') continue;
          const btns = [...el.querySelectorAll('button')].filter((x) => (x as HTMLElement).offsetWidth && ok.test((x as HTMLElement).innerText.trim()));
          const b = btns.find((x) => /W\/O (GPKI|Token)/i.test((x as HTMLElement).innerText)) || btns[0];
          if (b) return { dlg: el.id, label: (b as HTMLElement).innerText.trim(), text: el.innerText.replace(/\s+/g, ' ').slice(0, 120) };
        }
        return null;
      },
      ANSWER.source,
    );
    if (hit) {
      log(`dialog: "${hit.text}" -> ${hit.label}`);
      await clickButton(page, hit.label, { inDialog: hit.dlg });
      answered++;
      continue;
    }
    if ((await pageMessages(page)).length) break;
    await page.waitForTimeout(500);
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  await page.waitForTimeout(1500);
  return pageMessages(page);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

/** Click a side-menu tab and wait until it is active (an AJAX round trip). */
export async function openTab(page: Page, label: string, retry = true): Promise<void> {
  const item = page.locator('li.ui-tabmenuitem:visible', { hasText: new RegExp(`^\\s*${escapeRe(label)}\\s*$`) }).first();
  if (!(await item.count())) {
    await page.locator('a:visible, span:visible', { hasText: new RegExp(`^\\s*${escapeRe(label)}\\s*$`) }).first().click({ force: true });
    await pfIdle(page);
    return;
  }
  if (/ui-state-active/.test((await item.getAttribute('class')) ?? '')) return;
  await item.locator('a').first().evaluate((a) => (a as HTMLElement).click());
  await page.waitForLoadState('networkidle').catch(() => {});
  await pfIdle(page);
  // "Are you sure to proceed without add additional checklist?" → Yes (what we mean)
  await page
    .evaluate(() => {
      for (const d of document.querySelectorAll('.ui-dialog, .ui-confirm-dialog')) {
        if (!(d as HTMLElement).offsetWidth || !/are you sure to proceed without/i.test((d as HTMLElement).innerText)) continue;
        const yes = [...d.querySelectorAll('button')].find((b) => (b as HTMLElement).offsetWidth && /^(Yes|Ya)$/i.test((b as HTMLElement).innerText.trim()));
        if (yes) (yes as HTMLElement).click();
      }
    })
    .catch(() => {});
  await pfIdle(page);
  const active = await item
    .evaluate(
      (li) =>
        new Promise<boolean>((resolve) => {
          const t0 = Date.now();
          (function poll() {
            if (li.isConnected && li.classList.contains('ui-state-active')) return resolve(true);
            if (Date.now() - t0 > 45000) return resolve(false);
            setTimeout(poll, 250);
          })();
        }),
    )
    .catch(() => false);
  if (!active) {
    const fresh = page.locator('li.ui-tabmenuitem', { hasText: new RegExp(`^\\s*${escapeRe(label)}\\s*$`) }).first();
    if (!/ui-state-active/.test((await fresh.getAttribute('class')) ?? '')) {
      const stuck = await page.evaluate(() => ((window as any).PrimeFaces?.ajax?.Queue?.requests || []).length > 0 && (window as any).jQuery?.active === 0).catch(() => false);
      if (stuck && retry) {
        await page.reload({ waitUntil: 'networkidle' });
        await pfIdle(page);
        return openTab(page, label, false);
      }
      throw new Error(`Tab "${label}" did not open${(await pageMessages(page)).length ? `: ${(await pageMessages(page)).join(' | ')}` : ''}`);
    }
  }
}
