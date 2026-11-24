# sm-renewal_20261125-030936 is waiting

SM-024 failed in an earlier attempt (UNKNOWN (low): no rule matched; read the error, screenshot and trace). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run sm-renewal_20261125-030936 --step SM-024
