# fl-contract_20261125-123300 is waiting

KAT-057 failed in an earlier attempt (LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run fl-contract_20261125-123300 --step KAT-057
