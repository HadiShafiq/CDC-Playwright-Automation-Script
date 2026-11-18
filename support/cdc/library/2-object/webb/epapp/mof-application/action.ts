import { expect, Page } from "@playwright/test";
import { MofAppPage } from "./main";
import { LABELS } from "./data";
import { Language } from "../../../shared/data";
import { TIMEOUTS } from "../../../../1-data/config/timeout-config";

export class MofAppAction {
    private page: Page;
    private language: Language;
    public mofAppPage: MofAppPage;
    private labels: typeof LABELS["en"];

    constructor(page: Page, language: Language) {
        this.page = page;
        this.language = language;
        this.mofAppPage = new MofAppPage(page, language);
        this.labels = LABELS[language];
    }

    // ----------------------------
    //          HELPER
    // ----------------------------

    async waitForLoaderToDisappear(): Promise<void> {
        await this.mofAppPage.blockUiLoader.waitFor({ state: 'hidden', timeout: TIMEOUTS.LONG });
    }

    // ----------------------------
    //          TASK LIST
    // ----------------------------

    async goToTaskList(): Promise<void> {
        await expect(this.mofAppPage.taskListMenu).toBeVisible();
        await this.mofAppPage.taskListMenu.click();
        await this.page.waitForLoadState("networkidle");
    }

    async clickMofVerifyTask(accountName: string): Promise<void> {
        const taskLink = this.mofAppPage.mofVerifyTaskLink(accountName);
        await expect(taskLink).toBeVisible({ timeout: TIMEOUTS.LONG });
        await taskLink.click();
        await this.waitForLoaderToDisappear();
        await this.page.waitForLoadState('networkidle');
    }

    async clickMofReviewTask(accountName: string): Promise<void> {
        const taskLink = this.mofAppPage.mofReviewTaskLink(accountName);
        await expect(taskLink).toBeVisible({ timeout: TIMEOUTS.LONG });
        await taskLink.click();
        await this.waitForLoaderToDisappear();
        await this.page.waitForLoadState('networkidle');
    }

    async clickMofReviewEscalatedTask(accountName: string): Promise<void> {
        const taskLink = this.mofAppPage.mofReviewEscalatedTaskLink(accountName);
        await expect(taskLink).toBeVisible({ timeout: TIMEOUTS.LONG });
        await taskLink.click();
        await this.waitForLoaderToDisappear();
        await this.page.waitForLoadState('networkidle');
    }

    // ----------------------------
    //          SIDE MENU
    // ----------------------------

    async clickSupportingDocumentMenu(): Promise<void> {
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.supportingDocumentMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.supportingDocumentMenu.click();
        await this.waitForLoaderToDisappear();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    async clickPODecisionMenu(): Promise<void> {
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.poDecisionMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.poDecisionMenu.click();
        await this.waitForLoaderToDisappear();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    async clickApproverDecisionMenu(): Promise<void> {
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.approverDecisionMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.approverDecisionMenu.click();
        await this.waitForLoaderToDisappear();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    // ----------------------------
    //          BUTTONS
    // ----------------------------

    async claimTask(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.claimBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.claimBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickReceiveAll(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.receiveAllBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.receiveAllBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickVerify(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.verifyBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.verifyBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickYes(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.yesBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.yesBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
    
    async clickAllValid(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.allValidBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.allValidBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickRecommendToApprove(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.recToAppBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.recToAppBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickSubmit(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.submitBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.submitBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickApprove(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.approveBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.approveBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickReject(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.rejectBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.rejectBtn.click();
        await this.page.waitForLoadState('networkidle');
    }


    // ----------------------------
    //          FUNCTIONS
    // ----------------------------

    async selectTodayAsReceiveDate(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(this.mofAppPage.receiveDateCalendarToggle).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.mofAppPage.receiveDateCalendarToggle.click();
        await this.page.waitForTimeout(500);

        const today = new Date().getDate().toString();
        const todayLink = this.mofAppPage.datePickerDiv.getByRole('link', { name: today, exact: true });
        await expect(todayLink).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await todayLink.click();

        await this.mofAppPage.receiveDateInput.click();
        await this.page.waitForLoadState('networkidle');
    }

    async ensureAppVerifiedByPOChecked(): Promise<void> {
        await this.page.waitForTimeout(500);
    
        const input = this.mofAppPage.appVerifiedByPOCheckboxInput;
        const box   = this.mofAppPage.appVerifiedByPOCheckboxBox;
    
        await expect(box).toBeVisible({ timeout: TIMEOUTS.LONG });
    
        const isChecked = await input.isChecked();
        if (!isChecked) {
            await box.click();
            await this.page.waitForLoadState('networkidle');
        }
        // already checked — skip silently
    }

    // ----------------------------
    //          FLOWS
    // ----------------------------

    async verifyRequest(
        data: {
            accountName: string;
        }
    ): Promise<void>{
        await this.goToTaskList();
        await this.clickMofVerifyTask(data.accountName);
        if (await this.mofAppPage.claimBtn.isVisible()) {
            await this.claimTask();
        }
        await this.clickReceiveAll();
        await this.selectTodayAsReceiveDate();
        await this.clickVerify();
        await this.clickYes();
    }

    async reviewRequest(
        data: {
            accountName: string;
        }
    ): Promise<void>{
        await this.goToTaskList();
        await this.clickMofReviewTask(data.accountName);
        await this.ensureAppVerifiedByPOChecked();
        await this.clickSupportingDocumentMenu();
        await this.clickAllValid();
        await this.clickPODecisionMenu();
        await this.clickRecommendToApprove();
        await this.clickSubmit();
        await this.clickYes();
    }

    async rejectRequest(
        data: {
            accountName: string;
        }
    ): Promise<void>{
        await this.goToTaskList();
        await this.clickMofReviewTask(data.accountName);
        await this.ensureAppVerifiedByPOChecked();
        await this.clickSupportingDocumentMenu();
        await this.clickAllValid();
        await this.clickPODecisionMenu();
        await this.clickReject();
        await this.clickSubmit();
        await this.clickYes();
    }

    async reviewEscalatedRequest(
        data: {
            accountName: string;
        }
    ): Promise<void>{
        await this.goToTaskList();
        await this.clickMofReviewEscalatedTask(data.accountName);
        if (await this.mofAppPage.claimBtn.isVisible()) {
            await this.claimTask();
        }
        await this.clickApproverDecisionMenu();
        await this.clickApprove();
        await this.clickSubmit();
        await this.clickYes();
    }
}