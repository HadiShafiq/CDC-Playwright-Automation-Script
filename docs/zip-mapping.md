# What the shared zips contain, and what this framework took from them (2026-11-23)

Decision: **keep this framework** (Playwright Test, registry, flow runner, SIT DB checks) and take ideas, status
paths and step knowledge from the zips. Nothing was copied that holds credentials (several zips commit shared logins).

| Zip | What it really is | Useful for us | Taken into this repo |
|---|---|---|---|
| `QT_Tender-DirectLOA.zip` | **ngep-runner**: a developer's data-creation tool (plain Node + Chrome CDP, DEV/SIT), QT stages to 60023, Direct LOA (manual sourcing), dashboard | Stopping by real DB status, BPM assignee lookup, waiting for tasks, QT status path, QT screen knowledge | DB status check per checkpoint, `support/core/bpm-tasks.ts` (WFTASK@SITSOA), module **qt** (15 manual steps; port `stages/*.mjs` once SIT QT accounts are confirmed) |
| `FL fullfilment and PM.zip` | **claude-skills** (another developer): skills `fl-data` (Python + Playwright FL data creation, DEV-verified), `pm-admin`, `pm-settings`, `qa-cases`, `sanity-test`, `db-query`, … | `fl-data` flows and their status IDs: DAN, CAN, stop instruction, payment query/IDD failure, DO and invoice update/cancel (Fulfilment Maintenance), contract variants; the FL status map (`map/fl_data.json`) | FL sub-modules **maintenance** (DO/invoice update + cancel, non-contract and contract) and **payment-failure** (MM516FAIL, MM506FAIL): steps FL-101..122, manual, DB expectations *observe-only* until seen on SIT |
| `Fl-Fullfillment.zip` | An older copy of the same claude-skills repo (`fl-data` slightly newer `steps.py`, plus `fl-console`: a Node web console over Excel rows for CR/RN/PR) | Same as above; `fl-console` overlaps our CLI | Nothing extra beyond the `fl-data` knowledge |
| `sm automation.zip` | **kapitan**: an orchestrator that runs Claude agents on tickets and logs them. The SM Playwright specs live in a separate `unit_test` repo that is **not** in the zip; `TESTER.md` lists what it covers | The SM flow inventory (registration A–M, MOF contractor/consultant, add category with site visits, update profile, bumiputera, renewal, cancel, delete pending, tracking diary) and the SIT application numbers it made | Module **sm** (28 manual steps, 11 flows) with the **real SIT status paths** of those applications (KN/JN/KA/KU/JU/KB/KR/KC-06112026-…), document type **AP** (application no) |

## Already covered here (no need to take it)
- MOF supplier registration end to end, catalogue upload, soft cert: `tests/sm/registration`, `tests/sm/catalogue`,
  `tests/sm/soft-cert` (REG-001..004, CAT-001, SC-001..004, passed SIT 2026-11-18). Update MOF Profile: `tests/sm/update-profile`.
- Non-contract and contract fulfilment, stop delivery, debit note: KAT-046..064 (`fl-noncontract`, `fl-contract`,
  `fl-noncontract-partial-debit-note`).
- Direct LOA create / acknowledge / verify (16 variants), SQ, DP, CT FD + agreement.

## Not taken (and why)
- `fl-data` OSB mock changes (iGFMAS biz error): changes a shared DEV service; DEV only.
- `pm-admin`, `pm-settings` (user/role administration): change shared master data; ask first if needed.
- `qa-cases`, `sanity-test`: document generation; our skills `qa-testcase-engineer` / `qa-testcase-writer` cover test cases.
- Dashboards, local JBoss deploy, port-audit tools: developer tooling.

## Ported (2026-11-24)
1. QT-001..015 from ngep-runner `stages/` → `support/modules/qt/` (verified on SIT to 60023).
2. FL-101..122 from `fl-data/scripts/steps.py` → `support/modules/fl/maintenance.ts` (Fulfilment Maintenance update/cancel +
   approval, payment match with MM516FAIL / MM506FAIL). SIT run pending.
3. SM new MOF registration (SM-001, 002, 005, 006, 011, 012) → the REG chain stages, moved from the spec into
   `support/modules/sm/registration.ts` (the spec `tests/sm/registration` now calls them).

## Still manual (no source script in any zip)
- SM add category / site visit / update profile / bumiputera / renewal / cancel / delete / reject: the kapitan
  `unit_test` repo with `tests/supplier-appl/*.spec.ts` is not in the zip; to be built by exploring the SIT screens.
- PM access applications (PM-001..032): no script in the zips (`pm-admin`/`pm-settings` are user/role admin).
