---
name: mof-soft-cert
description: Soft cert for a new MOF supplier: SIT request (SC-001), approval in MSC Trustgate pilot ePRA (SC-002), approval e-mail (SC-003); tests/mof-registration/soft-cert.spec.ts
metadata:
  type: project
---

2026-11-18: after the catalogue, the user asked to request the soft cert on SIT and approve it in the **MSC Trustgate pilot ePRA** (https://digitalid.msctrustgate.com/v2/pilot/ePRA/; login stored only in .auth/credentials.xlsx, Role "MSC Trustgate ePRA (pilot)"). Done for 900101010815: request 70207 approved 16:08; MyTrust e-mail "PENDAFTARAN Sijil Digital … DILULUSKAN" with a link to set PIN + security question (https://digitalid.msctrustgate.com/certificate/enrolment/<token>).

**SIT (supplier):** dashboard "Soft Certificate Application" → Proceed → Submission Type Online → per-document upload icon opens "Choose Files" dialog: setInputFiles then press the row's **start** button (td.start), else nothing uploads → Request SoftCert → Payment Selection (RM0, first soft cert free) → Submit → Declaration dialog: tick + **Declare** → "successfully submitted to Certificate Authorities (CA)". Afterwards the dashboard link disappears.

**ePRA:** the user's way: type the IC in **User ID** and click **Search** (don't rely on the list order) → Select → detail page buttons Save | Approve | KIV | Reject → Approve gives a browser alert "Data has been successfully approved" → listed under Approved.

**SC-004 done 16:19:** enrolment link from the e-mail → 5 challenge questions + PIN → "PIN and challenge response has been successfully set". PIN field pattern is (?=.*d)(?=.*[a-z]) with exactly 8 characters (needs a LOWERCASE letter, the message wording is misleading). PIN + answers are generated and kept only in .auth/mof-accounts.json (softCert). The PIN is for signing transactions, not for login.
