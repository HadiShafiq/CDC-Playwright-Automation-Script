import path from 'node:path';
import type { Page } from '@playwright/test';
import { clickButton, openTab, pageMessages, pfIdle, pfSelect, pressAndConfirm, settledEval } from './pf';
import { openTask } from './tasklist';
import type { StageCtx } from './stages';

/**
 * QT-004 (60003 → 60025): the Specification Committee secretary prepares Specification & Scoring and submits.
 * Ported from ngep-runner stages/spec.mjs (built tab by tab on DEV, ran on SIT to 60023 for QT260000000004342):
 * every part skips what is already filled, so a retry continues where an earlier attempt stopped.
 */
export const SPEC = {
  periodMonths: '12',
  justification: 'QA automation test data.',
  template: {
    title: 'QA AUTO SPEC ALATULIS',
    items: [
      {
        name: 'PEN BOLA (BALL POINT) DAKWAT BIRU', uomSearch: 'Piece', uom: 'PC - Piece', priceType: 'Normal Standard', qty: '100',
        specs: [
          { text: 'Dakwat biru, mata pen 0.7mm', answer: 'Yes/No', scoreType: 'Manual', maxScore: '10' },
          { text: 'Badan pen lutsinar dengan penutup', answer: 'Yes/No', scoreType: 'Manual', maxScore: '10' },
        ],
      },
      {
        name: 'PENSEL KAYU 2B BERPEMADAM', uomSearch: 'Piece', uom: 'PC - Piece', priceType: 'Normal Standard', qty: '100',
        specs: [
          { text: 'Gred 2B, panjang 175mm', answer: 'Yes/No', scoreType: 'Manual', maxScore: '10' },
          { text: 'Pemadam dipasang di hujung', answer: 'Yes/No', scoreType: 'Manual', maxScore: '10' },
        ],
      },
    ],
  },
  // per item: 2 × 100 × unit = the QT price (RM100,000 → RM500)
  unitPrices: ['500', '500'],
  variance: { from: '10', to: '10', below: '50', within: '100', above: '0' },
  scoring: {
    technical: { item: '100', other: '0', packagePassing: '50' },
    financial: { weight: '100', item: '100', other: '0', passing: '0', packageType: 'Auto', packagePassing: '0', packageVariance: { from: '10', to: '10', below: '100', above: '0' } },
    overallPassing: '50',
  },
  finForms: { bankStatementFrom: 'July', experienceSinceYear: '2016' },
  schemaPdf: path.resolve(__dirname, '..', '..', '..', 'fixtures', 'files', 'qt-scoring-schema.pdf'),
};
type SpecLine = { text: string; answer: string; scoreType: string; maxScore?: string; scores?: string[] };

class Spec {
  NS = '_scQTPrepareSpec_WAR_NGePportlet_:form:';
  Q = `${this.NS}j_idt82:questionTbl`;
  F = `${this.NS}j_idt37:`;
  constructor(private page: Page, private log: (m: string) => void) {}
  byId = (id: string) => `[id="${this.NS}${id}"]`;

  async useFormNs() {
    const ns = await settledEval(this.page, () => {
      const el = document.querySelector('[id*="_WAR_NGePportlet_:form:"]') || document.querySelector('[id*=":form:"]');
      return el ? el.id.slice(0, el.id.indexOf(':form:') + 6) : null;
    }, undefined);
    if (ns) this.NS = ns;
    const tbl = await settledEval(this.page, () => [...document.querySelectorAll('[id$=":questionTbl"]')].map((e) => e.id)[0] ?? null, undefined);
    const box = tbl ? tbl.replace(/questionTbl$/, '') : null;
    this.Q = `${box || `${this.NS}j_idt82:`}questionTbl`;
    this.F = box || `${this.NS}j_idt37:`;
  }

  async fillIfEmpty(id: string, value: string) {
    const el = this.page.locator(this.byId(id));
    if (!(await el.count())) return `${id} not on page`;
    if ((await el.inputValue()).trim()) return `${id} already set`;
    await el.fill(value, { force: true });
    await el.blur();
    await pfIdle(this.page);
    return `${id} = ${value}`;
  }

