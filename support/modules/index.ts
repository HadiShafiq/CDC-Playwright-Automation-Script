import type { Page } from '@playwright/test';
import type { DocType } from '../core/documents';
import type { EnvConfig } from '../../config/environments';
import type { Evidence } from '../../fixtures/test';
import { reg001, reg002, reg003, reg004 } from './sm/registration';
import { cancelMof, createRenewalDraft, createUpdateDraft, declareAppl, supplierOfAppl } from './sm/application';
import { loadAccounts } from '../mof/accounts';
import { activateAccess, decideAccess, submitAccessApplication } from './pm/access';
import { approveTask, completeAndSubmit, createDraft, QT_SIT, reviseTask } from './qt/stages';
import { prepareSpec } from './qt/spec';
import { bpkApprove, prepareDocuments } from './qt/docprep';
import { submitProposal, techAction } from './qt/supplier';
import { ecPhase } from './qt/ecphase';
import { acceptLoi, approveLoi, loiNotRequired, negotiateLoi, prepareLoi } from './qt/loi';
import { acceptLoa, prepareLoa, verifyLoa } from './qt/loa';
import { loadPasswordFor } from '../credentials';
import { approveMaintenance, maintain, paymentMatchWith } from './fl/maintenance';
import { ackFaSupplier, approveSa, confirmFaMeeting, createFa, createSa, faTaskAction, prepareSupplementalLetter, signOffFa, updateFaResult } from './ct/amendment';

/**
 * Typed step functions for steps that have no Katalon script ("automation": "module" in registry/workflows/*.json).
 * The flow runner logs in (as the BPM assignee or `loginAs` below, with the shared SIT officer password), calls the
 * function, signs out, then checks the outcome (messages / documents) and the SIT DB status like any other step.
 */
export interface ModuleCtx {
  page: Page;
  baseURL: string;
  inputs: Partial<Record<DocType, string>>;
  runId: string;
  log: (m: string) => void;
  /** Sign out and log in as another user (same shared SIT officer password), e.g. each committee member. */
  as: (user: string) => Promise<void>;
  env: EnvConfig;
  evidence: Evidence;
}
export interface ModuleResult {
  outputs?: Partial<Record<DocType, string>>;
  messages: string[];
}
export interface ModuleStep {
  /** Who logs in when the step is not assigned to an officer by BPM: a login ID. */
  loginAs?: string;
  /** The step logs in and out by itself (SM registration stages: supplier account + officers from Task Status Search). */
  selfLogin?: boolean;
  run: (ctx: ModuleCtx) => Promise<ModuleResult>;
}

/** SM officer stage on the flow's application: new registrations (KN/JN) belong to our latest supplier, others to the update supplier. */
const smOfficer = async (ctx: ModuleCtx) => {
  const ap = ctx.inputs.AP;
  const supplier = ap && !/^[KJ]N-/.test(ap) ? await supplierOfAppl(ctx.env, ap) : undefined;
  return { messages: await reg003({ page: ctx.page, env: ctx.env, evidence: ctx.evidence }, { once: true, docNo: ap, supplier }) };
};

const need = (ctx: ModuleCtx, d: DocType) => {
  const v = ctx.inputs[d];
  if (!v) throw new Error(`needs a ${d} number`);
  return v;
};

