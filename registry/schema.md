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
      "login": "default",            // "default" (the step's Katalon account) | {"accountOf": "KAT-022"} | "assignedOfficer"
      "inputs": [{ "var": "sqNo", "doc": "SQ" }],   // Katalon variable ← document of that type from the flow run
      "outputs": [{ "doc": "SQ", "message": "Simple Quote.*successfully submitted" }],
      "checkpoint": {
        "id": "SQ_SUBMITTED",
        "description": "Simple Quote submitted",
        "displayedStatus": { "en": null, "bm": null },
        "verification": "source",    // execution | source | documentation | unverified
        "evidence": "where the claim comes from"
      }
    }
  },
  "flows": [
    {
      "id": "sq-services",
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
