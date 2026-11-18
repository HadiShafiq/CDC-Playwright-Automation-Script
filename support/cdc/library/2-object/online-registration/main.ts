import { Page, Locator } from "@playwright/test";
import { FORM_PREFIX } from "./data";
import { LABELS } from "./data";
import { Language } from "../shared/data";

export class OnlineRegistrationPage {
    private page: Page;
    private labels: typeof LABELS["en"]

    constructor(page: Page, language: Language) {
        this.page = page;
        this.labels = LABELS[language];
    }

    get downloadsMenu() {
        return this.page.getByRole("menuitem", { name: "DOWNLOADS" });
    }

    get quickLinksMenu() {
        return this.page.getByRole("menuitem", { name: "QUICK LINKS" });
    }

    get supplierRegistrationMenu() {
        return this.page.getByRole("menuitem", { name: "New Supplier Registration" });
    }

    get languageDropdown() {
        return this.page.locator('#_82_languageId');
    }

    // --- BUTTONS ---

    get nextBtn() {
        return this.page.getByRole("button", {name: this.labels.NEXT});
    }

    get previousBtn() {
        return this.page.getByRole("button", {name: this.labels.PREVIOUS});
    }

    get submitBtn() {
        return this.page.getByRole("button", {name: this.labels.SUBMIT});
    }

    get proceedBtn() {
        return this.page.getByRole("button", {name: this.labels.PROCEED});
    }

    // --- 1ST PAGE (CHOOSE ACCOUNT TYPE) --- 2ND PAGE (TERMS & CONDITIONS ) ---

    
    get accountRadio() {
        return this.page.locator('.ui-radiobutton-box');
    }
  
    get tncCheckbox() {
        return this.page.locator(`[id="${FORM_PREFIX}chkTcId"] .ui-chkbox-box`); //(.click)
    }

    // --- 3RD PAGE ( [ ACCOUNT/COMPANY/INDIVIDUAL/OWNER/GST/NOB/BANK ] INFORMATION) ---

    // --- ACCOUNT INFORMATION ---

    get suppType() {
        return "suppTypeId"; // suffix used in pfSelectOneMenu
    }

    get businessType() {
        return "busTypeId"; // suffix used in pfSelectOneMenu
    }

    get businessRegNo() {
        return this.page.locator(`[id="${FORM_PREFIX}regNo"]`);
    }

    // --- COMPANY INFORMATION

    get businessCompName() {
        return this.page.locator(`[id="${FORM_PREFIX}companyNameId"]`);
    }
    
    //date(unsure)
    get businessEstDateUI() {
        return this.page.getByRole('button', { name: 'ui-button' });
    }

    get businessEstDate() {
        return this.page.getByRole('link', { name: '1', exact: true });
    }

    get businessIncomeTax() {
        return this.page.locator(`[id="${FORM_PREFIX}incomeTaxId"]`);
    }

    get businessCompAdd1() {
        return this.page.locator(`[id="${FORM_PREFIX}compAdd1"]`);
    }

    get businessCompAdd2() {
        return this.page.locator(`[id="${FORM_PREFIX}compAdd2"]`);
    }

    get businessCompAdd3() {
        return this.page.locator(`[id="${FORM_PREFIX}compAdd3"]`);
    }

    get businessPostcode() {
        return this.page.locator(`[id="${FORM_PREFIX}compPostCodeMy"]`);
    }

    get businessState() {
        return "busState"; // suffix used in pfSelectOneMenu
    }

    get businessDivision() {
        return "busDivision"; // suffix used in pfSelectOneMenu
    }

    get businessDistrict() {
        return "busDistrict"; // suffix used in pfSelectOneMenu
    }

    get businessCity() {
        return "busCity"; // suffix used in pfSelectOneMenu
    }

    get businessLocalAuthority() {
        return "localAuthorityId"; // suffix used in pfSelectOneMenu
    }

