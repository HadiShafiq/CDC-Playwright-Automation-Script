import { Page } from "@playwright/test";
import { LABELS } from "./data";
import { Language } from "../../shared/data";

export class LogoutPage {
    private page: Page;
    private labels: typeof LABELS["en"];

    constructor(page: Page, language: Language) {
        this.page = page;
        this.labels = LABELS[language];
    }

    accountMenuItem(displayName: string) {
        const accountMenuName = `${this.labels.ACCOUNT_MENU_PREFIX} ${displayName}`.trim();
        return this.page.getByRole("menuitem", { name: accountMenuName });
    }

    logoutMenuItem() {
        return this.page.getByRole("menuitem", { name: this.labels.LOGOUT_MENU });
    }
}
