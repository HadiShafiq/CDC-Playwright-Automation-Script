import { BASE_URL } from "../../../base-url";
import { expect, Page } from "@playwright/test";
import { TIMEOUTS } from "../../1-data/config/timeout-config";
import { OnlineRegistrationPage } from "./main";
import { DROPDOWN_OPTIONS, URLS } from "./data";
import { pfSelectOneMenu } from "../../../utils/primeface-dropdown";
import { Language } from "../shared/data";

export class OnlineRegistrationAction {
    private page: Page;
    private language: Language;
    public regPage: OnlineRegistrationPage;

    constructor(page: Page, language: Language) {
        this.page = page;
        this.language = language;
        this.regPage = new OnlineRegistrationPage(page, language);
    }

    // --- NAVIGATION ---

    async goToHome(): Promise<void> {
        await this.page.goto(URLS.HOME);
        await this.page.waitForURL(URLS.HOME);
        //await expect(this.page.getByRole("link", { name: "ePerolehan", exact: true })).toBeVisible({ timeout: 15000 });
    }

    async selectLanguage(): Promise<void> {
        await this.page.locator('[id="_82_languageId"]').selectOption("en_US");
        await this.page.waitForTimeout(5000);
        //await expect(this.page.getByRole("link", { name: "ePerolehan", exact: true })).toBeVisible({ timeout: 15000 });
    }

    async selectLanguageMY(): Promise<void> {
        await this.page.locator('[id="_82_languageId"]').selectOption("ms_MY");
        await this.page.waitForTimeout(5000);
        //await expect(this.page.getByRole("link", { name: "ePerolehan", exact: true })).toBeVisible({ timeout: 15000 });
    }

    async goToOnlineRegistration(): Promise<void> {
        await this.page.goto(`${BASE_URL}/online-registration`);
        await this.page.waitForURL(`${BASE_URL}/online-registration`);
        //await expect(this.page.locator('[class="titleheader"]', { hasText: " Supplier Registration " })).toBeVisible();
    }

    // --- BUTTONS ---

