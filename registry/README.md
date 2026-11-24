# Workflow registry

Version-controlled description of the six procurement modules (qt, sq, dp, direct-loa, ct, fl): which automated steps exist, what each step
needs and produces, which role runs it, and how the steps chain into flows. The flow runner (`support/core/flow-runner.ts`)
and the CLI (`cli/qa.mjs`) read these files; nothing here is executed by itself.

| File | Content |
|---|---|
| `workflows/sm.json`, `qt.json`, `sq.json`, `dp.json`, `direct-loa.json`, `ct.json`, `fl.json` | Steps owned by the module + its flows; every flow has a `submodule` (folder under the module in tests/data-prep) |
| `db-schema.json` | Where each document's status lives in the SIT DB (table, number/id columns, workflow table, workflow types) + BPM task table |
| `db-statuses.json` | GENERATED (`qa db-catalog`): every status each workflow type used on SIT in the last year, EN/BM |
| `gates.json` | Points where a flow needs something the browser cannot do: SQL date moves, DB lookups, officer assignment |
| `schema.md` | Field reference |

## Verification levels (field `verification`)
Never raise a level without evidence. Never invent a displayed status.

| Level | Meaning |
|---|---|
| `execution` | Seen on SIT in a recorded run (give the run ID in `evidence`) |
| `source` | Taken from the script source (e.g. the success message the Katalon script waits for) |
| `documentation` | Taken from project notes or user explanation (knowledge/, memory) |
| `unverified` | Assumed from naming or order; must be confirmed by a run |

`displayedStatus` (EN/BM) stays `null` until the application's own status text has been read on screen in a run.

`checkpoint.db` is the **SIT database status** the step leaves the document in (with PM_STATUS_DESC EN/BM names). Add it only
from a real document's history (evidence = document number). The runner waits for it after the step (and after a gate
with `db`), fails the step on another status, and blocks an execution whose prepared document is no longer at the start status.
