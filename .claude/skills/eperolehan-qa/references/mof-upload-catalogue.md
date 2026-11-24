---
name: mof-upload-catalogue
description: Upload Catalogue for a new MOF supplier on SIT (tests/mof-registration/upload-catalogue.spec.ts, CAT-001): flow, the no-extension rule, items used
metadata:
  type: project
---

2026-11-18: after the MOF registration the user asked "proceed to upload catalogue" with product **14111512** (KERTAS GRAF) and service **85151501** (PERKHIDMATAN KAWALAN KEBERSIHAN MAKANAN), and said **don't use extension codes; extensions are for later test cases**. CAT-001 passed for 900101010815: "Item is successfully published. Catalogue uploaded successfully. Please proceed to soft cert request here".

**Flow (supplier):** Overview → Upload Catalogue (dashboard flow-chart link) → Create New Catalogue Item wizard: Select Item (search by Item Code autocomplete) → Choose Item → Draft list (page supptemp-catalogue-maint once drafts exist; "Add new item" returns to step 1). Each Draft row: Price, UOM (LOV dialog "Listing - UOM (Packaging)", Select), Image & Basic Specification dialog (image upload + text, Close; image fixtures/files/catalogue_item.png), Start Date (End Date auto-fills +2 years by the validity rule) → Save → tick → Publish → declaration checkbox → Yes.

**SIT findings:** a service is added straight from step 1 (dialog "add this service to catalogue?"). A product cannot be added without ticking an extension row (ERR-715014), and most product codes have none; setting Type/Brand/Measurement/Color all to "N A" + Search gives one generic "N A" row = no real extension. UOM used: AU Activity unit for both (no "unit/piece" on the LOV's first page).

**How to apply:** `npx cross-env TEST_ENV=SIT npx playwright test tests/mof-registration/upload-catalogue.spec.ts --workers=1`; items via CATALOGUE_ITEMS="code:product|service:price,…"; account = latest in .auth/mof-accounts.json or MOF_ACCOUNT. Next step SIT points to: soft cert request. Related: [[mof-registration-chain]].
