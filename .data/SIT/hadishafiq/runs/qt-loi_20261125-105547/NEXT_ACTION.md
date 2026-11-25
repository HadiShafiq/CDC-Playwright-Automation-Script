# qt-loi_20261125-105547 is waiting

QT-017 failed in an earlier attempt (BUSINESS_ASSERTION (high): the step finished but its proof query is not satisfied). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run qt-loi_20261125-105547 --step QT-017
