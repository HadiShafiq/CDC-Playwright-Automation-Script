# Flow run dloa-schedule-product-services_20261123-173458

| | |
|---|---|
| Flow | dloa-schedule-product-services — Direct LOA Direct LOA Agreement_Periodic (As And When or Schedule) - Product Plus Service → supplier → DO verify |
| Module | direct-loa |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **FAILED** |
| Started / updated | 2026-11-23T17:34:58+08:00 / 2026-11-23T18:10:03+08:00 |
| Documents | LA LA260000000004224 |

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | KAT-006 Create Direct LOA: Direct LOA Agreement_Periodic (As And When or Schedule) - Product Plus Service | VERIFIED (2 attempts) | LA_SUBMITTED | LA LA260000000004224 | Katalon default account of the step |   |
| 2 | KAT-009 Supplier acknowledges Direct LOA - Global (product + services) | VERIFIED | LA_ACKNOWLEDGED | LA LA260000000004224 | Katalon default account of the step |   |
| 3 | KAT-010 Desk Officer verifies the LOA | FAILED |  |  | Katalon default account of the step | APPLICATION_VALIDATION (medium): the application showed ERR-000001: Error encountered processing your last request! Please try again later or contact our help desk. (ERR-000001) <br>locator.click: Timeout 30000ms exceeded. |

## Application messages per step

**KAT-006** attempt 2026-11-23T17:35:06+08:00 → running · evidence `evidence\SIT\FLOW\dloa-schedule-product-services\01_KAT-006\2026-11-23_173459`

**KAT-006** attempt 2026-11-23T18:03:24+08:00 → verified · evidence `evidence\SIT\FLOW\dloa-schedule-product-services\01_KAT-006\2026-11-23_180318`
- info: Agency are fully responsibility in procurement for items which is only subject to PK 7/WP Item (exceptional from government procurement procedures).
- info: Letter of Acceptance (LOA) LA260000000004224 is successfully submitted.

**KAT-009** attempt 2026-11-23T18:06:33+08:00 → verified · evidence `evidence\SIT\FLOW\dloa-schedule-product-services\02_KAT-009\2026-11-23_180318`
- info: Letter of Acceptance (LOA) LA260000000004224 is acknowledged.

**KAT-010** attempt 2026-11-23T18:09:07+08:00 → failed · evidence `evidence\SIT\FLOW\dloa-schedule-product-services\03_KAT-010\2026-11-23_180318`
- error: Error encountered processing your last request! Please try again later or contact our help desk. (ERR-000001)

