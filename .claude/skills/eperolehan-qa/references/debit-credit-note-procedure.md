---
name: debit-credit-note-procedure
description: "How to make a debit note (and likely a credit note) on SIT for KAT-056: no create screen, SIT creates it from a services invoice above the order; full step list with accounts"
metadata:
  node_type: memory
  type: project
  originSessionId: 9583e3b5-4126-491e-ba50-3a006c0702c9
  modified: 2026-11-16T05:01:48.745Z
---

Verified 2026-11-16 on SIT (DN260000000004401, PO260000000007002). There is **no "create debit note" screen** in ePerolehan. SIT creates the debit note by itself when the supplier's **invoice amount is above the ordered amount** on a **services** PO. Goods POs cannot produce one (quantity only, no amount field).

**Debit note chain (all steps are Katalon tests in tests/katalon, run one at a time with data-overrides):**
1. KAT-028 Add to Cart - Services (AINHALIM ENTERPRISE, item 701216070000000000) → RN. Default login.
2. KAT-032 Approve RN, `_officer` 690127065209 (check Task Status Search first).
3. KAT-046 Submit PR, `_officer` 710527085562 (the Submit PR task takes a few minutes to appear).
4. KAT-047 Approve PR, `_officer` 690127065209; retry once if "not in My Task".
5. **Ask the user for the PO number** (they query FL_FULFILMENT_ORDER in DBeaver; it took ~1 h on 2026-11-16).
6. KAT-048 Acknowledge PO as AINHALIM (claims the group task itself).
7. KAT-049 delivery with `DeliveryAmount` **above** the PO grand total (RM1,500 against RM1,000; `DeliveryQuantity` = ordered qty of KAT-028 but the PO had unit price RM100 × 10, so it still counted as partial).
8. KAT-050 Acknowledge DO (DO number from the receiving officer's Group Task, e.g. 01309H005M2600503) → FRN.
9. KAT-051 Approve FRN, `_officer` 180220145443.
10. If the PO shows "Pending Partial Fulfilment": KAT-052 Stop Delivery as AINHALIM, then KAT-053 Approve SD, `_officer` 690127065209. The Create Invoice task only appears after full delivery or an approved stop.
11. KAT-054 Create Invoice with `_accountOf` KAT-048 (AINHALIM). SIT creates DN…, status "Pending Debit Note Approval" (see it in Fulfilment Maintenance > Document Type "Debit Note").
12. KAT-056 Approve Debit Note with `Document_Number` = DN…, `_officer` 690127065209 (Task Status Search task "Review DAN").

**Credit note: NOT verified.** Fulfilment Maintenance has a "Credit Note" document type, so SIT most likely creates one the same way when the invoice is **below** the ordered amount (DeliveryAmount under the PO total). Check with a read-only probe first; there is no Katalon test for it.

**Why:** the user asked (2026-11-16) to make a new debit note application end to end and use it for KAT-056, and to remember how for the next debit/credit note request.
**How to apply:** when asked for a debit or credit note, run this chain on a new services RN; never reuse old POs (they expire). Log every step in knowledge/data-change-audit.md. Related: [[katalon-conversion-project]], [[dp-loa-route-rule]], [[credentials-excel]].
