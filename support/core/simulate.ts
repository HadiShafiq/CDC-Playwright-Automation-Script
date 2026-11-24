import fs from 'node:fs';
import path from 'node:path';
import { ROOT, nowMy } from './context';
import { dbSchema, statusHistory } from './doc-status';
import { DOC_TYPES, looksLike, type DocType } from './documents';
import { sitQuery } from './sit-db';

/**
 * Status simulation for statuses only the backend sets (iGFMAS, scheduler, time limits) or that no flow reaches yet.
 * planSimulation() is READ-ONLY: it builds the data patch (one workflow status row; SM also SM_APPL.STATUS_ID) and its
 * rollback. The TESTER runs it in DBeaver (SIT). checkSimulation() confirms it and logs it in knowledge/data-change-audit.md.
 * Facts (SIT 2026-11-23): the 7 *_WORKFLOW_STATUS tables share columns and have *_WORKFLOW_STATUS_SEQ; triggers disabled.
 */
export interface ActiveStatus {
  module: string;
  docType: string;
  statusId: number;
  en: string;
  bm: string;
}

let active: ActiveStatus[] | undefined;
export function activeStatuses(): ActiveStatus[] {
  if (active) return active;
  const f = path.join(ROOT, 'registry', 'active-statuses.json');
  active = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')).statuses as ActiveStatus[]) : [];
  return active;
}

/** Excel module + workflow doc type (e.g. SC/LA, CT/FA, SC/OC, SM/SR, PM/CP) → our document type + status kind. */
export function kindOfWorkflow(module: string, wfType: string): { doc: DocType; kind: string } | undefined {
  for (const [doc, src] of Object.entries(dbSchema().documents)) {
    if (src.workflow.split('_')[0].toUpperCase() !== module || !src.wfTypes.includes(wfType)) continue;
    const kind = wfType === src.wfTypes[0] && wfType === doc && !src.subIds ? doc : `${doc}:${wfType}`;
    return { doc: doc as DocType, kind };
  }
  return undefined;
}

export interface SimulationPlan {
  docNo: string;
  kind: string;
  wfType: string;
  docId: number;
  currentStatus: number;
  target: number;
  active?: ActiveStatus;
  sql: string;
  file: string;
}