    async clickNext() {
        await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {});
        await this.regPage.nextBtn.click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState("domcontentloaded", { timeout: TIMEOUTS.EXTENDED }).catch(() => {});
    }

    async clickPrevious() {
        await this.regPage.previousBtn.click();
    }

    async clickSubmit() {
        await this.regPage.submitBtn.click();
    }

    async clickProceed() {
        await this.regPage.proceedBtn.click();
    }

    // --- STEP 1: ACCOUNT TYPE ---

    async selectAccountTypeBasic() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.regPage.accountRadio.first()).toBeVisible();
        await this.regPage.accountRadio.first().click();
        await this.regPage.nextBtn.click();
        // Wait for TnC page to load
        await expect(this.regPage.tncCheckbox).toBeVisible({ timeout: 10000 });
    }

    async selectAccountTypeMOF() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.regPage.accountRadio.nth(1)).toBeVisible();
        await this.regPage.accountRadio.nth(1).click();
        await this.regPage.nextBtn.click();
        // Wait for TnC page to load
        await expect(this.regPage.tncCheckbox).toBeVisible({ timeout: 10000 });
    }

    async selectAccountTypeG2G() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.regPage.accountRadio.nth(1)).toBeVisible();
        await this.regPage.accountRadio.nth(2).click();
        await this.regPage.nextBtn.click();
        // Wait for TnC page to load
        await expect(this.regPage.tncCheckbox).toBeVisible({ timeout: 10000 });
    }

    // --- STEP 2: TERMS & CONDITIONS ---

    async checkTnC() {
        const maxRetry = 3;
    
        for (let attempt = 1; attempt <= maxRetry; attempt++) {
            try {
                // Wait and click TnC checkbox
                await expect(this.regPage.tncCheckbox).toBeVisible();
                await this.regPage.tncCheckbox.click();
    
                // Wait for Next button to be visible and enabled
                await expect(this.regPage.nextBtn).toBeVisible();
                await expect(this.regPage.nextBtn).toBeEnabled();
    
                // Try clicking Next button
                await this.regPage.nextBtn.click({ timeout: 5000 });
    
                // Wait for either:
                // - next page element appears
                // - page starts navigating/loading
                await Promise.race([
                    this.page
                        .locator('div[id$="busTypeId"]')
                        .waitFor({ state: 'visible', timeout: 10000 }),
    
                    this.page.waitForLoadState('domcontentloaded', {
                        timeout: 10000,
                    }),
                ]);
    
                // Final verification
                await expect(
                    this.page.locator('div[id$="busTypeId"]')
                ).toBeVisible({ timeout: 15000 });
    
                // Success → exit function
                return;
    
            } catch (error) {
    
                // Prevent retry if already on next page
                const isNextPageLoaded = await this.page
                    .locator('div[id$="busTypeId"]')
                    .isVisible()
                    .catch(() => false);
    
                if (isNextPageLoaded) {
                    return;
                }
    
                console.log(`Attempt ${attempt} failed. Refreshing page...`);
    
                if (attempt === maxRetry) {
                    throw new Error(
                        `Failed to proceed after ${maxRetry} attempts.`
                    );
                }
    
                // Refresh page
                await this.page.reload();
    
                // Wait page stable before retry
                await this.page.waitForLoadState('domcontentloaded');
            }
        }
    }

    async checkTnCG2G() {
        await expect(this.regPage.tncCheckbox).toBeVisible();
        await this.regPage.tncCheckbox.click();
        await this.regPage.nextBtn.click();
        // Wait for Account Information page to load
        //await expect(this.page.locator('div[id$="busTypeId"]')).toBeVisible({ timeout: 10000 });
    }

    // --- STEP 3: ACCOUNT INFORMATION ---

    async selectBusinessType(type: string) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.page.locator('div[id$="busTypeId"]')).toBeVisible();
        await pfSelectOneMenu(this.page, this.regPage.businessType, type);
        // Wait for page to finish loading after business type selection
        await this.page.waitForTimeout(3000);
        await expect(this.regPage.businessRegNo).toBeVisible({ timeout: 15000 });
    }
    async selectBusinessTypeMOF(type: string) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.page.locator('div[id$="suppTypeId"]')).toBeVisible();
        await pfSelectOneMenu(this.page, this.regPage.suppType, type);
        // Wait for page to finish loading after business type selection
        await this.page.waitForTimeout(3000);
        await expect(this.regPage.businessRegNo).toBeVisible({ timeout: 15000 });
    }

    async fillBusinessRegNo(value: string) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.regPage.businessRegNo).toBeVisible();
        await this.regPage.businessRegNo.fill(value);
    }

    async fillOwnerNewIcNo(icNo: string): Promise<void> {
        const icField = this.page
            .locator("tr")
            .filter({ hasText: "Owner New I/C No." })
            .locator('input[type="text"]');
    
        await icField.fill(icNo);
    }

    // --- STEP 4: COMPANY INFORMATION ---

    async fillCompanyName(name: string) {
        await expect(this.regPage.businessCompName).toBeVisible({ timeout: TIMEOUTS.EXTENDED });
        await this.regPage.businessCompName.fill(name);
    }

    async fillBusinessEstDate() {
        const datee = this.regPage.businessEstDateUI;
        await expect(datee).toBeVisible({ timeout: TIMEOUTS.EXTENDED });
        await datee.click();
        // Wait for calendar to open
        await expect(this.regPage.businessEstDate).toBeVisible({ timeout: 5000 });
        await this.regPage.businessEstDate.click();
        // Wait for calendar to close
        await expect(this.regPage.businessEstDate).toBeHidden({ timeout: 5000 });
    }

    async fillBusinessIncomeTax(value: string) {
        await expect(this.regPage.businessIncomeTax).toBeVisible({ timeout: TIMEOUTS.EXTENDED });
        await this.regPage.businessIncomeTax.fill(value);
    }

    async fillCompanyAddress(line1: string, line2?: string, line3?: string) {
        await expect(this.regPage.businessCompAdd1).toBeVisible();
        await this.regPage.businessCompAdd1.fill(line1);
        if (line2) await this.regPage.businessCompAdd2.fill(line2);
        if (line3) await this.regPage.businessCompAdd3.fill(line3);
    }

    async selectBusinessState(type: string) {
        await pfSelectOneMenu(this.page, this.regPage.businessState, type);
    }

    async selectBusinessDivision(division: string) {
        await this.page.waitForFunction(() => {
            const items = document.querySelectorAll('[id$=":busDivision_panel"] li.ui-selectonemenu-item:not([data-label=""])');
            return items.length > 1;
        }, { timeout: 15000 });
        await pfSelectOneMenu(this.page, this.regPage.businessDivision, division);
    }

    async selectBusinessDistrict(district: string) {
        await this.page.waitForFunction(() => {
            const items = document.querySelectorAll('[id$=":busDistrict_panel"] li.ui-selectonemenu-item:not([data-label=""])');
            return items.length > 1;
        }, { timeout: 15000 });
        await pfSelectOneMenu(this.page, this.regPage.businessDistrict, district);
    }

    async selectBusinessCity(city: string) {
        await this.page.waitForFunction(() => {
            const panel = document.querySelector('[id$="busCity_panel"]');
            if (!panel) return false;
            const items = panel.querySelectorAll('li.ui-selectonemenu-item');
            return items.length > 1;
        }, { timeout: 15000 });
        await pfSelectOneMenu(this.page, this.regPage.businessCity, city);
        await this.page.waitForTimeout(3000);
    }

    async selectLocalAuthority(authority: string) {
        const menu = this.page.locator('div[id$="localAuthorityId"]');
        await expect(menu).toBeVisible();

        // Open the dropdown first
        await menu.locator('.ui-selectonemenu-trigger').click();

        // Panel is now open — wait for AJAX to load the specific option
        const panel = this.page.locator('div[id$="localAuthorityId_panel"]:visible');
        await expect(panel).toBeVisible({ timeout: 15000 });

        const item = panel.locator('li.ui-selectonemenu-item', { hasText: authority }).first();
        await expect(item).toBeVisible({ timeout: 15000 }); // waits for AJAX to populate
        await item.click({ force: true });

        // Verify selection
        await expect(this.page.locator('label[id$="localAuthorityId_label"]')).toHaveText(authority, { timeout: 10000 });
    }

    async fillBusinessPostcode(value: string) {
        await expect(this.regPage.businessPostcode).toBeVisible();
        await this.regPage.businessPostcode.fill(value);
    }

    async fillCoordinates(lat: string, lng: string) {
        await this.regPage.xCoordinate.fill(lat);
        await this.regPage.yCoordinate.fill(lng);
    }

    async clickViewMap() {
        await expect(this.regPage.viewMapBtn).toBeVisible();
        await this.regPage.viewMapBtn.click();
    }

    async closeMapDialog() {
        const mapDialog = this.page.locator('[id$="gmapDialogId"]');
        await expect(mapDialog).toBeVisible({ timeout: 10000 });
        const closeBtn = mapDialog.locator('a.ui-dialog-titlebar-close');
        await expect(closeBtn).toBeVisible({ timeout: 5000 });
        await closeBtn.click();
        await expect(mapDialog).toBeHidden({ timeout: 5000 });
    }

    // --- STEP 5: PHONE / FAX ---

    async fillPhoneNumber(country: string, area: string, number: string) {
        await expect(this.regPage.phoneNoCountryCode).toBeVisible();
        await this.regPage.phoneNoCountryCode.fill(country);
        await this.regPage.phoneNoAreaCode.fill(area);
        await this.regPage.phoneNoNumber.fill(number);
    }

    async fillFaxNumber(country: string, area: string, number: string) {
        await this.regPage.faxNoCountryCode.fill(country);
        await this.regPage.faxNoAreaCode.fill(area);
        await this.regPage.faxNoNumber.fill(number);
    }

    // --- STEP 6: OWNER INFORMATION ---

    async fillOwnerName(name: string) {
        await expect(this.regPage.ownerName.first()).toBeVisible();
        await this.regPage.ownerName.first().fill(name);
    }

    async fillOwnerIdNo(idNo: string) {
        await this.regPage.ownerIdNo.last().fill(idNo);
    }

    // --- GST INFORMATION ---

    async fillGstRegNo(regNo: string) {
        await this.regPage.gstRegNoId.fill(regNo);
    }

    async fillGstEffectiveDate(date: string) {
        const field = this.regPage.gstRegEffDate;
        await field.evaluate((el: HTMLElement) => el.removeAttribute("readonly"));
        await field.evaluate((el: HTMLElement) => el.dispatchEvent(new Event("change", { bubbles: true })));
    }

    async fillGstEndDate(date: string) {
        const field = this.regPage.gstRegEndDate;
        await field.evaluate((el: HTMLElement) => el.removeAttribute("readonly"));
        await field.fill(date);
        await field.evaluate((el: HTMLElement) => el.dispatchEvent(new Event("change", { bubbles: true })));
    }

    // --- STEP 7: NATURE OF BUSINESS (NOB) ---

    async clickAddNob() {
        await expect(this.regPage.nobAddBtn).toBeVisible();
        await this.page.waitForTimeout(2000);
        await this.regPage.nobAddBtn.click();
        // Wait for NOB dialog/table to open
        await this.page.waitForLoadState("networkidle");
        await expect(this.page.locator('td[role="gridcell"]').first()).toBeVisible({ timeout: 10000 });
    }

    async clickDeleteNob() {
        await this.regPage.nobDeleteBtn.click();
    }

    async searchNob(value: string) {
        await this.regPage.nobSearchField.fill(value);
        await this.regPage.searchBtn.click();
    }

    async resetNobSearch() {
        await this.regPage.resetBtn.click();
    }

    async selectNOBByDescription(text: string): Promise<void> {
        await this.page.waitForTimeout(3000);
        const item = this.page.locator('td[role="gridcell"]', { hasText: text });
        await expect(item).toBeVisible({ timeout: TIMEOUTS.EXTENDED });
        await item.click();
    }

    async selectNOBByCode(code: string): Promise<void> {
        const checkbox = this.regPage
            .getLovTable()
            .locator("tr", { hasText: code })
            .locator(".ui-chkbox-box");
        await checkbox.click();
    }

    async clickSelectNob() {
        await expect(this.regPage.selectBtn).toBeVisible();
        await this.page.waitForTimeout(2000);
        await this.regPage.selectBtn.click({ force: true });
        await this.page.waitForLoadState("networkidle");
        // Wait for NOB dialog to close and NOB to appear in table
        //await expect(this.page.locator('[id$="busiNatureId"] td[role="gridcell"]').first()).toBeVisible({ timeout: 10000 });
    }

    async selectNobByText(text: string) {
        await this.regPage.getCheckboxByRowText(text).click();
    }

    // --- STEP 8: BANK INFORMATION ---

    async clickAddBank() {
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState("networkidle");
        await expect(this.regPage.addBankButton).toBeVisible();
        await this.regPage.addBankButton.click({ force: true });
        await this.page.waitForLoadState("networkidle");
        await expect(this.page.locator('div[id*="bankInfoId"][id$="bankNameId"]')).toBeVisible({ timeout: 15000 });
    }

    async clickDeleteBank() {
        await this.regPage.deleteBankButton.click();
    }

    async selectBankName(bankName: string) {
        await this.page.waitForTimeout(1000);
        await pfSelectOneMenu(this.page, this.regPage.bankName, bankName);

        // ✅ Ensure label is REALLY updated (extra safety)
        await expect(this.page.locator(`label[id$="${this.regPage.bankName}_label"]`)
            ).toHaveText(bankName, { timeout: TIMEOUTS.EXTENDED });

        // 🔥 KEY: wait until input is truly usable
        await expect(this.regPage.bankAccNo).toBeEditable({ timeout: TIMEOUTS.EXTENDED });
    }

    async fillBankAccNo(accNo: string) {
        await this.page.waitForTimeout(2000);
        await expect(this.regPage.bankAccNo).toBeEditable({ timeout: 15000 });

        await this.regPage.bankAccNo.fill(accNo);
    }

    // --- STEP 9: NEXT (Page 2) ---

    // --- STEP 10: SUPPLIER ADMINISTRATOR INFORMATION ---

    async clickSupplierCell1() {
        await expect(this.regPage.supplierCheckbox).toBeVisible({ timeout: 15000 });
        await this.regPage.supplierCheckbox.click();

        // suppFullName is auto-filled by the system — wait for it to have a value
        await expect(this.regPage.suppFullName).not.toBeEmpty({ timeout: 15000 });
    }

    async clickSupplierCell() {
        await expect(this.regPage.supplierCheckbox).toBeVisible({timeout: 15000});
    
        const checked = await this.regPage.supplierCheckbox.evaluate(el =>el.classList.contains('ui-state-active'));
    
        if (!checked) {
            await this.regPage.supplierCheckbox.click();
        }
    
        await expect(this.regPage.suppFullName).not.toBeEmpty({
            timeout: 15000
        });
    }

    async fillSuppFullName(name: string) {
        await expect(this.regPage.suppFullName).toBeVisible({ timeout: 10000 });
        await this.regPage.suppFullName.fill(name);
    }

    async selectSuppSalutation(salutation: string) {
        await expect(this.page.locator('div[id$="salutationId"]')).toBeVisible({ timeout: 10000 });
        await pfSelectOneMenu(this.page, this.regPage.suppSalutation, salutation);
    }

    async fillSuppIdNo(idNo: string) {
        await this.regPage.suppIdNo.fill(idNo);
    }

    async fillSuppDOB() {
        const datee = this.regPage.businessEstDateUI;
        await expect(datee).toBeVisible();
        await datee.click();
        // Wait for calendar to open
        await expect(this.regPage.businessEstDate).toBeVisible({ timeout: 5000 });
        await this.regPage.businessEstDate.click();
        // Wait for calendar to close
        await expect(this.regPage.businessEstDate).toBeHidden({ timeout: 5000 });
    }

    async clickBumiputeraRadio() {
        await expect(this.regPage.bumiputeraButton).toBeVisible();
        await this.regPage.bumiputeraButton.click();
        // Verify it got selected
        await expect(this.regPage.bumiputeraButton).toHaveClass(/ui-state-active/, { timeout: 5000 });
    }

    async clickMuslimRadio() {
        await expect(this.regPage.muslimButton).toBeVisible();
        await this.regPage.muslimButton.click();
        await expect(this.regPage.muslimButton).toHaveClass(/ui-state-active/, { timeout: 5000 });
    }

    async fillSuppAddress(line1: string, line2?: string, line3?: string) {
        await expect(this.regPage.suppAddr1).toBeVisible();
        await this.regPage.suppAddr1.fill(line1);
        if (line2) await this.regPage.suppAddr2.fill(line2);
        if (line3) await this.regPage.suppAddr3.fill(line3);
    }

    async selectSuppState(state: string) {
        await pfSelectOneMenu(this.page, this.regPage.suppState, state);
    }

    async selectSuppDistrict(district: string) {
        await this.page.waitForFunction(() => {
            const items = document.querySelectorAll('[id$="cmbPermDistrict_panel"] li.ui-selectonemenu-item');
            return items.length > 1;
        }, { timeout: 15000 });
        await pfSelectOneMenu(this.page, this.regPage.suppDistrict, district);
    }

    async selectSuppCity(city: string) {
        await this.page.waitForFunction(() => {
            const items = document.querySelectorAll('[id$="cmbPermCity_panel"] li.ui-selectonemenu-item');
            return items.length > 1;
        }, { timeout: 15000 });
        await pfSelectOneMenu(this.page, this.regPage.suppCity, city);
    }

    async fillSuppPostcode(value: string) {
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(3000);
        await expect(this.regPage.suppPostcode).toBeVisible();
        await this.regPage.suppPostcode.fill(value);
    }

    async fillSuppPosition(value: string) {
        await expect(this.regPage.suppPosition).toBeVisible();
        await this.regPage.suppPosition.fill(value);
    }

    async checkboxManagement() {
        await this.regPage.suppRoleManagementCheckbox.click();
    }

    async clickCheckboxStaff(label: string) {
        const checkbox = this.regPage.getCheckboxByLabel(label);
        await checkbox.click();
    }

    async fillSuppTelNo(country: string, area: string, number: string) {
        await this.regPage.suppTelNoCountryCode.fill(country);
        await this.regPage.suppTelNoAreaCode.fill(area);
        await this.regPage.suppTelNoNum.fill(number);
    }

    async fillSuppMobileNo(country: string, area: string, number: string) {
        await expect(this.regPage.suppmobileNoCountryCode).toBeVisible();
        await this.regPage.suppmobileNoCountryCode.fill(country);
        await this.regPage.suppmobileNoAreaCode.fill(area);
        await this.regPage.suppmobileNoNum.fill(number);
    }

    async selectSuppTelco(telco: string) {
        await pfSelectOneMenu(this.page, this.regPage.suppTelco, telco);
    }

    async fillSuppEmail(email: string) {
        await expect(this.regPage.suppEmail).toBeVisible();
        await this.regPage.suppEmail.fill(email);
        await this.regPage.suppConfirmEmail.fill(email);
    }

    async checkSuppAddr() {
        await expect(this.regPage.suppAddrCheckbox).toBeVisible();
        await this.regPage.suppAddrCheckbox.click();
        // Wait for AJAX re-render after checkbox
        await this.page.waitForLoadState("networkidle");
    }

    async fillSuppCorrAddress(line1: string, line2?: string, line3?: string) {
        await this.regPage.suppCorrAddr1.fill(line1);
        if (line2) await this.regPage.suppCorrAddr2.fill(line2);
        if (line3) await this.regPage.suppCorrAddr3.fill(line3);
    }

    async selectSuppCorrState(state: string) {
        await pfSelectOneMenu(this.page, this.regPage.suppCorrState, state);
    }

    async selectSuppCorrDistrict(district: string) {
        await pfSelectOneMenu(this.page, this.regPage.suppCorrDistrict, district);
    }

    async selectSuppCorrCity(city: string) {
        await pfSelectOneMenu(this.page, this.regPage.suppCorrCity, city);
    }

    async fillSuppCorrPostcode(value: string) {
        await this.regPage.suppCorrPostcode.fill(value);
    }

    // --- STEP 11: SUBMIT ---

    async checkboxProceed() {
        await expect(this.regPage.termsCheckbox).toBeVisible({ timeout: 10000 });
        await this.regPage.termsCheckbox.click();
    }

    // --- INDIVIDUAL REGISTRATION ---

    async selectIndvService(service: string) {
        await pfSelectOneMenu(this.page, this.regPage.indvService, service);
    }

    async selectBumiOption(option: string) {
        await this.regPage.bumiRadio(option).click();
    }

    async fillIndvIC(ic: string) {
        await this.regPage.indvIC.fill(ic);
    }

    async fillIndvName(name: string) {
        await this.regPage.indvName.fill(name);
    }

    async fillIndvAddress(line1: string, line2?: string, line3?: string) {
        await this.regPage.indvAddr1.fill(line1);
        if (line2) await this.regPage.indvAddr2.fill(line2);
        if (line3) await this.regPage.indvAddr3.fill(line3);
    }

    async selectReligion(option: string) {
        await this.regPage.religionRadio(option).click();
    }

    async fillDOB(date: string) {
        const field = this.regPage.indvDOB;
        await field.evaluate((el: HTMLElement) => el.removeAttribute("readonly"));
        await field.fill(date);
        await field.evaluate((el: HTMLElement) => el.dispatchEvent(new Event("change", { bubbles: true })));
    }

    async selectIndvState(state: string) {
        await pfSelectOneMenu(this.page, this.regPage.indvState, state);
    }

    async selectIndvDistrict(district: string) {
        await pfSelectOneMenu(this.page, this.regPage.indvDistrict, district);
    }

    async selectIndvCity(city: string) {
        await pfSelectOneMenu(this.page, this.regPage.indvCity, city);
    }

    async fillIndvPostcode(value: string) {
        await this.regPage.indvPostcode.fill(value);
    }

    /*async checkAddMode() {
        await this.regPage.addModeCheckbox.click();
    }*/

    async clickAddProfCert() {
        await this.page.waitForTimeout(1000);
        await expect(this.regPage.profCertAddBtn).toBeVisible();
        await this.regPage.profCertAddBtn.click();
        await this.page.waitForLoadState("networkidle");
    }

    async selectProfBodyName(value: string) {
        await this.page.waitForTimeout(1000);
        await pfSelectOneMenu(this.page, this.regPage.profBodyName, value);
    }

    async fillProfBodyRegNo(value: string) {
        await this.page.waitForTimeout(1000);
        await expect(this.regPage.profBodyRegNo).toBeVisible();
        await this.regPage.profBodyRegNo.fill(value);
    }

    async fillProfBodyExpDate(date: string) {
        await this.page.waitForTimeout(1000);
        await expect(this.regPage.profBodyExpDate).toBeVisible();
        await this.regPage.profBodyExpDate.fill(date);
        await this.regPage.profBodyExpDate.dispatchEvent('change');
    }
    // --- ACCOUNT ACTIVATION ---
    async fillActivationDetails(activationKey: string, loginId: string): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');

        // Fill Activation Key
        const activationKeyInput = this.page.locator('[id$="j_idt20"]');
        await expect(activationKeyInput).toBeVisible({ timeout: 10000 });
        await activationKeyInput.fill(activationKey);

        // Fill Login ID
        const loginIdInput = this.page.locator('[id$="loginId"]');
        await expect(loginIdInput).toBeVisible({ timeout: 10000 });
        await loginIdInput.fill(loginId);

        // Click Submit
        await this.page.locator('button[onclick*="confirmDlg.show"]').click();
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('button[onclick*="_supplierUserActivation_WAR_NGePportlet_:form:j_idt39"]').click();
    }
    
    async clickOrgByName(orgName: string): Promise<void> {
        const row = this.page.locator('tr', { hasText: orgName });
        await expect(row).toBeVisible({ timeout: 15000 });
        await row.click();
        await this.page.waitForLoadState("networkidle");
    }

    // --- G2G: ORG TYPE SELECTION ---
 
    async selectG2GOrgType(orgTypeKey: keyof typeof DROPDOWN_OPTIONS.G2G_ORG_TYPE.en): Promise<void> {
        const value = DROPDOWN_OPTIONS.G2G_ORG_TYPE[this.language][orgTypeKey];
        await expect(this.page.locator('div[id$="orgTypeCodeSearchId"]')).toBeVisible({ timeout: 10000 });
        await pfSelectOneMenu(this.page, this.regPage.g2gOrgType, value);
        await this.page.waitForLoadState("networkidle");
    }
 
    // --- G2G: AGENCY NAME SEARCH ---
 
    async fillAgencyName(name: string): Promise<void> {
        await expect(this.regPage.agencyNameInput).toBeVisible({ timeout: 10000 });
        await this.regPage.agencyNameInput.fill(name);
    }
 
    async searchAgency(): Promise<void> {
        await expect(this.regPage.searchBtn).toBeVisible();
        await this.regPage.searchBtn.click();
        await this.page.waitForLoadState("networkidle");
        // Wait for at least one result row to appear
        await expect(this.regPage.agencyFirstResultSelectBtn).toBeVisible({ timeout: 15000 });
    }
 
    async selectFirstAgencyResult(): Promise<void> {
        await expect(this.regPage.agencyFirstResultSelectBtn).toBeVisible({ timeout: 10000 });
        await this.regPage.agencyFirstResultSelectBtn.click();
        await this.page.waitForLoadState("networkidle");
    }
 
    // --- G2G: BANK HQ CHECKBOX ---
 
    async checkBankHQ(): Promise<void> {
        await expect(this.regPage.bankHQCheckbox).toBeVisible({ timeout: 10000 });
        await this.regPage.bankHQCheckbox.click();
    }

    // --- G2G: SUPPLIER ADMIN INFORMATION (Page 2) ---
 
    async fillG2GSuppIdNo(idNo: string): Promise<void> {
        await expect(this.regPage.g2gSuppIdNo).toBeVisible();
        await this.regPage.g2gSuppIdNo.fill(idNo);
    }
 
    async fillG2GSuppPosition(position: string): Promise<void> {
        await expect(this.regPage.g2gSuppPosition).toBeVisible();
        await this.regPage.g2gSuppPosition.fill(position);
    }
 
    async fillG2GSuppDepartment(department: string): Promise<void> {
        await expect(this.regPage.g2gSuppDepartment).toBeVisible();
        await this.regPage.g2gSuppDepartment.fill(department);
    }
 
    async fillG2GSuppUnit(unit: string): Promise<void> {
        await expect(this.regPage.g2gSuppUnit).toBeVisible();
        await this.regPage.g2gSuppUnit.fill(unit);
    }
 
    async clickG2GMuslimCell(): Promise<void> {
        await expect(this.regPage.g2gMuslimCell).toBeVisible();
        await this.regPage.g2gMuslimCell.click();
    }
}
