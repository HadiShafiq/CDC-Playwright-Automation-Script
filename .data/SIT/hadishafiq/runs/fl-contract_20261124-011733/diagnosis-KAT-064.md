# Diagnosis KAT-064 — Payment match (contract)

Run fl-contract_20261124-011733 · 2026-11-24T01:25:01+08:00

## Error
```
locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('xpath=(//input[contains(@id,\'form\') and @type=\'text\'])[12]').first()[22m
[2m    - locator resolved to <input size="15" type="text" value="N/A" role="textbox" autocomplete="off" disabled="disabled" aria-disabled="true" aria-readonly="false" aria-multiline="false" id="_flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt169" name="_flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt169" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all ui-state-disabled"/>[22m
[2m    - fill("")[22m
[2m  - attempting fill action[22m
[2m    2 × waiting for element to be visible, enabled and editable[22m
[2m      - element is not enabled[22m
[2m    - retrying fill action[22m
[2m    - waiting 20ms[22m
[2m    2 × waiting for element to be visible, enabled and editable[22m
[2m      - element is not enabled[22m
[2m    - retrying fill action[22m
[2m      - waiting 100ms[22m
[2m    59 × waiting for element to be visible, enabled and editable[22m
[2m       - element is not enabled[22m
[2m     - retrying fill action[22m
[2m       - waiting 500ms[22m

```

## Application messages
- none

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/debit-adjustment-note?taskId=2492607e-cc67-4e6a-a013-97a9447cada4&claim=true&docNo=DN260000000004802#!
- Title: Debit Adjustment Note - ePerolehan

