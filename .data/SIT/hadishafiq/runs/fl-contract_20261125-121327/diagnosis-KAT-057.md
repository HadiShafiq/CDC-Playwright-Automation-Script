# Diagnosis KAT-057 — Prepare Contract Request from a contract

Run fl-contract_20261125-121327 · 2026-11-25T12:28:43+08:00

## Error
```
locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('//*[contains(@id,\'lovTb2_data\')]/tr/td[1]/div').first()[22m

```

## Application messages
- none

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
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/contract-request-from-crlist?p_p_auth=vxAEytWU&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
            - tab "General":
              - link "General":
                - /url: javascript:void(0)
            - tab "Delivery Address & Item" [expanded]:
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
          - text: Delivery Address
          - link:
            - /url: javascript:void(0)
          - text: Please add the delivery address either from the PTJ Address or Other Address. Click at the delivery address row to update the ordered quantity for each item listed. Tick/Select the checkbox for the delivery address that you wish to delete.
          - grid:
            - rowgroup:
              - row "Delivery Address Delivery/Service Period (Days) Delivery Start Date Delivery End Date Receiving Officer List":
                - columnheader
                - columnheader "Delivery Address"
                - columnheader "Delivery/Service Period (Days)"
                - columnheader "Delivery Start Date"
                - columnheader "Delivery End Date"
                - columnheader "Receiving Officer List"
            - rowgroup
            - rowgroup:
              - row "No records found":
                - gridcell "No records found"
          - button "PTJ Address"
          - button "Other Address"
          - button "Delete" [disabled]
          - text: Maximum decimal points that can be keyed-in as the Ordered Quantity is based on the Unit of Measurement. Please click
          - link "here":
            - /url: "#"
          - text: to view the Unit Of Measurement Reference Table. Take note that if the item is deleted from one of the delivery addresses, this item will be removed from other delivery addresses as well. If the item is not being delivered to other delivery addresses, please key 0 as the Quantity Ordered for that delivery address The Agency is required to ensure the item code is VERIFIED through the item code link before proceeding with the next process. Please ensure the description of the Purchase Request/ Contract Request is in line with the item name. If not in line, agency is recommended to remove the related item in order to avoid item code query by iGFMAS. Agency may also cancel or reject this Purchase Request/ Contract Request (if required). Please click for
          - link "Item and Specification Guideline.":
            - /url: "#"
          - table:
            - rowgroup:
              - row "Total Existing Item 0":
                - cell "Total Existing Item"
                - cell "0":
                  - textbox: "0"
                - cell
              - row "Total New Items Added 0":
                - cell "Total New Items Added"
                - cell "0":
                  - textbox: "0"
                - cell
              - row "Overall Total Item 0":
                - cell "Overall Total Item"
                - cell "0":
                  - textbox: "0"
                - cell
          - grid:
            - rowgroup:
              - row "GST Item Details Unit Price (RM) GST Amount (RM) (if any) Unit price with GST (RM) Ordered Quantity Ordered Amount (RM)":
                - columnheader:
                  - checkbox
                - columnheader "GST"
                - columnheader "Item Details"
                - columnheader "Unit Price (RM)"
                - columnheader "GST Amount (RM) (if any)"
                - columnheader "Unit price with GST (RM)"
                - columnheader "Ordered Quantity"
                - columnheader "Ordered Amount (RM)"
            - rowgroup
            - rowgroup:
              - row "No records found":
                - gridcell "No records found"
          - button "Add"
          - button "Delete" [disabled]
  - dialog "Listing - Delivery Address":
    - text: Listing - Delivery Address
    - button
    - text: Search
    - link:
      - /url: javascript:void(0)
    - table:
      - rowgroup:
        - row "Address TEST 1234":
          - cell "Address":
            - textbox
            - text: Address
          - cell "TEST 1234":
            - textbox: TEST 1234
    - table:
      - rowgroup:
        - row "Search Reset":
          - cell "Search Reset":
            - button "Search"
            - button "Reset"
    - text: Result
    - link:
      - /url: javascript:void(0)
    - grid:
      - rowgroup:
        - row "Address":
          - columnheader:
            - checkbox
          - columnheader "Address"
      - rowgroup
      - rowgroup:
        - row "No records found":
          - gridcell "No records found"
    - table:
      - rowgroup:
        - row "Select Cancel":
          - cell "Select Cancel":
            - button "Select" [disabled]
            - button "Cancel"
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
```

## Form values (what the page would submit)
```
input/hidden _flContractRequest_WAR_NGePportlet_:form = _flContractRequest_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/contract-request-from-crlist?p_p_id=f
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt18:inputTextBeforeSign = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:delAddrPanel_collapsed = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:addressDataTable_selection = 
input/text _flContractRequest_WAR_NGePportlet_:form:textBox1 = 0
input/text _flContractRequest_WAR_NGePportlet_:form:textBox2 = 0
input/text _flContractRequest_WAR_NGePportlet_:form:textBox3 = 0
input/checkbox _flContractRequest_WAR_NGePportlet_:form:itemDataTable_checkbox = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:itemDataTable_selection = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:manCountry_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:manCountry_focus = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:manState_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:manState_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:address1 = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:manDivison_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:manDivison_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt671 = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:manDistrict_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:manDistrict_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt683 = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:manCity_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:manCity_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:postCode = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:delAddrDetails_collapsed = false
input/text _flContractRequest_WAR_NGePportlet_:form:contactPerson = 
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:chargeOrgProfileNew = 
input/text _flContractRequest_WAR_NGePportlet_:form:email = 
input/text _flContractRequest_WAR_NGePportlet_:form:telNo:countryCodeCompId = 60
input/text _flContractRequest_WAR_NGePportlet_:form:telNo:areaCodeCompId = 
input/text _flContractRequest_WAR_NGePportlet_:form:telNo:phoneNoCompId = 
input/text _flContractRequest_WAR_NGePportlet_:form:faxNo:countryCodeCompId = 60
input/text _flContractRequest_WAR_NGePportlet_:form:faxNo:areaCodeCompId = 
input/text _flContractRequest_WAR_NGePportlet_:form:faxNo:phoneNoCompId = 
input/text _flContractRequest_WAR_NGePportlet_:form:mobileNo:countryCodeCompId = 60
input/text _flContractRequest_WAR_NGePportlet_:form:mobileNo:areaCodeCompId = 
input/text _flContractRequest_WAR_NGePportlet_:form:mobileNo:phoneNoCompId = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:chargeOrgProfileNewHidden = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:goodsReceivingDetails_collapsed = false
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:j_idt782 = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt786 = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt802 = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:j_idt886_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt886_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt891 = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt895 = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:searchPanel_collapsed = false
input/checkbox _flContractRequest_WAR_NGePportlet_:form:itemListResultDt_checkbox = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:itemListResultDt_selection = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:resultPanel_collapsed = false
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt947 = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt949 = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:measurementPanel_collapsed = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:uomResultPanel_collapsed = false
select/select-one _flContractRequest_WAR_NGePportlet_:form:j_idt961_input =  [State]
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt961_focus = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:chargeStateNew_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:chargeStateNew_focus = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:j_idt966_input =  [District]
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt966_focus = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:daerahNew_input =  [- Select One -]
input/text _flContractRequest_WAR_NGePportlet_:form:daerahNew_focus = 
select/select-one _flContractRequest_WAR_NGePportlet_:form:j_idt971_input = ptjcodenew [PTJ Code]
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt971_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:ptjSearchValue = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:chargePtjSearchPanelNew_collapsed = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:tableChargePtjNew2_selection = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:chargeResultPanelNew2_collapsed = false
select/select-one _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1405_input = fullAddress [Address]
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1405_focus = 
input/text _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1408 = TEST 1234
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1404_collapsed = false
input/checkbox _flContractRequest_WAR_NGePportlet_:form:j_idt1395:lovTb2_checkbox = false
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt1395:lovTb2_selection = 
input/hidden _flContractRequest_WAR_NGePportlet_:form:j_idt1395:j_idt1412_collapsed = false
input/text _flContractRequest_WAR_NGePportlet_:form:commodityCodeId = 
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:commodityTitleId = 
input/text _flContractRequest_WAR_NGePportlet_:form:segmentCodeId = 
textarea/textarea _flContractRequest_WAR_NGePportlet_:form:segmentTitleId = 
```

## SIT database
- LA LA260000000004240: 62506 Letter of Acceptance Completed · no open task
- CT CT260000000002315: 50300 Fulfilment Details Approved · no open task
