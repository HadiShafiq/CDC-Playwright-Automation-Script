# fl-contract-do-maint_20261125-155547 is waiting

KAT-057 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-740031: The PTJ has utilized the Schedule No. 1 of this Periodic Contract with Schedule. (ERR-740031)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run fl-contract-do-maint_20261125-155547 --step KAT-057