    get xCoordinate() {
        return this.page.locator(`[id="${FORM_PREFIX}acgmap:gmapInput:plat"]`);
    }

    get yCoordinate() {
        return this.page.locator(`[id="${FORM_PREFIX}acgmap:gmapInput:plng"]`);
    }

    get viewMapBtn() {
        return this.page.getByRole("button", {name: this.labels.VIEW_MAP});
    }

    get dialogCloseButton() {
        return this.page.locator('a.ui-dialog-titlebar-close');
    }    

    get phoneNoCountryCode() {
        return this.page.locator(`[id="${FORM_PREFIX}telNoId:countryCodeCompId"]`);
    }

    get phoneNoAreaCode() {
        return this.page.locator(`[id="${FORM_PREFIX}telNoId:areaCodeCompId"]`);
    }

    get phoneNoNumber() {
        return this.page.locator(`[id="${FORM_PREFIX}telNoId:phoneNoCompId"]`);
    }

    get faxNoCountryCode() {
        return this.page.locator(`[id="${FORM_PREFIX}faxNoId:countryCodeCompId"]`);
    }

    get faxNoAreaCode() {
        return this.page.locator(`[id="${FORM_PREFIX}faxNoId:areaCodeCompId"]`);
    }

    get faxNoNumber() {
        return this.page.locator(`[id="${FORM_PREFIX}faxNoId:phoneNoCompId"]`);
    }

    // --- INDIVIDUAL REGISTRATION INFORMATION ---

    get indvService() {
        return "serviceTypeId"; // suffix used in pfSelectOneMenu
    }

    
    bumiRadio(option: string) {
        return this.page.getByLabel(option);
    }

    get indvIC() {
        return this.page.locator(`[id="${FORM_PREFIX}individualRegNoId"]`);
    }

    get indvName() {
        return this.page.locator(`[id="${FORM_PREFIX}individualNameId"]`);
    }