```yaml
- link "Skip to Content":
  - /url: "#main-content"
- menubar "Dockbar"
- menubar "Dockbar":
  - menuitem "My Sites "
  - listitem:
    - link:
      - /url: /web/epapp/notifications
      - img
  - menuitem "My Account Shamsul Azri Bin Abu Bakar ":
    - img "My Account"
    - text: Shamsul Azri Bin Abu Bakar 
- banner:
  - heading "eP App" [level=1]:
    - link "eP App":
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/debit-adjustment-note?p_p_auth=ZNcQj2bD&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
      - img "eP App"
  - navigation:
    - menubar "Site Pages":
      - menuitem "Overview "
      - menuitem "My Application "
      - menuitem "Task List"
      - menuitem "Notice Board"
      - menuitem "Information "
      - menuitem "More "
      - menuitem "Reports "
- navigation:
  - list "Breadcrumb":
    - listitem:
      - link "eP App":
        - /url: /web/epapp
      - text: /
    - listitem:
      - link "Task List":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/task-list
      - text: /
    - listitem:
      - link "Debit Adjustment Note":
        - /url: "#"
- main:
  - heading "Debit Note Debit Note" [level=1]
  - table:
    - rowgroup:
      - row "Save Approve":
        - cell
        - cell "Save Approve":
          - button "Save"
          - button "Approve"
  - table:
    - rowgroup:
      - row "Purchase Order No. CO260000000006653 Debit Note No. DN260000000004802 PTJ Name BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Status Pending Debit Note Approval":
        - cell "Purchase Order No."
        - cell "CO260000000006653":
          - link "CO260000000006653":
            - /url: "#"
        - cell "Debit Note No."
        - cell "DN260000000004802"
        - cell "PTJ Name"
        - cell "BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN"
        - cell "Status"
        - cell "Pending Debit Note Approval"
  - table:
    - rowgroup:
      - row:
        - cell:
          - tablist:
            - tab "General" [expanded]:
              - link "General":
                - /url: javascript:void(0)
            - tab "Charge Line Summary":
              - link "Charge Line Summary":
                - /url: javascript:void(0)
        - cell:
          - text: Request Details
          - link:
            - /url: javascript:void(0)
          - table:
            - rowgroup:
              - row "Ministry KEMENTERIAN KEWANGAN MALAYSIA Description Description testing for automation":
                - cell "Ministry"
                - cell "KEMENTERIAN KEWANGAN MALAYSIA":
                  - textbox [disabled]: KEMENTERIAN KEWANGAN MALAYSIA
                - cell "Description"
                - cell "Description testing for automation":
                  - textbox [disabled]: Description testing for automation
              - row "Pegawai Pengawal KETUA SETIAUSAHA PERBENDAHARAAN":
                - cell "Pegawai Pengawal"
                - cell "KETUA SETIAUSAHA PERBENDAHARAAN":
                  - textbox [disabled]: KETUA SETIAUSAHA PERBENDAHARAAN
              - row "Kumpulan PTJ KUMPULAN PTJ PERBENDAHARAAN":
                - cell "Kumpulan PTJ"
                - cell "KUMPULAN PTJ PERBENDAHARAAN":
                  - textbox [disabled]: KUMPULAN PTJ PERBENDAHARAAN
              - row "Prepared For PTJ 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Procurement Type Category Services":
                - cell "Prepared For PTJ"
                - cell "24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN":
                  - textbox: 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
                - cell "Procurement Type Category"
                - cell "Services":
                  - textbox [disabled]: Services
              - row "PTJ Pembayar 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Invoice No. (Supplier) IN-CO260000000006653":
                - cell "PTJ Pembayar"
                - cell "24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN":
                  - textbox: 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
                - cell "Invoice No. (Supplier)"
                - cell "IN-CO260000000006653":
                  - textbox [disabled]: IN-CO260000000006653
              - row "Requisitioner Khairulakilah Binti Megat Sharuddin Invoice No. 01400K003S2600002":
                - cell "Requisitioner"
                - cell "Khairulakilah Binti Megat Sharuddin":
                  - textbox [disabled]: Khairulakilah Binti Megat Sharuddin
                - cell "Invoice No."
                - cell "01400K003S2600002":
                  - link "01400K003S2600002":
                    - /url: "#"
              - row "Contract No. CT260000000002301 Factored":
                - cell "Contract No."
                - cell "CT260000000002301":
                  - textbox [disabled]: CT260000000002301
                - cell "Factored"
                - cell:
                  - checkbox [disabled]
          - text: Supplier Details
          - link:
            - /url: javascript:void(0)
          - table:
            - rowgroup:
              - row "Business Registration No. LLP2610287-LGN MOF No. 357-0002294177 eP No. eP-1400K003S":
                - cell "Business Registration No."
                - cell "LLP2610287-LGN MOF No. 357-0002294177":
                  - table:
                    - rowgroup:
                      - row "LLP2610287-LGN MOF No. 357-0002294177":
                        - cell "LLP2610287-LGN":
                          - textbox [disabled]: LLP2610287-LGN
                        - cell "MOF No."
                        - cell "357-0002294177":
                          - textbox [disabled]: 357-0002294177
                - cell "eP No."
                - cell "eP-1400K003S":
                  - textbox [disabled]: eP-1400K003S
              - 'row "Business Registration No. (New) N/A (Notes: Applicable for ROC and ROB only) eP Declared Date N/A"':
                - cell "Business Registration No. (New)"
                - 'cell "N/A (Notes: Applicable for ROC and ROB only)"':
                  - textbox [disabled]: N/A
                  - text: "(Notes: Applicable for ROC and ROB only)"
                - cell "eP Declared Date"
                - cell "N/A":
                  - textbox [disabled]: N/A
              - row "GST Registration No. N/A":
                - cell "GST Registration No."
                - cell "N/A":
                  - textbox [disabled]: N/A
              - row "GST Registration Effective Date N/A":
                - cell "GST Registration Effective Date"
                - cell "N/A":
                  - textbox [disabled]: N/A
              - row "Bank Account No./Name 09002228481 AGROBANK":
                - cell "Bank Account No./Name"
                - cell "09002228481 AGROBANK":
                  - textbox [disabled]: 09002228481 AGROBANK
              - row "Supplier Name MOF FL LLP (registration with SSM as LLP)6":
                - cell "Supplier Name"
                - cell "MOF FL LLP (registration with SSM as LLP)6":
                  - textbox [disabled]: MOF FL LLP (registration with SSM as LLP)6
              - row "Supplier Branch Name HQ":
                - cell "Supplier Branch Name"
                - cell "HQ":
                  - textbox [disabled]: HQ
              - row "Address 23 lrg apaka, 42211, BANDAR BAHARU SUNGAI BESI, WILAYAH PERSEKUTUAN KUALA LUMPUR":
                - cell "Address"
                - cell "23 lrg apaka, 42211, BANDAR BAHARU SUNGAI BESI, WILAYAH PERSEKUTUAN KUALA LUMPUR":
                  - textbox [disabled]: 23 lrg apaka, 42211, BANDAR BAHARU SUNGAI BESI, WILAYAH PERSEKUTUAN KUALA LUMPUR
              - row "Telephone No. +60 221-0809 Fax No. N/A":
                - cell "Telephone No."
                - cell "+60 221-0809 Fax No. N/A":
                  - table:
                    - rowgroup:
                      - row "+60 221-0809 Fax No. N/A":
                        - cell "+60 221-0809":
                          - textbox [disabled]: +60 221-0809
                        - cell "Fax No."
                        - cell "N/A":
                          - textbox [disabled]: N/A
              - row "Contact Person OWNER 6":
                - cell "Contact Person"
                - cell "OWNER 6":
                  - textbox [disabled]: OWNER 6
              - row "Email cdc.dev.automation@commercedc.com.my":
                - cell "Email"
                - cell "cdc.dev.automation@commercedc.com.my":
                  - textbox [disabled]: cdc.dev.automation@commercedc.com.my
              - row "Contact Telephone No. N/A":
                - cell "Contact Telephone No."
                - cell "N/A":
                  - textbox [disabled]: N/A
          - text: Remarks And Attachment
          - link:
            - /url: javascript:void(0)
          - table:
            - rowgroup:
              - 'row "Remarks Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30 Guideline to upload document: 1. User may upload more than one file. 2. File format allowed JPG, GIF, PNG, BMP, TXT, XLS, PDF, DOC, CSV, DOCX. 3. Size file allowed should not exceed 20MB. Attachment Attach File(s) No records found"':
                - cell "Remarks Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30":
                  - table:
                    - rowgroup:
                      - row "Remarks Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30":
                        - cell "Remarks"
                        - cell "Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30":
                          - table:
                            - rowgroup:
                              - row "Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30":
                                - cell "Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30":
                                  - table:
                                    - rowgroup:
                                      - row "Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30":
                                        - cell:
                                          - img
                                        - cell
                                        - cell "Shamsul Azri Bin Abu Bakar , 24/11/2026 01:24:30"
                                      - row:
                                        - cell
                                        - cell:
                                          - textbox
                                        - cell
                - 'cell "Guideline to upload document: 1. User may upload more than one file. 2. File format allowed JPG, GIF, PNG, BMP, TXT, XLS, PDF, DOC, CSV, DOCX. 3. Size file allowed should not exceed 20MB. Attachment Attach File(s) No records found"':
                  - text: "Guideline to upload document: 1. User may upload more than one file. 2. File format allowed JPG, GIF, PNG, BMP, TXT, XLS, PDF, DOC, CSV, DOCX. 3. Size file allowed should not exceed 20MB."
                  - table:
                    - rowgroup:
                      - row "Attachment Attach File(s)":
                        - cell "Attachment"
                        - cell "Attach File(s)":
                          - button "Attach File(s)"
                      - row "No records found":
                        - cell
                        - cell "No records found"
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
```

