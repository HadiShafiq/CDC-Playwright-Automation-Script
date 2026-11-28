# Status coverage: proven vs open (generated)

Generated 2026-11-28T16:08:35+08:00 by `tests/tools/coverage.tool.spec.ts` from the SIT DB (read-only): 93 of our documents, 296 simulations. Do not edit by hand.

**Proven: 380/804 (47.3%)** = 130 real runs + 250 simulated.

| Module | Active | RUN | SIMULATED | OPEN_FLOW_EXISTS | OPEN_NO_FLOW | OPEN_SYSTEM | CANNOT_NEVER_USED | CANNOT_UNMAPPED |
|---|---|---|---|---|---|---|---|---|
| CD | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| CM | 28 | 0 | 0 | 0 | 13 | 1 | 14 | 0 |
| CT | 210 | 17 | 23 | 0 | 139 | 9 | 22 | 0 |
| FL | 165 | 40 | 89 | 2 | 5 | 8 | 18 | 3 |
| PM | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| PP | 14 | 0 | 0 | 0 | 14 | 0 | 0 | 0 |
| SC | 308 | 64 | 106 | 0 | 68 | 19 | 49 | 2 |
| SM | 74 | 7 | 32 | 10 | 0 | 0 | 25 | 0 |
| **All** | 804 | 130 | 250 | 12 | 239 | 37 | 131 | 5 |

- **RUN**: Dah run (real flow, our document)
- **SIMULATED**: Dah simulate (data patch, restored)
- **OPEN_FLOW_EXISTS**: Belum: our flow can reach it, not reached yet
- **OPEN_NO_FLOW**: Belum: SIT reaches it on screens, no flow / sandbox of ours
- **OPEN_SYSTEM**: Belum: backend status (iGFMAS / batch), simulate on a sandbox
- **CANNOT_NEVER_USED**: X boleh: never written on SIT (dev/backend-only or obsolete)
- **CANNOT_UNMAPPED**: X boleh: document type not mapped to a table

## CD

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| CAP | 15031 | Pending Assign UNSPSC | CANNOT_NEVER_USED |  |
| CAP | 15032 | In Progress | CANNOT_NEVER_USED |  |
| CAP | 15033 | Completed | CANNOT_NEVER_USED |  |

## CM

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| CD | 15021 | Pending Extension Maintenance Approval | CANNOT_NEVER_USED |  |
| CD | 15022 | Pending Publish Extension Maintenance | CANNOT_NEVER_USED |  |
| CD | 15023 | Extension Maintenance Rejection | CANNOT_NEVER_USED |  |
| CD | 15024 | Extension Maintenance Completion | CANNOT_NEVER_USED |  |
| CD | 15025 | Pending Extension Code Endorsement | CANNOT_NEVER_USED |  |
| CE | 15001 | Pending Extension Code Review | OPEN_NO_FLOW |  |
| CE | 15002 | Extension Recommendation | OPEN_NO_FLOW |  |
| CE | 15003 | Extension Code Request Completed | OPEN_NO_FLOW |  |
| CE | 15004 | Pending Extension Code Approval | OPEN_NO_FLOW |  |
| CE | 15005 | Item Code Request Completed | OPEN_NO_FLOW |  |
| CE | 15007 | Extension Code Acknowledgement | CANNOT_NEVER_USED |  |
| CE | 15008 | Pending Extension Code Review (Revise) | OPEN_NO_FLOW |  |
| CE | 15009 | Extension Code Request Rejected | OPEN_NO_FLOW |  |
| CMF | 11001 | Draft | CANNOT_NEVER_USED |  |
| CMF | 11002 | Pending Approval | CANNOT_NEVER_USED |  |
| CMF | 11003 | Approved | CANNOT_NEVER_USED |  |
| CMF | 11004 | Rejected | CANNOT_NEVER_USED |  |
| CMF | 11005 | Published | CANNOT_NEVER_USED |  |
| CMF | 11006 | Expired | OPEN_SYSTEM |  |
| CMF | 11007 | Direct Published | CANNOT_NEVER_USED |  |
| CU | 15006 | Item Code Acknowledgement | CANNOT_NEVER_USED |  |
| CU | 15011 | Pending Item Code Review | OPEN_NO_FLOW |  |
| CU | 15012 | UNSPSC Recommendation | OPEN_NO_FLOW |  |
| CU | 15014 | Pending Item Code Creation | OPEN_NO_FLOW |  |
| CU | 15015 | UNSPSC Completion | OPEN_NO_FLOW |  |
| CU | 15016 | Pending Item Code Creation (Revise) | OPEN_NO_FLOW |  |
| CU | 15017 | Item Code Request Rejected | OPEN_NO_FLOW |  |
| CU | 15018 | Pending Item Code Review (Revise) | CANNOT_NEVER_USED |  |