    get indvAddr1() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermAdd1"]`);
    }

    get indvAddr2() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermAdd2"]`);
    }

    get indvAddr3() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermAdd3"]`);
    }

    religionRadio(option: string) {
        return this.page.getByLabel(option);
    }

    get indvDOB() {
        return this.page.locator(`[id="${FORM_PREFIX}dobCalId_input"]`);
    }

    get indvState() { 
        return "cmbPermState"; 
    }
    
    get indvDistrict() { 
        return "cmbPermDistrict"; 
    }
    
    get indvCity() { 
        return "cmbPermCity"; 
    }

    get indvPostcode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermPostCodeMy"]`);
    }

    // --- INDIVIDUAL CONTACT INFORMATION ---

    get indvTelNoCountryCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPhoneNoId:countryCodeCompId"]`);
    }

    get indvTelNoAreaCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPhoneNoId:areaCodeCompId"]`);
    }

    get indvTelNoNum() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPhoneNoId:phoneNoCompId"]`);
    }

    get indvEmail() {
        return this.page.locator(`[id="${FORM_PREFIX}usrEmail"]`);
    }

    get indvConfirmEmail() {
        return this.page.locator(`[id="${FORM_PREFIX}conEmail"]`);
    }

    get indvContactAddr1() {
        return this.page.locator(`[id="${FORM_PREFIX}conAddress1"]`);
    }

    get indvContactAddr2() {
        return this.page.locator(`[id="${FORM_PREFIX}conAddress2"]`);
    }

    get indvContactAddr3() {
        return this.page.locator(`[id="${FORM_PREFIX}conAddress3"]`);
    }
    
    get indvMobileNoCountryCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtMobileNoId:countryCodeCompId"]`);
    }

    get indvMobileNoAreaCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtMobileNoId:areaCodeCompId"]`);
    }

    get indvMobileNoNum() {
        return this.page.locator(`[id="${FORM_PREFIX}txtMobileNoId:phoneNoCompId"]`);
    }

    get indvContactState() {
        return "cmbResState";
    }
    
    get indvContactDistrict() {
        return "cmbResDistrict";
    }
    
    get indvContactCity() {
        return "cmbResCity";
    }

    get indvContactPostcode() {
        return this.page.locator(`[id="${FORM_PREFIX}conPostCodeMy"]`);
    }

    // --- OWNER INFORMATION ---

    get ownerName() {
        return this.page.locator(`[id^="${FORM_PREFIX}tableOwner:0"][role="textbox"]`);
    }

    get ownerIdNo() {
        return this.page.locator(`[id^="${FORM_PREFIX}tableOwner:0"][role="textbox"]`);
    }

    // --- GST INFORMATION ---

    get gstRegNoId () {
        return this.page.locator(`[id="${FORM_PREFIX}gstRegNoId"]`);
    }

    get gstRegEffDate () {
        return this.page.locator(`[id="${FORM_PREFIX}gstEffDateCalId_input"]`);
    }

    get gstRegEndDate () {
        return this.page.locator(`[id="${FORM_PREFIX}gstEndDateCalId_input"]`);
    }

    // --- NATURE OF BUSINESS --- 

    get nobAddBtn() {
        return this.page.locator(`[id="${FORM_PREFIX}busiNatureId:busiNatureIdlovBtn"]`);
    }
    
    get nobDeleteBtn() {
        return this.page.locator(`[id="${FORM_PREFIX}btnRemove"]`);
    }

    get nobSearchLabel() {
        return this.page.locator(`[id="${FORM_PREFIX}j_idt322:j_idt328_label"]`);
    }
    
    get nobSearchPanel() {
        return this.page.locator(`[id="${FORM_PREFIX}j_idt322:j_idt328_panel"]`);
    }

    get nobSearchField() {
        return this.page.locator(`[id="${FORM_PREFIX}j_idt322:j_idt331"]`);
    }

    get searchBtn() {
        return this.page.getByRole("button", { name: this.labels.SEARCH });
    }

    get resetBtn() {
        return this.page.getByRole("button", {name: this.labels.RESET});
    }

    getLovTable() {
        return this.page.locator(`[id="${FORM_PREFIX}j_idt322:lovTb2_data"]`);
    }
    
    getCheckboxByRowText(text: string) {
        return this.getLovTable().locator("tr", { hasText: text }).locator(".ui-chkbox-box");
    }

    get selectBtn() {
        return this.page.getByRole("button", {name: this.labels.SELECT});
    }

    get cancelBtn() {
        return this.page.getByRole("button", {name: this.labels.CANCEL});
    }

    // --- BANK INFORMATION ---

    get addBankButton() {
    return this.page.locator(`[id="${FORM_PREFIX}addBnkBtnId"]`);
    }

    get deleteBankButton() {
        return this.page.locator(`[id="${FORM_PREFIX}deleteBnkBtnId"]`);
    }

    get bankName() {
        return "bankInfoId:0:bankNameId";
    }

    get bankAccNo() {
        return this.page.locator(`[id="${FORM_PREFIX}bankInfoId:0:bankAccNoId"]`);
    }

    // --- PROFESSIONAL CERT ---

    get profCertAddBtn() {
        return this.page.locator('button[onclick*="pnlProfCert"]').first();
    }

    get profBodyName() {
        return "profBodyId:0:profBodyName";
    }

    get profBodyRegNo() {
        return this.page.locator(`[id="${FORM_PREFIX}profBodyId:0:assocBodyRegNoId"]`);
    }

    get profBodyExpDate() {
        return this.page.locator(`[id="${FORM_PREFIX}profBodyId:0:assocBodyExpDateId_input"]`);
    }

    // --- 4th PAGE ( SUPPLIER ADMINISTRATOR INFORMATION )
   
    // --- SUPPLIER ADMINISTRATOR INFORMATION ---

    get supplierCheckbox1() {
        return this.page.getByRole('cell', { name: this.labels.SUPPLIER_CHECKBOX }).locator('div').nth(2);
    }

    get supplierCheckbox() {
        return this.page
            .locator(`td:has-text("${this.labels.SUPPLIER_CHECKBOX}")`)
            .locator('.ui-chkbox-box');
    }

    get suppFullName() {
        return this.page.locator(`[id="${FORM_PREFIX}fullName"]`);
    }

    get suppSalutation() {
        return "salutationId"; // suffix used in pfSelectOneMenu
    }    

    get suppIdNo() {
        return this.page.locator(`[id="${FORM_PREFIX}txtIdNumber1"]`);
    }

    get suppDOB() {
        return this.page.locator(`[id="${FORM_PREFIX}dobCalId_input"]`);
    }

    get bumiputeraButton() {
        return this.page.locator('.ui-radiobutton-box').first();
    }

    get nonBumiputeraButton() {
        return this.page.locator('td:nth-child(3) > .ui-radiobutton > .ui-radiobutton-box').first()
    }
    
    // Example of a hover/active radio button (if needed)
    get muslimButton() {
        //return this.page.locator('.ui-radiobutton-box.ui-widget.ui-corner-all.ui-state-default.ui-state-hover');
        return this.page.locator('[id="_onlineRegistration_WAR_NGePportlet_:form:religionId"] > tbody > tr > td > .ui-radiobutton > .ui-radiobutton-box').first();
    }

    get nonMuslimButton() {
        //return this.page.locator('.ui-radiobutton-box.ui-widget.ui-corner-all.ui-state-default.ui-state-hover');
        return this.page.locator('[id="_onlineRegistration_WAR_NGePportlet_:form:religionId"] > tbody > tr > td:nth-child(3) > .ui-radiobutton > .ui-radiobutton-box');
    }

    get suppAddr1() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermAdd1"]`);
    }

    get suppAddr2() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermAdd2"]`);
    }

    get suppAddr3() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermAdd3"]`);
    }

    get suppCountry() {
        return "cmbPermCounrty"; // suffix used in pfSelectOneMenu
    }
    
    get suppState() {
        return "cmbPermState"; // suffix used in pfSelectOneMenu
    }
    
    get suppDistrict() {
        return "cmbPermDistrict"; // suffix used in pfSelectOneMenu
    }
    
    get suppCity() {
        return "cmbPermCity"; // suffix used in pfSelectOneMenu
    }

    get suppPostcode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPermPostcodeMy"]`);
    }

    get suppPosition() {
        return this.page.locator('input[role="textbox"][name^="_onlineRegistration_WAR_NGePportlet_:form:"]').nth(7);
    }

    // checkbox(unsure)
    get suppRoleManagementCheckbox() {
        return this.page.locator('input[type="checkbox"][name^="_onlineRegistration_WAR_NGePportlet_:form:"]').nth(5);
    }

    getCheckboxByLabel(labelText: string) {
        return this.page
            .locator('td span', { hasText: labelText })
            .locator('xpath=preceding-sibling::div[contains(@class,"ui-chkbox-box")]');
    }

    get suppTelNoCountryCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPhoneNoId:countryCodeCompId"]`);
    }

    get suppTelNoAreaCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPhoneNoId:areaCodeCompId"]`);
    }

    get suppTelNoNum() {
        return this.page.locator(`[id="${FORM_PREFIX}txtPhoneNoId:phoneNoCompId"]`);
    }

    get suppmobileNoCountryCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtMobileNoId:countryCodeCompId"]`);
    }

    get suppmobileNoAreaCode() {
        return this.page.locator(`[id="${FORM_PREFIX}txtMobileNoId:areaCodeCompId"]`);
    }

    get suppmobileNoNum() {
        return this.page.locator(`[id="${FORM_PREFIX}txtMobileNoId:phoneNoCompId"]`);
    }

    get suppTelco() {
        return "txtMobileNoId:telcoCompId"; // suffix used in pfSelectOneMenu
    }    

    get suppEmail() {
        return this.page.locator(`[id="${FORM_PREFIX}usrEmail"]`);
    }

    get suppConfirmEmail() {
        return this.page.locator(`[id="${FORM_PREFIX}conEmail"]`);
    }

    get suppAddrCheckbox() {
        return this.page.locator(`[id="${FORM_PREFIX}chkAddMode"] .ui-chkbox-box`);
    }

    get suppCorrAddr1() {
        return this.page.locator(`[id="${FORM_PREFIX}conAddress1"]`);
    }

    get suppCorrAddr2() {
        return this.page.locator(`[id="${FORM_PREFIX}conAddress2"]`);
    }

    get suppCorrAddr3() {
        return this.page.locator(`[id="${FORM_PREFIX}conAddress3"]`);
    }
    
    get suppCorrState() {
        return "cmbResState"; // suffix used in pfSelectOneMenu
    }
    
    get suppCorrDistrict() {
        return "cmbResDistrict"; // suffix used in pfSelectOneMenu
    }
    
    get suppCorrCity() {
        return "cmbResCity"; // suffix used in pfSelectOneMenu
    }

    get suppCorrPostcode() {
        return this.page.locator(`[id="${FORM_PREFIX}conPostCodeMy"]`);
    }

    get termsCheckbox() {
        return this.page
            .getByRole('row', { name: this.labels.TERMS_AND_CONDITIONS })
            .locator('div.ui-chkbox-box');
    }

    // ============================================================
