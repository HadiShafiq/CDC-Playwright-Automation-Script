---
name: credentials-excel
description: "User wants test logins kept in an Excel file (.auth/credentials.xlsx), never typed in chat or committed"
metadata:
  node_type: memory
  type: feedback
  originSessionId: fa63c77d-8433-4e6a-91b3-cdbdcd20fe2c
  modified: 2026-10-28T11:22:42.363Z
---

Test logins live in .auth/credentials.xlsx (sheet "Credentials": Environment | Role | Username | Password | Notes), read by support/credentials.ts. The user asked for Excel specifically (like Katalon's Excel test data) and will upload more accounts per role later.

**Why:** user prefers managing credentials in Excel; .auth/ is git-ignored.

**How to apply:** add new roles/accounts as rows in that workbook (or adapt to the user's uploaded layout); never put passwords in code, logs or commits. Related: [[mof-end-to-end-plan]].
