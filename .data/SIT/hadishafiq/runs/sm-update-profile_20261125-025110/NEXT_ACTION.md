# sm-update-profile_20261125-025110 is waiting

SM-004 failed in an earlier attempt (APPLICATION_VALIDATION (medium): the application showed ERR-722592: Bank Name and Account Number are not allowed to be updated because this information is still tied to active contracts belonging to this company. Check on Supplier’s Contract Maintenance.). It changes data, so it is not retried automatically. Check that nothing was submitted, then: npm run qa -- retry --run sm-update-profile_20261125-025110 --step SM-004
