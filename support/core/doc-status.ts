import { docPattern, type DocType } from './documents';
import { sitQuery } from './sit-db';

/**
 * Real document status from the SIT database: the workflow status rows of a document with their English and
 * Bahasa Melayu names (PM_STATUS_DESC, language_code 'en' / 'ms').
 *
 * Mapping verified on SIT 2026-11-23 with our own documents (QA):
 *   SC_WORKFLOW_STATUS  SQ sc_quote · RN sc_request_note · PI sc_purchase_inquiry · LA sc_loa   (LA260000000004216)
 *   CT_WORKFLOW_STATUS  FD = ct_contract_ver of the contract · AC = ct_agreement of the contract  (CT260000000002293)
 *   FL_WORKFLOW_STATUS  CR/PR fl_fulfilment_request · CO/PO fl_fulfilment_order · DO fl_delivery_order ·
 *                       FN fl_fulfilment_note · IN fl_invoice · PA fl_payment_advice · SD fl_stop_instr ·
 *                       DN fl_adjustment                                                        (CR260000000006053)
 * Only CR, FD, AC, LA are proven by a matching history; the other FL tables follow the same pattern (see `verified`).
 */
export interface DocStatus {
  docType: string; // workflow doc type (e.g. LA, FD, AC, CR)
  statusId: number;
  en: string;
  bm: string;
  at: string; // when this status row was written (DB time = Malaysia time)
  current: boolean;
}

type Source = { wf: 'SC' | 'CT' | 'FL'; ids: (no: string) => string; wfType: string; verified: boolean };

const SC = (table: string, noCol: string, idCol: string, t: string, verified = false): Source => ({
  wf: 'SC', wfType: t, verified, ids: (no) => `select ${idCol} from ngep_sit.${table} where ${noCol} = '${no}'`,
});
const FL = (table: string, noCol: string, idCol: string, t: string, verified = false): Source => ({
  wf: 'FL', wfType: t, verified, ids: (no) => `select ${idCol} from ngep_sit.${table} where ${noCol} = '${no}'`,
});

const SOURCES: Partial<Record<DocType | 'CT:FD' | 'CT:AC', Source>> = {
  SQ: SC('sc_quote', 'quote_no', 'quote_id', 'SQ'),
  RN: SC('sc_request_note', 'request_note_no', 'request_note_id', 'RN'),
  PI: SC('sc_purchase_inquiry', 'purchase_inquiry_no', 'purchase_inquiry_id', 'PI'),
  LA: SC('sc_loa', 'loa_no', 'loa_id', 'LA', true),
  'CT:FD': { wf: 'CT', wfType: 'FD', verified: true, ids: (no) => `select v.contract_ver_id from ngep_sit.ct_contract_ver v join ngep_sit.ct_contract c on c.contract_id = v.contract_id where c.contract_no = '${no}'` },
  'CT:AC': { wf: 'CT', wfType: 'AC', verified: true, ids: (no) => `select a.agreement_id from ngep_sit.ct_agreement a join ngep_sit.ct_contract c on c.contract_id = a.contract_id where c.contract_no = '${no}'` },
  CR: FL('fl_fulfilment_request', 'doc_no', 'fulfilment_req_id', 'CR', true),
  PR: FL('fl_fulfilment_request', 'doc_no', 'fulfilment_req_id', 'PR'),
  CO: FL('fl_fulfilment_order', 'doc_no', 'fulfilment_order_id', 'CO'),
  PO: FL('fl_fulfilment_order', 'doc_no', 'fulfilment_order_id', 'PO'),
  DO: FL('fl_delivery_order', 'delivery_order_no', 'delivery_order_id', 'DO'),
  FN: FL('fl_fulfilment_note', 'fulfilment_note_no', 'fulfilment_note_id', 'FN'),
  IN: FL('fl_invoice', 'invoice_no', 'invoice_id', 'IN'),
  PA: FL('fl_payment_advice', 'payment_advice_no', 'payment_advice_id', 'PA'),
  SD: FL('fl_stop_instr', 'stop_instr_no', 'stop_instr_id', 'SD'),
  DN: FL('fl_adjustment', 'doc_no', 'adjustment_id', 'DN'),
};

/** Workflow kinds that exist for a document type (a contract has FD and AC). */
export function statusKinds(doc: DocType): string[] {
  return doc === 'CT' ? ['CT:FD', 'CT:AC'] : SOURCES[doc] ? [doc] : [];
}

function checkNo(doc: DocType, no: string) {
  const re = docPattern(doc);
  re.lastIndex = 0;
  const m = re.exec(no);
  if (!m || m[0] !== no) throw new Error(`doc-status: "${no}" is not a ${doc} number`); // also keeps the SQL injection-free
}

/** Full status history of a document (oldest first). kind: 'LA', 'CR', … or 'CT:FD' / 'CT:AC'. */
export function statusHistory(kind: string, no: string): DocStatus[] {
  const src = SOURCES[kind as keyof typeof SOURCES];
  if (!src) return [];
  checkNo(kind.startsWith('CT:') ? 'CT' : (kind as DocType), no);
  const rows = sitQuery(`select w.doc_type, w.status_id, w.is_current, to_char(w.created_date, 'YYYY-MM-DD HH24:MI:SS'),
      (select e.status_name from ngep_sit.pm_status_desc e where e.status_id = w.status_id and e.language_code = 'en' and rownum = 1),
      (select m.status_name from ngep_sit.pm_status_desc m where m.status_id = w.status_id and m.language_code = 'ms' and rownum = 1)
    from ngep_sit.${src.wf.toLowerCase()}_workflow_status w
    where w.doc_type = '${src.wfType}' and w.doc_id in (${src.ids(no)})
    order by w.created_date, w.workflow_status_id`);
  return rows.map(([docType, id, cur, at, en, bm]) => ({ docType, statusId: Number(id), current: cur === '1', at, en: en ?? '', bm: bm ?? '' }));
}

/** Current status (the is_current row), or undefined when the document has no workflow row yet. */
export function currentStatus(kind: string, no: string): DocStatus | undefined {
  const h = statusHistory(kind, no);
  return h.filter((s) => s.current).at(-1) ?? h.at(-1);
}

/** The status the document had at a moment (Malaysia time 'YYYY-MM-DD HH24:MI:SS'): the last row written before it. */
export function statusAt(kind: string, no: string, at: string): DocStatus | undefined {
  return statusHistory(kind, no).filter((s) => s.at <= at).at(-1);
}

/** Contract/Purchase Orders created from a request (CR → CO, PR → PO): replaces the manual CO/PO lookup gate. */
export function ordersOfRequest(requestNo: string): { docType: string; docNo: string; at: string }[] {
  if (!/^(CR|PR)\d{12,15}$/.test(requestNo)) throw new Error(`doc-status: "${requestNo}" is not a CR/PR number`);
  return sitQuery(`select o.doc_type, o.doc_no, to_char(o.created_date, 'YYYY-MM-DD HH24:MI:SS') from ngep_sit.fl_fulfilment_order o
    join ngep_sit.fl_fulfilment_request r on r.fulfilment_req_id = o.fulfilment_req_id where r.doc_no = '${requestNo}' order by o.created_date`)
    .map(([docType, docNo, at]) => ({ docType, docNo, at }));
}

export function sourceVerified(kind: string): boolean {
  return !!SOURCES[kind as keyof typeof SOURCES]?.verified;
}
