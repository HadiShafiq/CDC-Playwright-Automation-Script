# qt-supplier-finalization_20261125-052512 is waiting

QT-016 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-770271: Please upload the endorsement report signed by the committee members. (ERR-770271)). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run qt-supplier-finalization_20261125-052512 --step QT-016
