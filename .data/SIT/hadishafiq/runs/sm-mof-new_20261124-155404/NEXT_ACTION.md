# sm-mof-new_20261124-155404 is waiting

SM-001 failed in an earlier attempt (LOCATOR_OR_TIMING (low): an element was not found or not ready in time (could also be a slow SIT)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run sm-mof-new_20261124-155404 --step SM-001
