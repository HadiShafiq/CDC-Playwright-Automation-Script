---
name: mof-end-to-end-plan
description: "User's planned next step for the Update MOF Profile test - click Declare and continue through officer verification/approval (not started)"
metadata:
  node_type: memory
  type: project
  originSessionId: fa63c77d-8433-4e6a-91b3-cdbdcd20fe2c
  modified: 2026-10-28T11:28:17.881Z
---

On 2026-10-28 the user asked (for later, NOT to do yet) to extend tests/mof/update-mof-profile.spec.ts past Declaration into a full end-to-end flow: click Declare, carry the KU-… application number forward, find which officer role(s) must verify/approve it, log in as them and approve that KU.

**Why:** current test deliberately stops before Declare; user wants the whole lifecycle automated once they supply officer accounts.

**Finding the officer (user's tip):** after Declare, Dashboard → "Task Status Search" → enter the KU in "Document Number" → Search. The latest row shows which user ID now holds the task; repeat after each officer action to find the next one. Use this instead of asking the user who the officers are. All SIT officer accounts share one password, stored in .auth/credentials.xlsx row Role "Officer (any)", Username "*" (added 2026-10-28). support/credentials.ts currently returns the first SIT row (the supplier); it needs a role parameter when the officer flow is built.

**How to apply:** wait for the user to say go. They will choose the environment (SIT/UAT) and upload an Excel of usernames/passwords per role (into .auth/, git-ignored; see [[credentials-excel]]). Declare is irreversible and may need fees (processing/registration) per the Declaration notes, so confirm before first real run. Drafts on MOFCTOO16 kept getting "Deleted by Contractor" by someone else, so declare in the same run that prepares the draft.
