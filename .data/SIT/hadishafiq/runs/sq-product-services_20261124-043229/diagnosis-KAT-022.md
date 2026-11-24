# Diagnosis KAT-022 — Supplier responds to the Simple Quote (prices every line)

Run sq-product-services_20261124-043229 · 2026-11-24T04:47:26+08:00

## Error
```
❌ SQ Number not found from pagination 1 until 10: SQ260000000002367
```

## Application messages
- none

## Page
- URL: http://ngepsit.eperolehan.com.my/web/epapp/simple-quote-respond#!
- Title: Simple Quote Respond - ePerolehan

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
      - /url: http://ngepsit.eperolehan.com.my/web/epapp/simple-quote-respond?p_p_auth=FWj4t0Tg&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=22621&_49_privateLayout=false
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
      - link "Simple Quote Respond":
        - /url: "#"
- main:
  - heading "Simple Quote Respond Simple Quote Respond" [level=1]
  - grid:
    - rowgroup:
      - row "No. Document No. Procurement Title Start Date End Date Invitation Type ui-button":
        - columnheader "No."
        - columnheader "Document No."
        - columnheader "Procurement Title"
        - columnheader "Start Date"
        - columnheader "End Date"
        - columnheader "Invitation Type ui-button":
          - text: Invitation Type
          - button "ui-button"
    - rowgroup
    - rowgroup:
      - row "1. SQ260000000002365 WIP_SM/FL40863_04_NEW_1 24/11/2026 04:15 27/11/2026 20:15 Simple Quote":
        - gridcell "1."
        - gridcell "SQ260000000002365"
        - gridcell "WIP_SM/FL40863_04_NEW_1":
          - link "WIP_SM/FL40863_04_NEW_1":
            - /url: "#"
        - gridcell "24/11/2026 04:15"
        - gridcell "27/11/2026 20:15"
        - gridcell "Simple Quote"
- contentinfo:
  - img "Secured"
  - text: You are in a secured site.
```

## Form values (what the page would submit)
```
input/hidden _profileDisciplinaryAction_WAR_NGePportlet_:form = _profileDisciplinaryAction_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/simple-quote-respond?p_p_id=profileDi
input/hidden _scSupplierInvitationSq_WAR_NGePportlet_:form = _scSupplierInvitationSq_WAR_NGePportlet_:form
input/hidden javax.faces.encodedURL = http://ngepsit.eperolehan.com.my/web/epapp/simple-quote-respond?p_p_id=scSupplie
```

## SIT database
- SQ SQ260000000002367: 60851 Pending Supplier Response · no open task
