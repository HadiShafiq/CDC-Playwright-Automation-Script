# Registry schema

## workflows/<module>.json
```jsonc
{
  "module": "sq",                    // sq | dp | direct-loa | ct | fl
  "name": "Simple Quote",
  "steps": {                         // steps OWNED by this module; flows of any module may use them
    "KAT-021": {
      "title": "Create Simple Quote (Services)",
      "role": "Requisitioner",
      "stateChanging": true,         // true = never repeat blindly; an interrupted attempt becomes UNCERTAIN
      "login": "default",            // "assignedOfficer": given (--officer) > BPM task assignee in SIT WFTASK > data-overrides
      "automation": "katalon",       // optional: "manual" = not automated yet; the run stops, the tester acts + reconciles
      "bpmTask": "Verify Manual LOA",// optional: SIT WFTASK activity the step works on (wait for it, find its assignee)
      "source": "…", "instructions": "…",  // manual steps: where the logic can be ported from; what the tester does            // "default" (the step's Katalon account) | {"accountOf": "KAT-022"} | "assignedOfficer"
      "inputs": [{ "var": "sqNo", "doc": "SQ" }],   // Katalon variable ← document of that type from the flow run
      "outputs": [{ "doc": "SQ", "message": "Simple Quote.*successfully submitted" }],
      "checkpoint": {
        "id": "SQ_SUBMITTED",
        "description": "Simple Quote submitted",
        "displayedStatus": { "en": null, "bm": null },
        "verification": "source",    // execution | source | documentation | unverified
        "evidence": "where the claim comes from",
        "db": {                      // optional: SIT database status after the step (registry/db-schema.json kind)
          "kind": "SQ",              // LA | SQ | RN | CR | CT:FD | CT:AC | QT | QT:OC | QT:TEC …
          "statusId": 60851,         // null = the step does not change it (only observed)
          "en": "Pending Supplier Response", "bm": "Menunggu Maklumbalas Pembekal",
          "via": [40600, 40610],     // optional: in-between statuses while SIT finishes the move (keep waiting)
          "waitSec": 120,            // optional (default 120; 600 with via; 30 when observeOnly)
          "observeOnly": true,       // optional: not yet seen on SIT (e.g. DEV) — a different status is reported, not failed
          "evidence": "document number + where it was read"
        }
      }
    }
  },
  "flows": [
    {
      "id": "sq-services",
      "submodule": "simple-quote",   // folder: tests/data-prep/en/<module>/<submodule>/<flow>/
      "title": "…",
      "verification": "documentation",
      "notes": "…",
      "steps": ["KAT-021", { "gate": "SQ_START_SQL" }, "KAT-022", { "gate": "SQ_END_SQL" }],
      "variables": { "KAT-021": { "Fulfilmenttype": 2 } }   // optional per-flow variable values
    }
  ]
}
```

- `outputs[].message`: a regular expression the application's info message must match; the document number of
  type `doc` is read from that message. A step with outputs is VERIFIED only when the message was seen.
- A step without outputs, or whose checkpoint is `unverified`, ends as COMPLETED_UNVERIFIED, never VERIFIED.

## Document types (support/core/documents.ts)
`SQ` Simple Quote · `PI` Item Inquiry (Compare) · `RN` Request Note · `PR` Purchase Request · `PO` Purchase Order ·
`LA` Letter of Acceptance · `CT` Contract · `CR` Contract Request · `CO` Contract Order · `DO` Delivery Order ·
`FN` Fulfilment Received Note · `SD` Stop Delivery · `IN` Invoice · `DN` Debit Note · `PA` Payment (match)

## gates.json
```jsonc
{
  "SQ_START_SQL": {
    "type": "sql" | "lookup" | "wait",
    "title": "…",
    "needs": ["SQ"],                 // documents the instructions refer to
    "provides": ["PO"],              // lookup gates: documents the person supplies
    "instructions": "… {SQ} …",      // {DOC} is replaced by the flow run's document
    "source": "…"
  }
}
```
A gate is satisfied only by a person: `npm run qa -- gate --run <id> --gate <GATE> --done` or `--set PO=PO26…`.

## db-schema.json
`documents.<DOC>`: `table`, `no`, `id` (master table and its number/id columns), `workflow` (sc/ct/fl_workflow_status),
`wfTypes` (workflow doc types sharing the document id, e.g. a QT's QT, CMT, BPK, OC, TEC, FEC), `subIds` (own id query per
type, e.g. a contract's FD, AC, SA, FA … UF), `wfNames`, `verified` + `evidence`. `catalogOnly`: workflow types only listed in
the status catalogue (CM, PM, PP, treasury circulars, …). Document types include AP (SM application, KN-06112026-0058) and CN. `bpmTasks`: SIT01_SOAINFRA.wftask@SITSOA.
The generator writes the DBeaver queries of every document to `sql/status/<DOC>.sql`.

## CR suites (tests/cr-suites/<CR>/cr.json)
```jsonc
{ "cr": "12345", "title": "…", "language": "EN", "notes": "…",
  "scenarios": [{ "id": "S01", "title": "…", "flow": "dloa-oneoff-services",
                  "prepare": { "until": "LA_ACKNOWLEDGED" },   // step ID or status: data prep stops there
                  "execute": { "until": "LA_VERIFIED" },       // omit execute = the tester executes by hand
                  "expected": "approved expected result", "manual": "how to execute by hand" }] }
```
`npm run suites:gen` writes `data-prep/<SID>-<STATUS>.spec.ts`, `execution/<SID>-<title>.spec.ts` and `README.md`.
