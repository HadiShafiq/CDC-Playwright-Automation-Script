# Diagnosis KAT-035 — Supplier acknowledges the Purchase Order

Run dp-compare_20261123-204543 · 2026-11-24T01:39:57+08:00

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
- URL: http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_auth=a2TpnlBM&p_p_id=BpmTaskList_WAR_NGePportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=2&p_p_col_pos=1&_BpmTaskList_WAR_NGePportlet__facesViewIdRender=%2Fxhtml%2Fbpmtasklist%2FtaskListView.xhtml#!
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
  - menuitem "My Account NURULAIN BINTI HALIM ":
    - img "My Account"
    - text: NURULAIN BINTI HALIM 
- banner:
  - heading "eP App" [level=1]:
    - link "eP App":
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_p_auth=lJLNR2qt&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - row "CO260000000005449 Purchase Order TSCN_24336_66_DLOA_PTJSabah_QUOtpTEN_Pending Supplier Acknowledgement_JGNUSIK 29/09/2026 14:04 Pending Supplier Acknowledgement Claim":
        - gridcell "CO260000000005449"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_66_DLOA_PTJSabah_QUOtpTEN_Pending Supplier Acknowledgement_JGNUSIK":
          - link "TSCN_24336_66_DLOA_PTJSabah_QUOtpTEN_Pending Supplier Acknowledgement_JGNUSIK":
            - /url: "#"
        - gridcell "29/09/2026 14:04"
        - gridcell
        - gridcell "Pending Supplier Acknowledgement"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005448 Purchase Order TSCN_24336_64_DLOA_PTJ3_QUOtpTEN_Awaiting iGFMAS Response (Invoice)_JGNUSIK 29/09/2026 13:56 Pending Invoice Claim":
        - gridcell "CO260000000005448"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_64_DLOA_PTJ3_QUOtpTEN_Awaiting iGFMAS Response (Invoice)_JGNUSIK":
          - link "TSCN_24336_64_DLOA_PTJ3_QUOtpTEN_Awaiting iGFMAS Response (Invoice)_JGNUSIK":
            - /url: "#"
        - gridcell "29/09/2026 13:56"
        - gridcell
        - gridcell "Pending Invoice"
        - gridcell "Claim":
          - button "Claim"
      - row "LA260000000003602 Letter of Acceptance (LOA) Pending Decision by Approving Authority at Ministry/Jabatan level_PTJ3 _ 2mil_testing 18/09/2026 15:18 Pending Acknowledgement Receipt's Letter Of Acceptance Claim":
        - gridcell "LA260000000003602"
        - gridcell "Letter of Acceptance (LOA)"
        - gridcell "Pending Decision by Approving Authority at Ministry/Jabatan level_PTJ3 _ 2mil_testing":
          - link "Pending Decision by Approving Authority at Ministry/Jabatan level_PTJ3 _ 2mil_testing":
            - /url: "#"
        - gridcell "18/09/2026 15:18"
        - gridcell
        - gridcell "Pending Acknowledgement Receipt's Letter Of Acceptance"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005198 Purchase Order TSCN_24336_56_NQT_PTJSabah_TENTapiAmountQUO_Cancelled CO_JGN USIK 18/09/2026 10:53 Pending Supplier Acknowledgement Claim":
        - gridcell "CO260000000005198"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_56_NQT_PTJSabah_TENTapiAmountQUO_Cancelled CO_JGN USIK":
          - link "TSCN_24336_56_NQT_PTJSabah_TENTapiAmountQUO_Cancelled CO_JGN USIK":
            - /url: "#"
        - gridcell "18/09/2026 10:53"
        - gridcell
        - gridcell "Pending Supplier Acknowledgement"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005196 Purchase Order TSCN_24336_50_NQT_PTJSarawak_QUOTapiAmountTEN_Awaiting iGFMAS Response_JGN USIK 18/09/2026 10:33 Pending Invoice Claim":
        - gridcell "CO260000000005196"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_50_NQT_PTJSarawak_QUOTapiAmountTEN_Awaiting iGFMAS Response_JGN USIK":
          - link "TSCN_24336_50_NQT_PTJSarawak_QUOTapiAmountTEN_Awaiting iGFMAS Response_JGN USIK":
            - /url: "#"
        - gridcell "18/09/2026 10:33"
        - gridcell
        - gridcell "Pending Invoice"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005192 Purchase Order TSCN_24336_47_NQT_PTJ3_TEN_Pending Invoice_JGN USIK 18/09/2026 09:40 Pending Invoice Claim":
        - gridcell "CO260000000005192"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_47_NQT_PTJ3_TEN_Pending Invoice_JGN USIK":
          - link "TSCN_24336_47_NQT_PTJ3_TEN_Pending Invoice_JGN USIK":
            - /url: "#"
        - gridcell "18/09/2026 09:40"
        - gridcell
        - gridcell "Pending Invoice"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005188 Purchase Order JGN USIK FL 24336 - CT260000000001896 Awaiting iGFMAS Response 15/09/2026 15:26 Pending Invoice Claim":
        - gridcell "CO260000000005188"
        - gridcell "Purchase Order"
        - gridcell "JGN USIK FL 24336 - CT260000000001896 Awaiting iGFMAS Response":
          - link "JGN USIK FL 24336 - CT260000000001896 Awaiting iGFMAS Response":
            - /url: "#"
        - gridcell "15/09/2026 15:26"
        - gridcell
        - gridcell "Pending Invoice"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005178 Purchase Order JGN USIK CR3 FL24336 - CT260000000001890 Pending Supplier Acknowledgement 15/09/2026 09:30 Pending Supplier Acknowledgement Claim":
        - gridcell "CO260000000005178"
        - gridcell "Purchase Order"
        - gridcell "JGN USIK CR3 FL24336 - CT260000000001890 Pending Supplier Acknowledgement":
          - link "JGN USIK CR3 FL24336 - CT260000000001890 Pending Supplier Acknowledgement":
            - /url: "#"
        - gridcell "15/09/2026 09:30"
        - gridcell
        - gridcell "Pending Supplier Acknowledgement"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005163 Purchase Order TSCN_24336_57_DLOA_PTJSabah_TEN_Cancelled Invoice_JGN USIK 14/09/2026 15:46 Pending Invoice Claim":
        - gridcell "CO260000000005163"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_57_DLOA_PTJSabah_TEN_Cancelled Invoice_JGN USIK":
          - link "TSCN_24336_57_DLOA_PTJSabah_TEN_Cancelled Invoice_JGN USIK":
            - /url: "#"
        - gridcell "14/09/2026 15:46"
        - gridcell
        - gridcell "Pending Invoice"
        - gridcell "Claim":
          - button "Claim"
      - row "CO260000000005169 Purchase Order TSCN_24336_53_DLOA_PTJSabah_TEN_ Pending Supplier Acknowledgement_JGN USIK 14/09/2026 15:15 Pending Supplier Acknowledgement Claim":
        - gridcell "CO260000000005169"
        - gridcell "Purchase Order"
        - gridcell "TSCN_24336_53_DLOA_PTJSabah_TEN_ Pending Supplier Acknowledgement_JGN USIK":
          - link "TSCN_24336_53_DLOA_PTJSabah_TEN_ Pending Supplier Acknowledgement_JGN USIK":
            - /url: "#"
        - gridcell "14/09/2026 15:15"
        - gridcell
        - gridcell "Pending Supplier Acknowledgement"
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
      - row "PO260000000007216 Purchase Order Title 1 23/11/2026 21:16 07/12/2026 21:16 Pending Supplier Acknowledgement Release":
        - gridcell "PO260000000007216"
        - gridcell "Purchase Order"
        - gridcell "Title 1":
          - link "Title 1":
            - /url: "#"
        - gridcell "23/11/2026 21:16"
        - gridcell "07/12/2026 21:16"
        - gridcell "Pending Supplier Acknowledgement"
        - gridcell "Release":
          - button "Release"
      - row "PO260000000007001 Purchase Order Title 1 16/11/2026 11:06 Pending Invoice Release":
        - gridcell "PO260000000007001"
        - gridcell "Purchase Order"
        - gridcell "Title 1":
          - link "Title 1":
            - /url: "#"
        - gridcell "16/11/2026 11:06"
        - gridcell
        - gridcell "Pending Invoice"
        - gridcell "Release":
          - button "Release"
      - row "CO260000000005157 Purchase Order JGN USIK - FL 24336 - CT260000000001840 Pending Revision (Invoice Cancellation) 14/09/2026 09:58 Pending Revision (Invoice Cancellation)":
        - gridcell "CO260000000005157"
        - gridcell "Purchase Order"
        - gridcell "JGN USIK - FL 24336 - CT260000000001840 Pending Revision (Invoice Cancellation)":
          - link "JGN USIK - FL 24336 - CT260000000001840 Pending Revision (Invoice Cancellation)":
            - /url: "#"
        - gridcell "14/09/2026 09:58"
        - gridcell
        - gridcell "Pending Revision (Invoice Cancellation)"
        - gridcell
      - row "CO260000000005094 Purchase Order JGN USIK - FL 24336 - CT260000000001747 - Pending Revision (Invoice Cancellation) 09/09/2026 14:08 Pending Revision (Invoice Cancellation)":
        - gridcell "CO260000000005094"
        - gridcell "Purchase Order"
        - gridcell "JGN USIK - FL 24336 - CT260000000001747 - Pending Revision (Invoice Cancellation)":
          - link "JGN USIK - FL 24336 - CT260000000001747 - Pending Revision (Invoice Cancellation)":
            - /url: "#"
        - gridcell "09/09/2026 14:08"
        - gridcell
        - gridcell "Pending Revision (Invoice Cancellation)"
        - gridcell
      - row "KU-12082026-0041 Supplier Application Update MOF draft application ( AINHALIM ENTERPRISE ) 12/08/2026 17:25 12/08/2027 17:25 Pending Application Declaration":
        - gridcell "KU-12082026-0041"
        - gridcell "Supplier Application"
        - gridcell "Update MOF draft application ( AINHALIM ENTERPRISE )":
          - link "Update MOF draft application ( AINHALIM ENTERPRISE )":
            - /url: "#"
        - gridcell "12/08/2026 17:25"
        - gridcell "12/08/2027 17:25"
        - gridcell "Pending Application Declaration"
        - gridcell
      - row "CO260000000004803 Purchase Order JGN USIK CR2 - CT260000000000935 - FL24336 - Pending Revision (Invoice Cancellation) 11/08/2026 13:56 Pending Revision (Invoice Cancellation)":
        - gridcell "CO260000000004803"
        - gridcell "Purchase Order"
        - gridcell "JGN USIK CR2 - CT260000000000935 - FL24336 - Pending Revision (Invoice Cancellation)":
          - link "JGN USIK CR2 - CT260000000000935 - FL24336 - Pending Revision (Invoice Cancellation)":
            - /url: "#"
        - gridcell "11/08/2026 13:56"
        - gridcell
        - gridcell "Pending Revision (Invoice Cancellation)"
        - gridcell
      - row "CO260000000004760 Purchase Order FL - CT260000000000968 - Pending Revision (Invoice Cancellation) - jgn usik 07/08/2026 16:24 Pending Revision (Invoice Cancellation)":
        - gridcell "CO260000000004760"
        - gridcell "Purchase Order"
        - gridcell "FL - CT260000000000968 - Pending Revision (Invoice Cancellation) - jgn usik":
          - link "FL - CT260000000000968 - Pending Revision (Invoice Cancellation) - jgn usik":
            - /url
```

## Form values (what the page would submit)
```
input/hidden _profileDisciplinaryAction_WAR_NGePportlet_:form = _profileDisciplinaryAction_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_p_id=profileDisciplinaryA
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
- PI PI260000000000804: 60753 Completed · no open task
- RN RN260000000004916: 60703 Completed · no open task
- PR PR260000000005072: 40300 Purchase Request Approved · no open task
- PO PO260000000007216: 41000 Pending Supplier Acknowledgement · open tasks: Acknowledge PO → nurulainmof, 880801029878