export function planSimulation(no: string, target: number, wfType?: string, outDir = path.join(ROOT, '.data', 'SIT', 'simulate')): SimulationPlan {
  const doc = DOC_TYPES.find((t) => looksLike(t, no));
  if (!doc) throw new Error(`simulate: "${no}" is not a document number`);
  const src = dbSchema().documents[doc];
  if (!src) throw new Error(`simulate: ${doc} has no database mapping`);
  const wf = wfType || src.wfTypes[0];
  if (!src.wfTypes.includes(wf)) throw new Error(`simulate: ${doc} has no workflow type ${wf} (${src.wfTypes.join(', ')})`);
  if (!Number.isInteger(target) || target <= 0) throw new Error('simulate: bad status id');
  const module = src.workflow.split('_')[0].toUpperCase();
  const act = activeStatuses().find((s) => s.module === module && s.docType === wf && s.statusId === target);
  const kind = wf === src.wfTypes[0] && wf === doc && !src.subIds ? doc : `${doc}:${wf}`;
  const idSql = (src.subIds?.[wf] ?? `select ${src.id} from ngep_sit.${src.table} where ${src.no} = '{NO}'`).split("'{NO}'").join(`'${no}'`);
  const ids = sitQuery(idSql).map((r) => r[0]);
  if (ids.length !== 1) throw new Error(`simulate: ${no} ${wf}: expected exactly one document id, found ${ids.length}`);
  const docId = Number(ids[0]);
  const cur = sitQuery(`select workflow_status_id, status_id, created_by from ngep_sit.${src.workflow} where doc_type = '${wf}' and doc_id = ${docId} and is_current = 1 order by created_date desc`);
  if (!cur.length) throw new Error(`simulate: ${no} has no current ${wf} status row (it never entered this workflow)`);
  const [curRowId, curStatus, userId] = cur[0];
  const T = `ngep_sit.${src.workflow}`;
  const SEQ = `ngep_sit.${src.workflow.toUpperCase()}_SEQ`;
  const sm = src.table === 'sm_appl';
  const sql = [
    `-- SIMULATE ${no} (${kind}, doc_id ${docId}): ${curStatus} → ${target} ${act ? `${act.en} / ${act.bm}` : '(NOT in the active status list!)'}`,
    `-- DATA PATCH: SIT only, run by the tester in DBeaver (SIT connection). Moves the status row only: no BPM task is`,
    `-- created or closed, so use it for status-dependent screens, lists, reports and validations, not to continue the workflow.`,
    `UPDATE ${T} SET is_current = 0, changed_by = ${userId}, changed_date = systimestamp WHERE doc_type = '${wf}' AND doc_id = ${docId} AND is_current = 1;`,
    `INSERT INTO ${T} (workflow_status_id, doc_type, doc_id, is_current, status_id, record_status, created_by, created_date) VALUES (${SEQ}.nextval, '${wf}', ${docId}, 1, ${target}, 1, ${userId}, systimestamp);`,
    ...(sm ? [`UPDATE ngep_sit.sm_appl SET status_id = ${target} WHERE appl_id = ${docId};`] : []),
    'COMMIT;',
    `-- Check: SELECT doc_type, status_id, is_current, created_date FROM ${T} WHERE doc_type = '${wf}' AND doc_id = ${docId} ORDER BY created_date;`,
    '',
    `-- ROLLBACK (back to ${curStatus}):`,
    `-- DELETE FROM ${T} WHERE doc_type = '${wf}' AND doc_id = ${docId} AND is_current = 1 AND status_id = ${target};`,
    `-- UPDATE ${T} SET is_current = 1 WHERE workflow_status_id = ${curRowId};`,
    ...(sm ? [`-- UPDATE ngep_sit.sm_appl SET status_id = ${curStatus} WHERE appl_id = ${docId};`] : []),
    '-- COMMIT;',
  ].join('\n');
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${no}_${wf}_${target}.sql`);
  fs.writeFileSync(file, sql + '\n');
  return { docNo: no, kind, wfType: wf, docId, currentStatus: Number(curStatus), target, active: act, sql, file };
}

/** Is the document at the target now? When it is, the simulation is logged once in knowledge/data-change-audit.md. */
export function checkSimulation(no: string, target: number, wfType: string | undefined, tester: string, sqlFile?: string): { ok: boolean; statusId: number | null; en: string; bm: string; kind: string } {
  const doc = DOC_TYPES.find((t) => looksLike(t, no))!;
  const src = dbSchema().documents[doc];
  const wf = wfType || src.wfTypes[0];
  const kind = wf === src.wfTypes[0] && wf === doc && !src.subIds ? doc : `${doc}:${wf}`;
  const c = statusHistory(kind, no).filter((s) => s.current).at(-1);
  const ok = c?.statusId === target;
  if (ok) {
    const audit = path.join(ROOT, 'knowledge', 'data-change-audit.md');
    const mark = `${no} (${kind}) status → ${target}`;
    if (!fs.readFileSync(audit, 'utf8').includes(mark))
      fs.appendFileSync(audit, `| ${nowMy().slice(0, 16).replace('T', ' ')} | SIT | ${tester} (ran the patch) | Status simulation | ${mark} ${c!.en} | Data patch ${sqlFile ? path.relative(ROOT, sqlFile) : `.data/SIT/simulate/${no}_${wf}_${target}.sql`}: workflow status row (no BPM task) | Rollback SQL at the end of the same file | No |\n`);
  }
  return { ok, statusId: c?.statusId ?? null, en: c?.en ?? '', bm: c?.bm ?? '', kind };
}