## CT

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| AC | 56000 | Pending Draft Agreement Creation | SIMULATED | CT260000000002301 |
| AC | 56050 | Pending Draft Agreement Approval | SIMULATED | CT260000000002301 |
| AC | 56100 | Pending Draft Agreement Revision | SIMULATED | CT260000000002301 |
| AC | 56150 | Pending Draft Agreement Revision Approval | SIMULATED | CT260000000002301 |
| AC | 56250 | Pending Final Agreement Update | SIMULATED | CT260000000002301 |
| AC | 56300 | Pending Final Agreement Approval | SIMULATED | CT260000000002301 |
| AC | 56350 | Pending Final Agreement Revision | SIMULATED | CT260000000002301 |
| AC | 56400 | Pending Final Agreement Revision Approval | SIMULATED | CT260000000002301 |
| AC | 56600 | Agreement Completed | RUN | CT260000000002293 |
| AC | 56601 | Pending Contract Request Creation | SIMULATED | CT260000000002301 |
| AC | 56700 | Cancelled Due to Ministry Restructuring | SIMULATED | CT260000000002301 |
| AC | 56750 | Pending Agreement Creation | RUN | CT260000000002293 |
| AC | 56800 | Pending Agreement Approval | RUN | CT260000000002293 |
| AC | 56850 | Pending Agreement Revision | SIMULATED | CT260000000002301 |
| AC | 56900 | Pending Agreement Revision Approval | SIMULATED | CT260000000002301 |
| AC | 56950 | Pending Draft Agreement Creation Cancelled | SIMULATED | CT260000000002301 |
| AC | 56955 | Pending Draft Agreement Approval Cancelled | SIMULATED | CT260000000002301 |
| AC | 56960 | Pending Draft Agreement Revision Cancelled | SIMULATED | CT260000000002301 |
| AC | 56965 | Pending Draft Agreement Revision Approval Cancelled | SIMULATED | CT260000000002301 |
| AC | 56970 | Pending Final Agreement Update Cancelled | SIMULATED | CT260000000002301 |
| AC | 56975 | Pending Final Agreement Approval Cancelled | SIMULATED | CT260000000002301 |
| AC | 56980 | Pending Final Agreement Revision Cancelled | SIMULATED | CT260000000002301 |
| AC | 56985 | Pending Final Agreement Revision Approval Cancelled | SIMULATED | CT260000000002301 |
| CB | 55500 | Pending Update Bank Info Submission | CANNOT_NEVER_USED |  |
| CB | 55550 | Pending Confirmation Bank Information Update | OPEN_NO_FLOW |  |
| CB | 55600 | Update Bank Info Completed | OPEN_NO_FLOW |  |
| CB | 55700 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| COM | 59000 | Pending Contract Owner Submission | OPEN_NO_FLOW |  |
| COM | 59200 | Contract Owner Management Completed | OPEN_NO_FLOW |  |
| COM | 59250 | Contract Owner Management Cancelled | OPEN_NO_FLOW |  |
| CQ | 58000 | Pending Treasury Circular (PP) Central Contract Creation Submission | OPEN_NO_FLOW |  |
| CQ | 58005 | Pending Treasury Circular (PP) Central Contract Creation Approval | OPEN_NO_FLOW |  |
| CQ | 58010 | Pending Treasury Circular (PP) Central Contract Creation Revision | OPEN_NO_FLOW |  |
| CQ | 58015 | Pending Treasury Circular (PP) Central Contract Creation Revision Approval | OPEN_NO_FLOW |  |
| CQ | 58020 | Treasury Circular (PP)  Central Contract Creation Cancelled | OPEN_NO_FLOW |  |
| CQ | 58025 | Treasury Circular (PP)  Central Contract Creation Approved | OPEN_NO_FLOW |  |
| CQ | 58030 | Treasury Circular (PP) Central Contract Creation Rejected | OPEN_NO_FLOW |  |
| CQ | 58035 | Pending Treasury Circular (PP) Central Contract Update Submission | OPEN_NO_FLOW |  |
| CQ | 58040 | Pending Treasury Circular (PP) Central Contract Update Approval | OPEN_NO_FLOW |  |
| CQ | 58045 | Pending Treasury Circular (PP) Central Contract Update Revision | OPEN_NO_FLOW |  |
| CQ | 58050 | Pending Treasury Circular (PP) Central Contract Update Revision Approval | OPEN_NO_FLOW |  |
| CQ | 58055 | Treasury Circular (PP) Central Contract Update Cancelled | OPEN_NO_FLOW |  |
| CQ | 58060 | Treasury Circular (PP) Central Contract Update Approved | OPEN_NO_FLOW |  |
| CQ | 58065 | Treasury Circular (PP) Central Contract Update Rejected | OPEN_NO_FLOW |  |
| CQ | 58070 | Pending Cancellation Treasury Circular (PP) Central Contract Approval | OPEN_NO_FLOW |  |
| CQ | 58075 | Pending Cancellation Treasury Circular (PP) Central Contract Revision | OPEN_NO_FLOW |  |
| CQ | 58080 | Pending Cancellation Treasury Circular (PP) Central Contract Revision Approval | OPEN_NO_FLOW |  |
| CQ | 58085 | Cancellation Treasury Circular (PP) Central Contract Approved | OPEN_NO_FLOW |  |
| CQ | 58090 | Cancellation Treasury Circular (PP) Central Contract Rejected | OPEN_NO_FLOW |  |
| CRA | 97000 | Pending Contract Admin Administrative Submission | CANNOT_NEVER_USED |  |
| CRA | 97050 | Pending Contract Admin Administrative Approval | CANNOT_NEVER_USED |  |
| CRA | 97100 | Pending Contract Admin Administrative Revision | CANNOT_NEVER_USED |  |
| CRA | 97150 | Pending Contract Admin Administrative Revision  Approval | CANNOT_NEVER_USED |  |
| FA | 51000 | Pending Amendment With Supplemental Submission | RUN | CT260000000002328 |
| FA | 51050 | Pending Amendment With Supplemental Approval | RUN | CT260000000002328 |
| FA | 51100 | Pending Amendment With Supplemental Revision | OPEN_NO_FLOW |  |
| FA | 51150 | Pending Amendment With Supplemental Revision Approval | OPEN_NO_FLOW |  |
| FA | 51200 | Pending Meeting Confirmation | RUN | CT260000000002328 |
| FA | 51210 | Pending Meeting Confirmation Revision | OPEN_NO_FLOW |  |
| FA | 51250 | Pending Decision by the Approving Authority at the Ministry / Jabatan Level | RUN | CT260000000002328 |
| FA | 51260 | Pending Decision by the Approving Authority at the Ministry / Jabatan Level Revision | OPEN_NO_FLOW |  |
| FA | 51300 | Pending Verification | RUN | CT260000000002328 |
| FA | 51320 | Pending Chairperson Sign Off | RUN | CT260000000002328 |
| FA | 51400 | Pending Supplemental Contract Letter Submission | RUN | CT260000000002328 |
| FA | 51405 | Pending Supplemental Contract Letter Approval | OPEN_NO_FLOW |  |
| FA | 51410 | Pending Supplemental Contract Letter Revision | OPEN_NO_FLOW |  |
| FA | 51420 | Pending Supplemental Contract Letter Revision Approval | OPEN_NO_FLOW |  |
| FA | 51450 | Pending Supplemental Contract Letter Acknowledgement | RUN | CT260000000002328 |
| FA | 51500 | Pending Verification Acknowledgement of Supplemental Contract Letter | RUN | CT260000000002328 |
| FA | 51600 | Amendment With Supplemental Contract Rejected | OPEN_NO_FLOW |  |
| FA | 51650 | Amendment With Supplemental Contract Cancelled | OPEN_NO_FLOW |  |
| FA | 51700 | Supplemental Contract Letter Completed | RUN | CT260000000002328 |
| FA | 51750 | Supplemental Contract Letter Rejected | CANNOT_NEVER_USED |  |
| FA | 51800 | Pending Decision by the Approving Authority at the Ministry of Finance Level | OPEN_NO_FLOW |  |
| FA | 51850 | Pending Cancellation Acknowledgement Amendment With Supplemental Contract | OPEN_NO_FLOW |  |
| FA | 51900 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| FA | 51950 | Pending Rejection Acknowledgement of Supplemental Contract Letter | OPEN_NO_FLOW |  |
| FA | 51960 | Cancelled due to Disciplinary Action | OPEN_NO_FLOW |  |
| FA | 51961 | Cancelled due to Bumiputera Status has been Cancelled | OPEN_NO_FLOW |  |
| FA | 51970 | Rejected due to Disciplinary Action | OPEN_NO_FLOW |  |
| FA | 51971 | Rejected due to Bumiputera Status has been Cancelled | OPEN_NO_FLOW |  |
| FA | 51980 | Revised due to Disciplinary Action | CANNOT_NEVER_USED |  |
| FA | 51981 | Revised due to Bumiputera Status has been Cancelled | CANNOT_NEVER_USED |  |
| FA | 51990 | Pending Cancellation Acknowledgement due to Disciplinary Action | OPEN_NO_FLOW |  |
| FA | 51991 | Pending Cancellation Acknowledgement due to Bumiputera Status has been Cancelled | OPEN_NO_FLOW |  |
| FD | 50050 | Pending Fulfilment Details Creation | RUN | CT260000000002293 |
| FD | 50150 | Pending Fulfilment Details Approval | RUN | CT260000000002293 |
| FD | 50200 | Pending Fulfilment Details Revision | SIMULATED | CT260000000002301 |
| FD | 50250 | Pending Fulfilment Details Revision Approval | SIMULATED | CT260000000002301 |
| FD | 50300 | Fulfilment Details Approved | RUN | CT260000000002293 |
| FD | 50400 | Cancelled Due to Ministry Restructuring | SIMULATED | CT260000000002301 |
| FS | 53000 | Pending Suspension Submission | OPEN_NO_FLOW |  |
| FS | 53050 | Pending Suspension Approval | OPEN_NO_FLOW |  |
| FS | 53100 | Pending Suspension Revision | OPEN_NO_FLOW |  |
| FS | 53150 | Pending Suspension Revision Approval | OPEN_NO_FLOW |  |
| FS | 53200 | Contract Suspension Approved | OPEN_NO_FLOW |  |
| FS | 53250 | Contract Suspension Rejected | OPEN_NO_FLOW |  |
| FS | 53300 | Contract Suspension Cancelled | OPEN_NO_FLOW |  |
| FS | 53400 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| FT | 52000 | Pending Termination Submission | OPEN_NO_FLOW |  |
| FT | 52050 | Pending Termination Approval | OPEN_NO_FLOW |  |
| FT | 52100 | Pending Termination Revision | OPEN_NO_FLOW |  |
| FT | 52150 | Pending Termination Revision Approval | OPEN_NO_FLOW |  |
| FT | 52200 | Pending Termination Letter Printing | OPEN_NO_FLOW |  |
| FT | 52250 | Contract Termination Completed | OPEN_NO_FLOW |  |
| FT | 52350 | Contract Termination Cancelled | OPEN_NO_FLOW |  |
| FT | 52400 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| FU | 54000 | Pending Fulfilment Details Submission | OPEN_NO_FLOW |  |
| FU | 54050 | Pending Fulfilment Details Approval | OPEN_NO_FLOW |  |
| FU | 54100 | Pending Fulfilment Details Revision | OPEN_NO_FLOW |  |
| FU | 54150 | Pending Fulfilment Details Revision Approval | OPEN_NO_FLOW |  |
| FU | 54200 | Fulfilment Details Approved | OPEN_NO_FLOW |  |
| FU | 54250 | Fulfilment Details Rejected | OPEN_NO_FLOW |  |
| FU | 54300 | Fulfilment Details Cancelled | OPEN_NO_FLOW |  |
| FW | 54500 | Pending Amendment Without Supplemental Submission | OPEN_NO_FLOW |  |
| FW | 54550 | Pending Amendment Without Supplemental Approval | OPEN_NO_FLOW |  |
| FW | 54600 | Pending Amendment Without Supplemental Revision | OPEN_NO_FLOW |  |
| FW | 54650 | Pending Amendment Without Supplemental Revision Approval | OPEN_NO_FLOW |  |
| FW | 54700 | Amendment Without Supplemental Approved | OPEN_NO_FLOW |  |
| FW | 54750 | Amendment Without Supplemental Rejected | OPEN_NO_FLOW |  |
| FW | 54800 | Amendment Without Supplemental Cancelled | OPEN_NO_FLOW |  |
| FW | 54900 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| LA | 50301 | Letter of Acceptance Verified | CANNOT_NEVER_USED |  |
| NT | 54850 | Pending Notification Setting Submission | OPEN_NO_FLOW |  |
| NT | 54860 | Pending Notification Setting Approval | OPEN_NO_FLOW |  |
| NT | 54870 | Pending Notification Setting Revision | OPEN_NO_FLOW |  |
| NT | 54880 | Pending Notification Setting Revision Approval | OPEN_NO_FLOW |  |
| NT | 54910 | Notification Setting Approved | OPEN_NO_FLOW |  |
| NT | 54950 | Notification Setting Rejected | OPEN_NO_FLOW |  |
| NT | 54990 | Notification Setting Cancelled | OPEN_NO_FLOW |  |
| PQ | 58100 | Pending Treasury Circular (PP) Central Panel Contract Creation Submission | OPEN_NO_FLOW |  |
| PQ | 58105 | Pending Treasury Circular (PP) Central Panel Contract Creation Approval | OPEN_NO_FLOW |  |
| PQ | 58110 | Pending Treasury Circular (PP) Central Panel Contract Creation Revision | OPEN_NO_FLOW |  |
| PQ | 58115 | Pending Treasury Circular (PP) Central Panel Contract Creation Revision Approval | OPEN_NO_FLOW |  |
| PQ | 58120 | Treasury Circular (PP) Central Panel Contract Creation Cancelled | OPEN_NO_FLOW |  |
| PQ | 58125 | Treasury Circular (PP) Central Panel Contract Creation Approved | OPEN_NO_FLOW |  |
| PQ | 58130 | Treasury Circular (PP) Central Panel Contract Creation Rejected | OPEN_NO_FLOW |  |
| PQ | 58135 | Pending Treasury Circular (PP) Central Panel Contract Update Submission | OPEN_NO_FLOW |  |
| PQ | 58140 | Pending Treasury Circular (PP) Central Panel Contract Update Approval | OPEN_NO_FLOW |  |
| PQ | 58145 | Pending Treasury Circular (PP) Central Panel Contract Update Revision | OPEN_NO_FLOW |  |
| PQ | 58150 | Pending Treasury Circular (PP) Central Panel Contract Update Revision Approval | OPEN_NO_FLOW |  |
| PQ | 58155 | Treasury Circular (PP) Central Panel Contract Cancelled | OPEN_NO_FLOW |  |
| PQ | 58160 | Treasury Circular (PP) Central Panel Contract Update Approved | OPEN_NO_FLOW |  |
| PQ | 58165 | Treasury Circular (PP) Central Panel Contract Update Rejected | OPEN_NO_FLOW |  |
| PQ | 58170 | Pending Cancellation Treasury Circular (PP) Central Panel Contract Approval | OPEN_NO_FLOW |  |
| PQ | 58175 | Pending Cancellation Treasury Circular (PP) Central Panel Contract Revision | OPEN_NO_FLOW |  |
| PQ | 58180 | Pending Cancellation Treasury Circular (PP) Central Panel Contract Revision Approval | OPEN_NO_FLOW |  |
| PQ | 58185 | Cancellation Treasury Circular (PP) Central Panel Contract Approved | OPEN_NO_FLOW |  |
| PQ | 58190 | Cancellation Treasury Circular (PP) Central Panel Contract Rejected | OPEN_NO_FLOW |  |
| RA | 59100 | Pending Designation of Contract Administrator Submission | OPEN_NO_FLOW |  |
| RA | 59150 | Pending Designation of Contract Administrator Approval | OPEN_NO_FLOW |  |
| RA | 59300 | Contract Administrator Designation Application Approved | OPEN_NO_FLOW |  |
| RA | 59301 | Contract Administrator Designation Application completed | OPEN_NO_FLOW |  |
| RA | 59350 | Contract Administrator Designation Application Rejected | OPEN_NO_FLOW |  |
| RA | 59400 | Contract Administrator Designation Application Cancelled | OPEN_NO_FLOW |  |
| RC | 58600 | Pending Cancel Treasury Circular (PP) Submission | CANNOT_NEVER_USED |  |
| RC | 58650 | Pending Cancel Treasury Circular (PP) Approval | OPEN_NO_FLOW |  |
| RC | 58700 | Pending Cancel Treasury Circular (PP) Revision | OPEN_NO_FLOW |  |
| RC | 58750 | Pending Cancel Treasury Circular (PP) Revision Approval | OPEN_NO_FLOW |  |
| RC | 58800 | Cancel Treasury Circular (PP) Approved | OPEN_NO_FLOW |  |
| RC | 58850 | Cancel Treasury Circular (PP) Rejected | OPEN_NO_FLOW |  |
| RF | 55000 | Pending Factoring Submission | CANNOT_NEVER_USED |  |
| RF | 55050 | Pending Factoring Acknowledgement | OPEN_NO_FLOW |  |
| RF | 55060 | Factoring Acknowledgement Rejected | OPEN_NO_FLOW |  |
| RF | 55100 | Pending Factoring Approval | OPEN_NO_FLOW |  |
| RF | 55110 | Factoring Request Rejected | OPEN_NO_FLOW |  |
| RF | 55150 | Factoring Request Approved | OPEN_NO_FLOW |  |
| RF | 55160 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| SA | 57000 | Pending Draft Supplemental Agreement Creation | OPEN_NO_FLOW |  |
| SA | 57050 | Pending Draft Supplemental Agreement Approval | OPEN_NO_FLOW |  |
| SA | 57100 | Pending Draft Supplemental Agreement Revision | CANNOT_NEVER_USED |  |
| SA | 57150 | Pending Draft Supplemental Agreement Revision Approval | CANNOT_NEVER_USED |  |
| SA | 57250 | Pending Final Supplemental Agreement Update | OPEN_NO_FLOW |  |
| SA | 57300 | Pending Final Supplemental Agreement Approval | OPEN_NO_FLOW |  |
| SA | 57350 | Pending Final Supplemental Agreement Revision | CANNOT_NEVER_USED |  |
| SA | 57400 | Pending Final Supplemental Agreement Revision Approval | CANNOT_NEVER_USED |  |
| SA | 57600 | Supplemental Agreement Completed | OPEN_NO_FLOW |  |
| SA | 57700 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| SA | 57750 | Pending Supplemental Agreement Creation | RUN | CT260000000002328 |
| SA | 57800 | Pending Supplemental  Agreement Approval | OPEN_NO_FLOW |  |
| SA | 57850 | Pending Supplemental Agreement Revision | OPEN_NO_FLOW |  |
| SA | 57900 | Pending Supplemental Agreement Revision Approval | OPEN_NO_FLOW |  |
| SA | 57950 | Pending Draft Supplemental Agreement Creation Cancelled | OPEN_NO_FLOW |  |
| SA | 57955 | Pending Draft Supplemental Agreement Approval Cancelled | OPEN_NO_FLOW |  |
| SA | 57960 | Pending Draft Supplemental Agreement Revision Cancelled | CANNOT_NEVER_USED |  |
| SA | 57965 | Pending Draft Supplemental Agreement Revision Approval Cancelled | CANNOT_NEVER_USED |  |
| SA | 57970 | Pending Final Supplemental Agreement Update Cancelled | OPEN_NO_FLOW |  |
| SA | 57975 | Pending Final Supplemental Agreement Approval Cancelled | CANNOT_NEVER_USED |  |
| SA | 57980 | Pending Final Supplemental Agreement Revision | CANNOT_NEVER_USED |  |
| SA | 57985 | Pending Final Supplemental Agreement Revision Approval Cancelled | CANNOT_NEVER_USED |  |
| UF | 55800 | Pending Update Factoring Submission | CANNOT_NEVER_USED |  |
| UF | 55850 | Pending Update Factoring Acknowledgement | OPEN_NO_FLOW |  |
| UF | 55860 | Update Factoring Acknowledgement Rejected | OPEN_NO_FLOW |  |
| UF | 55870 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |
| UF | 55900 | Pending Update Factoring Approval | OPEN_NO_FLOW |  |
| UF | 55910 | Update Factoring Rejected | OPEN_NO_FLOW |  |
| UF | 55950 | Update Factoring Approved | OPEN_NO_FLOW |  |
| XA | 59110 | Pending Remove Designation of Contract Administrator Submission | OPEN_NO_FLOW |  |
| XA | 59160 | Pending Remove Designation of Contract Administrator Approval | OPEN_NO_FLOW |  |
| XA | 59310 | Contract Administrator Designation Cancellation Application completed | OPEN_NO_FLOW |  |
| XA | 59311 | Contract Administrator Designation Cancellation Approved | OPEN_NO_FLOW |  |
| XA | 59360 | Remove Designation of Contract Administrator Rejected | OPEN_NO_FLOW |  |
| XA | 59410 | Remove Designation of Contract Administrator Cancelled | OPEN_NO_FLOW |  |
| XF | 55200 | Pending Remove Factoring Submission | CANNOT_NEVER_USED |  |
| XF | 55250 | Pending Remove Factoring Acknowledgement | OPEN_NO_FLOW |  |
| XF | 55260 | Remove Factoring Acknowledgement Rejected | OPEN_NO_FLOW |  |
| XF | 55300 | Pending Remove Factoring Approval | OPEN_NO_FLOW |  |
| XF | 55310 | Remove Factoring Rejected | OPEN_NO_FLOW |  |
| XF | 55350 | Remove Factoring Approved | OPEN_NO_FLOW |  |
| XF | 55400 | Cancelled Due to Ministry Restructuring | OPEN_SYSTEM |  |

