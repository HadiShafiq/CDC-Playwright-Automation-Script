# Flow run dp-assign-code_20261125-051514

| | |
|---|---|
| Flow | dp-assign-code — Assign Code on a Request Note (product, then service) |
| Module | dp |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-25T05:15:14+08:00 / 2026-11-25T05:20:50+08:00 |
| Documents | RN RN260000000004925 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-038 Assign Code - Product (Request Note lines without item code) | VERIFIED | RN_CODE_ASSIGNED | RN RN260000000004925 | account of KAT-035 (nurulainmof) — self-heal: the open BPM task "Codify Purchase Request" is assigned to nurulainmof, 880801029878, 880801235445, not to NURULAINMOF |   |
| 2 | KAT-039 Assign Code - Service | FAILED |  |  | account of KAT-030 | TEST_DATA (medium): the document is not in this account's task list (wrong account, not assigned yet, or already done) <br>RN260000000004925 is not in this account's My Task (no result) |

## Application messages per step

**KAT-038** attempt 2026-11-25T05:15:22+08:00 → verified · evidence `evidence\SIT\FLOW\dp-assign-code\01_KAT-038\2026-11-25_051515`
- info: Request Note RN260000000004925 is successfully submitted.

**KAT-039** attempt 2026-11-25T05:19:10+08:00 → failed · evidence `evidence\SIT\FLOW\dp-assign-code\02_KAT-039\2026-11-25_051515`

