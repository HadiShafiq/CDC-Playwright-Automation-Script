# Diagnosis KAT-057 — Prepare Contract Request from a contract

Run fl-contract-do-maint_20261125-155547 · 2026-11-25T15:58:43+08:00

## Error
```
locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('//button[.//span[normalize-space()=\'PTJ Address\']]').first()[22m

```

## Application messages
- error: The PTJ has utilized the Schedule No. 1 of this Periodic Contract with Schedule. (ERR-740031)

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/contract-request-from-crlist?contractId=97089&scheduleNo=1#!
- Title: Contract Request - ePerolehan

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
  - menuitem "My Account Do Not Use By Ija Set7 - Desk Officer ":
    - img "My Account"
    - text: Do Not Use By Ija Set7 - Desk Officer 
- banner:
  - heading "eP App" [level=1]:
    - link "eP App":
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/contract-request-from-crlist?p_p_auth=DE3vxL51&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
      - img "eP App"
  - navigation:
    - menubar "Site Pages":
      - menuitem "Overview"
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
      - link "My Application":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/my-application
      - text: /
    - listitem:
      - link "Fulfilment":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/fullfillment
      - text: /
    - listitem:
      - link "Contract List":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/contract-list
      - text: /
    - listitem:
      - link "Contract Request":
        - /url: "#"