## FL

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| A59 | 49000 | Pending AP59 Decision | OPEN_SYSTEM |  |
| A59 | 49010 | Normal Payment | CANNOT_NEVER_USED |  |
| A59 | 49020 | Payment Via AP59 | OPEN_SYSTEM |  |
| CN | 45600 | Generated | OPEN_NO_FLOW |  |
| CN | 45900 | Cancelled | OPEN_NO_FLOW |  |
| CN | 45910 | Cancelled by Year End Process | OPEN_SYSTEM |  |
| CO | 41441 | Carry Forward | SIMULATED | CO260000000006653 |
| CO | 41500 | Pending Supplier Acknowledgement | RUN | CO260000000006664 |
| CO | 41505 | Pending Fulfilment | RUN | CO260000000006663 |
| CO | 41510 | Pending Partial Fulfilment | SIMULATED | CO260000000006653 |
| CO | 41515 | Pending Invoice | RUN | CO260000000006658 |
| CO | 41517 | Pending Revision (Invoice Cancellation) | SIMULATED | CO260000000006653 |
| CO | 41520 | Pending Debit Note Approval | SIMULATED | CO260000000006653 |
| CO | 41525 | Pending Payment Match | RUN | CO260000000006664 |
| CO | 41526 | Pending Payment Instruction Query from iGFMAS | RUN | CO260000000006658 |
| CO | 41527 | Pending Payment Instruction Query Verification | SIMULATED | CO260000000006653 |
| CO | 41530 | Pending Payment | RUN | CO260000000006658 |
| CO | 41535 | Closed | SIMULATED | CO260000000006653 |
| CO | 41540 | Complete for Payment Process | SIMULATED | CO260000000006653 |
| CO | 41600 | Awaiting iGFMAS Response | SIMULATED | CO260000000006653 |
| CO | 41630 | Pending Cancellation Submission | SIMULATED | CO260000000006653 |
| CO | 41640 | Pending AP59 Submission | SIMULATED | CO260000000006653 |
| CO | 41900 | Cancelled | SIMULATED | CO260000000006653 |
| CO | 41910 | Cancelled by Year End Process | SIMULATED | CO260000000006653 |
| CO | 41920 | Closed Due To AP59 | SIMULATED | CO260000000006653 |
| CO | 41930 | Closed - Manual Action By User | SIMULATED | CO260000000006653 |
| CO | 41931 | Closed/Manual Payment | SIMULATED | CO260000000006653 |
| CO | 41932 | Closed with manual payment at iGFMAS | SIMULATED | CO260000000006653 |
| CO | 41940 | Cancelled Due To Ministry Restructuring | SIMULATED | CO260000000006653 |
| CO | 41941 | Cancelled due to PTJ Code Changed | SIMULATED | CO260000000006653 |
| CR | 40500 | Pending Contract Request Creation | SIMULATED | CR260000000006054 |
| CR | 40501 | Pending MTO Creation | SIMULATED | CR260000000006054 |
| CR | 40510 | Pending Approval | RUN | CR260000000006053 |
| CR | 40515 | Pending Revision | SIMULATED | CR260000000006054 |
| CR | 40520 | Pending Revision Approval | SIMULATED | CR260000000006054 |
| CR | 40600 | Awaiting iGFMAS Response | RUN | CR260000000006066 |
| CR | 40610 | Pending CR Review from iGFMAS | RUN | CR260000000006066 |
| CR | 40620 | Pending Query Verification | SIMULATED | CR260000000006054 |
| CR | 40800 | Contract Request Approved | RUN | CR260000000006053 |
| CR | 40810 | Rejected | SIMULATED | CR260000000006054 |
| CR | 40900 | Cancelled | SIMULATED | CR260000000006054 |
| CR | 40910 | Cancelled by Year End Process | SIMULATED | CR260000000006054 |
| CR | 40911 | Closed Due To AP59 | SIMULATED | CR260000000006054 |
| CR | 40940 | Cancelled due to PID validity expired | SIMULATED | CR260000000006054 |
| CR | 40950 | Rejected due to PID validity expired | SIMULATED | CR260000000006054 |
| CR | 40960 | Cancelled Due to Ministry Restructuring | SIMULATED | CR260000000006054 |
| DN | 45000 | Pending Debit Note Approval | SIMULATED | DN260000000004802 |
| DN | 45100 | Awaiting iGFMAS Response | SIMULATED | DN260000000004802 |
| DN | 45300 | Approved | RUN | DN260000000004802 |
| DN | 45400 | Cancelled | SIMULATED | DN260000000004802 |
| DN | 45410 | Cancelled by Year End Process | SIMULATED | DN260000000004802 |
| DO | 42000 | Pending Acknowledgement | RUN | 01309H005M2600504 |
| DO | 42005 | Acknowledged | RUN | 01400K003S2600004 |
| DO | 42010 | Pending Modification Approval | RUN | 60000730212600002 |
| DO | 42015 | Pending Cancellation Approval | RUN | 60000730212600002 |
| DO | 42030 | Pending Cancellation Submission | SIMULATED | 01309H005M2600504 |
| DO | 42810 | Rejected | SIMULATED | 01309H005M2600504 |
| DO | 42900 | Cancelled | RUN | 60000730212600002 |
| DO | 42910 | Cancelled by Year End Process | SIMULATED | 01309H005M2600504 |
| DO | 42911 | Closed Due To AP59 | SIMULATED | 01309H005M2600504 |
| DO | 42912 | Cancelled Due To Ministry Restructuring | SIMULATED | 01309H005M2600504 |
| FC | 49110 | Pending Factoring Company Verification | CANNOT_UNMAPPED |  |
| FC | 49120 | Acknowledged | CANNOT_UNMAPPED |  |
| FC | 49130 | Rejected | CANNOT_UNMAPPED |  |
| FN | 43000 | Pending Acknowledgement | SIMULATED | FN260000000005812 |
| FN | 43002 | Pending Approval | RUN | FN260000000005812 |
| FN | 43004 | Pending Revision | SIMULATED | FN260000000005812 |
| FN | 43006 | Pending Revision Approval | SIMULATED | FN260000000005812 |
| FN | 43010 | Approved | RUN | FN260000000005811 |
| FN | 43020 | Pending Modification Submission | SIMULATED | FN260000000005812 |
| FN | 43030 | Pending Cancellation Submission | SIMULATED | FN260000000005812 |
| FN | 43100 | Awaiting iGFMAS Response | RUN | FN260000000005811 |
| FN | 43810 | Rejected | SIMULATED | FN260000000005812 |
| FN | 43900 | Cancelled | SIMULATED | FN260000000005812 |
| FN | 43910 | Cancelled by Year End Process | SIMULATED | FN260000000005812 |
| FN | 43911 | Closed Due To AP59 | SIMULATED | FN260000000005812 |
| FN | 43912 | Cancelled Due To Ministry Restructuring | SIMULATED | FN260000000005812 |
| IN | 44000 | Pending Invoice Creation | OPEN_NO_FLOW |  |
| IN | 44005 | Submitted | RUN | 01400K003S2600003 |
| IN | 44010 | Pending Cancellation Approval | RUN | 01400K003S2600003 |
| IN | 44015 | Pending Modification Approval | RUN | 01400K003S2600003 |
| IN | 44017 | Pending Revision (Invoice Cancellation) | OPEN_NO_FLOW |  |
| IN | 44100 | Awaiting iGFMAS Response | OPEN_SYSTEM |  |
| IN | 44130 | Pending Cancellation Submission | OPEN_NO_FLOW |  |
| IN | 44900 | Cancelled | RUN | 01400K003S2600003 |
| IN | 44910 | Closed Due To AP59 | OPEN_SYSTEM |  |
| IN | 44911 | Cancelled by Year End Process | OPEN_SYSTEM |  |
| PA | 46000 | Pending Payment Match | OPEN_FLOW_EXISTS |  |
| PA | 46001 | Pending Payment Instruction Query from iGFMAS | RUN | PA260000000006413 |
| PA | 46002 | Pending Payment Instruction Query Verification | OPEN_FLOW_EXISTS |  |
| PA | 46003 | Pending Revision (Invoice Cancellation) | SIMULATED | PA260000000006414 |
| PA | 46005 | Payment Instruction Completed | RUN | PA260000000006413 |
| PA | 46100 | Awaiting iGFMAS Response | RUN | PA260000000006421 |
| PA | 46900 | Cancelled | SIMULATED | PA260000000006414 |
| PA | 46910 | Cancelled by Year End Process | SIMULATED | PA260000000006414 |
| PA | 46913 | Closed with manual payment at iGFMAS | SIMULATED | PA260000000006414 |
| PO | 41000 | Pending Supplier Acknowledgement | RUN | PO260000000007216 |
| PO | 41002 | Pending Rejection Acknowledgement | SIMULATED | PO260000000007218 |
| PO | 41005 | Pending Fulfilment | RUN | PO260000000007217 |
| PO | 41010 | Pending Partial Fulfilment | RUN | PO260000000007216 |
| PO | 41015 | Pending Invoice | RUN | PO260000000007216 |
| PO | 41017 | Pending Revision (Invoice Cancellation) | SIMULATED | PO260000000007218 |
| PO | 41020 | Pending Debit Note Approval | SIMULATED | PO260000000007218 |
| PO | 41025 | Pending Payment Match | RUN | PO260000000007216 |
| PO | 41026 | Pending Payment Instruction Query from iGFMAS | RUN | PO260000000007216 |
| PO | 41027 | Pending Payment Instruction Query Verification | SIMULATED | PO260000000007218 |
| PO | 41030 | Pending Payment | RUN | PO260000000007216 |
| PO | 41035 | Closed | SIMULATED | PO260000000007218 |
| PO | 41040 | Complete for Payment Process | SIMULATED | PO260000000007218 |
| PO | 41100 | Awaiting iGFMAS Response | SIMULATED | PO260000000007218 |
| PO | 41130 | Pending Cancellation Submission | SIMULATED | PO260000000007218 |
| PO | 41310 | Rejected | SIMULATED | PO260000000007218 |
| PO | 41400 | Cancelled | SIMULATED | PO260000000007218 |
| PO | 41410 | Cancelled by Year End Process | SIMULATED | PO260000000007218 |
| PO | 41420 | Closed - Manual Action By User | SIMULATED | PO260000000007218 |
| PO | 41421 | Closed/Manual Payment | SIMULATED | PO260000000007218 |
| PO | 41422 | Closed with manual payment at iGFMAS | SIMULATED | PO260000000007218 |
| PO | 41430 | Cancelled by System | SIMULATED | PO260000000007218 |
| PO | 41440 | Cancelled Due To Ministry Restructuring | SIMULATED | PO260000000007218 |
| PO | 41442 | Cancelled due to PTJ Code Changed | SIMULATED | PO260000000007218 |
| PO | 96708 | Both | SIMULATED | PO260000000007218 |
| PR | 40000 | Pending Purchase Request Creation | RUN | PR260000000005073 |
| PR | 40010 | Pending Approval | RUN | PR260000000005072 |
| PR | 40015 | Pending Revision | SIMULATED | PR260000000005074 |
| PR | 40020 | Pending Revision Approval | SIMULATED | PR260000000005074 |
| PR | 40100 | Awaiting iGFMAS Response | RUN | PR260000000005075 |
| PR | 40110 | Pending PR Review from iGFMAS | RUN | PR260000000005076 |
| PR | 40120 | Pending Query Verification | SIMULATED | PR260000000005074 |
| PR | 40300 | Purchase Request Approved | RUN | PR260000000005073 |
| PR | 40310 | Rejected | SIMULATED | PR260000000005074 |
| PR | 40400 | Cancelled | SIMULATED | PR260000000005074 |
| PR | 40401 | Cancelled due to Simple Quote validity period is expired (60 days). | SIMULATED | PR260000000005074 |
| PR | 40402 | Rejected due to Simple Quote validity period is expired (60 days). | SIMULATED | PR260000000005074 |
| PR | 40410 | Cancelled by Year End Process | SIMULATED | PR260000000005074 |
| PR | 40430 | Cancelled by System | SIMULATED | PR260000000005074 |
| PR | 40440 | Cancelled due to Purchase in Default validity period is expired (60 days). | SIMULATED | PR260000000005074 |
| PR | 40450 | Rejected due to Purchase in Default validity period is expired (60 days). | SIMULATED | PR260000000005074 |
| PR | 40460 | Cancelled Due To Ministry Restructuring | SIMULATED | PR260000000005074 |
| PY | 49300 | Pending Supplier Acknowledgement | CANNOT_NEVER_USED |  |
| PY | 49301 | Pending Invoice | CANNOT_NEVER_USED |  |
| PY | 49302 | Pending Fulfillment | CANNOT_NEVER_USED |  |
| PY | 49303 | Pending Partial Fulfillment | CANNOT_NEVER_USED |  |
| PY | 49304 | Pending Debit Note Approval | CANNOT_NEVER_USED |  |
| PY | 49305 | Pending Payment Match | CANNOT_NEVER_USED |  |
| PY | 49312 | Pending Payment Instruction Query Verification | CANNOT_NEVER_USED |  |
| PY | 49313 | Pending Revision (Invoice Cancellation) | CANNOT_NEVER_USED |  |
| RS | 49210 | Approved | CANNOT_NEVER_USED |  |
| RS | 49220 | Cancelled | CANNOT_NEVER_USED |  |
| RS | 49221 | Closed Due To AP59 | OPEN_SYSTEM |  |
| SD | 47000 | Pending Submission | SIMULATED | SD260000000002802 |
| SD | 47005 | Pending Approval | RUN | SD260000000002802 |
| SD | 47100 | Awaiting iGFMAS Response | SIMULATED | SD260000000002802 |
| SD | 47800 | Approved | RUN | SD260000000002802 |
| SD | 47810 | Rejected | SIMULATED | SD260000000002802 |
| SD | 47900 | Cancelled | SIMULATED | SD260000000002802 |
| SD | 47910 | Cancelled by Year End Process | SIMULATED | SD260000000002802 |
| SD | 47911 | Closed Due To AP59 | SIMULATED | SD260000000002802 |
| SI | 48000 | Pending Shipping Instruction Creation | CANNOT_NEVER_USED |  |
| SI | 48005 | Pending Approval | CANNOT_NEVER_USED |  |
| SI | 48010 | Pending Revision | CANNOT_NEVER_USED |  |
| SI | 48015 | Pending Revision Approval | CANNOT_NEVER_USED |  |
| SI | 48800 | Approved | CANNOT_NEVER_USED |  |
| SI | 48810 | Rejected | CANNOT_NEVER_USED |  |
| SI | 48900 | Cancelled | CANNOT_NEVER_USED |  |
| SI | 48911 | Closed Due To AP59 | OPEN_SYSTEM |  |

