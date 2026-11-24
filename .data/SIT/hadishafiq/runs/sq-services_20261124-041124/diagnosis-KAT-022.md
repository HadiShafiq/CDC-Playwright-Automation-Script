# Diagnosis KAT-022 — Supplier responds to the Simple Quote (prices every line)

Run sq-services_20261124-041124 · 2026-11-24T04:17:24+08:00

## Error
```
locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('xpath=(//input[contains(@id,\'questionTbl:\') and contains(@id,\':ratePerUom\')])[1]').first()[22m
[2m    - locator resolved to <input type="text" maxlength="19" role="textbox" autocomplete="off" disabled="disabled" aria-disabled="true" aria-readonly="false" aria-multiline="false" onkeypress="if (event.keyCode == 13) { return false; }" id="_ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:ratePerUom" name="_ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:ratePerUom" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all ui-state-disabled"/>[22m
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
[2m    58 × waiting for element to be visible, enabled and editable[22m
[2m       - element is not enabled[22m
[2m     - retrying fill action[22m
[2m       - waiting 500ms[22m

```

## Application messages
- info: Simple Quote will start on 24 Nov 2026 at 20:15. Kindly log in on time setting.

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/review-supplier-view?qt=33393#!
- Title: Response Simple Quote - ePerolehan

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
  - menuitem "My Account OWNER 3 ":
    - img "My Account"
    - text: OWNER 3 
- banner:
  - heading "eP App" [level=1]:
    - link "eP App":
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/review-supplier-view?p_p_auth=A5viKyi6&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - link "Task List":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/task-list
      - text: /
    - listitem:
      - link "Response Simple Quote":
        - /url: "#"
- main:
  - heading "Response Simple Quote Response Simple Quote" [level=1]
  - link:
    - /url: "#"
  - list:
    - listitem: Simple Quote will start on 24 Nov 2026 at 20:15. Kindly log in on time setting.
  - table:
    - rowgroup:
      - row "Simple Quote No. SQ260000000002365 PTJ BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Request Date 24/11/2026 04:13":
        - cell "Simple Quote No."
        - cell "SQ260000000002365"
        - cell "PTJ"
        - cell "BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN"
        - cell "Request Date"
        - cell "24/11/2026 04:13"
        - cell
        - cell
  - text: Supplier Details
  - link:
    - /url: javascript:void(0)
  - table:
    - rowgroup:
      - row "Supplier eP No. eP-1400K002N Supplier Basic FL ROC (registration with SSM as ROC) 3":
        - cell "Supplier eP No."
        - cell "eP-1400K002N":
          - textbox [disabled]: eP-1400K002N
        - cell "Supplier"
        - cell "Basic FL ROC (registration with SSM as ROC) 3":
          - textbox [disabled]: Basic FL ROC (registration with SSM as ROC) 3
      - row "Ministry Of Finance Registration No. N/A GST Registration No N/A":
        - cell "Ministry Of Finance Registration No."
        - cell "N/A":
          - textbox [disabled]: N/A
        - cell "GST Registration No"
        - cell "N/A":
          - textbox [disabled]: N/A
      - row "GST Registration Effective Date N/A eP Declared Date N/A":
        - cell "GST Registration Effective Date"
        - cell "N/A":
          - textbox [disabled]: N/A
        - cell "eP Declared Date"
        - cell "N/A":
          - textbox [disabled]: N/A
  - text: Simple Quote Details
  - link:
    - /url: javascript:void(0)
  - text: Please complete all mandatory ( * ) field.
  - table:
    - rowgroup:
      - row "Panel Yes No":
        - cell "Panel"
        - cell "Yes No":
          - table:
            - rowgroup:
              - row "Yes No":
                - cell "Yes":
                  - radio "Yes" [disabled]
                - cell "Yes"
                - cell "No":
                  - radio "No" [checked] [disabled]
                - cell "No"
      - row "Title WIP_SM/FL40863_04_NEW_1":
        - cell "Title"
        - cell "WIP_SM/FL40863_04_NEW_1":
          - textbox [disabled]: WIP_SM/FL40863_04_NEW_1
      - row "Scope of work and services Attachment":
        - cell "Scope of work and services"
        - cell "Attachment":
          - button "Attachment" [disabled]
          - link:
            - /url: "#"
      - row "Zonal Yes No":
        - cell "Zonal"
        - cell "Yes No":
          - table:
            - rowgroup:
              - row "Yes No":
                - cell "Yes No":
                  - table:
                    - rowgroup:
                      - row "Yes No":
                        - cell "Yes":
                          - radio "Yes" [disabled]
                        - cell "Yes"
                        - cell "No":
                          - radio "No" [checked] [disabled]
                        - cell "No"
                - cell
      - row "Start Date 24/11/2026 20:15":
        - cell "Start Date"
        - cell "24/11/2026 20:15":
          - textbox [disabled]: 24/11/2026 20:15
      - row "End Date 27/11/2026 20:15":
        - cell "End Date"
        - cell "27/11/2026 20:15":
          - textbox [disabled]: 27/11/2026 20:15
      - 'row "Simple Quote Type: Single Multiple"':
        - cell "Simple Quote Type:"
        - cell "Single Multiple":
          - table:
            - rowgroup:
              - row "Single Multiple":
                - cell "Single Multiple":
                  - table:
                    - rowgroup:
                      - row "Single Multiple":
                        - cell "Single":
                          - radio "Single" [checked] [disabled]
                        - cell "Single"
                        - cell "Multiple":
                          - radio "Multiple" [disabled]
                        - cell "Multiple"
                - cell
  - text: Government is not bound to agree to accept the lowest price of Simple Quote or any of Simple Quote Price Offered must be valid for at least 60 days Service List
  - link:
    - /url: javascript:void(0)
  - grid:
    - rowgroup:
      - row "Item Fulfilment Type UOM Freq. per UOM No. UOM per day No. UOM per month Duration (Month) Quantity * Unit Price(RM) Offered Total Amount(RM) Service Period Supplier Offer":
        - columnheader "Item"
        - columnheader "Fulfilment Type"
        - columnheader "UOM"
        - columnheader "Freq. per UOM"
        - columnheader "No. UOM per day"
        - columnheader "No. UOM per month"
        - columnheader "Duration (Month)"
        - columnheader "Quantity"
        - columnheader "* Unit Price(RM)"
        - columnheader "Offered Total Amount(RM)"
        - columnheader "Service Period"
        - columnheader "Supplier Offer"
      - row "Specification":
        - columnheader "Specification"
    - rowgroup:
      - row "Grand Total (RM) 0.00":
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell "Grand Total (RM)"
        - gridcell "0.00"
        - gridcell
        - gridcell
    - rowgroup:
      - row "PERKHIDMATAN UNDANG UNDANG PENGAMBILAN ANAK ANGKAT 801218020000000000 Periodic (Schedule) Activity unit 1 1 3 30 Days":
        - gridcell "PERKHIDMATAN UNDANG UNDANG PENGAMBILAN ANAK ANGKAT 801218020000000000":
          - text: PERKHIDMATAN UNDANG UNDANG PENGAMBILAN ANAK ANGKAT
          - link "801218020000000000":
            - /url: "#"
        - gridcell "Periodic (Schedule)"
        - gridcell "Activity unit"
        - gridcell "1"
        - gridcell
        - gridcell
        - gridcell "1"
        - gridcell "3"
        - gridcell:
          - textbox [disabled]
        - gridcell
        - gridcell "30 Days"
        - gridcell:
          - textbox [disabled]
      - row "Service Specification1":
        - gridcell "Service Specification1":
          - link:
            - /url: "#"
          - text: Service Specification1
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
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
      - link "Response Simple Quote":
        - /url: "#"
