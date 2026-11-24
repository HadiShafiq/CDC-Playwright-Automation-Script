import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './context';
import { docPattern, isDocType, type DocType } from './documents';
import { sitQuery } from './sit-db';

/**
 * Real document status from the SIT database: the workflow status rows of a document with their English and
 * Bahasa Melayu names (PM_STATUS_DESC, language_code 'en' / 'ms'). Where each document lives: registry/db-schema.json.
 *
 * A status "kind" is a document type plus its workflow doc type:
 *   'LA'      → sc_workflow_status rows of type LA of an LA number
 *   'CT:FD'   → the contract's Fulfilment Details,  'CT:AC' → its Agreement
 *   'QT'      → the QT's own rows; 'QT:OC', 'QT:TEC', 'QT:FEC', 'QT:CMT', 'QT:BPK' → its committee/approval rows
 *   'QT:*'    → every row of the document (the whole path, all workflow types)
 */
export interface DocStatus {
  docType: string; // workflow doc type (e.g. LA, FD, AC, CR, OC)
  statusId: number;
  en: string;
  bm: string;
  at: string; // when this status row was written (DB time = Malaysia time), 'YYYY-MM-DD HH24:MI:SS'
  current: boolean;
}

export interface DbDocument {
  name: string;
  table: string;
  no: string;
  id: string;
  workflow: string;
  wfTypes: string[];
  subIds?: Record<string, string>;
  /** Readable name per workflow type (e.g. CT: FA = Amendment with Supplemental). */
  wfNames?: Record<string, string>;
  verified: boolean;
  evidence: string;
}

export interface DbSchema {
  statusNames: string;
  bpmTasks: string;
  documents: Record<string, DbDocument>;
  /** Workflow types shown in the status catalogue only: { workflow table: [types] }. */
  catalogOnly?: Record<string, string[] | string>;
}

let schema: DbSchema | undefined;
export function dbSchema(): DbSchema {
  return (schema ??= JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'db-schema.json'), 'utf8')) as DbSchema);
}

/** Splits 'CT:FD' → { doc: 'CT', wfType: 'FD' }; 'LA' → { doc: 'LA', wfType: 'LA' }; 'QT:*' → wfType '*'. */
export function parseKind(kind: string): { doc: DocType; wfType: string; src: DbDocument } {
  const [doc, wf] = kind.split(':');
  const src = dbSchema().documents[doc];
  if (!isDocType(doc) || !src) throw new Error(`doc-status: no database mapping for "${kind}" (registry/db-schema.json)`);
  const wfType = wf ?? src.wfTypes[0];
  if (wfType !== '*' && !src.wfTypes.includes(wfType)) throw new Error(`doc-status: ${doc} has no workflow type ${wfType} (known: ${src.wfTypes.join(', ')})`);
  return { doc, wfType, src };
}

/** Workflow kinds that exist for a document type (a contract has CT:FD and CT:AC; a QT has QT, QT:CMT, QT:OC …). */
export function statusKinds(doc: DocType): string[] {
  const src = dbSchema().documents[doc];
  if (!src) return [];
  return src.wfTypes.map((t, i) => (i === 0 && t === doc ? doc : `${doc}:${t}`));
}

function checkNo(doc: DocType, no: string) {
  const re = docPattern(doc);
  re.lastIndex = 0;
  const m = re.exec(no);
  if (!m || m[0] !== no) throw new Error(`doc-status: "${no}" is not a ${doc} number`); // also keeps the SQL injection-free
}

/** SQL (one SELECT) for a document's status history; also written to sql/status/ for DBeaver with '{NO}' as placeholder. */
export function historySql(kind: string, no = '{NO}'): string {
  const { wfType, src } = parseKind(kind);
  const ids = src.subIds?.[wfType] ?? `select ${src.id} from ngep_sit.${src.table} where ${src.no} = '${no}'`;
  const typeFilter = wfType === '*' ? `w.doc_type in (${src.wfTypes.map((t) => `'${t}'`).join(', ')})` : `w.doc_type = '${wfType}'`;
  return `select w.doc_type, w.status_id, w.is_current, to_char(w.created_date, 'YYYY-MM-DD HH24:MI:SS') as changed_at,
    (select e.status_name from ngep_sit.pm_status_desc e where e.status_id = w.status_id and e.language_code = 'en' and rownum = 1) as status_en,
    (select m.status_name from ngep_sit.pm_status_desc m where m.status_id = w.status_id and m.language_code = 'ms' and rownum = 1) as status_bm
  from ngep_sit.${src.workflow} w
  where ${typeFilter} and w.doc_id in (${ids.split("'{NO}'").join(`'${no}'`)})
  order by w.created_date, w.workflow_status_id`;
}

