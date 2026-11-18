import { Page } from "@playwright/test";
import { Language } from "../../../shared/data";
import { LABELS } from "./data";

export class MofAppPage {
    private page: Page;
    private language: Language;
    private labels: typeof LABELS["en"];

    constructor(page: Page, language: Language) {
        this.page = page;
        this.language = language;
        this.labels = LABELS[language];
    }

    // ----------------------------
    //          HELPER
    // ----------------------------

    get blockUiLoader() {
        return this.page.locator('div.ui-blockui-content:visible');
    }

    // ----------------------------
    //          TASK LIST
    // ----------------------------

    get taskListMenu() {
        return this.page.getByRole("menuitem", { name: this.labels.TASK_LIST });
    }

    mofVerifyTaskLink(accountName: string) {
        return this.page.getByRole('link', {
            name: `${this.labels.MOF_VERIFY_TASK} ( ${accountName} )`
        });
    }

    mofReviewTaskLink(accountName: string) {
        return this.page.getByRole('link', {
            name: `${this.labels.MOF_REVIEW_TASK} ( ${accountName} )`
        });
    }

    mofReviewEscalatedTaskLink(accountName: string) {
        return this.page.getByRole('link', {
            name: `${this.labels.MOF_REVIEW_ESCALATED_TASK} ( ${accountName} )`
        });
    }

    // ----------------------------
    //          SIDE MENU
    // ----------------------------

    get supportingDocumentMenu(){
        return this.page.getByRole("link", { name: this.labels.SUPPORTING_DOCUMENTS, exact: true});
    }

    get poDecisionMenu(){
        return this.page.getByRole("link", { name: this.labels.PO_DECISION, exact: true});
    }

    get approverDecisionMenu(){
        return this.page.getByRole("link", { name: this.labels.APPROVER_DECISION, exact: true});
    }

    // ----------------------------
    //          BUTTON
    // ----------------------------

    get claimBtn() {
        return this.page.getByRole('button', { name: this.labels.CLAIM });
    }

    get receiveAllBtn() {
        return this.page.getByRole('button', { name: this.labels.RECEIVE_ALL });
    }

    get verifyBtn() {
        return this.page.getByRole('button', { name: this.labels.VERIFY });
    }

    get yesBtn() {
        return this.page.getByRole('button', { name: this.labels.YES });
    }

    get allValidBtn() {
        return this.page.getByRole('button', { name: this.labels.ALL_VALID });
    }

    get recToAppBtn() {
        return this.page.getByRole('button', { name: this.labels.RECOMMEND });
    }

    get submitBtn() {
        return this.page.getByRole('button', { name: this.labels.SUBMIT });
    }

    get approveBtn() {
        return this.page.getByRole('button', { name: this.labels.APPROVE });
    }

    get rejectBtn() {
        return this.page.getByRole('button', { name: this.labels.REJECT });
    }

    // TODO: PrimeFaces calendar trigger may be brittle via role; fallback:
    // this.page.locator('[id$="receiveCalId_button"]')
    get receiveDateCalendarToggle() {
        return this.page.getByRole('button', { name: 'ui-button' });
    }

    get datePickerDiv() {
        return this.page.locator('#ui-datepicker-div');
    }

    get receiveDateInput() {
        return this.page.locator('[id="_MOFApplication_WAR_NGePportlet_:form:receiveCalId_input"]');
    }

    get appVerifiedByPORow() {
        return this.page.locator('tr').filter({ hasText: this.labels.APP_VERIFIED_BY_PO });
    }
    
    // visual box — this is what you click for PrimeFaces checkboxes
    get appVerifiedByPOCheckboxBox() {
        return this.appVerifiedByPORow.locator('.ui-chkbox-box');
    }
    
    // hidden input — used only to read checked state, never clicked directly
    get appVerifiedByPOCheckboxInput() {
        return this.appVerifiedByPORow.locator('input[type="checkbox"]');
    }

}