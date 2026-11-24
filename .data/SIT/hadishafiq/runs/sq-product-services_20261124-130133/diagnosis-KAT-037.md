# Diagnosis KAT-037 — Create Simple Quote - Product plus Services

Run sq-product-services_20261124-130133 · 2026-11-24T13:11:22+08:00

## Error
```
❌ Dropdown failed (stale/DOM refresh): DLOA/4. DLOA - Requestioner/2. Item List/Fulfilment Type Services
```

## Application messages
- none

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/catalogue-search#!
- Title: Catalogue Search - ePerolehan

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
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/catalogue-search?p_p_auth=aFWS6hhg&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - link "Direct Purchase":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/direct-purchase
      - text: /
    - listitem:
      - link "Catalogue Search":
        - /url: "#"
- main:
  - heading "Catalogue Search Catalogue Search" [level=1]
  - text: Simple Quote
  - table:
    - rowgroup:
      - row:
        - cell
        - cell
  - button "<< Item Search"
  - button "Save"
  - button "Submit"
  - button "Cancel"
  - table:
    - rowgroup:
      - row "Simple Quote No. -- System Generated -- Procurement Type Normal PTJ BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN Prepared By Khairulakilah Binti Megat Sharuddin Status Pending Submission":
        - cell "Simple Quote No. -- System Generated --":
          - table:
            - rowgroup:
              - row "Simple Quote No. -- System Generated --":
                - cell "Simple Quote No."
                - cell "-- System Generated --"
        - cell "Procurement Type"
        - cell "Normal"
        - cell "PTJ"
        - cell "BAHAGIAN PENTADBIRAN - CAWANGAN KEWANGAN - KEMENTERIAN KEWANGAN"
        - cell "Prepared By"
        - cell "Khairulakilah Binti Megat Sharuddin"
        - cell "Status"
        - cell "Pending Submission"
  - table:
    - rowgroup:
      - row "Please click forItem and Specification Preparation Guideline. Please click the UOM link for unit of measurement name search as a guide. The desired units of measurement need to be enter in the UOM field box and selection from the display 'autocomplete' list. A change to the item name (extension information) selected from the catalogue will cause a change to the item code for that item. Product List Clone Service List Clone":
        - cell:
          - tablist:
            - tab "General Information":
              - link "General Information":
                - /url: javascript:void(0)
            - tab "Zone":
              - link "Zone":
                - /url: javascript:void(0)
            - tab "Item List" [expanded]:
              - link "Item List":
                - /url: javascript:void(0)
            - tab "Criteria and Supplier List":
              - link "Criteria and Supplier List":
                - /url: javascript:void(0)
        - cell "Please click forItem and Specification Preparation Guideline. Please click the UOM link for unit of measurement name search as a guide. The desired units of measurement need to be enter in the UOM field box and selection from the display 'autocomplete' list. A change to the item name (extension information) selected from the catalogue will cause a change to the item code for that item. Product List Clone Service List Clone":
          - text: Please click for
          - link "Item and Specification Preparation Guideline.":
            - /url: "#"
          - text: Please click the UOM link for unit of measurement name search as a guide. The desired units of measurement need to be enter in the UOM field box and selection from the display 'autocomplete' list. A change to the item name (extension information) selected from the catalogue will cause a change to the item code for that item. Product List
          - link:
            - /url: javascript:void(0)
          - grid:
            - rowgroup:
              - row "* Item * UOM * Price Type * Quantity * Delivery Period ui-button":
                - columnheader "* Item"
                - columnheader "* UOM"
                - columnheader "* Price Type"
                - columnheader "* Quantity"
                - columnheader "* Delivery Period"
                - columnheader "ui-button":
                  - button "ui-button"
              - row "* Specification":
                - columnheader "* Specification"
            - rowgroup
            - rowgroup:
              - row "Prod2 AU - Activity unit UOM Normal Standard 10 30 Days ui-button ui-button":
                - gridcell "Prod2":
                  - textbox: Prod2
                  - link:
                    - /url: "#"
                - gridcell "AU - Activity unit UOM":
                  - textbox "AU - Activity unit"
                  - link "UOM":
                    - /url: "#"
                - gridcell "Normal Standard":
                  - combobox:
                    - option "- Select One -"
                    - option "Normal Standard" [selected]
                    - option "Tier Standard"
                - gridcell "10":
                  - textbox: "10"
                - gridcell "30 Days":
                  - textbox: "30"
                  - text: Days
                - gridcell "ui-button ui-button":
                  - button "ui-button"
                  - button "ui-button"
              - row "KERTAS MINYAK minyak M KEPING GULUNG brown 14111503005010013D AU - Activity unit UOM Normal Standard 10 30 Days ui-button ui-button":
                - gridcell "KERTAS MINYAK minyak M KEPING GULUNG brown 14111503005010013D":
                  - textbox: KERTAS MINYAK
                  - textbox: minyak M KEPING GULUNG brown
                  - link "14111503005010013D":
                    - /url: "#"
                - gridcell "AU - Activity unit UOM":
                  - textbox "AU - Activity unit"
                  - link "UOM":
                    - /url: "#"
                - gridcell "Normal Standard":
                  - combobox:
                    - option "- Select One -"
                    - option "Normal Standard" [selected]
                    - option "Tier Standard"
                - gridcell "10":
                  - textbox: "10"
                - gridcell "30 Days":
                  - textbox: "30"
                  - text: Days
                - gridcell "ui-button ui-button":
                  - button "ui-button"
                  - button "ui-button"
              - row "Product Specification2 ui-button ui-button":
                - gridcell "Product Specification2":
                  - textbox: Product Specification2
                  - link:
                    - /url: "#"
                - gridcell
                - gridcell
                - gridcell
                - gridcell
                - gridcell "ui-button ui-button":
                  - button "ui-button"
                  - button "ui-button"
          - button "Clone"
          - text: Service List
          - link:
            - /url: javascript:void(0)
          - grid:
            - rowgroup:
              - row "* Item * Fulfilment Type * UOM * Freq. per UOM * No. UOM per day * No. UOM per month * Duration (Month) * Quantity * Service Period ui-button":
                - columnheader "* Item"
                - columnheader "* Fulfilment Type"
                - columnheader "* UOM"
                - columnheader "* Freq. per UOM"
                - columnheader "* No. UOM per day"
                - columnheader "* No. UOM per month"
                - columnheader "* Duration (Month)"
                - columnheader "* Quantity"
                - columnheader "* Service Period"
                - columnheader "ui-button":
                  - button "ui-button"
              - row "* Specification":
                - columnheader "* Specification"
            - rowgroup
            - rowgroup:
              - row "No records found":
                - gridcell "No records found"
          - button "Clone"
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
      - link "My Application":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/my-application
      - text: /
    - listitem:
      - link "Direct Purchase":
        - /url: http://ngepsit.eperolehan.com.my/web/epapp/direct-purchase
      - text: /
    - listitem:
      - link "Catalogue Search":
        - /url: "#"
