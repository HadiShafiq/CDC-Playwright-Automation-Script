# qt-doc-revision_20261125-033605 is waiting

QT-107 failed in an earlier attempt (BUSINESS_ASSERTION (high): the step finished but the SIT database status is not the expected one). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run qt-doc-revision_20261125-033605 --step QT-107
