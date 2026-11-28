# ct-fd-agreement_20261128-123147 is waiting

KAT-041 failed in an earlier attempt (TEST_DATA (medium): the document is not in this account's task list (wrong account, not assigned yet, or already done)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run ct-fd-agreement_20261128-123147 --step KAT-041
