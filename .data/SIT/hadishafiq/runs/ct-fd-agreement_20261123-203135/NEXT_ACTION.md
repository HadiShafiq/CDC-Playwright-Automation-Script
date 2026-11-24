# ct-fd-agreement_20261123-203135 is waiting

KAT-040 failed in an earlier attempt (LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run ct-fd-agreement_20261123-203135 --step KAT-040
