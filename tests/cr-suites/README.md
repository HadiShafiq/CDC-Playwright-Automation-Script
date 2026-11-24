# CR suites

One folder per CR: `tests/cr-suites/<CR>/`. Each has two parts, so QA can always see where data prep stops and where
the execution starts.

```
tests/cr-suites/<CR>/
  cr.json                      ← the only file you edit: scenarios, flow, where data prep stops, where execution ends
  README.md                    ← generated: scenario table, statuses (DB EN/BM), commands
  data-prep/<SID>-<STATUS>.spec.ts      ← generated: runs the flow up to the scenario's start status, then stops
  execution/<SID>-<title>.spec.ts       ← generated: runs the scenario from that status to its end status
```

## Make a CR suite
Quickest: `npm run qa -- cr add --cr <CR number>` and pick module → sub-module → flow → where data prep stops → where the
execution ends (repeat for each scenario). Or by hand:

1. Copy `_TEMPLATE/` to `<CR number>/` (no leading underscore).
2. Edit `cr.json`: for each scenario pick a flow (`npm run qa -- list-flows`), `prepare.until` (a status from
   `docs/status-catalog.md` or a step ID) and `execute.until`. Leave `execute` out when the tester executes by hand.
   Write the approved expected result; never invent one.
3. `npm run suites:gen`, then check the generated `README.md`.

## Run
```
npm run qa -- cr                                              # list suites and scenarios
npm run qa -- cr --env sit --cr <CR> --scenario S01 --prep    # data prep (stops at the start status)
npm run qa -- cr --env sit --cr <CR> --scenario S01 --exec    # execution from the prepared documents
npm run qa -- doc-status --env sit --doc <number>             # where a document is now (DB status EN/BM + BPM tasks)
```
Or run a spec directly: `npx cross-env TEST_ENV=SIT playwright test "tests/cr-suites/<CR>/data-prep/S01-….spec.ts" --project=flows --headed`.

How it hangs together:
- The data-prep run is called `CR-<CR>_<SID>_prep_<time>`; the execution takes the documents of the **latest completed**
  one (or `--input LA=LA26…` / `QA_INPUT=LA=LA26…`).
- Before the execution changes anything, it checks in the SIT database that the prepared document is still at the start
  status (e.g. LA 62505). If somebody already used it, the run blocks and tells you to prepare again.
- After each step the runner reads the document's DB status and compares it with the registry; officer steps log in
  as the officer the SIT BPM task is assigned to.
- Manual steps (QT for now) stop the run with instructions; do the step in the application, then
  `npm run qa -- reconcile --env sit --run <id> --step QT-0xx --done` and `npm run qa -- resume --env sit --run <id>`.

`EXAMPLE/` is a demo of the structure (Direct LOA, DP to LOA, QT), not a real CR.
