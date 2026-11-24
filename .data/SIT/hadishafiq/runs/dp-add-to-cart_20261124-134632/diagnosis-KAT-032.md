# Diagnosis KAT-032 — Approve Request Note (Compare / Add to Cart)

Run dp-add-to-cart_20261124-134632 · 2026-11-24T13:51:14+08:00

## Error
```
RN260000000004926 is not in this account's My Task (no result)
```

## Application messages
- none

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/task-list#!
- Title: Task List - ePerolehan

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
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_p_auth=sDJv0m73&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
        - /url: "#"
- main:
  - heading "Task List Task List" [level=1]
  - text: Group Task
  - link:
    - /url: javascript:void(0)
  - grid:
    - rowgroup:
      - row "Document No Document Type Description Created Date Due Date Status Action":
        - columnheader "Document No"
        - columnheader "Document Type"
        - columnheader "Description"
        - columnheader "Created Date"
        - columnheader "Due Date"
        - columnheader "Status"
        - columnheader "Action"
    - rowgroup
    - rowgroup:
      - row "PO250000000000802 Purchase Order INV_fact_AL003 Factoring Non-Contracted SDI & CAN - AL 20/03/2025 12:38 Pending Payment Match Claim":
        - gridcell "PO250000000000802"
        - gridcell "Purchase Order"
        - gridcell "INV_fact_AL003 Factoring Non-Contracted SDI & CAN - AL":
          - link "INV_fact_AL003 Factoring Non-Contracted SDI & CAN - AL":
            - /url: "#"
        - gridcell "20/03/2025 12:38"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PO240000000000008 Purchase Order INV87654 Test Perihal upload doc - AL 07/02/2025 16:51 Pending Payment Match Claim":
        - gridcell "PO240000000000008"
        - gridcell "Purchase Order"
        - gridcell "INV87654 Test Perihal upload doc - AL":
          - link "INV87654 Test Perihal upload doc - AL":
            - /url: "#"
        - gridcell "07/02/2025 16:51"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO250000000000403 Purchase Order INV24012024 EAE TSCN 03 FL 35508 24/01/2025 17:22 Pending Payment Match Claim":
        - gridcell "CO250000000000403"
        - gridcell "Purchase Order"
        - gridcell "INV24012024 EAE TSCN 03 FL 35508":
          - link "INV24012024 EAE TSCN 03 FL 35508":
            - /url: "#"
        - gridcell "24/01/2025 17:22"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO240000000000197 Purchase Order 60000730212400062 Contract Request for Contract No. CT240000000000674 15/11/2024 16:04 Pending Payment Match Claim":
        - gridcell "CO240000000000197"
        - gridcell "Purchase Order"
        - gridcell "60000730212400062 Contract Request for Contract No. CT240000000000674":
          - link "60000730212400062 Contract Request for Contract No. CT240000000000674":
            - /url: "#"
        - gridcell "15/11/2024 16:04"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PO240000000000203 Purchase Order 60000730212400060 TEST SCENARIO 1 - FL AUDIT TRAIL - Fulfilment - Non-Contract Fulfilment (141124) 14/11/2024 15:38 Pending Payment Match Claim":
        - gridcell "PO240000000000203"
        - gridcell "Purchase Order"
        - gridcell "60000730212400060 TEST SCENARIO 1 - FL AUDIT TRAIL - Fulfilment - Non-Contract Fulfilment (141124)":
          - link "60000730212400060 TEST SCENARIO 1 - FL AUDIT TRAIL - Fulfilment - Non-Contract Fulfilment (141124)":
            - /url: "#"
        - gridcell "14/11/2024 15:38"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PO240000000000197 Purchase Order 110101 inv EAE add to cart FL 35508 <13 November 2024> 14/11/2024 12:35 Pending Payment Match Claim":
        - gridcell "PO240000000000197"
        - gridcell "Purchase Order"
        - gridcell "110101 inv EAE add to cart FL 35508 <13 November 2024>":
          - link "110101 inv EAE add to cart FL 35508 <13 November 2024>":
            - /url: "#"
        - gridcell "14/11/2024 12:35"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PO240000000000201 Purchase Order 60000730212400052(FULHAM) Test Scenario 1 (Fulfilment - Non-Contract Fulfilment) - (141124) 14/11/2024 11:16 Pending Payment Match Claim":
        - gridcell "PO240000000000201"
        - gridcell "Purchase Order"
        - gridcell "60000730212400052(FULHAM) Test Scenario 1 (Fulfilment - Non-Contract Fulfilment) - (141124)":
          - link "60000730212400052(FULHAM) Test Scenario 1 (Fulfilment - Non-Contract Fulfilment) - (141124)":
            - /url: "#"
        - gridcell "14/11/2024 11:16"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO240000000000187 Purchase Order inccd cd 2810pm 28/10/2024 14:54 Pending Payment Match Claim":
        - gridcell "CO240000000000187"
        - gridcell "Purchase Order"
        - gridcell "inccd cd 2810pm":
          - link "inccd cd 2810pm":
            - /url: "#"
        - gridcell "28/10/2024 14:54"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO240000000000184 Purchase Order doct CT616 - DN 25/10/2024 17:26 Pending Payment Match Claim":
        - gridcell "CO240000000000184"
        - gridcell "Purchase Order"
        - gridcell "doct CT616 - DN":
          - link "doct CT616 - DN":
            - /url: "#"
        - gridcell "25/10/2024 17:26"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO240000000000183 Purchase Order invcndn SERVICE DN CN 25/10/2024 15:03 Pending Payment Match Claim":
        - gridcell "CO240000000000183"
        - gridcell "Purchase Order"
        - gridcell "invcndn SERVICE DN CN":
          - link "invcndn SERVICE DN CN":
            - /url: "#"
        - gridcell "25/10/2024 15:03"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
  - text: Page 20 / 20 p p 11 12 13 14 15 16 17 18 19 20 p p My Task
  - link:
    - /url: javascript:void(0)
  - table:
    - rowgroup:
      - 'row "Document No : RN260000000004926 Document Type : All All"':
        - cell "Document No :"
        - cell "RN260000000004926":
          - textbox: RN260000000004926
        - cell "Document Type :"
        - cell "All All":
          - combobox:
            - option "All" [selected]
            - option "Agreement"
            - option "Amendment With Supplementary Contract"
            - option "Amendment Without Supplement"
            - option "Bpk Approval"
            - option "Committee Approval"
            - option "Contract Request"
            - option "Contract Suspension/Activation"
            - option "Contract Termination"
            - option "Debit Note"
            - option "Fulfilment Details Creation"
            - option "Fulfilment Details Update"
            - option "Letter of Acceptance (LOA)"
            - option "Letter of Intent (LOI)"
            - option "Payment Advice"
            - option "Procurement Board Approval"
            - option "Proposal Evaluation"
            - option "Ptj Approval"
            - option "Purchase In Default"
            - option "Contract Order"
            - option "Purchase Order"
            - option "Purchase Request"
            - option "Quotation/Tender"
            - option "Remove Factoring"
            - option "Request Factoring"
            - option "Request Note"
            - option "Shipping Instruction"
            - option "Simple Quote"
            - option "Specification"
            - option "Stop Delivery Instruction"
            - option "Supplemental Agreement"
            - option "Supplier Application"
            - option "Supplier Finalization"
          - textbox
          - text: All
      - 'row "Status : - Select One - - Select One -"':
        - cell "Status :"
        - cell "- Select One - - Select One -":
          - combobox [disabled]:
            - option "- Select One -" [selected]
          - textbox
          - text: "- Select One -"
        - cell
        - cell
      - 'row "Created From : ui-button Created To : ui-button"':
        - cell "Created From :"
        - cell "ui-button":
          - textbox
          - button "ui-button"
        - cell "Created To :"
        - cell "ui-button":
          - textbox
          - button "ui-button"
      - 'row "Sort By : Created Date Created Date Order By : Descending Descending"':
        - cell "Sort By :"
        - cell "Created Date Created Date":
          - combobox:
            - option "Created Date" [selected]
            - option "Document No"
          - textbox
          - text: Created Date
        - cell "Order By :"
        - cell "Descending Descending":
          - combobox:
            - option "Descending" [selected]
            - option "Ascending"
          - textbox
          - text: Descending
  - button "Reset"
  - button "Search"
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
        - /url: "#"