  async fillPeriodByLabel(value: string) {
    const found = await this.page.evaluate(() => {
      const vis = (e: Element) => !!((e as HTMLElement).offsetWidth || (e as HTMLElement).offsetHeight);
      const label = [...document.querySelectorAll('label, td, th, span, div')].find((e) => vis(e) && e.children.length <= 3 && /^Contract \/ Completion Period/i.test(((e as HTMLElement).innerText || '').trim()));
      if (!label) return null;
      const box = [...document.querySelectorAll('input[type="text"], input:not([type])')].find((i) => vis(i) && label.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_FOLLOWING) as HTMLInputElement | undefined;
      if (!box) return null;
      box.setAttribute('data-qt-period', '1');
      return { disabled: box.disabled, value: box.value };
    });
    if (!found) return 'period box not on page';
    const el = this.page.locator('[data-qt-period="1"]').first();
    if ((await el.inputValue()).trim()) return 'period (by label) already set';
    if (found.disabled) throw new Error('Contract / Completion Period box is disabled on this screen');
    await el.fill(value, { force: true });
    await el.blur();
    await pfIdle(this.page);
    return `period (by label) = ${value}`;
  }

  async fillGeneral() {
    await this.useFormNs();
    await openTab(this.page, 'General Information');
    let p = await this.fillIfEmpty('qtContractDuration', SPEC.periodMonths);
    if (p.endsWith('not on page')) p = await this.fillIfEmpty('contractBo', SPEC.periodMonths);
    if (p.endsWith('not on page')) p = await this.fillPeriodByLabel(SPEC.periodMonths);
    this.log(p);
    this.log(await this.fillIfEmpty('justificationProcValueId_2', SPEC.justification));
  }

  async save() {
    await clickButton(this.page, 'Save');
    await this.page.waitForTimeout(1500);
    return pageMessages(this.page);
  }

  async pickAutocomplete(inputId: string, search: string, want: string) {
    const input = this.page.locator(`[id="${inputId}"]`);
    if ((await input.inputValue()).trim() === want) return;
    await input.fill('');
    await input.pressSequentially(search, { delay: 100 });
    const found = await this.page
      .waitForFunction(
        (want) => {
          document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
          const li = [...document.querySelectorAll('.ui-autocomplete-panel li, .ui-autocomplete-items li')].find((l) => (l as HTMLElement).offsetWidth && (l as HTMLElement).innerText.trim() === want);
          if (li) li.setAttribute('data-pw-target', '1');
          return !!li;
        },
        want,
        { timeout: 15000 },
      )
      .then(() => true, () => false);
    if (!found) throw new Error(`UOM "${want}" not offered for "${search}"`);
    await this.page.locator('[data-pw-target="1"]').click();
    await pfIdle(this.page);
  }

  async setScoring(row: number, sp: SpecLine) {
    const P = this.Q.replace(/questionTbl$/, '');
    await this.page.locator(`[id="${this.Q}:${row}:scoringBtn"]`).click({ force: true });
    await pfIdle(this.page);
    const label = await this.page.evaluate(({ id, auto }) => [...((document.getElementById(`${id}_input`) || document.getElementById(id)) as HTMLSelectElement).options].map((o) => o.text.trim()).find((t) => (auto ? /auto/i.test(t) : t && !/auto|select/i.test(t))), { id: `${P}scoreType`, auto: sp.scoreType === 'Auto' });
    if (!label) throw new Error(`No ${sp.scoreType} score type offered for row ${row}`);
    await pfSelect(this.page, `${P}scoreType`, label);
    if (sp.maxScore) {
      const max = this.page.locator(`[id="${P}maxScore"]`);
      await max.fill(sp.maxScore, { force: true });
      await max.blur();
    }
    for (let k = 0; k < (sp.scores || []).length; k++) {
      const box = this.page.locator(`[id="${P}scoringTbl:${k}:score"]`);
      await box.fill(sp.scores![k], { force: true });
      await box.blur();
    }
    await pfIdle(this.page);
    await clickButton(this.page, 'OK', { inDialog: `${P}scoringSetPopup` });
    const left = await this.page.evaluate((id) => getComputedStyle(document.getElementById(id)!).display !== 'none' && document.getElementById(id)!.getAttribute('aria-hidden') !== 'true', `${P}scoringSetPopup`);
    if (left) throw new Error(`Scoring dialog did not close for row ${row}: ${(await pageMessages(this.page)).join(' | ')}`);
  }