## Form values (what the page would submit)
```
input/hidden _flDebitAdjustmentNote_WAR_NGePportlet_:form = _flDebitAdjustmentNote_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/debit-adjustment-note?p_p_id=flDebitA
input/hidden _flDebitAdjustmentNote_WAR_NGePportlet_:form:j_idt18:inputTextBeforeSign = 
input/hidden _flDebitAdjustmentNote_WAR_NGePportlet_:form:form = _flDebitAdjustmentNote_WAR_NGePportlet_:form:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/debit-adjustment-note?p_p_id=flDebitA
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt79 = KEMENTERIAN KEWANGAN MALAYSIA
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt83 = Description testing for automation
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:controlOff = KETUA SETIAUSAHA PERBENDAHARAAN
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:ptjGroup = KUMPULAN PTJ PERBENDAHARAAN
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt93 = 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt100 = Services
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt104 = 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt111 = IN-CO260000000006653
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt118 = Khairulakilah Binti Megat Sharuddin 
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt129 = CT260000000002301
input/checkbox _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt133_input = false
input/hidden _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt75_collapsed = false
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt142 = LLP2610287-LGN
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt149 = 357-0002294177
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt156 = eP-1400K003S
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt160 = N/A
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt169 = N/A
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt176 = N/A
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt183 = N/A
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt190 = 09002228481  AGROBANK
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt194 = MOF FL LLP (registration with SSM as LLP)6
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt198 = HQ
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt205 = 23 lrg apaka, 
42211, BANDAR BAHARU SUNGAI BESI, WILAYAH PERSEKUTUAN KUALA LUMPU
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt209 = +60  221-0809
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt213 = N/A
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt217 = OWNER 6
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt221 = cdc.dev.automation@commercedc.com.my
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt225 = N/A
input/hidden _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt138_collapsed = false
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt270:0:j_idt277 = 
input/file _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:upload_input = 
input/hidden _flDebitAdjustmentNote_WAR_NGePportlet_:form:form:j_idt265_collapsed = false
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:commodityCodeId = 
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:commodityTitleId = 
input/text _flDebitAdjustmentNote_WAR_NGePportlet_:form:segmentCodeId = 
textarea/textarea _flDebitAdjustmentNote_WAR_NGePportlet_:form:segmentTitleId = 
```

## SIT database
- LA LA260000000004225: 62506 Letter of Acceptance Completed · no open task
- CR CR260000000006054: 40800 Contract Request Approved · no open task
- CO CO260000000006653: 41520 Pending Debit Note Approval · no open task
- DO 01400K003S2600003: 42005 Acknowledged · no open task
- FN FN260000000005811: 43010 Approved · no open task