- main:
  - heading "Contract Request Contract Request" [level=1]
  - link:
    - /url: "#"
  - list:
    - listitem: The PTJ has utilized the Schedule No. 1 of this Periodic Contract with Schedule. (ERR-740031)
  - table:
    - rowgroup:
      - row "<< Back Save Submit":
        - cell "<< Back":
          - button "<< Back"
        - cell "Save Submit":
          - button "Save"
          - button "Submit"
  - table:
    - rowgroup:
      - row "Contract No. CT260000000002315 Contract Request No. N/A PTJ Name BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Prepared By Do Not Use By Ija Set7 - Desk Officer Status Pending Contract Request Creation":
        - cell "Contract No."
        - cell "CT260000000002315":
          - link "CT260000000002315":
            - /url: "#"
        - cell "Contract Request No."
        - cell "N/A"
        - cell "PTJ Name"
        - cell "BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN"
        - cell "Prepared By"
        - cell "Do Not Use By Ija Set7 - Desk Officer"
        - cell "Status"
        - cell "Pending Contract Request Creation"
  - table:
    - rowgroup:
      - row:
        - cell
  - table:
    - rowgroup:
      - row:
        - cell:
          - tablist:
            - tab "General" [expanded]:
              - link "General":
                - /url: javascript:void(0)
            - tab "Delivery Address & Item":
              - link "Delivery Address & Item":
                - /url: javascript:void(0)
            - tab "Order Summary":
              - link "Order Summary":
                - /url: javascript:void(0)
            - tab "Charge Line Assignment":
              - link "Charge Line Assignment":
                - /url: javascript:void(0)
            - tab "Approver List":
              - link "Approver List":
                - /url: javascript:void(0)
        - cell:
          - text: Agency Details
          - link:
            - /url: javascript:void(0)
          - text: Fields with (*) are mandatory.
          - table:
            - rowgroup:
              - row "Ministry KEMENTERIAN KEWANGAN MALAYSIA":
                - cell "Ministry"
                - cell "KEMENTERIAN KEWANGAN MALAYSIA":
                  - textbox [disabled]: KEMENTERIAN KEWANGAN MALAYSIA
              - row "Pegawai Pengawal KETUA SETIAUSAHA PERBENDAHARAAN":
                - cell "Pegawai Pengawal"
                - cell "KETUA SETIAUSAHA PERBENDAHARAAN":
                  - textbox [disabled]: KETUA SETIAUSAHA PERBENDAHARAAN
              - row "Kumpulan PTJ KUMPULAN PTJ PERBENDAHARAAN":
                - cell "Kumpulan PTJ"
                - cell "KUMPULAN PTJ PERBENDAHARAAN":
                  - textbox [disabled]: KUMPULAN PTJ PERBENDAHARAAN
              - row "Prepared For PTJ * 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN":
                - cell "Prepared For PTJ *"
                - cell "24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN":
                  - textbox: 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
              - row "PTJ Pembayar 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN":
                - cell "PTJ Pembayar"
                - cell "24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN":
                  - textbox [disabled]: 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
              - row "Accounting Office 1102 KEMENTERIAN KEWANGAN":
                - cell "Accounting Office"
                - cell "1102 KEMENTERIAN KEWANGAN":
                  - textbox: 1102 KEMENTERIAN KEWANGAN
          - text: Request Details
          - link:
            - /url: javascript:void(0)
          - text: Please make sure the performance bond has been submitted by the supplier or obtain release (waiver) before continuing with the creation of the Contract Request. Fields with (*) are mandatory.
          - table:
            - rowgroup:
              - row "Description * Description testing for automation Contract Type Ministry":
                - cell "Description *"
                - cell "Description testing for automation":
                  - textbox: Description testing for automation
                - cell
                - cell "Contract Type"
                - cell "Ministry":
                  - textbox [disabled]: Ministry
              - row "Financial Year 2026":
                - cell "Financial Year"
                - cell "2026":
                  - textbox [disabled]: "2026"
              - row "Prepared Date 25/11/2026":
                - cell "Prepared Date"
                - cell "25/11/2026":
                  - textbox [disabled]: 25/11/2026
              - row "Procurement Type Category Supply Of Goods":
                - cell "Procurement Type Category"
                - cell "Supply Of Goods":
                  - textbox [disabled]: Supply Of Goods
              - row:
                - cell
                - cell
              - row "Delivery/Service Period (Days) 60":
                - cell "Delivery/Service Period (Days)"
                - cell "60":
                  - table:
                    - rowgroup:
                      - row "60":
                        - cell "60":
                          - textbox [disabled]: "60"
                - cell
                - cell
              - row "Tick to remain the selected Delivery Start Date and Delivery End Date entered by user to be displayed in Purchase Order":
                - cell "Tick to remain the selected Delivery Start Date and Delivery End Date entered by user to be displayed in Purchase Order":
                  - table:
                    - rowgroup:
                      - row "Tick to remain the selected Delivery Start Date and Delivery End Date entered by user to be displayed in Purchase Order":
                        - cell:
                          - checkbox [checked]
                        - cell "Tick to remain the selected Delivery Start Date and Delivery End Date entered by user to be displayed in Purchase Order"
                        - cell
              - row "Delivery Start Date 25/11/2026 ui-button Fulfilment Type Periodic (Schedule)":
                - cell "Delivery Start Date"
                - cell "25/11/2026 ui-button":
                  - textbox: 25/11/2026
                  - button "ui-button"
                - cell "Fulfilment Type"
                - cell "Periodic (Schedule)":
                  - textbox [disabled]: Periodic (Schedule)
              - row "Schedule No./ Phase 1 Phase/ Schedule Information":
                - cell
                - cell
                - cell "Schedule No./ Phase"
                - cell "1":
                  - textbox [disabled]: "1"
                - cell "Phase/ Schedule Information":
                  - table:
                    - rowgroup:
                      - row "Phase/ Schedule Information":
                        - cell "Phase/ Schedule Information":
                          - link "Phase/ Schedule Information":
                            - /url: "#"
              - row "Delivery End Date 24/01/2027 ui-button Factored Contract?":
                - cell "Delivery End Date"
                - cell "24/01/2027 ui-button":
                  - textbox: 24/01/2027
                  - button "ui-button"
                - cell "Factored Contract?"
                - cell:
                  - checkbox [disabled]
              - row "Zonal Price?":
                - cell
                - cell
                - cell "Zonal Price?"
                - cell:
                  - checkbox [disabled]
              - row:
                - cell
                - cell
                - cell
                - cell
          - table:
            - rowgroup:
              - row "* I declare that submission of all information in Purchase Request/ Contract Request is correct and valid.":
                - cell "*":
                  - checkbox [checked]
                  - text: "*"
                - cell "I declare that submission of all information in Purchase Request/ Contract Request is correct and valid."
          - text: Supplier Details
          - link:
            - /url: javascript:void(0)
          - table:
            - rowgroup:
              - row "Business Registration No. 747798-U MOF No. 357-02088811 eP No. eP-1400I0577":
                - cell "Business Registration No."
                - cell "747798-U MOF No. 357-02088811":
                  - table:
                    - rowgroup:
                      - row "747798-U MOF No. 357-02088811":
                        - cell "747798-U":
                          - textbox [disabled]: 747798-U
                        - cell "MOF No."
                        - cell "357-02088811":
                          - textbox [disabled]: 357-02088811
                - cell "eP No."
                - cell "eP-1400I0577":
                  - textbox [disabled]: eP-1400I0577
              - 'row "Business Registration No. (New) 200601028042 (Notes: Applicable for ROC and ROB only) eP Declared Date 25/10/2024"':
                - cell "Business Registration No. (New)"
                - 'cell "200601028042 (Notes: Applicable for ROC and ROB only)"':
                  - textbox [disabled]: "200601028042"
                  - text: "(Notes: Applicable for ROC and ROB only)"
                - cell "eP Declared Date"
                - cell "25/10/2024":
                  - textbox [disabled]: 25/10/2024
              - row "GST Registration No. 000901595136":
                - cell "GST Registration No."
                - cell "000901595136":
                  - textbox [disabled]: "000901595136"
              - row "GST Registration Effective Date 01/04/2015":
                - cell "GST Registration Effective Date"
                - cell "01/04/2015":
                  - textbox [disabled]: 01/04/2015
              - row "Supplier Name FIRST ALLIED SECURITY SERVICES SDN. BHD.":
                - cell "Supplier Name"
                - cell "FIRST ALLIED SECURITY SERVICES SDN. BHD.":
                  - textbox [disabled]: FIRST ALLIED SECURITY SERVICES SDN. BHD.
              - row "Supplier Branch Name - Select One -":
                - cell "Supplier Branch Name"
                - cell "- Select One -":
                  - textbox
                  - text: "- S