  async fillSpecEditor() {
    await this.useFormNs();
    const t = SPEC.template;
    const titleBox = this.page.locator('xpath=//td[normalize-space()="Document Title"]/following::textarea[1]').first();
    if ((await titleBox.inputValue()).trim() !== t.title) await titleBox.fill(t.title);
    const rowsNow = () =>
      this.page.evaluate((q) => [...document.querySelectorAll(`[id^="${q}:"][id$=":itemName"], [id^="${q}:"][id$=":specification"]`)].map((e) => ({ r: Number(e.id.slice(q.length + 1).split(':')[0]), item: e.id.endsWith(':itemName'), v: (e as HTMLInputElement).value.trim() })).sort((x, y) => x.r - y.r), this.Q);
    for (const it of t.items) {
      let items = (await rowsNow()).filter((x) => x.item);
      let row = items.find((x) => x.v === it.name) || items.find((x) => !x.v);
      if (!row) {
        await this.page.locator(`[id="${this.Q}:addTopBtn"]`).click();
        await pfIdle(this.page);
        items = (await rowsNow()).filter((x) => x.item);
        row = items.find((x) => !x.v);
        if (!row) throw new Error(`No new item row: ${(await pageMessages(this.page)).join(' | ')}`);
      }
      const R = `${this.Q}:${row.r}:`;
      const name = this.page.locator(`[id="${R}itemName"]`);
      if ((await name.inputValue()).trim() !== it.name) await name.fill(it.name);
      await this.pickAutocomplete(`${R}uom_input`, it.uomSearch, it.uom);
      await pfSelect(this.page, `${R}priceType`, it.priceType);
      const qty = this.page.locator(`[id="${R}qty"]`);
      if ((await qty.inputValue()).trim() !== it.qty) {
        await qty.fill(it.qty);
        await qty.blur();
        await pfIdle(this.page);
      }
      const theRow = row;
      const specsOf = async () => {
        const all = await rowsNow();
        const k = all.findIndex((x) => x.r === theRow.r);
        const out: typeof all = [];
        for (const x of all.slice(k + 1)) {
          if (x.item) break;
          out.push(x);
        }
        return out;
      };
      const have = (await specsOf()).map((x) => x.v);
      for (const sp of it.specs.filter((x) => !have.includes(x.text)).reverse()) {
        const blank = (await specsOf()).find((x) => !x.v);
        let r: number;
        if (blank) r = blank.r;
        else {
          await this.page.locator(`[id="${this.Q}:${theRow.r}:addBtn"]`).click();
          await this.page.locator(`[id^="${this.Q}:${theRow.r}:"]`, { hasText: /^\s*Specification\s*$/ }).first().click();
          await pfIdle(this.page);
          r = theRow.r + 1;
        }
        await this.page.locator(`[id="${this.Q}:${r}:specification"]`).fill(sp.text);
        await pfSelect(this.page, `${this.Q}:${r}:answerTypeId`, sp.answer);
        await this.setScoring(r, sp);
      }
      for (const x of await specsOf()) {
        const sp = it.specs.find((y) => y.text === x.v);
        if (!sp || !have.includes(sp.text)) continue;
        await pfSelect(this.page, `${this.Q}:${x.r}:answerTypeId`, sp.answer);
        await this.setScoring(x.r, sp);
      }
    }
    await clickButton(this.page, 'Save');
    await this.page.waitForTimeout(1000);
    return pageMessages(this.page);
  }

  async completeEditor(what: string) {
    await this.useFormNs();
    const msgs = await pressAndConfirm(this.page, 'Complete', this.log);
    if (msgs.some((m) => /ERR-|required|mandatory/i.test(m))) throw new Error(`${what} Complete rejected: ${msgs.join(' | ')}`);
    return msgs;
  }

