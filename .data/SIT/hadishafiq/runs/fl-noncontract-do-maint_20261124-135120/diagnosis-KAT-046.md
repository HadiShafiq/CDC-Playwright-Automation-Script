# Diagnosis KAT-046 — Submit Purchase Request from an approved Request Note

Run fl-noncontract-do-maint_20261124-135120 · 2026-11-24T13:53:33+08:00

## Error
```
locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('//span[contains(.,\'I declare\')]/ancestor::tr[1]/td[1]//div[contains(@class,\'ui-chkbox-box\')]').first()[22m

```

## Application messages
- none

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/review-directpurchase?taskId=152371b0-8c51-4a44-90e8-8681cbd97f67&claim=true&docNo=RN260000000004926#!
- Title: Request Note - ePerolehan

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
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/review-directpurchase?p_p_auth=bwYjcCQ3&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - link "Request Note":
        - /url: "#"
- main:
  - heading "Request Note Request Note" [level=1]
  - button "Save"
  - button "Approve"
  - button "Revise"
  - button "Reject"
  - table:
    - rowgroup:
      - row "Request Note No. RN260000000004926 PTJ BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Method Search Catalogue Prepared by Khairulakilah Binti Megat Sharuddin Status Pending Approval":
        - cell "Request Note No."
        - cell "RN260000000004926"
        - cell "PTJ"
        - cell "BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN"
        - cell "Method"
        - cell "Search Catalogue"
        - cell "Prepared by"
        - cell "Khairulakilah Binti Megat Sharuddin"
        - cell "Status"
        - cell "Pending Approval"
      - row:
        - cell
        - cell
  - table:
    - rowgroup:
      - row "* Item Detail Please complete all mandatory ( * ) field. Difference on Procurement Type / Recommended Supplier / PR/LOA Prepared By / Delivery/Service Period / Procurement type Category / Title defined will generate different Purchase Request (PR). Apply to All Remarks Remark is mandatory for Request Note rejection or revision. Remarks Shamsul Azri Bin Abu Bakar ,":
        - cell
        - cell "* Item Detail Please complete all mandatory ( * ) field. Difference on Procurement Type / Recommended Supplier / PR/LOA Prepared By / Delivery/Service Period / Procurement type Category / Title defined will generate different Purchase Request (PR). Apply to All Remarks Remark is mandatory for Request Note rejection or revision. Remarks Shamsul Azri Bin Abu Bakar ,":
          - text: "* Item Detail"
          - link:
            - /url: javascript:void(0)
          - text: Please complete all mandatory ( * ) field. Difference on Procurement Type / Recommended Supplier / PR/LOA Prepared By / Delivery/Service Period / Procurement type Category / Title defined will generate different Purchase Request (PR).
          - table:
            - rowgroup:
              - row:
                - cell:
                  - grid:
                    - rowgroup:
                      - row "Item Procurement Type Market Research Summary * Recommended Supplier Disciplinary Action Taken Price Per Unit (RM) * PR/LOA Prepared By * Delivery / Service Period * Procurement Type Category * Title":
                        - columnheader:
                          - checkbox
                        - columnheader "Item"
                        - columnheader "Procurement Type"
                        - columnheader "Market Research Summary"
                        - columnheader "* Recommended Supplier"
                        - columnheader "Disciplinary Action Taken"
                        - columnheader "Price Per Unit (RM)"
                        - columnheader "* PR/LOA Prepared By"
                        - columnheader "* Delivery / Service Period"
                        - columnheader "* Procurement Type Category"
                        - columnheader "* Title"
                    - rowgroup
                    - rowgroup:
                      - row "PERKHIDMATAN PEMBIAKAN HAIWAN KECIL Ad Hoc Details of price offered by each supplier through market research from search catalogue result No 100.00 60 Days Services WIP_SM/FL40863_01":
                        - gridcell:
                          - checkbox
                        - gridcell "PERKHIDMATAN PEMBIAKAN HAIWAN KECIL":
                          - link "PERKHIDMATAN PEMBIAKAN HAIWAN KECIL":
                            - /url: "#"
                        - gridcell "Ad Hoc":
                          - link "Ad Hoc":
                            - /url: "#"
                        - gridcell "Details of price offered by each supplier through market research from search catalogue result":
                          - link "Details of price offered by each supplier through market research from search catalogue result":
                            - /url: "#"
                            - img "Details of price offered by each supplier through market research from search catalogue result"
                        - gridcell:
                          - grid:
                            - rowgroup:
                              - row "AINHALIM ENTERPRISE Supplier Details":
                                - gridcell "AINHALIM ENTERPRISE":
                                  - textbox: AINHALIM ENTERPRISE
                                  - link:
                                    - /url: "#"
                                - gridcell "Supplier Details":
                                  - link "Supplier Details":
                                    - /url: "#"
                                    - img "Supplier Details"
                        - gridcell "No"
                        - gridcell "100.00"
                        - gridcell:
                          - grid:
                            - rowgroup:
                              - row "Khairulakilah Binti Megat Sharuddin":
                                - gridcell "Khairulakilah Binti Megat Sharuddin":
                                  - textbox: Khairulakilah Binti Megat Sharuddin
                                  - link:
                                    - /url: "#"
                        - gridcell "60 Days":
                          - textbox: "60"
                          - text: Days
                        - gridcell "Services":
                          - combobox:
                            - option "- Select One -"
                            - option "Supply Of Goods"
                            - option "Services" [selected]
                        - gridcell "WIP_SM/FL40863_01":
                          - textbox: WIP_SM/FL40863_01
          - button "Apply to All" [disabled]
          - text: Remarks
          - link:
            - /url: javascript:void(0)
          - text: Remark is mandatory for Request Note rejection or revision.
          - table:
            - rowgroup:
              - row "Remarks Shamsul Azri Bin Abu Bakar ,":
                - cell "Remarks"
                - cell "Shamsul Azri Bin Abu Bakar ,":
                  - table:
                    - rowgroup:
                      - row "Shamsul Azri Bin Abu Bakar ,":
                        - cell "Shamsul Azri Bin Abu Bakar ,":
                          - table:
                            - rowgroup:
                              - row "Shamsul Azri Bin Abu Bakar ,":
                                - cell:
                                  - img
                                - cell
                                - cell "Shamsul Azri Bin Abu Bakar ,"
                              - row:
                                - cell
                                - cell:
                                  - textbox
                - cell
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
```

## Form values (what the page would submit)
```
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form = _scDirectPurchaseTask_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/review-directpurchase?p_p_id=scDirect
select/select-one _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt94:j_idt104_input =  [- Select One -]
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt94:j_idt104_focus = 
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt94:j_idt107 = 
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt94:j_idt103_collapsed = false
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt94:j_idt111_collapsed = false
input/checkbox _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:selAllChk_input = false
input/checkbox _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:j_idt127_input = false
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:afterSave:afterSavelov = AINHALIM ENTERPRISE
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:preparedBy = Khairulakilah Binti Megat Sharuddin 
select/select-one _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somMinistry_input = 955020 [KEMENTERIAN KEWANGAN MALAYSIA]
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somMinistry_focus = 
select/select-one _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somJabatan_input = 955169 [KUMPULAN PTJ PERBENDAHARAAN]
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somJabatan_focus = 
select/select-one _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somPtj_input = 982047 [BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN]
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somPtj_focus = 
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:searchName = 
select/select-one _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somIdType_input =  [- Select One -]
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:somIdType_focus = 
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:searchIc = 
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:userOrgPnlId_collapsed = false
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:dtUserOrg_selection = 
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:beforeSaveLov:userOrgResultPnlId_collapsed = false
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:deliveryTerm = 60
select/select-one _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:procTypeCategory = 816 [Services]
textarea/textarea _scDirectPurchaseTask_WAR_NGePportlet_:form:requestListDataTable:0:procTypeCatTitle = WIP_SM/FL40863_01
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:requestNoteItemDetails_collapsed = false
textarea/textarea _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt436:j_idt442:0:j_idt450 = 
input/hidden _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt436:scRemarkPanelId_collapsed = false
input/text _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt552 = Ad Hoc
textarea/textarea _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt556 = ENGL!SH
textarea/textarea _scDirectPurchaseTask_WAR_NGePportlet_:form:j_idt560 = Testing-Automated-Services
```

## SIT database
- RN RN260000000004926: 60701 Pending Approval · open tasks: Review Direct Purchase → 690127065209