```

## Form values (what the page would submit)
```
input/hidden _Catalogue_WAR_NGePportlet_:form = _Catalogue_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/catalogue-search?p_p_id=Catalogue_WAR
input/text _Catalogue_WAR_NGePportlet_:form:j_idt233 = 
input/text _Catalogue_WAR_NGePportlet_:form:j_idt235 = 
input/hidden _Catalogue_WAR_NGePportlet_:form:measurementPanel_collapsed = false
input/hidden _Catalogue_WAR_NGePportlet_:form:uomResultPanel_collapsed = false
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:titleName = Prod2
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:commodityCodeId = 
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:commodityTitleId = 
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:segmentCodeId = 
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:segmentTitleId = 
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:uom_input = AU  - Activity unit
input/hidden _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:uom_hinput = 6
select/select-one _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:priceType = 294 [Normal Standard]
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:qty = 10
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:0:deliveryTerm = 30
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:titleName = KERTAS MINYAK
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:extensionName = minyak M KEPING GULUNG brown
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:commodityCodeId = 
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:commodityTitleId = 
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:segmentCodeId = 
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:segmentTitleId = 
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:uom_input = AU  - Activity unit
input/hidden _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:uom_hinput = 6
select/select-one _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:priceType = 294 [Normal Standard]
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:qty = 10
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:1:deliveryTerm = 30
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:2:specification = Product Specification2
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:2:commodityCodeId = 
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:2:commodityTitleId = 
input/text _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:2:segmentCodeId = 
textarea/textarea _Catalogue_WAR_NGePportlet_:form:j_idt246:questionTbl:2:segmentTitleId = 
input/hidden _Catalogue_WAR_NGePportlet_:form:j_idt246:spg_collapsed = false
input/hidden _Catalogue_WAR_NGePportlet_:form:j_idt386:spg_collapsed = false
```

## SIT database