// ADD THESE to the OnlineRegistrationPage class in main.ts
// ============================================================

    // --- G2G: ORG TYPE SEARCH ---

    get g2gOrgType() {
        return "orgTypeCodeSearchId"; // suffix used in pfSelectOneMenu
    }

    get agencyNameInput() {
        return this.page.locator('tr', { hasText: this.labels.AGENCY_NAME }).locator('input[type="text"]');
    }

    // reuses existing searchBtn (getByRole "Search") — no new locator needed

    get agencyFirstResultSelectBtn() {
        // Stable: icon src is language-independent (title attribute changes EN/BM, src doesn't)
        return this.page.locator('[id$="orgProfileDtId"] img[src*="edit.png"]').first();
    }

    // --- G2G: BANK HQ CHECKBOX ---

    get bankHQCheckbox() {
        return this.page
            .locator('tr', { hasText: this.labels.HEAD_QUARTERS })
            .locator('.ui-chkbox-box')
            .last();
    }

     // --- G2G: SUPPLIER ADMIN INFORMATION (Page 2) ---
 
     get g2gSuppIdNo() {
        // G2G uses txtIdNumber (no "1" suffix) — different from suppIdNo = txtIdNumber1
        return this.page.locator(`[id="${FORM_PREFIX}txtIdNumber"]`);
    }
 
    get g2gSuppPosition() {
        return this.page
            .locator('td', { hasText: this.labels.POSITION_IN_COMPANY })
            .locator('xpath=following-sibling::td[1]')
            .locator('input[type="text"]');
    }
 
    get g2gSuppDepartment() {
        return this.page
            .locator('td', { hasText: this.labels.DEPARTMENT_DIVISION })
            .locator('xpath=following-sibling::td[1]')
            .locator('input[type="text"]');
    }
 
    get g2gSuppUnit() {
        return this.page
            .locator('td', { hasText: this.labels.UNIT_SECTION })
            .locator('xpath=following-sibling::td[1]')
            .locator('input[type="text"]');
    }
 
    get g2gMuslimCell() {
        // G2G Muslim radio is triggered by clicking the cell (nth(1) skips header cell)
        // Different from existing muslimButton which scopes to the supplier religion table
        return this.page.getByRole('cell', { name: this.labels.MUSLIM }).nth(1);
    }
}