export const MODULE_STEPS: Record<string, ModuleStep> = {
  // Direct LOA approval (62501) when SIT asks for it — generic approve by the BPM assignee
  'LA-APPROVE': { run: async (ctx) => approveTask(ctx, need(ctx, 'LA')) },
  // FL Fulfilment Maintenance (fl-data steps.py, DEV-verified): supplier update/cancel, FL Approver approves
  'FL-101': { run: async (ctx) => maintain(ctx, 'DO', need(ctx, 'DO'), !!ctx.inputs.CO, 'Update') },
  'FL-102': { run: async (ctx) => approveMaintenance(ctx, 'DO', need(ctx, 'DO')) },
  'FL-103': { run: async (ctx) => maintain(ctx, 'DO', need(ctx, 'DO'), !!ctx.inputs.CO, 'Cancel') },
  'FL-104': { run: async (ctx) => approveMaintenance(ctx, 'DO', need(ctx, 'DO')) },
  'FL-111': { run: async (ctx) => maintain(ctx, 'IN', need(ctx, 'IN'), !!ctx.inputs.CO, 'Update') },
  'FL-112': { run: async (ctx) => approveMaintenance(ctx, 'IN', need(ctx, 'IN')) },
  'FL-113': { run: async (ctx) => maintain(ctx, 'IN', need(ctx, 'IN'), !!ctx.inputs.CO, 'Cancel') },
  'FL-114': { run: async (ctx) => approveMaintenance(ctx, 'IN', need(ctx, 'IN')) },
  // payment match with the iGFMAS stub's failure suffix (fl-data fl.py presets pay_query / pay_idd_fail)
  'FL-121': { run: async (ctx) => paymentMatchWith(ctx, ctx.inputs.CO ?? need(ctx, 'PO'), 'Test Payment MM516FAIL') },
  'FL-122': { run: async (ctx) => paymentMatchWith(ctx, ctx.inputs.CO ?? need(ctx, 'PO'), 'Test Payment MM506FAIL') },
  // SM new MOF registration: the REG chain stages (support/modules/sm/registration.ts, passed SIT 2026-11-18)
  'SM-001': {
    selfLogin: true,
    run: async (ctx) => {
      const c = { page: ctx.page, env: ctx.env, evidence: ctx.evidence };
      // A rerun continues the latest account when it is registered but its application is not declared yet
      // (2026-11-24: a rerun of SM-001 must not register a second supplier while KN-24112026-0035 is half done)
      const last = loadAccounts().filter((x) => x.env === ctx.env.name).at(-1);
      const has = (w: string) => !!last?.notes?.some((n) => n.includes(w));
      if (last && has('first login OK') && !has('declared')) ctx.log(`continuing account ${last.username} (${last.companyName}${last.applicationNo ? `, draft ${last.applicationNo}` : ''}): already registered and logged in`);
      else await reg001(c);
      const ap = await reg002(c, { stopBeforeDeclare: true });
      return { outputs: { AP: ap }, messages: [`Application ${ap} saved (draft)`] };
    },
  },
  'SM-002': {
    selfLogin: true,
    run: async (ctx) => {
      const c = { page: ctx.page, env: ctx.env, evidence: ctx.evidence };
      // A renewal (KR/JR) declares its own draft and pays the processing fee; a new registration runs REG-002
      if (ctx.inputs.AP && /^[KJ]R-/.test(ctx.inputs.AP)) return { messages: [await declareAppl(c, ctx.inputs.AP, { payFee: true })] };
      return { messages: [`Application ${await reg002(c)} declared, processing fee paid`] };
    },
  },
  'SM-005': { selfLogin: true, run: smOfficer },
  'SM-006': { selfLogin: true, run: smOfficer },
  'SM-011': { selfLogin: true, run: smOfficer },
  'SM-013': { selfLogin: true, run: smOfficer },
  // Update MOF Profile of our registered supplier (support/modules/sm/application.ts)
  'SM-022': { selfLogin: true, run: async (ctx) => { const c = { page: ctx.page, env: ctx.env, evidence: ctx.evidence }; const ap = await createUpdateDraft(c); return { outputs: { AP: ap }, messages: [`Update MOF Profile ${ap} drafted`] }; } },
  'SM-004': { selfLogin: true, run: async (ctx) => ({ messages: [await declareAppl({ page: ctx.page, env: ctx.env, evidence: ctx.evidence }, need(ctx, 'AP'))] }) },
  'SM-031': { selfLogin: true, run: async (ctx) => { const kc = await cancelMof({ page: ctx.page, env: ctx.env, evidence: ctx.evidence }); return { outputs: { AP: kc }, messages: [`Cancel MOF Account ${kc} submitted`] }; } },
  'SM-032': { selfLogin: true, run: smOfficer },
  'SM-024': { selfLogin: true, run: async (ctx) => { const ap = await createRenewalDraft({ page: ctx.page, env: ctx.env, evidence: ctx.evidence }); return { outputs: { AP: ap }, messages: [`Renewal ${ap} drafted`] }; } },
  'SM-012': {
    selfLogin: true,
    run: async (ctx) => {
      const ap = ctx.inputs.AP;
      const supplier = ap && !/^[KJ]N-/.test(ap) ? await supplierOfAppl(ctx.env, ap) : undefined;
      return { messages: [`Virtual certificate ${(await reg004({ page: ctx.page, env: ctx.env, evidence: ctx.evidence }, { docNo: ap, supplier })) || 'shown'}`] };
    },
  },
  // PM Access Application (public form, BPM approver pool, e-mail activation) — built from the SIT screens 2026-11-24
  'PM-001': { selfLogin: true, run: async (ctx) => { const r = await submitAccessApplication(ctx.page, ctx.baseURL, { companyProfile: true, marketResearch: false }, ctx.log); return { outputs: { AA: r.appl }, messages: r.messages }; } },
  'PM-002': { selfLogin: true, run: async (ctx) => { const r = await submitAccessApplication(ctx.page, ctx.baseURL, { companyProfile: false, marketResearch: true }, ctx.log); return { outputs: { AA: r.appl }, messages: r.messages }; } },
  'PM-011': { selfLogin: true, run: async (ctx) => decideAccess(ctx, need(ctx, 'AA'), 'CP', 'approve') },
  'PM-012': { selfLogin: true, run: async (ctx) => decideAccess(ctx, need(ctx, 'AA'), 'MR', 'approve') },
  'PM-031': { selfLogin: true, run: async (ctx) => decideAccess(ctx, need(ctx, 'AA'), 'CP', 'reject') },
  'PM-032': { selfLogin: true, run: async (ctx) => decideAccess(ctx, need(ctx, 'AA'), 'MR', 'reject') },
  'PM-021': { selfLogin: true, run: async (ctx) => activateAccess(ctx.page, need(ctx, 'AA'), ctx.log) },
  'PM-022': { selfLogin: true, run: async (ctx) => activateAccess(ctx.page, need(ctx, 'AA'), ctx.log) },
  'QT-001': {
    loginAs: QT_SIT.users.DESK_OFFICER,
    run: async (ctx) => {
      const title = `QA AUTO QT ${new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 16).replace('T', ' ')}`;
      const r = await createDraft(ctx, title);
      return { outputs: { QT: r.QT }, messages: r.messages };
    },
  },
  'QT-002': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => completeAndSubmit(ctx, need(ctx, 'QT')) },
  'QT-003': { loginAs: QT_SIT.users.COMMITTEE_APPROVER, run: async (ctx) => approveTask(ctx, need(ctx, 'QT')) },
  'QT-004': { loginAs: QT_SIT.users.SC_SECRETARY, run: async (ctx) => prepareSpec(ctx, need(ctx, 'QT')) },
  // 60025: every Specification Committee member endorses, each as themselves (ngep-runner endorseAll)
  'QT-005': {
    loginAs: QT_SIT.users.SC_MEMBER1,
    run: async (ctx) => {
      const messages: string[] = [];
      for (const [i, user] of [QT_SIT.users.SC_MEMBER1, QT_SIT.users.SC_MEMBER2].entries()) {
        if (i > 0) await ctx.as(user);
        try {
          messages.push(...(await approveTask(ctx, need(ctx, 'QT'), { button: 'Endorsement', remark: 'Endorsed (QA automation)' })).messages);
        } catch (e) {
          if (!/is not in this account's My Task/.test(String((e as Error).message))) throw e;
          ctx.log(`${user}: no endorsement task (already endorsed?)`);
        }
      }
      return { messages };
    },
  },
  'QT-007': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => prepareDocuments(ctx, need(ctx, 'QT')) },
  // No BPK: Open For = Bumiputera (SC_QT.OPEN_FOR = B, as QT260000000004373) instead of All (A → BPK approval 60030)
  'QT-107': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => prepareDocuments(ctx, need(ctx, 'QT'), { openFor: /Bumi/i }) },
  'QT-008': { loginAs: QT_SIT.users.BPK_APPROVER, run: async (ctx) => bpkApprove(ctx, need(ctx, 'QT')) },
  'QT-009': { loginAs: QT_SIT.users.PUBLICATION_APPROVER, run: async (ctx) => approveTask(ctx, need(ctx, 'QT')) },
  'QT-108': { loginAs: QT_SIT.users.BPK_APPROVER, run: async (ctx) => bpkApprove(ctx, need(ctx, 'QT'), /Revis|Kaji Semula|Return/i) },
  'QT-109': { loginAs: QT_SIT.users.PUBLICATION_APPROVER, run: async (ctx) => reviseTask(ctx, need(ctx, 'QT')) },
  // 60007 → 60009: Technical Support publishes the notice now (instead of waiting for the publish date)
  'QT-010': { loginAs: QT_SIT.users.TECH_SUPPORT, run: async (ctx) => techAction(ctx, need(ctx, 'QT'), 'Publish') },
  // 60009 → 60022: the QT suppliers submit proposals, then Technical Support closes the QT
  'QT-011': {
    loginAs: QT_SIT.suppliers[0],
    run: async (ctx) => {
      const qt = need(ctx, 'QT');
      const messages: string[] = [];
      let submitted = 0;
      for (const [i, user] of QT_SIT.suppliers.entries()) {
        if (i > 0) await ctx.as(user);
        try {
          messages.push(...(await submitProposal(ctx, qt)));
          submitted++;
          ctx.log(`supplier ${user} submitted`);
        } catch (e) {
          ctx.log(`supplier ${user} skipped: ${String((e as Error).message).slice(0, 160)}`);
        }
      }
      if (!submitted) throw new Error(`No supplier could submit a proposal for ${qt}; not closing`);
      await ctx.as(QT_SIT.users.TECH_SUPPORT);
      messages.push(...(await techAction(ctx, qt, 'Close')).messages);
      return { messages };
    },
  },
  // 60022 → 60023: evaluation tasks (committees, meetings, OC/TEC/FEC evaluation) by their BPM assignees, each step up to its checkpoint
  'QT-012': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => ecPhase(ctx, need(ctx, 'QT'), { kind: 'QT', statusId: 60010 }) },
  'QT-013': { loginAs: QT_SIT.users.OC_SECRETARY, run: async (ctx) => ecPhase(ctx, need(ctx, 'QT'), { kind: 'QT:OC', statusId: 62004 }) },
  'QT-014': { loginAs: QT_SIT.users.TEC_CHAIR, run: async (ctx) => ecPhase(ctx, need(ctx, 'QT'), { kind: 'QT:TEC', statusId: 62105 }) },
  'QT-015': { loginAs: QT_SIT.users.FEC_CHAIR, run: async (ctx) => ecPhase(ctx, need(ctx, 'QT'), { kind: 'QT', statusId: 60023 }) },
  // Supplier Finalization (SF): Consolidate Report → FC meeting → finalize → endorse ×n → sign off → 62213 Pending LOI Preparation
  'QT-016': { loginAs: QT_SIT.users.FEC_CHAIR, run: async (ctx) => ecPhase(ctx, need(ctx, 'QT'), { kind: 'QT:SF', statusId: 62213 }) },
  'QT-017': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => prepareLoi(ctx, need(ctx, 'QT')) },
  'QT-018': { selfLogin: true, run: async (ctx) => approveLoi(ctx, need(ctx, 'QT')) },
  'QT-019': { selfLogin: true, run: async (ctx) => acceptLoi(ctx, need(ctx, 'QT'), async (u) => !!(await loadPasswordFor(ctx.env.name, u))) },
  'QT-020': { selfLogin: true, run: async (ctx) => negotiateLoi(ctx, need(ctx, 'QT')) },
  'QT-021': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => prepareLoa(ctx, need(ctx, 'QT')) },
  // CT Amendment With Supplement (FA): Contract Administrator = account of KAT-040 (registry login)
  'CT-101': { run: async (ctx) => createFa(ctx, need(ctx, 'CT')) },
  'CT-102': { run: async (ctx) => faTaskAction(ctx, need(ctx, 'CT'), 'Approve', 51050) },
  'CT-103': { run: async (ctx) => confirmFaMeeting(ctx, need(ctx, 'CT')) },
  'CT-104': { run: async (ctx) => updateFaResult(ctx, need(ctx, 'CT')) },
  'CT-105': { selfLogin: true, run: async (ctx) => signOffFa(ctx, need(ctx, 'CT')) },
  'CT-106': { run: async (ctx) => faTaskAction(ctx, need(ctx, 'CT'), 'Acknowledge', 51320) },
  'CT-107': { run: async (ctx) => prepareSupplementalLetter(ctx, need(ctx, 'CT')) },
  'CT-108': { selfLogin: true, run: async (ctx) => ackFaSupplier(ctx, need(ctx, 'CT')) },
  'CT-109': { run: async (ctx) => faTaskAction(ctx, need(ctx, 'CT'), 'Acknowledge', 51500) },
  'CT-110': { run: async (ctx) => createSa(ctx, need(ctx, 'CT')) },
  'CT-111': { run: async (ctx) => approveSa(ctx, need(ctx, 'CT')) },
  'QT-024': { loginAs: QT_SIT.users.DESK_OFFICER, run: async (ctx) => loiNotRequired(ctx, need(ctx, 'QT')) },
  // QT LOA that SIT routes to "Approve LOA" (62501), e.g. LA260000000004244 (2026-11-25); skipped at any other status
  'QT-025': { run: async (ctx) => approveTask(ctx, need(ctx, 'LA')) },
  'QT-022': { selfLogin: true, run: async (ctx) => acceptLoa(ctx, need(ctx, 'QT')) },
  'QT-023': { selfLogin: true, run: async (ctx) => verifyLoa(ctx, need(ctx, 'QT')) },
  'QT-006': { loginAs: QT_SIT.users.SC_CHAIR, run: async (ctx) => approveTask(ctx, need(ctx, 'QT'), { button: 'Sign Off', remark: 'Signed off (QA automation)' }) },
};