  async templateRow(title: string) {
    return this.page.evaluate((title) => {
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Mechanism/.test(x.tHead?.innerText || ''));
      const r = t && [...t.tBodies[0].rows].find((x) => (x.cells[1] as HTMLElement | undefined)?.innerText.trim() === title);
      return r ? (r as HTMLElement).innerText : null;
    }, title);
  }

  async clickRowPencil(title: string) {
    await this.page.evaluate((title) => {
      document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
      const tb = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && /Mechanism/.test(x.tHead?.innerText || ''))!;
      const r = [...tb.tBodies[0].rows].find((x) => (x.cells[1] as HTMLElement | undefined)?.innerText.trim() === title)!;
      ([...r.cells].at(-1)!.querySelector('a, button') as HTMLElement).setAttribute('data-pw-target', '1');
    }, title);
    await this.page.locator('[data-pw-target="1"]').click({ force: true });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(this.page);
  }

  async ensureTemplate() {
    const t = SPEC.template;
    await openTab(this.page, 'Technical Checklist');
    const row = await this.templateRow(t.title);
    if (row && /Completed/.test(row)) return 'template already completed';
    if (row) await this.clickRowPencil(t.title);
    else {
      await clickButton(this.page, 'Create Specification');
      const D = await this.page.evaluate(() => [...document.querySelectorAll('.ui-dialog')].find((d) => /Clone Specification From/.test((d as HTMLElement).innerText) && d.getAttribute('aria-hidden') !== 'true')!.id);
      await clickButton(this.page, 'Search', { inDialog: D });
      await this.page.evaluate((d) => {
        document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
        const tb = [...document.getElementById(d)!.querySelectorAll('table')].find((x) => /Template Title/.test(x.tHead?.innerText || ''))!;
        const r = [...tb.tBodies[0].rows].find((x) => /^Blank Template/.test((x.cells[0] as HTMLElement).innerText.trim()) && /Technical/.test((x as HTMLElement).innerText) && /Product/.test((x as HTMLElement).innerText))!;
        (r.querySelector('button, a') as HTMLElement).setAttribute('data-pw-target', '1');
      }, D);
      await this.page.locator('[data-pw-target="1"]').click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await pfIdle(this.page);
    }
    this.log(`template save: ${(await this.fillSpecEditor()).join(' | ')}`);
    await this.completeEditor('Template');
    return 'template completed';
  }

  async ensurePrice() {
    const title = SPEC.template.title;
    await openTab(this.page, 'Financial Checklist');
    const row = await this.templateRow(title);
    if (!row) throw new Error(`Template "${title}" missing from Financial Checklist`);
    if (/Completed/.test(row)) return 'price already completed';
    await this.clickRowPencil(title);
    await this.useFormNs();
    for (let i = 0; i < SPEC.unitPrices.length; i++) {
      const R = `${this.F}questionTbl:${i}:`;
      const up = this.page.locator(`[id="${R}unitPriceServiceSchedule"]`);
      if ((await up.inputValue()).replace(/[,.0]/g, '') !== SPEC.unitPrices[i].replace(/[,.0]/g, '')) {
        await up.fill(SPEC.unitPrices[i]);
        await up.blur();
        await pfIdle(this.page);
      }
      const dlgOpen = () => this.page.evaluate((id) => getComputedStyle(document.getElementById(id)!).display !== 'none' && document.getElementById(id)!.getAttribute('aria-hidden') !== 'true', `${this.F}scoringSetPopup`);
      if (!(await dlgOpen())) {
        await this.page.locator(`[id="${R}scoringBtn"]`).click();
        await pfIdle(this.page);
      }
      await pfSelect(this.page, `${this.F}scoreType`, 'Auto');
      const v = SPEC.variance;
      for (const [field, val] of [['fromVariance', v.from], ['toVariance', v.to], ['belowScore', v.below], ['score', v.within], ['aboveScore', v.above]]) {
        const box = this.page.locator(`[id="${this.F}scoringTbl:0:${field}"]`);
        await box.fill(val, { force: true });
        await box.blur();
      }
      await pfIdle(this.page);
      await clickButton(this.page, 'OK', { inDialog: `${this.F}scoringSetPopup` });
      if (await dlgOpen()) throw new Error(`Price scoring dialog did not close: ${(await pageMessages(this.page)).join(' | ')}`);
    }
    await clickButton(this.page, 'Save');
    await this.page.waitForTimeout(800);
    await this.completeEditor('Price');
    return 'price completed';
  }

  async scoreOnlyTemplate(tab: string) {
    await openTab(this.page, tab);
    const rows = await this.page.evaluate(() => {
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Mechanism/.test(x.tHead?.innerText || '') && /Scoring/.test(x.tHead?.innerText || ''));
      if (!t) return [];
      const col = [...t.tHead!.rows[0].cells].findIndex((c) => (c as HTMLElement).innerText.trim() === 'Scoring');
      return [...t.tBodies[0].rows].map((r) => {
        const box = r.cells[col]?.querySelector('.ui-chkbox');
        const input = box?.querySelector('input[type=checkbox]') as HTMLInputElement | null;
        return { title: (r.cells[1] as HTMLElement).innerText.trim(), id: box?.id || null, checked: !!input?.checked, disabled: !!(input?.disabled || box?.querySelector('.ui-state-disabled')) };
      });
    });
    const changed: string[] = [];
    for (const r of rows) {
      if (!r.id || r.title === SPEC.template.title || !r.checked) continue;
      if (r.disabled) {
        changed.push(`${r.title}: mandatory, left ticked`);
        continue;
      }
      await this.page.locator(`[id="${r.id}"] .ui-chkbox-box`).click({ force: true });
      await pfIdle(this.page);
      changed.push(`${r.title}: unticked`);
    }
    return changed;
  }

  async setBox(xpath: string, value: string) {
    const box = this.page.locator(`xpath=${xpath}`).first();
    if (!(await box.count())) throw new Error(`No field at ${xpath}`);
    if ((await box.inputValue()).replace(/,/g, '').trim() === value) return;
    await box.fill(value);
    await box.blur();
    await pfIdle(this.page);
  }

  async byItem(n: number, heading = 'BY ITEM') {
    const ok = await this.page.evaluate(({ n, heading }) => {
      document.querySelectorAll('[data-pw-byitem]').forEach((e) => e.removeAttribute('data-pw-byitem'));
      const head = [...document.querySelectorAll('*')].find((e) => (e as HTMLElement).offsetWidth && e.childElementCount === 0 && (e.textContent ?? '').trim().toUpperCase() === heading);
      if (!head) return false;
      const after = [...document.querySelectorAll('input[type=text]')].filter((i) => (i as HTMLElement).offsetWidth && !(i as HTMLInputElement).readOnly && !(i as HTMLInputElement).disabled && !i.id.endsWith('_focus') && head.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_FOLLOWING);
      if (!after[n]) return false;
      after[n].setAttribute('data-pw-byitem', '1');
      return true;
    }, { n, heading });
    if (!ok) throw new Error(`No ${heading} input #${n}`);
    return '//input[@data-pw-byitem="1"]';
  }

  async byLabel(label: string) {
    const ok = await this.page.evaluate((label) => {
      document.querySelectorAll('[data-pw-label]').forEach((e) => e.removeAttribute('data-pw-label'));
      const lab = [...document.querySelectorAll('label, span, td')].find((e) => (e as HTMLElement).offsetWidth && e.childElementCount === 0 && (e.textContent ?? '').replace(/\s+/g, ' ').includes(label));
      const input = lab?.closest('tr')?.querySelector('input[type=text]:not([readonly]):not([disabled])');
      if (input) input.setAttribute('data-pw-label', '1');
      return !!input;
    }, label);
    if (!ok) throw new Error(`No editable field labelled "${label}"`);
    return '//input[@data-pw-label="1"]';
  }

  async fillScoring() {
    const o = SPEC.scoring;
    await this.useFormNs();
    await openTab(this.page, 'Technical Scoring');
    const pkg = this.page.locator('input[id$=":techScoreWeight"]:visible');
    for (let i = 0; i < (await pkg.count()); i++) {
      if (['', '0'].includes((await pkg.nth(i).inputValue()).trim())) await this.setBox(`(//input[contains(@id, ":techScoreWeight")])[${i + 1}]`, '1');
    }
    if (await pkg.count()) await this.setBox(await this.byLabel('Passing Score Benchmark'), o.technical.packagePassing);
    await this.setBox(await this.byItem(0), o.technical.item);
    await this.setBox(await this.byItem(1), o.technical.other);
    await openTab(this.page, 'Financial Scoring');
    await this.setBox('//input[contains(@id, ":financialweightage:0:")]', o.financial.weight);
    if (await this.page.locator('select[id$="finScoringNoOfAutoscore_input"]').count()) {
      await pfSelect(this.page, `${this.NS}finScoringNoOfAutoscore`, o.financial.packageType);
      const v = o.financial.packageVariance;
      for (const [k, val] of [v.from, v.to, v.below, v.above, o.financial.packagePassing].entries()) await this.setBox(await this.byItem(k, 'BY PACKAGE'), val);
    }
    await this.setBox(await this.byItem(0), o.financial.item);
    await this.setBox(await this.byItem(1), o.financial.other);
    await this.setBox('//input[contains(@id, "numberFromFinancialItemScore")]', o.financial.passing);
    await openTab(this.page, 'Overall Scoring');
    await this.setBox(await this.byLabel('Overall Passing Score'), o.overallPassing);
  }

  async addDelivery() {
    await openTab(this.page, 'Delivery / Service Address');
    const has = await this.page.evaluate(() => {
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Delivery \/ Service Address/.test(x.tHead?.innerText || ''));
      return !!t && t.tBodies[0].rows.length > 0 && !/No records found/.test((t.tBodies[0] as HTMLElement).innerText);
    });
    if (has) return 'address already added';
    await clickButton(this.page, 'Add');
    const dlg = await this.page.evaluate(() => document.querySelector('[id$=":deliveryServiceAddressokbtnId"]')!.closest('.ui-dialog')!.id);
    await this.page.locator(`[id="${dlg}"] tbody .ui-chkbox .ui-chkbox-box`).first().click({ force: true });
    await pfIdle(this.page);
    await clickButton(this.page, 'OK', { inDialog: dlg });
    return 'first PTJ address added';
  }

  async uploadInOpenDialog() {
    const input = this.page.locator('.ui-dialog:not([aria-hidden="true"]) input[type=file]').first();
    await input.waitFor({ state: 'attached', timeout: 15000 });
    await input.setInputFiles(SPEC.schemaPdf);
    await this.page.locator('.ui-dialog:not([aria-hidden="true"]) table.files td.start button').first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(this.page);
    await this.page.waitForTimeout(2000);
    const dlg = await this.page.evaluate(() => [...document.querySelectorAll('.ui-dialog')].find((d) => (d as HTMLElement).offsetWidth && d.getAttribute('aria-hidden') !== 'true' && d.querySelector('input[type=file]'))?.id);
    if (dlg) await clickButton(this.page, 'Close', { inDialog: dlg }).catch(() => {});
  }

  async uploadUserScoringSchema(tab: string) {
    await openTab(this.page, tab);
    const btn = await this.page.evaluate(() => {
      document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
      const lab = [...document.querySelectorAll('label, span, td')].find((e) => (e as HTMLElement).offsetWidth && e.childElementCount === 0 && (e.textContent ?? '').trim() === 'Supporting Document');
      const row = lab?.closest('tr');
      if (!row) return null;
      if (/\.pdf|\.doc/i.test((row as HTMLElement).innerText)) return 'present';
      const el = row.querySelector('a, button');
      if (el) el.setAttribute('data-pw-target', '1');
      return el ? 'clicked' : null;
    });
    if (btn === 'present') return 'schema already attached';
    if (!btn) throw new Error(`No Supporting Document upload on ${tab}`);
    await this.page.locator('[data-pw-target="1"]').click({ force: true });
    await pfIdle(this.page);
    await this.uploadInOpenDialog();
    return 'schema uploaded';
  }

  async uploadPtjDocuments(tab: string) {
    await openTab(this.page, tab);
    const done: string[] = [];
    for (let guard = 0; guard < 20; guard++) {
      const title = await this.page.evaluate(() => {
        document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
        const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Mechanism/.test(x.tHead?.innerText || ''));
        if (!t) return null;
        const heads = [...t.tHead!.rows[0].cells].map((c) => (c as HTMLElement).innerText.trim());
        const mech = heads.indexOf('Mechanism');
        const doc = heads.indexOf('Document');
        const r = [...t.tBodies[0].rows].find((x) => {
          const m = (x.cells[mech]?.querySelector('select') as HTMLSelectElement | null)?.selectedOptions[0]?.text || (x.cells[mech] as HTMLElement | undefined)?.innerText || '';
          return /PTJ Upload/i.test(m) && /Pending/i.test((x as HTMLElement).innerText) && x.cells[doc]?.querySelector('button, a');
        });
        if (!r) return null;
        (r.cells[doc].querySelector('button, a') as HTMLElement).setAttribute('data-pw-target', '1');
        return (r.cells[1] as HTMLElement).innerText.trim();
      });
      if (!title) break;
      await this.page.locator('[data-pw-target="1"]').click({ force: true });
      await pfIdle(this.page);
      await this.uploadInOpenDialog();
      done.push(title);
      if (done.filter((d) => d === title).length > 1) throw new Error(`Upload for "${title}" did not stick`);
    }
    return done;
  }

  async openChecklistRow(titlePart: string, tab = 'Financial Checklist') {
    await openTab(this.page, tab);
    const ok = await settledEval(this.page, (titlePart: string) => {
      document.querySelectorAll('[data-pw-target]').forEach((e) => e.removeAttribute('data-pw-target'));
      const t = [...document.querySelectorAll('table')].find((x) => (x as HTMLElement).offsetWidth && !x.closest('.ui-dialog') && /Mechanism/.test(x.tHead?.innerText || ''));
      const r = t && [...t.tBodies[0].rows].find((x) => (x.cells[1] as HTMLElement | undefined)?.innerText.includes(titlePart));
      const a = r && [...r.cells].at(-1)!.querySelector('a, button');
      if (a) a.setAttribute('data-pw-target', '1');
      return !!a;
    }, titlePart);
    if (!ok) return false;
    await this.page.locator('[data-pw-target="1"]').click({ force: true });
    await this.page.getByRole('button', { name: '<< Back' }).waitFor();
    await pfIdle(this.page);
    return true;
  }

  async saveAndBack() {
    await clickButton(this.page, 'Save');
    await this.page.waitForTimeout(800);
    const msgs = await pageMessages(this.page);
    await clickButton(this.page, '<< Back');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await pfIdle(this.page);
    return msgs;
  }

  async completeForms() {
    const out: string[] = [];
    // SIT Security QTs: "Bilangan Kakitangan" web form is Not Completed (ERR-760266) until saved once
    if (await this.openChecklistRow('Bilangan Kakitangan', 'Technical Checklist')) out.push(`Bilangan Kakitangan: ${(await this.saveAndBack()).join(' ')}`);
    if (await this.openChecklistRow('Penyata bank')) {
      const mon = await settledEval(this.page, () => {
        const s = [...document.querySelectorAll('select')].find((x) => [...x.options].some((op) => op.text.trim() === 'January'));
        return s ? { id: s.id.replace(/_input$/, ''), val: s.selectedOptions[0]?.text.trim() ?? '' } : null;
      }, undefined);
      if (mon && !/^[A-Z][a-z]+$/.test(mon.val)) await pfSelect(this.page, mon.id, SPEC.finForms.bankStatementFrom);
      out.push(`bank statement: ${(await this.saveAndBack()).join(' ')}`);
    }
    for (const part of ['Pengalaman Syarikat Dengan Kerajaan', 'Pengalaman Syarikat Dengan Bukan']) {
      if (!(await this.openChecklistRow(part))) continue;
      const year = this.page.locator('xpath=//*[contains(normalize-space(), "Company Experience Since Year")]/following::input[@type="text"][1]').first();
      if (!(await year.inputValue()).trim()) {
        await year.fill(SPEC.finForms.experienceSinceYear);
        await year.blur();
        await pfIdle(this.page);
      }
      out.push(`${part}: ${(await this.saveAndBack()).join(' ')}`);
    }
    return out;
  }
}

