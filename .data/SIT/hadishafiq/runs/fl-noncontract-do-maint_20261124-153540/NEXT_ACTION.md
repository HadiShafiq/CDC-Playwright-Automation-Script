# fl-noncontract-do-maint_20261124-153540 is waiting

KAT-047 failed in an earlier attempt (BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run fl-noncontract-do-maint_20261124-153540 --step KAT-047
