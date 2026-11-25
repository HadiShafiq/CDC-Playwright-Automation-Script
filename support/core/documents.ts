/**
 * ePerolehan document numbers seen on SIT (examples from knowledge/ and data-overrides.json):
 * QT260000000004342, SQ260000000002309, RN260000000004702, LA260000000004130, PO260000000007002, DO 01309H005M2600503.
 */
export const DOC_TYPES = ['AA', 'AP', 'PD', 'PL', 'TC', 'CX', 'RC', 'QT', 'SQ', 'PI', 'RN', 'PR', 'PO', 'LA', 'CT', 'CR', 'CO', 'DO', 'FN', 'SD', 'IN', 'DN', 'CN', 'PA'] as const;
export type DocType = (typeof DOC_TYPES)[number];

const DOC_NAMES: Record<DocType, string> = {
  AA: 'Access application (PM)', PD: 'PID (price indication document)', PL: 'Procurement plan', TC: 'Treasury circular (PP)', CX: 'Treasury circular cancellation request', RC: 'Code request (item / extension code)', AP: 'Supplier application (SM)', CN: 'Credit Note', QT: 'Quotation / Tender', SQ: 'Simple Quote', PI: 'Item Inquiry (Compare)', RN: 'Request Note', PR: 'Purchase Request', PO: 'Purchase Order',
  LA: 'Letter of Acceptance', CT: 'Contract', CR: 'Contract Request', CO: 'Contract Order', DO: 'Delivery Order',
  FN: 'Fulfilment Received Note', SD: 'Stop Delivery', IN: 'Invoice', DN: 'Debit Note', PA: 'Payment',
};
export const docName = (t: DocType) => DOC_NAMES[t];

/** Pattern of one document type. DO numbers have their own shape (e.g. 01309H005M2600503). */
export function docPattern(t: DocType): RegExp {
  // DO numbers have their own shape: 01309H005M2600503, or all digits for some PTJs (60000730212600001, SIT 2026-11-25)
  if (t === 'DO') return /\b(?:\d{5}[A-Z]\d{3}[A-Z]\d{7}|\d{17})\b/g;
  // SM application numbers: KN-06112026-0050 (K contractor / J consultant; N new, A add category, U update, R renewal,
  // C cancel, B bumiputera) — SIT SM_APPL.APPL_NO
  if (t === 'AP') return /\b[A-Z]{2}-\d{8}-\d{4}\b/g;
  // PM access application numbers: AP + yymmdd + 9 digits (AP200204000000835) — SIT PM_ACCESS_APPL.APPL_NO
  if (t === 'AA') return /\bAP\d{15}\b/g;
  // Procurement plan: PP260000000000245 / PE260000000000009 (SIT PP_PLAN.PLAN_NO)
  if (t === 'PL') return /\bP[PE]\d{15}\b/g;
  // Treasury circular (PP): CQ260000000000669, PM… (SIT CT_CIRCULAR.CIRCULAR_NO)
  if (t === 'TC') return /\b(?:CQ|PQ|PM)\d{13,15}\b/g;
  // Code request: RNC120118-1159 (item code, CU) / RNE… (extension code, CE) (SIT CM_REQUEST_CODE.DOC_NO)
  if (t === 'RC') return /\bRN[CE]\d{6}-\d{4}\b/g;
  // Credit notes: CN26… or the iGFMAS form C0251152801170008 (SIT FL_ADJUSTMENT.DOC_NO)
  if (t === 'CN') return /\b(?:CN\d{12,15}|C\d{16})\b/g;
  return new RegExp(`\\b${t}\\d{12,15}\\b`, 'g');
}

export function isDocType(v: string): v is DocType {
  return (DOC_TYPES as readonly string[]).includes(v);
}

/** All document numbers of type `t` in `text`, in order of appearance. */
export function findDocs(text: string, t: DocType): string[] {
  return [...text.matchAll(docPattern(t))].map((m) => m[0]);
}

/** Basic shape check for a number a person typed (gate values, --input). */
export function looksLike(t: DocType, value: string): boolean {
  const re = docPattern(t);
  re.lastIndex = 0;
  const m = re.exec(value);
  return !!m && m[0] === value;
}