export async function prepareSpec(ctx: StageCtx, qt: string): Promise<{ messages: string[] }> {
  const { page, log } = ctx;
  const s = new Spec(page, log);
  await openTask(page, ctx.baseURL, qt, log);
  await s.fillGeneral();
  log(`save: ${(await s.save()).join(' | ')}`);
  log(`template: ${await s.ensureTemplate()}`);
  log(`price: ${await s.ensurePrice()}`);
  for (const tab of ['Technical Checklist', 'Financial Checklist']) log(`${tab}: ${(await s.scoreOnlyTemplate(tab)).join('; ') || 'nothing to untick'}`);
  await s.fillScoring();
  log(`delivery: ${await s.addDelivery()}`);
  for (const tab of ['Technical Checklist', 'Financial Checklist']) log(`${tab} uploads: ${(await s.uploadPtjDocuments(tab)).join('; ') || 'none pending'}`);
  log(`forms: ${(await s.completeForms()).join('; ') || 'none'}`);
  for (const tab of ['Technical Scoring', 'Financial Scoring']) log(`${tab} schema: ${await s.uploadUserScoringSchema(tab)}`);
  log(`save: ${(await s.save()).join(' | ')}`);
  // Submit reads wipStatusMax, which only the Technical Scoring tab reliably sets
  await openTab(page, 'Technical Scoring');
  const msgs = await pressAndConfirm(page, 'Submit', log);
  if (!msgs.some((m) => /success|submitted/i.test(m))) throw new Error(`Spec submit not confirmed: ${msgs.join(' | ') || 'no message'}`);
  return { messages: msgs };
}