```

## Form values (what the page would submit)
```
input/hidden _flContractRequest_WAR_NGePportlet_:form = _flContractRequest_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/contract-request-from-crlist?p_p_id=f
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt18:inputTextBeforeSign = 
input/text _flContractRequest_WAR_NGePportlet_:form:ministry = KEMENTERIAN KEWANGAN MALAYSIA
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:controlOff = KETUA SETIAUSAHA PERBENDAHARAAN
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:ptjGroup = KUMPULAN PTJ PERBENDAHARAAN
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:preparedOrgProfileId = 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:issuedOrgProfile = 24010101 BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:agOffice = 1102 KEMENTERIAN KEWANGAN
input/hidden _flContractRequest_WAR_NGePportlet_:form:flDetails_collapsed = false
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:title = Description testing for automation
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt160 = Ministry
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt164 = 2026
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt168 = 25/11/2026
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt175 = Supply Of Goods
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt185 = 60
input/checkbox _flContractRequest_WAR_NGePportlet_:form:crGeneralRadio_input = true
input/text _flContractRequest_WAR_NGePportlet_:form:delStartDate_input = 25/11/2026
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt211 = Periodic (Schedule)
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt218 = 1
input/text _flContractRequest_WAR_NGePportlet_:form:delEndDate_input = 24/01/2027
input/checkbox _flContractRequest_WAR_NGePportlet_:form:j_idt247_input = false
input/checkbox _flContractRequest_WAR_NGePportlet_:form:j_idt254_input = false
input/checkbox _flContractRequest_WAR_NGePportlet_:form:j_idt263_input = true
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt144_collapsed = false
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt271 = 747798-U
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt278 = 357-02088811
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt285 = eP-1400I0577
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt289 = 200601028042
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt298 = 25/10/2024
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt305 = 000901595136
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt312 = 01/04/2015
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt319 = FIRST ALLIED SECURITY SERVICES SDN. BHD.
select/select-one _flContractRequest_WAR_NGePportlet_:form:suppBranch_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:suppBranch_focus = 
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:j_idt331 = 1-6-29 JALAN SEMARAK API 1/50, 
BLOCK C OFF JALAN GOMBAK , 
53000, KUALA LUMPUR,
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt335 = +60  3-40321100
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt339 = +60  3-40321091
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt343 = MUHAMMAD AZWAN BIN ZAKARIA
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt347 = eperolehantestemail@gmail.com
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt351 = +60  3-40321100
input/hidden _flContractRequest_WAR_NGePportlet_:form:supplierPnl_collapsed = false
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:j_idt388:0:j_idt395 = 
input/file _flContractRequest_WAR_NGePportlet_:form:upload_input = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt383_collapsed = false
select/select-one _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1405_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1405_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1408 = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1404_collapsed = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1412_collapsed = false
input/text _flContractRequest_WAR_NGePportlet_:form:commodityCodeId = 
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:commodityTitleId = 
input/text _flContractRequest_WAR_NGePportlet_:form:segmentCodeId = 
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:segmentTitleId = 
```

## SIT database
- LA LA260000000004240: 62506 Letter of Acceptance Completed · no open task
- CT CT260000000002315: 50300 Fulfilment Details Approved · no open task
