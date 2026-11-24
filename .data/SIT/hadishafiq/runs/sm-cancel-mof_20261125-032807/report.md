# Flow run sm-cancel-mof_20261125-032807

| | |
|---|---|
| Flow | sm-cancel-mof — Cancel MOF Account (contractor) |
| Module | sm |
| Environment | SIT |
| Tester | hadishafiq |
| Language | EN |
| CR | - |
| Status | **BLOCKED** |
| Started / updated | 2026-11-25T03:28:07+08:00 / 2026-11-25T03:31:42+08:00 |
| Documents | - |

**Waiting for:** SM-031 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-722707: The personnel 1. OWNER 8560 has a valid digital certificate. Please go to the SoftCert Management menu to revoke this personnel digital certificate first before the Cancel MOF Account application can ). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run sm-cancel-mof_20261125-032807 --step SM-031

## Items

| # | Item | Result | Checkpoint | Documents | Login | Classification / note |
|---|---|---|---|---|---|---|
| 1 | SM-031 Submit the MOF account cancellation | FAILED (2 attempts) |  |  | Katalon default account of the step | APPLICATION_VALIDATION (medium): the application showed ERR-722707: The personnel 1. OWNER 8560 has a valid digital certificate. Please go to the SoftCert Management menu to revoke this personnel digital certificate first before the Cancel MOF Account application can  <br>Soft cert revocation signed, but Cancel MOF still answers ERR-722707 (revocation pending approval?) |
| 2 | SM-032 Approve the MOF account cancellation | not run |  |  |  |   |

## Application messages per step

**SM-031** attempt 2026-11-25T03:28:14+08:00 → failed · evidence `evidence\SIT\FLOW\sm-cancel-mof\01_SM-031\2026-11-25_032807`
- error: The personnel 1. OWNER 8560 has a valid digital certificate. Please go to the SoftCert Management menu to revoke this personnel digital certificate first before the Cancel MOF Account application can be proceed. (ERR-722707)

**SM-031** attempt 2026-11-25T03:30:19+08:00 → failed · evidence `evidence\SIT\FLOW\sm-cancel-mof\01_SM-031\2026-11-25_033013`
- error: The personnel 1. OWNER 8560 has a valid digital certificate. Please go to the SoftCert Management menu to revoke this personnel digital certificate first before the Cancel MOF Account application can be proceed. (ERR-722707)

