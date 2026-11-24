# Flow run dp-compare_20261123-204543

| | |
|---|---|
| Flow | dp-compare — DP Compare (Item Inquiry) to Purchase Order acknowledgement |
| Module | dp |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **COMPLETED** |
| Started / updated | 2026-11-23T20:45:43+08:00 / 2026-11-24T01:41:20+08:00 |
| Documents | PI PI260000000000804, RN RN260000000004916, PR PR260000000005072, PO PO260000000007216 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-029 Add to Compare: submit Item Inquiry to suppliers | VERIFIED | PI_SUBMITTED | PI PI260000000000804 | Katalon default account of the step |   |
| 2 | KAT-044 Claim Group Task application | COMPLETED-UNVERIFIED | GROUP_TASK_CLAIMED |  | Katalon default account of the step |   |
| 3 | KAT-030 Supplier responds to the Item Inquiry | VERIFIED (2 attempts) | PI_SUPPLIER_RESPONDED | PI PI260000000000804 | Katalon default account of the step |   |
| 4 | KAT-031 Prepare Request Note from Compare | VERIFIED | RN_SUBMITTED | RN RN260000000004916 | Katalon default account of the step |   |
| 5 | KAT-032 Approve Request Note (Compare / Add to Cart) | VERIFIED | RN_APPROVED | RN RN260000000004916 | officer 690127065209: BPM task "Review Direct Purchase" of RN260000000004916 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 6 | KAT-033 Submit Purchase Request from the approved Request Note | VERIFIED (2 attempts) | PR_SUBMITTED | PR PR260000000005072 | officer 710527085562: BPM task "Submit PR" of RN260000000004916 is ASSIGNED to 710527085562 (SIT WFTASK) |   |
| 7 | KAT-034 Approve Purchase Request (sent to iGFMAS) | VERIFIED | PR_APPROVED | PR PR260000000005072 | officer 690127065209: BPM task "Review PR" of PR260000000005072 is ASSIGNED to 690127065209 (SIT WFTASK) |   |
| 8 | GATE PO_LOOKUP | done by SIT database (automatic lookup) 2026-11-23T21:16:03+08:00 | | PO PO260000000007216 | | |
| 9 | KAT-035 Supplier acknowledges the Purchase Order | VERIFIED (6 attempts) | PO_ACKNOWLEDGED | PO PO260000000007216 | account of KAT-035 (nurulainmof) — self-heal: the open BPM task "Acknowledge PO" is assigned to nurulainmof, not to BASICFLROS3 |   |

## Application messages per step

**KAT-029** attempt 2026-11-23T20:45:49+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\01_KAT-029\2026-11-23_204544`
- error: Day to Respond is mandatory.
- info: Agency are fully responsibility in procurement for items which is only subject to PK7 / WP Item (exceptional from government procurement procedures).
- info: Item Inquiry PI260000000000804 is successfully submitted.

**KAT-030** attempt 2026-11-23T20:47:01+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\02_KAT-030\2026-11-23_204544`

**KAT-030** attempt 2026-11-23T21:06:55+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\03_KAT-030\2026-11-23_210616`
- info: Item Inquiry PI260000000000804 is successfully submitted.

**KAT-044** attempt 2026-11-23T21:06:21+08:00 → completed-unverified · evidence `evidence\SIT\FLOW\dp-compare\02_KAT-044\2026-11-23_210616`

**KAT-031** attempt 2026-11-23T21:07:33+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\04_KAT-031\2026-11-23_210616`
- info: Request Note RN260000000004916 is successfully submitted.

**KAT-032** attempt 2026-11-23T21:08:17+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\05_KAT-032\2026-11-23_210616`
- info: Request Note RN260000000004916 is approved.

**KAT-033** attempt 2026-11-23T21:09:04+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\06_KAT-033\2026-11-23_210616`

**KAT-033** attempt 2026-11-23T21:14:16+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\06_KAT-033\2026-11-23_211218`
- info: Agency is responsible in procurement for items which falls under PK7 / WP Item (Exceptional from government procurement procedures) / Special Item (With Approval). All Purchase Orders must be issued before supplies received/ services rendered. Purchase Orders are allowed to be issued not more than one (1) week from supplies received/ services rendered for Procurement Type PK7 / WP Item - FMB PK7/WP Item Threshold DP&PR 100k BI. Any Purchase Order to be issued incompliance with treasury circular must be obtained prior approval from Ministry of Finance.
- info: Selected Charge Line Items updated.
- info: Purchase Request PR260000000005072 is successfully submitted.

**KAT-034** attempt 2026-11-23T21:15:29+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\07_KAT-034\2026-11-23_211218`
- info: Agency is responsible in procurement for items which falls under PK7 / WP Item (Exceptional from government procurement procedures) / Special Item (With Approval). All Purchase Orders must be issued before supplies received/ services rendered. Purchase Orders are allowed to be issued not more than one (1) week from supplies received/ services rendered for Procurement Type PK7 / WP Item - FMB PK7/WP Item Threshold DP&PR 100k BI. Any Purchase Order to be issued incompliance with treasury circular must be obtained prior approval from Ministry of Finance.
- info: Purchase Request PR260000000005072 is approved and has been sent to iGFMAS for verification. Please click Alert/Notification to review the status and print the Purchase Order document.

**KAT-035** attempt 2026-11-23T21:16:03+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\09_KAT-035\2026-11-23_211218`

**KAT-035** attempt 2026-11-23T21:19:01+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\09_KAT-035\2026-11-23_211852`

**KAT-035** attempt 2026-11-24T01:29:32+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\09_KAT-035\2026-11-24_012923`

**KAT-035** attempt 2026-11-24T01:36:34+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\09_KAT-035\2026-11-24_013625`

**KAT-035** attempt 2026-11-24T01:39:02+08:00 → failed · evidence `evidence\SIT\FLOW\dp-compare\09_KAT-035\2026-11-24_013852`

**KAT-035** attempt 2026-11-24T01:40:46+08:00 → verified · evidence `evidence\SIT\FLOW\dp-compare\09_KAT-035\2026-11-24_014037`
- info: Purchase Order PO260000000007216 is acknowledged.

