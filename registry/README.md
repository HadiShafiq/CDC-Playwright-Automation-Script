# Workflow registry

Version-controlled description of the five procurement modules: which automated steps exist, what each step
needs and produces, which role runs it, and how the steps chain into flows. The flow runner (`support/core/flow-runner.ts`)
and the CLI (`cli/qa.mjs`) read these files; nothing here is executed by itself.

| File | Content |
|---|---|
| `workflows/sq.json`, `dp.json`, `direct-loa.json`, `ct.json`, `fl.json` | Steps owned by the module + its flows |
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
