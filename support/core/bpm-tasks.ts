import { looksLike, DOC_TYPES } from './documents';
import { dbSchema } from './doc-status';
import { sitQuery } from './sit-db';

/**
 * BPM tasks of a document on SIT (read-only): SIT01_SOAINFRA.WFTASK over the database link SITSOA, matched on
 * CUSTOMATTRIBUTESTRING1 = document number. Tells who a task is really assigned to, so a step run by "the officer SIT
 * assigned" logs in as that officer instead of a guess, and lets a step wait until its task exists.
 * Verified 2026-11-23: LA260000000004227 → "Verify Manual LOA" ASSIGNED to 710527085562 (the Desk Officer KAT-010 used).
 * Idea from the ngep-runner project (lib/wftask.mjs); rewritten for this framework. NGEP_SIT.MV_WFTASK is stale: not used.
 */
export interface BpmTask {
  activity: string;
  state: string; // ASSIGNED, COMPLETED, … (empty for finished tasks on SIT)
  assignees: string[]; // login IDs ("710527085562,user" → "710527085562"); group assignees keep their group name
  groupAssignees: string[];
  claimedBy: string;
  createdAt: string;
  taskId: string;
}

function checkNo(no: string) {
  if (!DOC_TYPES.some((t) => looksLike(t, no))) throw new Error(`bpm-tasks: "${no}" is not a document number`);
}

/** Every task of a document (oldest first), any state. */
export function bpmTasks(docNo: string): BpmTask[] {
  checkNo(docNo);
  return sitQuery(`select activityname, state, assignees, acquiredby, to_char(createddate, 'YYYY-MM-DD HH24:MI:SS'), taskid
    from ${dbSchema().bpmTasks} where customattributestring1 = '${docNo}' order by createddate`).map(([activity, state, assignees, claimedBy, createdAt, taskId]) => {
    const parts = (assignees ?? '').split(/[;:]/).map((a) => a.trim()).filter(Boolean);
    return {
      activity: activity ?? '',
      state: state ?? '',
      assignees: parts.filter((a) => !/,group$/i.test(a)).map((a) => a.replace(/,user$/i, '')),
      groupAssignees: parts.filter((a) => /,group$/i.test(a)).map((a) => a.replace(/,group$/i, '')),
      claimedBy: claimedBy ?? '',
      createdAt: createdAt ?? '',
      taskId: taskId ?? '',
    };
  });
}

/** Open (ASSIGNED) tasks of a document; `activity` narrows to one task name. */
export function openTasks(docNo: string, activity?: string): BpmTask[] {
  return bpmTasks(docNo).filter((t) => t.state === 'ASSIGNED' && (!activity || t.activity === activity));
}

/**
 * The officer to log in as for a step that acts on `docNos`: the single user assignee of the open task.
 * - `activity` given: that task must be open.
 * - no activity: exactly one open task with exactly one user assignee across the documents (else ambiguous).
 * Returns why when it cannot decide, so the runner can ask the person.
 */
export function assignedOfficer(docNos: string[], activity?: string): { officer?: string; task?: BpmTask; why: string } {
  const open = docNos.flatMap((no) => openTasks(no, activity).map((t) => ({ no, t })));
  const withUser = open.filter((x) => x.t.assignees.length === 1 || x.t.claimedBy);
  if (withUser.length === 1) {
    const { no, t } = withUser[0];
    return { officer: t.claimedBy || t.assignees[0], task: t, why: `BPM task "${t.activity}" of ${no} is ASSIGNED to ${t.claimedBy || t.assignees[0]} (SIT WFTASK)` };
  }
  if (!open.length) return { why: `no open BPM task${activity ? ` "${activity}"` : ''} for ${docNos.join(', ')} yet` };
  return { why: `several or group BPM tasks are open for ${docNos.join(', ')}: ${open.map((x) => `"${x.t.activity}" → ${[...x.t.assignees, ...x.t.groupAssignees.map((g) => `group ${g}`)].join('/') || '?'}`).join('; ')}` };
}

/** Waits (polling every 5 s) until `docNo` has an open task (optionally a named one). Returns it, or undefined at the deadline. */
export async function waitForTask(docNo: string, activity: string | undefined, timeoutMs: number): Promise<BpmTask | undefined> {
  const end = Date.now() + timeoutMs;
  for (;;) {
    const t = openTasks(docNo, activity)[0];
    if (t || Date.now() > end) return t;
    await new Promise((r) => setTimeout(r, 5_000));
  }
}

/**
 * Supplier companies invited to a Simple Quote (SC_QUOTE_SUPPLIER), not yet submitted first, mapped to logins through
 * PM_USER_ORG.ORG_PROFILE_ID = supplier id (verified 2026-11-24: nurulainmof → 1009925 AINHALIM ENTERPRISE).
 * Returns the given usernames whose company is invited (SQ supplier steps have no BPM task to read the assignee from).
 */
export function invitedSupplierLogins(sqNo: string, usernames: string[]): string[] {
  if (!/^SQ\d{12,15}$/.test(sqNo)) return [];
  const list = [...new Set(usernames.filter((u) => /^[\w.@-]+$/.test(u)))];
  if (!list.length) return [];
  const rows = sitQuery(`select u.login_id, s.is_submitted from ngep_sit.sc_quote q join ngep_sit.sc_quote_supplier s on s.quote_id = q.quote_id
    join ngep_sit.pm_user_org o on o.org_profile_id = s.supplier_id and o.record_status = 1 join ngep_sit.pm_user u on u.user_id = o.user_id
    where q.quote_no = '${sqNo}' and upper(u.login_id) in (${list.map((u) => `'${u.toUpperCase()}'`).join(', ')}) order by s.is_submitted`);
  return rows.map(([login]) => list.find((u) => u.toUpperCase() === login.toUpperCase())!).filter(Boolean);
}