```

## Form values (what the page would submit)
```
input/hidden _profileDisciplinaryAction_WAR_NGePportlet_:form = _profileDisciplinaryAction_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/review-supplier-view?p_p_id=profileDi
input/hidden _ReviewSupplierView_WAR_NGePportlet_:form = _ReviewSupplierView_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/review-supplier-view?p_p_id=ReviewSup
input/hidden _ReviewSupplierView_WAR_NGePportlet_:form:j_idt26:inputTextBeforeSign = SQ260000000002365468602
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt64 = eP-1400K002N
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt68 = Basic FL ROC (registration with SSM as ROC) 3
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt72 = N/A
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt76 = N/A
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt83 = N/A
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt90 = N/A
input/hidden _ReviewSupplierView_WAR_NGePportlet_:form:suppViewDtl_collapsed = false
input/radio _ReviewSupplierView_WAR_NGePportlet_:form:j_idt99:0 = false
input/radio _ReviewSupplierView_WAR_NGePportlet_:form:j_idt99:1 = true
textarea/textarea _ReviewSupplierView_WAR_NGePportlet_:form:j_idt105 = WIP_SM/FL40863_04_NEW_1
input/radio _ReviewSupplierView_WAR_NGePportlet_:form:j_idt113:0 = false
input/radio _ReviewSupplierView_WAR_NGePportlet_:form:j_idt113:1 = true
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt128_input = 24/11/2026 20:15
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt132_input = 27/11/2026 20:15
input/radio _ReviewSupplierView_WAR_NGePportlet_:form:j_idt136:0 = true
input/radio _ReviewSupplierView_WAR_NGePportlet_:form:j_idt136:1 = false
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:commodityCodeId = 
textarea/textarea _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:commodityTitleId = 
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:segmentCodeId = 
textarea/textarea _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:segmentTitleId = 
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:ratePerUom = 
textarea/textarea _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:0:answerSqRemarks = 
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:1:commodityCodeId = 
textarea/textarea _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:1:commodityTitleId = 
input/text _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:1:segmentCodeId = 
textarea/textarea _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:questionTbl:1:segmentTitleId = 
input/hidden _ReviewSupplierView_WAR_NGePportlet_:form:j_idt184:spg_collapsed = false
input/hidden _ReviewSupplierView_WAR_NGePportlet_:form:tplSpecId_collapsed = false
```

## SIT database
- SQ SQ260000000002365: 60851 Pending Supplier Response · no open task