## PM

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| CP | 75005 | Pending Approval | RUN | AP261124000001579 |
| MR | 75000 | Pending Approval | RUN | AP261125000001580 |

## PP

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| PE | 30006 | Pending Submission | OPEN_NO_FLOW |  |
| PE | 30007 | Pending Approval | OPEN_NO_FLOW |  |
| PE | 30008 | Pending Revision | OPEN_NO_FLOW |  |
| PE | 30009 | Approved | OPEN_NO_FLOW |  |
| PE | 30012 | Pending Revision Approval | OPEN_NO_FLOW |  |
| PE | 30014 | Cancelled | OPEN_NO_FLOW |  |
| PP | 30001 | Pending Submission | OPEN_NO_FLOW |  |
| PP | 30002 | Pending Verification | OPEN_NO_FLOW |  |
| PP | 30003 | Pending Approval | OPEN_NO_FLOW |  |
| PP | 30004 | Pending Revision | OPEN_NO_FLOW |  |
| PP | 30005 | Approved | OPEN_NO_FLOW |  |
| PP | 30010 | Pending Revision Verification | OPEN_NO_FLOW |  |
| PP | 30011 | Pending Revision Approval | OPEN_NO_FLOW |  |
| PP | 30013 | Cancelled | OPEN_NO_FLOW |  |

