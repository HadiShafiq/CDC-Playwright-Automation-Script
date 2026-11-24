# Diagnosis KAT-039 — Assign Code - Service

Run dp-assign-code_20261125-051514 · 2026-11-25T05:20:50+08:00

## Error
```
RN260000000004925 is not in this account's My Task (no result)
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
  - menuitem "My Account NURULAIN BINTI HALIM ":
    - img "My Account"
    - text: NURULAIN BINTI HALIM 
- banner:
  - heading "eP App" [level=1]:
    - link "eP App":
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/task-list?p_p_auth=5xPlS29G&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
    - rowgroup
  - text: Page 20 / 20 p p 11 12 13 14 15 16 17 18 19 20 p p My Task
  - link:
    - /url: javascript:void(0)
  - table:
    - rowgroup:
      - 'row "Document No : RN260000000004925 Document Type : All All"':
        - cell "Document No :"
        - cell "RN260000000004925":
          - textbox: RN260000000004925
        - cell "Document Type :"
        - cell "All All":
          - combobox:
            - option "All" [selected]
            - option "Amendment With Supplementary Contract"
            - option "Invoice"
            - option "Item Inquiry"
            - option "Procurement Board Approval"
            - option "Contract Order"
            - option "Purchase Order"
            - option "Quotation/Tender"
            - option "Request Extension Code"
            - option "Request Unspsc Code"
            - option "Simple Quote"
            - option "Supplier Application"
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
    - rowgroup
  - text: Page 1 / 20 p p 1 2 3 4 5 6 7 8 9 10 p p
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
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
input/text _BpmTaskList_WAR_NGePportlet_:form:j_idt135 = RN260000000004925
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
- RN RN260000000004925: 60703 Completed · open tasks: Submit PR → 710527085562