```

## Form values (what the page would submit)
```
input/hidden _BpmTaskList_WAR_NGePportlet_:form = _BpmTaskList_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_p_id=BpmTaskList_WAR_NGeP
select/select-one _BpmTaskList_WAR_NGePportlet_:form:j_idt10:j_idt20_input =  [- Select One -]
input/text _BpmTaskList_WAR_NGePportlet_:form:j_idt10:j_idt20_focus = 
input/text _BpmTaskList_WAR_NGePportlet_:form:j_idt10:j_idt23 = 
input/hidden _BpmTaskList_WAR_NGePportlet_:form:j_idt10:j_idt19_collapsed = false
input/hidden _BpmTaskList_WAR_NGePportlet_:form:j_idt10:j_idt27_collapsed = false
input/text _BpmTaskList_WAR_NGePportlet_:form:j_idt46 = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:docTypeAnvanceId_input =  [All]
input/text _BpmTaskList_WAR_NGePportlet_:form:docTypeAnvanceId_focus = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:docStatusGroup_input = 0 [- Select One -]
input/text _BpmTaskList_WAR_NGePportlet_:form:docStatusGroup_focus = 
input/text _BpmTaskList_WAR_NGePportlet_:form:groupTaskCreatedDateFrom_input = 
input/text _BpmTaskList_WAR_NGePportlet_:form:groupTaskCreatedDateTo_input = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:taskListSortByGroup_input = CREATEDATE [Created Date]
input/text _BpmTaskList_WAR_NGePportlet_:form:taskListSortByGroup_focus = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:taskListOrderByGroup_input = false [Descending]
input/text _BpmTaskList_WAR_NGePportlet_:form:taskListOrderByGroup_focus = 
input/hidden _BpmTaskList_WAR_NGePportlet_:form:advanceViewPanelId_collapsed = true
input/text _BpmTaskList_WAR_NGePportlet_:form:j_idt135 = RN260000000004926
select/select-one _BpmTaskList_WAR_NGePportlet_:form:docTypeNormalId_input =  [All]
input/text _BpmTaskList_WAR_NGePportlet_:form:docTypeNormalId_focus = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:docStatus_input = 0 [- Select One -]
input/text _BpmTaskList_WAR_NGePportlet_:form:docStatus_focus = 
input/text _BpmTaskList_WAR_NGePportlet_:form:myTaskCreatedDateFrom_input = 
input/text _BpmTaskList_WAR_NGePportlet_:form:myTaskCreatedDateTo_input = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:taskListSortBy_input = CREATEDATE [Created Date]
input/text _BpmTaskList_WAR_NGePportlet_:form:taskListSortBy_focus = 
select/select-one _BpmTaskList_WAR_NGePportlet_:form:taskListOrderBy_input = false [Descending]
input/text _BpmTaskList_WAR_NGePportlet_:form:taskListOrderBy_focus = 
input/hidden _BpmTaskList_WAR_NGePportlet_:form:normalViewPanelId_collapsed = false
```

## SIT database
- RN RN260000000004926: 60701 Pending Approval · open tasks: Review Direct Purchase → 690127065209