## SC

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| A1 | 62600 | Pending Submission | CANNOT_NEVER_USED |  |
| A2 | 62601 | Completed | CANNOT_NEVER_USED |  |
| BD | 63350 | Pending Online Bidding | CANNOT_NEVER_USED |  |
| BD | 63351 | Online Bidding Started | CANNOT_NEVER_USED |  |
| BD | 63352 | Online Bidding Completed | CANNOT_NEVER_USED |  |
| BD | 63353 | Online Bidding Paused | CANNOT_NEVER_USED |  |
| BD | 63354 | Online Bidding Cancelled | CANNOT_NEVER_USED |  |
| BD | 63355 | Pending Reschedule Bidding | CANNOT_NEVER_USED |  |
| BD | 63357 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | OPEN_SYSTEM |  |
| BGT | 60100 | Pending Approval | CANNOT_NEVER_USED |  |
| BGT | 60101 | Approved | CANNOT_NEVER_USED |  |
| BGT | 60102 | Rejected | CANNOT_NEVER_USED |  |
| BGT | 60103 | Pending Revision | CANNOT_NEVER_USED |  |
| BPK | 60150 | Pending BPK Approval | RUN | QT260000000004536 |
| BPK | 60151 | BPK Approval Approved | RUN | QT260000000004524 |
| BPK | 60152 | BPK Approval Rejected | SIMULATED | QT260000000004524 |
| BPK | 60153 | Pending Document Revision (BPK) | RUN | QT260000000004537 |
| BPK | 60154 | Pending BPK Revision Approval | SIMULATED | QT260000000004524 |
| BPK | 60157 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | QT260000000004524 |
| BSA | 63500 | Pending Additional BSV Attendance Approval | CANNOT_UNMAPPED |  |
| BSA | 63501 | Additional BSV Attendance Approved | CANNOT_NEVER_USED |  |
| BSA | 63502 | Additional BSV Attendance Rejected | CANNOT_NEVER_USED |  |
| BSA | 63503 | Pending Briefing/Site Visit Update Approval | CANNOT_UNMAPPED |  |
| BSV | 60550 | Pending | CANNOT_NEVER_USED |  |
| BSV | 60551 | Completed | CANNOT_NEVER_USED |  |
| BSV | 60552 | Cancel | CANNOT_NEVER_USED |  |
| BSV | 60553 | Postpone | CANNOT_NEVER_USED |  |
| BSV | 60554 | Request Rejected | CANNOT_NEVER_USED |  |
| CMT | 60200 | Pending Committee Formation Submission | RUN | QT260000000004539 |
| CMT | 60201 | Pending Committee Formation Approval | RUN | QT260000000004536 |
| CMT | 60202 | Committee Formation Completed | RUN | QT260000000004536 |
| CMT | 60203 | Pending Committee Formation Revision | SIMULATED | QT260000000004524 |
| CMT | 60204 | Pending Committee Formation Revision Approval | SIMULATED | QT260000000004524 |
| CMT | 60205 | Pending Appoint Finalization Committee Secretary | RUN | QT260000000004539 |
| CMT | 60206 | Pending Finalization Committee Formation | SIMULATED | QT260000000004524 |
| CMT | 60207 | Cancel Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| CMT | 60208 | Proceed Manual Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| CMT | 60209 | Proceed Manual Due To PTJ Code Changed | SIMULATED | QT260000000004524 |
| CMT | 60210 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | QT260000000004524 |
| CMT | 60211 | Pending Jawatankuasa Perolehan Kerajaan di Peringkat Perbendaharaan Malaysia Decision | SIMULATED | QT260000000004524 |
| CMT | 60212 | Pending Committee Formation Update Approval | SIMULATED | QT260000000004524 |
| CMT | 60213 | Pending Committee Formation Update (Revision) | SIMULATED | QT260000000004524 |
| CMT | 60214 | Pending Committee Formation Update Approval (Revision) | SIMULATED | QT260000000004524 |
| DAR | 63557 | Pending Desk Officer Assistant Update Approval | OPEN_NO_FLOW |  |
| DAR | 63558 | Desk Officer Assistant Update Approval Completed | OPEN_NO_FLOW |  |
| DAR | 63559 | Desk Officer Assistant Update Rejected | OPEN_NO_FLOW |  |
| DAR | 63560 | Pending Desk Officer Assistant Update (Revision) | OPEN_NO_FLOW |  |
| DAR | 63561 | Pending Desk Officer Assistant Update Approval (Revision) | OPEN_NO_FLOW |  |
| DAR | 63562 | Desk Officer Assistant's update is cancelled. | CANNOT_NEVER_USED |  |
| EC | 62050 | Pending Confirmation Evaluation Committee | OPEN_NO_FLOW |  |
| EC | 62051 | Pending Document Compliance and Proposal Evaluation | OPEN_NO_FLOW |  |
| EC | 62053 | Pending Proposal Evaluation Endorsement | OPEN_NO_FLOW |  |
| EC | 62054 | Pending Proposal Evaluation Sign Off | OPEN_NO_FLOW |  |
| EC | 62055 | Proposal Evaluation Completed | OPEN_NO_FLOW |  |
| EC | 62058 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | OPEN_SYSTEM |  |
| EC | 62059 | Pending Document Compliance and Proposal Evaluation (Revision) | OPEN_NO_FLOW |  |
| EPV | 60350 | Pending Approval | OPEN_NO_FLOW |  |
| EPV | 60351 | Approved | OPEN_NO_FLOW |  |
| EPV | 60352 | Rejected | OPEN_NO_FLOW |  |
| EPV | 60353 | Pending Supplier Acceptance | OPEN_NO_FLOW |  |
| EPV | 60354 | Accepted | OPEN_NO_FLOW |  |
| EPV | 60355 | Cancel Due To Ministry Restructuring | OPEN_SYSTEM |  |
| EPV | 60356 | Proceed Manual Due To Ministry Restructuring | OPEN_SYSTEM |  |
| EPV | 60357 | Revised | CANNOT_NEVER_USED |  |
| FEC | 62150 | Pending Confirmation Financial Evaluation Committee | RUN | QT260000000004539 |
| FEC | 62151 | Pending Financial Proposal Evaluation | RUN | QT260000000004539 |
| FEC | 62152 | Pending Financial Proposal Evaluation Endorsement | RUN | QT260000000004539 |
| FEC | 62153 | Pending Financial Proposal Evaluation Sign Off | RUN | QT260000000004539 |
| FEC | 62154 | Financial Proposal Evaluation Completed | RUN | QT260000000004524 |
| FEC | 62155 | Cancel Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| FEC | 62157 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | QT260000000004524 |
| FEC | 62158 | Pending Financial Proposal Evaluation (Revision) | SIMULATED | QT260000000004524 |
| LA | 62500 | Pending Letter Of Acceptance Submission | RUN | LA260000000004240 |
| LA | 62501 | Pending Letter Of Acceptance Approval | SIMULATED | LA260000000004238 |
| LA | 62502 | Pending Letter of Acceptance Revision | SIMULATED | LA260000000004238 |
| LA | 62504 | Pending Acknowledgement Receipt's Letter Of Acceptance | RUN | LA260000000004228 |
| LA | 62505 | Pending Verification of Acknowledgement Receipt's Letter Of Acceptance | RUN | LA260000000004228 |
| LA | 62506 | Letter of Acceptance Completed | RUN | LA260000000004226 |
| LA | 62507 | Letter of Acceptance Rejected | SIMULATED | LA260000000004238 |
| LA | 62508 | Pending Letter of Acceptance Revision Approval | SIMULATED | LA260000000004238 |
| LA | 62509 | Cancelled | RUN | LA260000000004227 |
| LA | 62510 | Cancel Due To Ministry Restructuring | SIMULATED | LA260000000004238 |
| LA | 62511 | Proceed Manual Due To Ministry Restructuring | SIMULATED | LA260000000004238 |
| LA | 62514 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | LA260000000004238 |
| LA | 62515 | Rejected due to Simple Quote validity period is expired (60 days). | SIMULATED | LA260000000004238 |
| LA | 62516 | Cancelled due to Simple Quote validity period is expired (60 days). | SIMULATED | LA260000000004238 |
| LA | 62517 | Cancelled (Not agree with extension validity period) | SIMULATED | LA260000000004238 |
| LA | 62520 | Pending Acknowledgement Receipt's Letter Of Acceptance (Supplier Action) | SIMULATED | LA260000000004238 |
| LA | 62521 | Pending Cancellation Letter of Acceptance | SIMULATED | LA260000000004238 |
| LA | 62522 | Letter of Acceptance Cancellation Approved | SIMULATED | LA260000000004238 |
| LA | 62523 | Letter of Acceptance Cancellation Rejected | SIMULATED | LA260000000004238 |
| LA | 62602 | Letter of Acceptance Verified | SIMULATED | LA260000000004238 |
| LA | 62604 | QT Cancellation Request From User Approved By BPK,MoF | SIMULATED | LA260000000004238 |
| LA | 62605 | Quotation/Tender Closed by Agency Due To Validity Period Expired/Special Approval | SIMULATED | LA260000000004238 |
| LI | 62400 | Pending Letter Of Intent Submission | RUN | LI260000000000781 |
| LI | 62401 | Pending Letter Of Intent Approval | RUN | LI260000000000781 |
| LI | 62402 | Pending Letter Of Intent Revision | OPEN_NO_FLOW |  |
| LI | 62403 | Pending Supplier Acknowledgement | RUN | LI260000000000781 |
| LI | 62404 | Pending Letter Of Intent Negotiation | RUN | LI260000000000781 |
| LI | 62405 | Letter Of Intent Completed | RUN | LI260000000000781 |
| LI | 62406 | Letter of Intent Rejected | OPEN_NO_FLOW |  |
| LI | 62407 | Pending Letter Of Intent Revision Approval | OPEN_NO_FLOW |  |
| LI | 62408 | Cancelled | OPEN_NO_FLOW |  |
| LI | 62409 | Proceed Manual Due To Ministry Restructuring | OPEN_SYSTEM |  |
| LI | 62411 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | OPEN_SYSTEM |  |
| LI | 62412 | QT Cancellation Request From User Approved By BPK,MoF | CANNOT_NEVER_USED |  |
| LI | 62413 | Quotation/Tender Closed by Agency Due To Validity Period Expired/Special Approval | OPEN_SYSTEM |  |
| LI | 62414 | Cancelled (Not agree with extension validity period) | OPEN_SYSTEM |  |
| MS | 62650 | Pending | CANNOT_NEVER_USED |  |
| MS | 62651 | Cancelled | CANNOT_NEVER_USED |  |
| MS | 62652 | Done | CANNOT_NEVER_USED |  |
| MS | 62653 | Postpone | CANNOT_NEVER_USED |  |
| OC | 62000 | Pending Confirmation Opening Committee | RUN | QT260000000004539 |
| OC | 62001 | Pending Compliance Verification | RUN | QT260000000004539 |
| OC | 62002 | Pending Compliance Verification Endorsement | RUN | QT260000000004539 |
| OC | 62003 | Pending Compliance Verification Sign Off | RUN | QT260000000004539 |
| OC | 62004 | Compliance Verification Completed | RUN | QT260000000004524 |
| OC | 62005 | Cancel Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| OC | 62007 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | QT260000000004524 |
| OC | 62008 | Pending Compliance Verification (Revision) | SIMULATED | QT260000000004524 |
| PCB | 60250 | Pending Procurement Board Approval | OPEN_NO_FLOW |  |
| PCB | 60251 | Procurement Board Approval Approved | OPEN_NO_FLOW |  |
| PCB | 60252 | Procurement Board Approval Rejected | CANNOT_NEVER_USED |  |
| PCB | 60253 | Pending Procurement Board Revision | OPEN_NO_FLOW |  |
| PCB | 60254 | Pending Supplier Acceptance | CANNOT_NEVER_USED |  |
| PCB | 60255 | Pending Procurement Board Revision Approval | CANNOT_NEVER_USED |  |
| PCB | 60256 | Accepted | CANNOT_NEVER_USED |  |
| PCB | 60257 | Cancel Due To Ministry Restructuring | OPEN_SYSTEM |  |
| PD | 60800 | Pending Submission | OPEN_NO_FLOW |  |
| PD | 60801 | Pending Verification | OPEN_NO_FLOW |  |
| PD | 60802 | Pending Approval | OPEN_NO_FLOW |  |
| PD | 60803 | Pending Request Note Creation | OPEN_NO_FLOW |  |
| PD | 60804 | Completed | OPEN_NO_FLOW |  |
| PD | 60805 | Rejected | OPEN_NO_FLOW |  |
| PD | 60806 | Pending Simple Quote Creation | OPEN_NO_FLOW |  |
| PD | 60807 | Purchase in Default Validity Period Expired | OPEN_SYSTEM |  |
| PD | 60808 | Cancel Due To Ministry Restructuring | OPEN_SYSTEM |  |
| PD | 60810 | Pending Supplier Response for Request to Reduce Minimum Order Quantity | OPEN_NO_FLOW |  |
| PD | 60811 | Pending Verification of Supplier Response | OPEN_NO_FLOW |  |
| PD | 60812 | Pending Revision | OPEN_NO_FLOW |  |
| PD | 60813 | Pending Revision Verification | OPEN_NO_FLOW |  |
| PD | 60814 | Pending Revision Approval | OPEN_NO_FLOW |  |
| PD | 60815 | Cancelled | OPEN_NO_FLOW |  |
| PI | 60750 | Pending Submission | SIMULATED | PI260000000000804 |
| PI | 60751 | Pending Supplier Response | RUN | PI260000000000804 |
| PI | 60752 | Pending Request Note Creation | SIMULATED | PI260000000000804 |
| PI | 60753 | Completed | RUN | PI260000000000804 |
| PI | 60754 | Cancelled | SIMULATED | PI260000000000804 |
| PI | 60755 | Expired | SIMULATED | PI260000000000804 |
| PI | 60756 | Cancel Due To Ministry Restructuring | SIMULATED | PI260000000000804 |
| PR | 61600 | Pending | CANNOT_NEVER_USED |  |
| PR | 61601 | Completed | CANNOT_NEVER_USED |  |
| PTJ | 60300 | Pending Approval | OPEN_NO_FLOW |  |
| PTJ | 60301 | Approved | OPEN_NO_FLOW |  |
| PTJ | 60302 | Rejected | OPEN_NO_FLOW |  |
| PTJ | 60303 | Pending Revision | CANNOT_NEVER_USED |  |
| PTJ | 60304 | Cancel Due To Ministry Restructuring | OPEN_SYSTEM |  |
| QC | 12340 | Rejected: Test Only | CANNOT_NEVER_USED |  |
| QC | 12341 | Approved: Test Only | OPEN_NO_FLOW |  |
| QC | 12342 | Pending: Test Only | OPEN_NO_FLOW |  |
| QC | 63450 | Pending Cancellation | OPEN_NO_FLOW |  |
| QC | 63451 | Cancelation Rejected | OPEN_NO_FLOW |  |
| QC | 63452 | Cancellation Approved | OPEN_NO_FLOW |  |
| QC | 63453 | Cancel Due To Ministry Restructuring | OPEN_SYSTEM |  |
| QC | 63454 | Proceed Manual Due To Ministry Restructuring | OPEN_SYSTEM |  |
| QDR | 63460 | Pending Desk Officer Maintenance Approval | OPEN_NO_FLOW |  |
| QDR | 63461 | Desk Officer Maintenance Approved | OPEN_NO_FLOW |  |
| QDR | 63462 | Desk Officer Maintenance Rejected | OPEN_NO_FLOW |  |
| QDR | 63463 | Cancel Due To Ministry Restructuring | OPEN_SYSTEM |  |
| QDR | 63464 | Proceed Manual Due To Ministry Restructuring | OPEN_SYSTEM |  |
| QT | 60002 | Pending Quotation / Tender Submission | RUN | QT260000000004537 |
| QT | 60003 | Pending Specification Preparation | RUN | QT260000000004524 |
| QT | 60004 | Pending Document Preparation | RUN | QT260000000004524 |
| QT | 60005 | Pending Document Approval for Publication | RUN | QT260000000004524 |
| QT | 60006 | Pending Document Revision | RUN | QT260000000004538 |
| QT | 60007 | Pending Notice Publishing | RUN | QT260000000004524 |
| QT | 60008 | Pending Briefing / Site Visit Registration | SIMULATED | QT260000000004524 |
| QT | 60009 | Pending Proposal Preparation | RUN | QT260000000004539 |
| QT | 60010 | Pending Proposal Evaluation | RUN | QT260000000004539 |
| QT | 60011 | Pending Supplier Finalization | RUN | QT260000000004539 |
| QT | 60012 | Pending Letter of Intent Preparation | RUN | QT260000000004539 |
| QT | 60013 | Pending Letter of Acceptance Preparation | RUN | QT260000000004539 |
| QT | 60014 | Awarded | RUN | QT260000000004539 |
| QT | 60015 | Cancelled | SIMULATED | QT260000000004524 |
| QT | 60016 | Pending Proposal Re-Evaluation | SIMULATED | QT260000000004524 |
| QT | 60017 | Re-Finalization | SIMULATED | QT260000000004524 |
| QT | 60018 | Cancelled Due To Migration | SIMULATED | QT260000000004524 |
| QT | 60022 | Quotation / Tender Closed | RUN | QT260000000004524 |
| QT | 60023 | Pending Recommendation | RUN | QT260000000004539 |
| QT | 60024 | Pending Quotation / Tender Approval | RUN | QT260000000004536 |
| QT | 60025 | Pending Specification Endorsement | RUN | QT260000000004536 |
| QT | 60026 | Pending Specification Sign Off | RUN | QT260000000004524 |
| QT | 60027 | Pending Specification Preparation (Revision) | SIMULATED | QT260000000004524 |
| QT | 60028 | Pending Specification Approval | SIMULATED | QT260000000004524 |
| QT | 60029 | Pending Procurement Board Approval | SIMULATED | QT260000000004524 |
| QT | 60030 | Pending BPK Approval | RUN | QT260000000004524 |
| QT | 60031 | Pending Reschedule | SIMULATED | QT260000000004524 |
| QT | 60032 | Archived | SIMULATED | QT260000000004524 |
| QT | 60033 | Pending Reform New Committee | SIMULATED | QT260000000004524 |
| QT | 60034 | Pending Specification Committee Chairperson Sign Off | SIMULATED | QT260000000004524 |
| QT | 60035 | Pending Reschedule Publication | SIMULATED | QT260000000004524 |
| QT | 60036 | Pending Reschedule Proposal Closing Date | SIMULATED | QT260000000004524 |
| QT | 60037 | Pending Specification Revision Approval | SIMULATED | QT260000000004524 |
| QT | 60038 | Pending Document Revision Approval | SIMULATED | QT260000000004524 |
| QT | 60039 | Pending Document Revision | SIMULATED | QT260000000004524 |
| QT | 60040 | Pending Specification Changes Endorsement | SIMULATED | QT260000000004524 |
| QT | 60041 | Cancel Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| QT | 60042 | Proceed Manual Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| QT | 60043 | Cancelled due to PTJ Code Changed | SIMULATED | QT260000000004524 |
| QT | 60044 | Proceed Manual Due To PTJ Code Changed | SIMULATED | QT260000000004524 |
| QT | 60045 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | QT260000000004524 |
| QT | 60046 | QT Cancellation Request From User Approved By BPK,MoF | SIMULATED | QT260000000004524 |
| QT | 60047 | Quotation/Tender Closed by Agency Due To Validity Period Expired/Special Approval | SIMULATED | QT260000000004524 |
| QT | 60048 | Pending Jawatankuasa Perolehan Kerajaan di Peringkat Perbendaharaan Malaysia Decision | SIMULATED | QT260000000004524 |
| QT | 60049 | Pending Recommendation (Revise Briefing Paper) | SIMULATED | QT260000000004524 |
| QT | 60051 | Pending Document Approval for Publication (Reschedule) | SIMULATED | QT260000000004524 |
| QT | 60052 | Pending Presentation/Demonstration Invitation | SIMULATED | QT260000000004524 |
| QT | 60053 | Cancelled Due To No Supplier Passed Technical Evaluation And Qualified For Presentation/Demonstration | SIMULATED | QT260000000004524 |
| QT | 60054 | Cancelled due to New CPTPP Regulations | SIMULATED | QT260000000004524 |
| QT | 60055 | Pending Quotation / Tender Submission | SIMULATED | QT260000000004524 |
| QT | 60056 | Pending Request Review from eGPA | SIMULATED | QT260000000004524 |
| QT | 60057 | Pending Reschedule (eGPA) | SIMULATED | QT260000000004524 |
| QTA | 63400 | Prepare | CANNOT_NEVER_USED |  |
| QTA | 63401 | Pending Approval | CANNOT_NEVER_USED |  |
| QTA | 63402 | Completed | CANNOT_NEVER_USED |  |
| RN | 60700 | Pending Submission | SIMULATED | RN260000000004918 |
| RN | 60701 | Pending Approval | RUN | RN260000000004927 |
| RN | 60702 | Pending Revision | SIMULATED | RN260000000004918 |
| RN | 60703 | Completed | RUN | RN260000000004927 |
| RN | 60704 | Cancelled | SIMULATED | RN260000000004918 |
| RN | 60705 | Rejected | SIMULATED | RN260000000004918 |
| RN | 60706 | Cancelled due to Purchase in Default validity period is expired (60 days). | SIMULATED | RN260000000004918 |
| RN | 60707 | Pending Revision Approval | SIMULATED | RN260000000004918 |
| RN | 60708 | Pending Assign Item Code | RUN | RN260000000004925 |
| RN | 60709 | Cancel Due To Ministry Restructuring | SIMULATED | RN260000000004918 |
| RN | 60710 | Cancelled due to Simple Quote validity period is expired (60 days). | SIMULATED | RN260000000004918 |
| RN | 60711 | Rejected due to Simple Quote validity period is expired (60 days). | SIMULATED | RN260000000004918 |
| RN | 60715 | Rejected due to Purchase in Default validity period is expired (60 days). | SIMULATED | RN260000000004918 |
| RN | 62603 | Request Note Approved | SIMULATED | RN260000000004918 |
| SE | 63550 | Pending Specification Preparation | OPEN_NO_FLOW |  |
| SE | 63551 | Pending Specification Endorsement | OPEN_NO_FLOW |  |
| SE | 63552 | Pending Specification Sign Off | OPEN_NO_FLOW |  |
| SE | 63553 | Pending Specification Preparation (Revision) | OPEN_NO_FLOW |  |
| SE | 63554 | Completed | OPEN_NO_FLOW |  |
| SE | 63556 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | OPEN_SYSTEM |  |
| SF | 62200 | Pending Confirmation Finalization Committee | RUN | QT260000000004524 |
| SF | 62201 | Pending Supplier Finalization Decision | RUN | QT260000000004524 |
| SF | 62202 | Pending Escalation to BPK | OPEN_NO_FLOW |  |
| SF | 62203 | Supplier Finalization Completed | RUN | QT260000000004524 |
| SF | 62204 | Pending Bidding Coordination | OPEN_NO_FLOW |  |
| SF | 62205 | Pending Bidding | OPEN_NO_FLOW |  |
| SF | 62206 | Pending Bidding Escalation | OPEN_NO_FLOW |  |
| SF | 62207 | Pending Confirmation Finalization Committee After Bidding | OPEN_NO_FLOW |  |
| SF | 62208 | Pending Supplier Finalization After Bidding | OPEN_NO_FLOW |  |
| SF | 62209 | Pending Multiple LOI Recommendation | OPEN_NO_FLOW |  |
| SF | 62210 | Pending Supplier Finalization Endorsement | RUN | QT260000000004524 |
| SF | 62211 | Pending Supplier Finalization Sign Off | RUN | QT260000000004539 |
| SF | 62213 | Pending LOI Preparation / Acknowledgement or Negotiation | RUN | QT260000000004539 |
| SF | 62214 | Proceed Manual Due To Ministry Restructuring | OPEN_SYSTEM |  |
| SF | 62215 | Proceed Manual Due To PTJ Code Changed | CANNOT_NEVER_USED |  |
| SF | 62216 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | OPEN_SYSTEM |  |
| SF | 62217 | Pending Confirmation Finalization Committee (Reverse LOI Status) | OPEN_NO_FLOW |  |
| SF | 62218 | Supplier Finalization Preparation (Reverse LOI Status) | OPEN_NO_FLOW |  |
| SF | 62219 | Pending Supplier Finalization Endorsement (Reverse LOI Status) | CANNOT_NEVER_USED |  |
| SF | 62220 | Pending Supplier Finalization Sign Off (Reverse LOI Status) | CANNOT_NEVER_USED |  |
| SF | 62221 | Pending Confirmation Finalization Committee (Reverse LOA Status) | OPEN_NO_FLOW |  |
| SF | 62222 | Supplier Finalization Preparation (Reverse LOA Status) | OPEN_NO_FLOW |  |
| SF | 62223 | Pending Supplier Finalization Endorsement (Reverse LOA Status) | CANNOT_NEVER_USED |  |
| SF | 62224 | Pending Supplier Finalization Sign Off (Reverse LOA Status) | CANNOT_NEVER_USED |  |
| SF | 62225 | Letter of Intent Cancelled (Reverse LOI) | CANNOT_NEVER_USED |  |
| SF | 62226 | Letter of Acceptance Cancelled (Reverse LOA) | CANNOT_NEVER_USED |  |
| SF | 62227 | Pending Letter of Acceptance Acknowledgement (Supplier Action) | CANNOT_NEVER_USED |  |
| SF | 62228 | Pending Jawatankuasa Perolehan Kerajaan di Peringkat Perbendaharaan Malaysia Decision | OPEN_NO_FLOW |  |
| SF | 62229 | Pending Supplier Finalization Decision (Revision) | OPEN_NO_FLOW |  |
| SF | 62230 | Pending Supplier Finalization After Bidding (Revision) | OPEN_NO_FLOW |  |
| SF | 62231 | Pending Multiple LOI Recommendation (Revision) | OPEN_NO_FLOW |  |
| SF | 62233 | Pending Jawatankuasa Perolehan Kerajaan di Peringkat Perbendaharaan Malaysia Decision After Bidding | OPEN_NO_FLOW |  |
| SQ | 60850 | Pending Submission | SIMULATED | SQ260000000002371 |
| SQ | 60851 | Pending Supplier Response | RUN | SQ260000000002365 |
| SQ | 60852 | Pending Request Note Creation | RUN | SQ260000000002365 |
| SQ | 60853 | Completed | RUN | SQ260000000002363 |
| SQ | 60854 | Cancelled | SIMULATED | SQ260000000002371 |
| SQ | 60855 | Cancelled due to Purchase in Default validity period is expired (60 days). | SIMULATED | SQ260000000002371 |
| SQ | 60856 | Response Submitted | SIMULATED | SQ260000000002371 |
| SQ | 60857 | Pending Item Code Assignment | SIMULATED | SQ260000000002371 |
| SQ | 60858 | Cancel Due To Ministry Restructuring | SIMULATED | SQ260000000002371 |
| SQ | 60860 | Simple Quote Validity Period Expired | SIMULATED | SQ260000000002371 |
| SQ | 60861 | Cancelled due to Simple Quote validity period is expired (60 days) | SIMULATED | SQ260000000002371 |
| TD | 60500 | Pending Submission | CANNOT_NEVER_USED |  |
| TD | 60501 | Completed | CANNOT_NEVER_USED |  |
| TEC | 62100 | Pending Confirmation Technical Evaluation Committee | RUN | QT260000000004539 |
| TEC | 62101 | Pending Technical Proposal Evaluation | RUN | QT260000000004539 |
| TEC | 62103 | Pending Technical Proposal Evaluation Endorsement | RUN | QT260000000004539 |
| TEC | 62104 | Pending Technical Proposal Evaluation Sign Off | RUN | QT260000000004539 |
| TEC | 62105 | Technical Proposal Evaluation Completed | RUN | QT260000000004539 |
| TEC | 62106 | Cancel Due To Ministry Restructuring | SIMULATED | QT260000000004524 |
| TEC | 62108 | Quotation Has Been Cancelled Due To Proposal Validity Expired. Mof Approval Is Required For Further Action (If Any) | SIMULATED | QT260000000004524 |
| TEC | 62109 | Pending Technical Proposal Evaluation (Revision) | SIMULATED | QT260000000004524 |
| TEC | 62110 | Pending Technical Proposal Evaluation (Presentation / Demonstration) | SIMULATED | QT260000000004524 |
| TEC | 62111 | Pending Technical Proposal Evaluation Endorsement (Presentation / Demonstration) | SIMULATED | QT260000000004524 |
| TEC | 62112 | Pending Technical Proposal Evaluation Sign Off (Presentation / Demonstration) | SIMULATED | QT260000000004524 |
| TEC | 62113 | Pending Technical Proposal Evaluation (Presentation / Demonstration - Revision) | SIMULATED | QT260000000004524 |
| TEC | 62114 | Cancelled Due To No Supplier Passed Technical Evaluation And Qualified For Presentation/Demonstration. | SIMULATED | QT260000000004524 |
| TEC | 62115 | Pending Cancellation | SIMULATED | QT260000000004524 |
| TEC | 62116 | Cancellation Approved | SIMULATED | QT260000000004524 |
| TEC | 62117 | Cancellation Rejected | SIMULATED | QT260000000004524 |
| TS | 60450 | Pending Submission | CANNOT_NEVER_USED |  |
| TS | 60451 | Completed | CANNOT_NEVER_USED |  |

