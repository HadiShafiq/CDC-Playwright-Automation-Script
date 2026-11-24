---
name: mof-registration-chain
description: "New MOF supplier registration end to end on SIT (tests/mof-registration, REG-001..004): sources, how e-mails and officer passwords are supplied, status"
metadata:
  node_type: memory
  type: project
  originSessionId: 9583e3b5-4126-491e-ba50-3a006c0702c9
  modified: 2026-11-18T03:53:14.560Z
---

Started 2026-11-16: the user asked to "run create mof … until he got cert" — register a brand-new MOF supplier on SIT and take it through activation, first login, the MOF application (Declare + processing fee), the officer stages and the virtual certificate.

**Built:** `tests/mof-registration/mof-registration.spec.ts` (serial REG-001..REG-004, tag @mof-registration, `npm run mofreg:sit`) on page objects copied from the user's other project `C:\Users\hadishafiq\Desktop\CDC- PLaywright_Latest\tests\library` into `support/cdc/` (hosts replaced by `support/cdc/base-url.ts` from TEST_ENV; upload file → fixtures/files/File_pdf_for_testing.pdf). `support/mof/sso.ts` logs in with any username/password; `support/mof/accounts.ts` keeps the created accounts in git-ignored `.auth/mof-accounts.json` and appends audit rows.

**Sources ported:** mof-acc-contractor-COOPERATIVE.spec.ts (registration until first login; Gmail IMAP via `support/cdc/library/utils/email-helper.ts`), Declare-MOF-Kontraktor.spec.ts (REG-002), verify_declare.spec.ts (officer verify / review / escalated approve, REG-003), View Virtual Certificate (REG-004). The Katalon copies in Downloads (mof-acc-contractor-COOPERATIVE.groovy, MOF_Registration_ObjectRepository) are conversions of the same scripts.

**E-mail:** the user chose YOPmail (2026-11-16, "use temp mail website yopmail") over the Gmail mailbox of the old scripts: each REG-001 run makes `mofreg<timestamp>@yopmail.com` and `support/mof/yopmail.ts` reads it through the YOPmail web page (iframe#ifinbox / iframe#ifmail) in a second tab. No password needed. (Gmail path kept in support/cdc/library/utils/email-helper.ts; `EXTRA_ENV_FILE` in playwright.config can load another project's .env if ever needed.) Officer password: `MOF_OFFICER_PASSWORD` in .env, else the shared officer row of credentials.xlsx.

**Done 2026-11-18:** first full pass. Test Company 90923536 (Contractor/Cooperative), login 900101370499, eP-0101L0015, application KN-18112026-0001 → MOF No. **357-0002294531**, virtual certificate **K10344207601990321**. All four REG tests passed (uncommitted at the time of writing).

**SIT findings (Cooperative):**
- YOPmail can't be read by Playwright: Cloudflare blocks automated Chrome (even installed Chrome; ticking by hand shows "Troubleshoot"). The user's Katalon gets through with Selenium. Don't try to get around it (permission check refused Selenium-for-Cloudflare and auto-clicking). Hand-off: the user reads the mail in their own browser and gives ACTIVATION_LINK + ACTIVATION_KEY, then TEMP_PASSWORD; REG-001 resumes the latest account. For unattended runs suggest MailSlurp / Gmail IMAP / mail.tm.
- New account password: <new-account password: see .auth/credentials.xlsx> (user's choice); also the shared officer password works for the MOF officers.
- Cooperative form differences: no Telco dropdown, Business Type label "Registered With SKM", no Equity Owner role (so no residential/office address), Capital Info = Total Share + Total Members + an "Equity info was changed" dialog (OK) that resets Total Members.
- After Declare + processing fee the "Processing Fee" task closes a minute later. Officers (Task Status Search): Verify Supporting Documents (group, claim) → Review Application (needs Register Category Code(s) → Approve All before Recommend to Approve) → Review Application (Escalated) → Approve. Then supplier "Make Payment" task = registration fee → Proceed → View Virtual Certification (My Application > Supplier Management).
- REG-002 notes saved sections per application, so a rerun resumes the draft without duplicating personnel.

**How to apply:** rerun a stage with `-g "REG-00x"`; REG-002+ use the latest account of the env from .auth/mof-accounts.json (or `MOF_ACCOUNT=<loginId>`). Unknown officer forms make REG-003 stop and list the visible buttons — extend the if/else there. Log every SIT change in knowledge/data-change-audit.md (the spec does it). Related: [[katalon-conversion-project]], [[mof-end-to-end-plan]], [[credentials-excel]].

**Outlook mailboxes (2026-11-18):** newsupplier001/002/003@commercedc.com.my (Microsoft 365, no MFA) replace YOPmail. Rows 5–7 of .auth/credentials.xlsx, Role "Outlook mailbox"; one dummy password for all three (the user gave it, stored only in the Excel; it is NOT the <new-account password: see .auth/credentials.xlsx> account password). support/mof/outlook.ts signs in headless, keeps the session in .auth/outlook-<local>.json and reads the newest matching mail; REG-001 picks MOF_MAILBOX or the mailbox used least, and only accepts mails naming the company/owner/login ID because mailboxes are reused (001 already receives Hopetech Sdn Bhd mail).

**Done 2026-11-18 15:13–15:25, fully unattended via Outlook:** Test Company 01167338, login 900101010815, eP-0101L0016, KN-18112026-0006 → MOF No. 357-0002294532, certificate K10344207591990353. SIT accepted newsupplier001 although another supplier uses it. Whole chain ≈10 min. Right after the fee the certificate list can say "No records found"; REG-004 now reloads every 30 s (max 10 min) and fails if it never shows.
