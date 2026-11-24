---
name: phase1-framework
description: "Phase 1 QA framework (branch phase1-framework, started 2026-11-23): module mapping, SIT-only, EN-first then BM with permission"
metadata:
  node_type: memory
  type: project
  originSessionId: 2994701e-b854-448e-8f2a-e70c31cc0517
  modified: 2026-11-23T07:31:22.173Z
---

Phase 1 "ePerolehan Intelligent Playwright QA framework" from the user's master prompt, approved 2026-11-23 on branch `phase1-framework` (baseline tag `baseline/katalon-64`). Persistent plan: `docs/phase1-plan.md` in the repo; read it first in a new session.

Decisions from the user (2026-11-23):
- Modules: DP, **SQ as its own module**, Direct LOA, CT, FL, and since 2026-11-23 **QT** (Quotation/Tender, steps manual until ported from ngep-runner).
- CR suites: first "not yet", then **changed 2026-11-23**: one folder per CR with two parts, **data prep** (stop at a status) and **execution** (from that status), so manual QA knows where to stop. Structure: tests/cr-suites/<CR>/cr.json → generated data-prep/ + execution/ + README; generic data prep in tests/data-prep/en/. See [[ngep-runner-comparison]].
- **SIT only.** No UAT credentials; UAT will need reruns and maybe script changes later.
- English and BM in separate folders. Run English until ALL flows pass, then **ask permission before running BM**.
- SIT DB available: use the user's SQL (see [[sq-date-sql-procedure]], [[sit-db-access]]); ask before running SQL.
- Preserve originals as the prompt says (an `original-scripts/` copy + the tag).
- test-results/ may be deleted.

**Why:** the user wants a CLI-driven, registry/checkpoint-based framework that keeps the 64 passing Katalon specs working.
**How to apply:** never edit `tests/katalon/**` by hand (generated); stop and ask before BM runs, SQL, and UAT.