## SM

| Doc type | Status | EN | State | Evidence |
|---|---|---|---|---|
| DA | 20800 | Pending Complaint Investigation | CANNOT_NEVER_USED |  |
| DA | 20801 | New Complaint - Rejected | CANNOT_NEVER_USED |  |
| DA | 20805 | Pending PTPK Decision - Round 1 | CANNOT_NEVER_USED |  |
| DA | 20806 | PTPK  Decision Round 1 - rejected | CANNOT_NEVER_USED |  |
| DA | 20810 | Pending Preparation Show Cause Letter | CANNOT_NEVER_USED |  |
| DA | 20815 | Updating Supplier Received Show Cause Letter Date | CANNOT_NEVER_USED |  |
| DA | 20820 | Pending Response Show Cause Letter by the Supplier | CANNOT_NEVER_USED |  |
| DA | 20825 | Pending PTPK Decision - Round 2 | CANNOT_NEVER_USED |  |
| DA | 20826 | PTPK  Decision Round 2 - rejected | CANNOT_NEVER_USED |  |
| DA | 20830 | Pending Preparation of Accusation Letter | CANNOT_NEVER_USED |  |
| DA | 20835 | Updating Supplier Received Accusation Letter Date | CANNOT_NEVER_USED |  |
| DA | 20840 | Pending Response Accusation Letter by the Supplier | CANNOT_NEVER_USED |  |
| DA | 20845 | Pending JKTT Decision | CANNOT_NEVER_USED |  |
| DA | 20899 | Completed | CANNOT_NEVER_USED |  |
| RGS | 20700 | Not Defined | CANNOT_NEVER_USED |  |
| RGS | 20701 | Bumiputera | CANNOT_NEVER_USED |  |
| RGS | 20702 | Registered | CANNOT_NEVER_USED |  |
| RGS | 20703 | Bumiputera Operated from Home | CANNOT_NEVER_USED |  |
| RGS | 20704 | Non-Bumiputera Operated from Home | CANNOT_NEVER_USED |  |
| RGS | 20705 | Bumiputera and Foreign Company Joint Venture | CANNOT_NEVER_USED |  |
| RGS | 20706 | Bumiputera and Non-Bumiputera and Foreign Company Joint Venture | CANNOT_NEVER_USED |  |
| RGS | 20707 | Foreign Company | CANNOT_NEVER_USED |  |
| SPY | 20401 | Pending Payment Response | CANNOT_NEVER_USED |  |
| SPY | 20402 | Payment Failed | CANNOT_NEVER_USED |  |
| SPY | 20405 | Payment Successful | CANNOT_NEVER_USED |  |
| SR | 20100 | Pending Application Declaration | RUN | KU-02112026-0021 |
| SR | 20101 | Pending Supporting Document Verification | RUN | KN-24112026-0035 |
| SR | 20102 | Pending Application Verification | SIMULATED | KN-24112026-0035 |
| SR | 20103 | Pending Review Site Visit Report - Before Approval | OPEN_FLOW_EXISTS |  |
| SR | 20104 | Pending Review Application | RUN | KR-25112026-0001 |
| SR | 20105 | Pending Site Visit | OPEN_FLOW_EXISTS |  |
| SR | 20106 | Pending Re-Site Visit | SIMULATED | KN-24112026-0035 |
| SR | 20107 | Pending Reply Enquiry by Processing Officer | SIMULATED | KN-24112026-0035 |
| SR | 20108 | Pending Application Approval | RUN | KN-24112026-0035 |
| SR | 20109 | Pending Application Re-Approval | SIMULATED | KN-24112026-0035 |
| SR | 20110 | Pending Site Visit Assignment - Before Approval | OPEN_FLOW_EXISTS |  |
| SR | 20111 | Pending  Re-Site Visit Assignment | SIMULATED | KN-24112026-0035 |
| SR | 20112 | Rejected by Processing Officer | OPEN_FLOW_EXISTS |  |
| SR | 20113 | Rejected by Approver | OPEN_FLOW_EXISTS |  |
| SR | 20114 | Pending Payment Processing Fee | RUN | KR-25112026-0001 |
| SR | 20115 | Pending Application Rejection | SIMULATED | KN-24112026-0035 |
| SR | 20116 | Pending Review Site Visit Report - After Approval | OPEN_FLOW_EXISTS |  |
| SR | 20117 | Pending Site Visit Assignment - After Approval | OPEN_FLOW_EXISTS |  |
| SR | 20118 | Rejected by system - No response to inquiry | SIMULATED | KN-24112026-0035 |
| SR | 20119 | Auto-cancelled by System due to No Payment for Registration Fee | SIMULATED | KN-24112026-0035 |
| SR | 20120 | Auto-deleted by System due to No Payment for Processing Fee | SIMULATED | KN-24112026-0035 |
| SR | 20121 | The application has been rejected by system due to no response to Processing Officer inquiry within pre-defined period | SIMULATED | KN-24112026-0035 |
| SR | 20122 | The application has been rejected by system due to no response to supporting document inquiry within pre-defined period | SIMULATED | KN-24112026-0035 |
| SR | 20123 | Auto-deleted by system due to supplier has cancelled the MOF Account | SIMULATED | KN-24112026-0035 |
| SR | 20124 | Draft application deleted by system due to not declare within the given period | SIMULATED | KN-24112026-0035 |
| SR | 20125 | Pending Site Visit - Before Approval | SIMULATED | KN-24112026-0035 |
| SR | 20126 | Pending Site Visit - After Approval | SIMULATED | KN-24112026-0035 |
| SR | 20188 | Delete Company | SIMULATED | KN-24112026-0035 |
| SR | 20189 | Deleted by Contractor | SIMULATED | KN-24112026-0035 |
| SR | 20190 | Deleted by Consultant | SIMULATED | KN-24112026-0035 |
| SR | 20191 | MOF Account Cancelled by Contractor | OPEN_FLOW_EXISTS |  |
| SR | 20192 | MOF Account Cancelled by Consultant | SIMULATED | KN-24112026-0035 |
| SR | 20193 | Cancelled Pre-Registration Account | SIMULATED | KN-24112026-0035 |
| SR | 20198 | Pending Certificate Generation | SIMULATED | KN-24112026-0035 |
| SR | 20199 | Registered | RUN | KR-25112026-0001 |
| SR | 20200 | Pending Application Enquiry | SIMULATED | KN-24112026-0035 |
| SR | 20201 | Rejection | SIMULATED | KN-24112026-0035 |
| SR | 20202 | Cancelled | SIMULATED | KN-24112026-0035 |
| SR | 20209 | Cancelled Due To Migration | SIMULATED | KN-24112026-0035 |
| SR | 20251 | Pending Payment Registration Fee | RUN | KR-25112026-0001 |
| SR | 20252 | Pending Payment Soft Cert Fee | SIMULATED | KN-24112026-0035 |
| SR | 20299 | Updated Successfully | SIMULATED | KN-24112026-0035 |
| SR | 20301 | Pending Review Cancellation | OPEN_FLOW_EXISTS |  |
| SR | 20311 | Cancelled by system due to not activate the activation link within the given period | SIMULATED | KN-24112026-0035 |
| SR | 20312 | Auto-deleted by system due to MOF Account has been cancelled | SIMULATED | KN-24112026-0035 |
| SR | 20398 | Pending Revise Application | SIMULATED | KN-24112026-0035 |
| SR | 20399 | Cancellation Approved | OPEN_FLOW_EXISTS |  |
| SR | 20400 | Application auto-rejected by system due to not submit supporting document (Offline) within pre-defined period | SIMULATED | KN-24112026-0035 |
| SR | 97350 | Cancelled Pre-Registration Account | SIMULATED | KN-24112026-0035 |
