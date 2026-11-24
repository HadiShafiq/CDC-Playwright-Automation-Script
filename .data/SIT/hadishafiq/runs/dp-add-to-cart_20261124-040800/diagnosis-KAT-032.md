# Diagnosis KAT-032 — Approve Request Note (Compare / Add to Cart)

Run dp-add-to-cart_20261124-040800 · 2026-11-24T04:53:55+08:00

## Error
```
locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('xpath=(//*[starts-with(normalize-space(text()),\'Document No\') and contains(text(),\':\')]/following::input[@type=\'text\'][1])[last()]').first()[22m
[2m    - locator resolved to <input value="" size="60" type="text" role="textbox" autocomplete="off" aria-disabled="false" aria-readonly="false" aria-multiline="false" id="_BpmTaskList_WAR_NGePportlet_:form:j_idt135" name="_BpmTaskList_WAR_NGePportlet_:form:j_idt135" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all"/>[22m
[2m    - fill("")[22m
[2m  - attempting fill action[22m
[2m    2 × waiting for element to be visible, enabled and editable[22m
[2m      - element is not visible[22m
[2m    - retrying fill action[22m
[2m    - waiting 20ms[22m
[2m    2 × waiting for element to be visible, enabled and editable[22m
[2m      - element is not visible[22m
[2m    - retrying fill action[22m
[2m      - waiting 100ms[22m
[2m    59 × waiting for element to be visible, enabled and editable[22m
[2m       - element is not visible[22m
[2m     - retrying fill action[22m
[2m       - waiting 500ms[22m

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
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_p_auth=cejPh5q2&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - row "CO260000000006648 Purchase Order INV0000011 WIP-8687-DLOA- CONTRACTED-CENTRAL-ASWHEN-PENDING PAYMENT MATCH-SIT 23/11/2026 10:52 Pending Payment Match Claim":
        - gridcell "CO260000000006648"
        - gridcell "Purchase Order"
        - gridcell "INV0000011 WIP-8687-DLOA- CONTRACTED-CENTRAL-ASWHEN-PENDING PAYMENT MATCH-SIT":
          - link "INV0000011 WIP-8687-DLOA- CONTRACTED-CENTRAL-ASWHEN-PENDING PAYMENT MATCH-SIT":
            - /url: "#"
        - gridcell "23/11/2026 10:52"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000006450 Purchase Order INV000003 WIP-8687-DLOA- CONTRACTED-MINISTRY-ONEOFF-PENDING PAYMENT MATCH-SIT 19/11/2026 16:32 Pending Payment Match Claim":
        - gridcell "CO260000000006450"
        - gridcell "Purchase Order"
        - gridcell "INV000003 WIP-8687-DLOA- CONTRACTED-MINISTRY-ONEOFF-PENDING PAYMENT MATCH-SIT":
          - link "INV000003 WIP-8687-DLOA- CONTRACTED-MINISTRY-ONEOFF-PENDING PAYMENT MATCH-SIT":
            - /url: "#"
        - gridcell "19/11/2026 16:32"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000006449 Purchase Order INV000002 WIP-8687-DLOA- CONTRACTED-MINISTRY-SCHEDULE-PENDING PAYMENT MATCH-SIT 19/11/2026 16:31 Pending Payment Match Claim":
        - gridcell "CO260000000006449"
        - gridcell "Purchase Order"
        - gridcell "INV000002 WIP-8687-DLOA- CONTRACTED-MINISTRY-SCHEDULE-PENDING PAYMENT MATCH-SIT":
          - link "INV000002 WIP-8687-DLOA- CONTRACTED-MINISTRY-SCHEDULE-PENDING PAYMENT MATCH-SIT":
            - /url: "#"
        - gridcell "19/11/2026 16:31"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000006448 Purchase Order INV000001 WIP-8687-DLOA- CONTRACTED-MINISTRY-ASWHEN-PENDING PAYMENT MATCH-SIT 19/11/2026 16:31 Pending Payment Match Claim":
        - gridcell "CO260000000006448"
        - gridcell "Purchase Order"
        - gridcell "INV000001 WIP-8687-DLOA- CONTRACTED-MINISTRY-ASWHEN-PENDING PAYMENT MATCH-SIT":
          - link "INV000001 WIP-8687-DLOA- CONTRACTED-MINISTRY-ASWHEN-PENDING PAYMENT MATCH-SIT":
            - /url: "#"
        - gridcell "19/11/2026 16:31"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PD260000000000495 Purchase In Default DO NOT USE - TEST PID ZAKWAN 17/11/2026 17:37 24/11/2026 17:37 Pending Verification Claim":
        - gridcell "PD260000000000495"
        - gridcell "Purchase In Default"
        - gridcell "DO NOT USE - TEST PID ZAKWAN":
          - link "DO NOT USE - TEST PID ZAKWAN":
            - /url: "#"
        - gridcell "17/11/2026 17:37"
        - gridcell "24/11/2026 17:37"
        - gridcell "Pending Verification"
        - gridcell "Claim":
          - button "Claim"
      - row "PO260000000007002 Purchase Order IN-PO260000000007002 WIP_SM/FL40863_01 16/11/2026 12:59 Pending Payment Match Claim":
        - gridcell "PO260000000007002"
        - gridcell "Purchase Order"
        - gridcell "IN-PO260000000007002 WIP_SM/FL40863_01":
          - link "IN-PO260000000007002 WIP_SM/FL40863_01":
            - /url: "#"
        - gridcell "16/11/2026 12:59"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PO260000000006242 Purchase Order INV022910080811 30911 - NON CONTRACTED - (19/10) 19/10/2026 16:30 Pending Payment Match Claim":
        - gridcell "PO260000000006242"
        - gridcell "Purchase Order"
        - gridcell "INV022910080811 30911 - NON CONTRACTED - (19/10)":
          - link "INV022910080811 30911 - NON CONTRACTED - (19/10)":
            - /url: "#"
        - gridcell "19/10/2026 16:30"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005674 Purchase Order INV02291008081991 30911 - PENDING SUPPLIER ACK (19/10) 19/10/2026 12:16 Pending Payment Match Claim":
        - gridcell "CO260000000005674"
        - gridcell "Purchase Order"
        - gridcell "INV02291008081991 30911 - PENDING SUPPLIER ACK (19/10)":
          - link "INV02291008081991 30911 - PENDING SUPPLIER ACK (19/10)":
            - /url: "#"
        - gridcell "19/10/2026 12:16"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005673 Purchase Order INV01900111111 30911 - PENDING SUPPLIER ACK 19/10/2026 11:38 Pending Payment Match Claim":
        - gridcell "CO260000000005673"
        - gridcell "Purchase Order"
        - gridcell "INV01900111111 30911 - PENDING SUPPLIER ACK":
          - link "INV01900111111 30911 - PENDING SUPPLIER ACK":
            - /url: "#"
        - gridcell "19/10/2026 11:38"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
      - row "PO260000000006237 Purchase Order INV0229100808 30911 - NON-CONTRACTED FL - (16/10) 16/10/2026 11:37 Pending Payment Match Claim":
        - gridcell "PO260000000006237"
        - gridcell "Purchase Order"
        - gridcell "INV0229100808 30911 - NON-CONTRACTED FL - (16/10)":
          - link "INV0229100808 30911 - NON-CONTRACTED FL - (16/10)":
            - /url: "#"
        - gridcell "16/10/2026 11:37"
        - gridcell
        - gridcell "Pending Payment Match"
        - gridcell "Claim":
          - button "Claim"
  - text: Page 1 / 20 p p 1 2 3 4 5 6 7 8 9 10 p p My Task
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
      - row "RN260000000004918 Request Note WIP_SM/FL40863_01 24/11/2026 04:09 01/12/2026 04:09 Pending Approval":
        - gridcell "RN260000000004918"
        - gridcell "Request Note"
        - gridcell "WIP_SM/FL40863_01":
          - link "WIP_SM/FL40863_01":
            - /url: "#"
        - gridcell "24/11/2026 04:09"
        - gridcell "01/12/2026 04:09"
        - gridcell "Pending Approval"
        - gridcell
      - row "CO240000000000109 60000730212400025 Delivery Order hsmd- CHECK PAGINATION FL SUB TABLE 8.0 23/11/2026 23:12 24/11/2026 23:12 Pending Modification Approval":
        - gridcell "CO240000000000109 60000730212400025"
        - gridcell "Delivery Order"
        - gridcell "hsmd- CHECK PAGINATION FL SUB TABLE 8.0":
          - link "hsmd- CHECK PAGINATION FL SUB TABLE 8.0":
            - /url: "#"
        - gridcell "23/11/2026 23:12"
        - gridcell "24/11/2026 23:12"
        - gridcell "Pending Modification Approval"
        - gridcell
      - row "CT260000000000951 Amendment With Supplementary Contract CT_24336_WIP_12_DP _AINHALIM 23/11/2026 16:17 30/11/2026 16:17 Pending Amendment With Supplemental Approval":
        - gridcell "CT260000000000951"
        - gridcell "Amendment With Supplementary Contract"
        - gridcell "CT_24336_WIP_12_DP _AINHALIM":
          - link "CT_24336_WIP_12_DP _AINHALIM":
            - /url: "#"
        - gridcell "23/11/2026 16:17"
        - gridcell "30/11/2026 16:17"
        - gridcell "Pending Amendment With Supplemental Approval"
        - gridcell
      - row "PR250000000002422 Purchase Request TSCN_DAFL_017 23/11/2026 15:49 23/12/2026 15:49 Pending Revision Approval":
        - gridcell "PR250000000002422"
        - gridcell "Purchase Request"
        - gridcell "TSCN_DAFL_017":
          - link "TSCN_DAFL_017":
            - /url: "#"
        - gridcell "23/11/2026 15:49"
        - gridcell "23/12/2026 15:49"
        - gridcell "Pending Revision Approval"
        - gridcell
      - row "CO260000000005156 01309H005M2600409 Invoice TSCN_24336_52_DLOA_PTJ3_QUO_Pending Cancellation Approval_JGN USIK 23/11/2026 15:47 30/11/2026 15:47 Pending Cancellation Approval":
        - gridcell "CO260000000005156 01309H005M2600409"
        - gridcell "Invoice"
        - gridcell "TSCN_24336_52_DLOA_PTJ3_QUO_Pending Cancellation Approval_JGN USIK":
          - link "TSCN_24336_52_DLOA_PTJ3_QUO_Pending Cancellation Approval_JGN USIK":
            - /url: "#"
        - gridcell "23/11/2026 15:47"
        - gridcell "30/11/2026 15:47"
        - gridcell "Pending Cancellation Approval"
        - gridcell
      - row "CO260000000002401 60001256552600014 Delivery Order CENTRAL CT SIR 29587 23/11/2026 14:48 30/11/2026 14:48 Pending Cancellation Approval":
        - gridcell "CO260000000002401 60001256552600014"
        - gridcell "Delivery Order"
        - gridcell "CENTRAL CT SIR 29587":
          - link "CENTRAL CT SIR 29587":
            - /url: "#"
        - gridcell "23/11/2026 14:48"
        - gridcell "30/11/2026 14:48"
        - gridcell "Pending Cancellation Approval"
        - gridcell
      - row "PR240000000000021 Purchase Request 28777 smqtfl pend revision approval pr gfd 23/11/2026 12:42 23/12/2026 12:42 Pending Revision Approval":
        - gridcell "PR240000000000021"
        - gridcell "Purchase Request"
        - gridcell "28777 smqtfl pend revision approval pr gfd":
          - link "28777 smqtfl pend revision approval pr gfd":
            - /url: "#"
        - gridcell "23/11/2026 12:42"
        - gridcell "23/12/2026 12:42"
        - gridcell "Pending Revision Approval"
        - gridcell
      - row "CT260000000000866 Amendment With Supplementary Contract CT_24336_WIP_30_DLOA _AINHALIM 23/11/2026 12:10 30/11/2026 12:10 Pending Amendment With Supplemental Approval":
        - gridcell "CT260000000000866"
        - gridcell "Amendment With Supplementary Contract"
        - gridcell "CT_24336_WIP_30_DLOA _AINHALIM":
          - link "CT_24336_WIP_30_DLOA _AINHALIM":
            - /url: "#"
        - gridcell "23/11/2026 12:10"
        - gridcell "30/11/2026 12:10"
        - gridcell "Pending Amendment With Supplemental Approval"
        - gridcell
      - row "RN260000000000153 Request Note testing 23/11/2026 12:06 30/
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
input/text _BpmTaskList_WAR_NGePportlet_:form:j_idt135 = 
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
input/hidden _BpmTaskList_WAR_NGePportlet_:form:normalViewPanelId_collapsed = true
```

## SIT database
- RN RN260000000004918: 60701 Pending Approval · open tasks: Review Direct Purchase → 690127065209