/** Full status history of a document (oldest first). */
export function statusHistory(kind: string, no: string): DocStatus[] {
  const { doc } = parseKind(kind);
  checkNo(doc, no);
  return sitQuery(historySql(kind, no)).map(([docType, id, cur, at, en, bm]) => ({ docType, statusId: Number(id), current: cur === '1', at, en: en ?? '', bm: bm ?? '' }));
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
  return parseKind(kind).src.verified;
}

/** Every status a workflow doc type has used on SIT in the last `days` days, with EN/BM names and how often. */
export function statusesInUse(workflow: string, wfType: string, days = 365): { statusId: number; en: string; bm: string; rows: number }[] {
  if (!/^[a-z_]+$/.test(workflow) || !/^[A-Z]{2,4}$/.test(wfType)) throw new Error('doc-status: bad workflow/type');
  return sitQuery(`select w.status_id, count(*),
      (select e.status_name from ngep_sit.pm_status_desc e where e.status_id = w.status_id and e.language_code = 'en' and rownum = 1),
      (select m.status_name from ngep_sit.pm_status_desc m where m.status_id = w.status_id and m.language_code = 'ms' and rownum = 1)
    from ngep_sit.${workflow} w where w.doc_type = '${wfType}' and w.created_date > sysdate - ${Number(days)}
    group by w.status_id order by w.status_id`).map(([id, n, en, bm]) => ({ statusId: Number(id), rows: Number(n), en: en ?? '', bm: bm ?? '' }));
}

/** Delivery Orders submitted against a PO/CO (DO_LOOKUP). Verified 2026-11-23: CO260000000005848 → 01400K003S2600002. */
export function deliveryOrdersOf(orderNo: string): { docNo: string; at: string }[] {
  if (!/^(CO|PO)\d{12,15}$/.test(orderNo)) throw new Error(`doc-status: "${orderNo}" is not a CO/PO number`);
  return sitQuery(`select d.delivery_order_no, to_char(d.created_date, 'YYYY-MM-DD HH24:MI:SS') from ngep_sit.fl_delivery_order d
    join ngep_sit.fl_fulfilment_order o on o.fulfilment_order_id = d.fulfilment_order_id where o.doc_no = '${orderNo}' order by d.created_date`)
    .map(([docNo, at]) => ({ docNo, at }));
}

/** Contract made from an LOA (CT_CONTRACT.LOA_ID). Verified 2026-11-23: LA260000000004225 → CT260000000002301. */
export function contractOfLoa(laNo: string): string | undefined {
  if (!/^LA\d{12,15}$/.test(laNo)) throw new Error(`doc-status: "${laNo}" is not an LA number`);
  return sitQuery(`select c.contract_no from ngep_sit.ct_contract c join ngep_sit.sc_loa l on l.loa_id = c.loa_id where l.loa_no = '${laNo}'`)[0]?.[0] || undefined;
}

/** Debit / credit notes of a PO/CO (FL_ADJUSTMENT by the order). 2026-11-24: CO260000000006653 → DN260000000004802. */
export function adjustmentsOf(orderNo: string, type: 'DN' | 'CN'): { docNo: string; at: string }[] {
  if (!/^(CO|PO)\d{12,15}$/.test(orderNo)) throw new Error(`doc-status: "${orderNo}" is not a CO/PO number`);
  return sitQuery(`select a.doc_no, to_char(a.created_date, 'YYYY-MM-DD HH24:MI:SS') from ngep_sit.fl_adjustment a
    join ngep_sit.fl_fulfilment_order o on o.fulfilment_order_id = a.fulfilment_order_id where o.doc_no = '${orderNo}' and a.doc_type = '${type}' order by a.created_date`)
    .map(([docNo, at]) => ({ docNo, at }));
}
