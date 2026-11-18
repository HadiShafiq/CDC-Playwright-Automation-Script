import { Page } from "@playwright/test";
import { LogoutPage } from "./main";
import { Language } from "../../shared/data";

export class LogoutAction {
    private page: Page;
    private logoutPage: LogoutPage;

    constructor(page: Page, language: Language) {
        this.page = page;
        this.logoutPage = new LogoutPage(page, language);
    }
    /**
     * Opens the account menu and clicks logout (Log Keluar / Sign Out).
     * @param accountDisplayName - The user's display name as shown in the account menu (e.g. "Nur Hidayah Binti Samsudin" or "Test New Po")
     */
    async logout(accountDisplayName: string): Promise<void> {
        await this.logoutPage.accountMenuItem(accountDisplayName).isVisible();
        await this.logoutPage.accountMenuItem(accountDisplayName).click();
        await this.logoutPage.logoutMenuItem().click();
        await this.page.waitForTimeout(3000);
    }
}
