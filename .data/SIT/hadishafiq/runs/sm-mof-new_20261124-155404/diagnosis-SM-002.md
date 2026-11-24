# Diagnosis SM-002 — Declare the application and pay the processing fee

Run sm-mof-new_20261124-155404 · 2026-11-24T16:34:20+08:00

## Error
```
[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('button', { name: 'Declare' })
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" getByRole('button', { name: 'Declare' }) with timeout 20000ms[22m
[2m  - waiting for getByRole('button', { name: 'Declare' })[22m

```

## Application messages
- error: Missing document(s) : The following documents are mandatory, please upload a valid document for the following list before submitting : 1.)BORANG PENGISYTIHARAN MOF (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide) 2.)MINIT MESYUARAT AGUNG TAHUNAN PERTUBUHAN TERKINI 3.)PERJANJIAN SEWA DIMATIKAN SETEM/ GERAN/ S&P/ BIL UTILITI YANG MENGANDUNGI NAMA DAN ALAMAT SYARIKAT/ SURAT KEBENARAN YANG DITANDATANGAN OLEH PEMILIK PREMIS 4.)SIJIL PENDAFTARAN PERTUBUHAN 5.)SURAT AKUAN SYARIKAT - LAMPIRAN 11 (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide.) 6.)UNDANG-UNDANG TUBUH/ PERLEMBAGAAN PERTUBUHAN (ERR-722537)

## Page
- URL: http://ngepsit.eperolehan.com.my/home
- Title: HOME - ePerolehan

```yaml
- link "Skip to Content":
  - /url: "#main-content"
- banner:
  - heading "ePerolehan" [level=1]:
    - link "ePerolehan":
      - /url: http://ngepsit.eperolehan.com.my/home?p_p_auth=ATy58qAw&p_p_id=49&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_49_struts_action=%2Fmy_sites%2Fview&_49_groupId=10184&_49_privateLayout=false
      - img "ePerolehan"
  - emphasis: Portal last updated on 6 November 2026 04:54:51 PM
  - navigation:
    - menubar "Site Pages":
      - menuitem "HOME"
      - menuitem "ABOUT eP"
      - menuitem "eP USERS"
      - menuitem "VALUE ADDED SERVICES"
      - menuitem "HELP AND REFERENCE"
      - menuitem "DOWNLOADS"
      - menuitem "QUICK LINKS"
      - menuitem "SEARCH "
- main
```

## Form values (what the page would submit)
```
```

## SIT database
- AP KN-24112026-0035: 20100 Pending Application Declaration · open tasks: Draft Register Account → 900101921645
