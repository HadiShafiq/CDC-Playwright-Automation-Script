/**
 * ePerolehan document numbers seen on SIT (examples from knowledge/ and data-overrides.json):
 * SQ260000000002309, RN260000000004702, LA260000000004130, PO260000000007002, DO 01309H005M2600503.
 */
export const DOC_TYPES = ['SQ', 'PI', 'RN', 'PR', 'PO', 'LA', 'CT', 'CR', 'CO', 'DO', 'FN', 'SD', 'IN', 'DN', 'PA'] as const;
export type DocType = (typeof DOC_TYPES)[number];

const DOC_NAMES: Record<DocType, string> = {
  SQ: 'Simple Quote', PI: 'Item Inquiry (Compare)', RN: 'Request Note', PR: 'Purchase Request', PO: 'Purchase Order',
  LA: 'Letter of Acceptance', CT: 'Contract', CR: 'Contract Request', CO: 'Contract Order', DO: 'Delivery Order',
  FN: 'Fulfilment Received Note', SD: 'Stop Delivery', IN: 'Invoice', DN: 'Debit Note', PA: 'Payment',
};
export const docName = (t: DocType) => DOC_NAMES[t];

/** Pattern of one document type. DO numbers have their own shape (e.g. 01309H005M2600503). */
export function docPattern(t: DocType): RegExp {
  return t === 'DO' ? /\b\d{5}[A-Z]\d{3}[A-Z]\d{7}\b/g : new RegExp(`\\b${t}\\d{12,15}\\b`, 'g');
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
