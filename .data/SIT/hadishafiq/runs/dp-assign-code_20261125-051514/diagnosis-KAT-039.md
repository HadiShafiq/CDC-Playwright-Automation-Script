# Diagnosis KAT-039 — Assign Code - Service

Run dp-assign-code_20261125-051514 · 2026-11-25T05:24:34+08:00

## Error
```
❌ RN number not found. Message was: 
```

## Application messages
- error: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/purchase-request?taskId=3e869ae0-de7a-46b4-88e1-f6ac14bc3308&claim=true&docNo=RN260000000004925#!
- Title: Purchase Request - ePerolehan

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
  - menuitem "My Account Khairulakilah Binti Megat Sharuddin ":
    - img "My Account"
    - text: Khairulakilah Binti Megat Sharuddin 
- banner:
  - heading "eP App" [level=1]:
    - link "eP App":
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/purchase-request?p_p_auth=HuY9Utaw&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - link "Purchase Request":
        - /url: "#"
- main:
  - heading "Purchase Request Purchase Request" [level=1]
  - link:
    - /url: "#"
  - list:
    - listitem: Approver is mandatory for document submission. Please select at least one approver. (ERR-750010)
  - table:
    - rowgroup:
      - row "Save Submit Cancel":
        - cell
        - cell "Save Submit Cancel":
          - button "Save"
          - button "Submit"
          - button "Cancel"
  - table:
    - rowgroup:
      - row "Request Note No. RN260000000004925 Purchase Request No. PR260000000005077 PTJ Name BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Prepared By Khairulakilah Binti Megat Sharuddin Status Pending Purchase Request Creation":
        - cell "Request Note No."
        - cell "RN260000000004925":
          - link "RN260000000004925":
            - /url: "#"
        - cell "Purchase Request No."
        - cell "PR260000000005077"
        - cell "PTJ Name"
        - cell "BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN"
        - cell "Prepared By"
        - cell "Khairulakilah Binti Megat Sharuddin"
        - cell "Status"
        - cell "Pending Purchase Request Creation"
  - table:
    - rowgroup:
      - row "Approver Details Approver Group Archie Approver 001 Approver Name - Select One -":
        - cell:
          - tablist:
            - tab "General":
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
            - tab "Approver List" [expanded]:
              - link "Approver List":
                - /url: javascript:void(0)
        - cell "Approver Details Approver Group Archie Approver 001 Approver Name - Select One -":
          - text: Approver Details
          - link:
            - /url: javascript:void(0)
          - table:
            - rowgroup:
              - row "Approver Group Archie Approver 001":
                - cell "Approver Group Archie Approver 001":
                  - table:
                    - rowgroup:
                      - row "Approver Group Archie Approver 001":
                        - cell "Approver Group"
                        - cell "Archie Approver 001":
                          - textbox
                          - text: Archie Approver 001
              - row "Approver Name - Select One -":
                - cell "Approver Name - Select One -":
                  - table:
                    - rowgroup:
                      - row "Approver Name - Select One -":
                        - cell "Approver Name"
                        - cell "- Select One -":
                          - textbox
                          - text: "- Select One -"
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
```

## Form values (what the page would submit)
```
input/hidden _flPurchaseRequest_WAR_NGePportlet_:form = _flPurchaseRequest_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/purchase-request?p_p_id=flPurchaseReq
input/hidden _flPurchaseRequest_WAR_NGePportlet_:form:j_idt18:inputTextBeforeSign = 
select/select-one _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1109_input = 36263 [Archie Approver 001]
input/text _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1109_focus = 
select/select-one _flPurchaseRequest_WAR_NGePportlet_:form:approverDropdown_input =  [- Select One -]
input/text _flPurchaseRequest_WAR_NGePportlet_:form:approverDropdown_focus = 
input/hidden _flPurchaseRequest_WAR_NGePportlet_:form:settingId_collapsed = false
select/select-one _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1126:j_idt1136_input =  [- Select One -]
input/text _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1126:j_idt1136_focus = 
input/text _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1126:j_idt1139 = 
input/hidden _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1126:j_idt1135_collapsed = false
input/hidden _flPurchaseRequest_WAR_NGePportlet_:form:j_idt1126:j_idt1143_collapsed = false
input/text _flPurchaseRequest_WAR_NGePportlet_:form:commodityCodeId = 
textarea/textarea _flPurchaseRequest_WAR_NGePportlet_:form:commodityTitleId = 
input/text _flPurchaseRequest_WAR_NGePportlet_:form:segmentCodeId = 
textarea/textarea _flPurchaseRequest_WAR_NGePportlet_:form:segmentTitleId = 
```

## SIT database
- RN RN260000000004925: 60703 Completed · open tasks: Submit PR → 710527085562
