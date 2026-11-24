# sm-cancel-mof_20261125-032807 is waiting

SM-031 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-722707: The personnel 1. OWNER 8560 has a valid digital certificate. Please go to the SoftCert Management menu to revoke this personnel digital certificate first before the Cancel MOF Account application can ). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run sm-cancel-mof_20261125-032807 --step SM-031
