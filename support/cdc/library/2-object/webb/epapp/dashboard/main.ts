import { Locator, Page } from "@playwright/test";
import { Language } from "../../../shared/data";
import { LABELS } from "./data";

export class DashboardPage {
  private page: Page;
    private labels: typeof LABELS["en"];

    constructor(page: Page, language: Language) {
        this.page = page;
        this.labels = LABELS[language];
    }

  // =========================
  // LOCATORS
  // =========================

  get searchField() {
    return this.page.locator('input[type="text"][autocomplete="off"]');
  }

  get searchButton() {
    return this.page.getByRole("button", { name: "Search" });
  }

  get tableRows() {
    return this.page.locator('[id$=":dt_data"] tr');
  }

  get tableBodyRows() {
    return this.page.locator("tbody tr");
  }

  get welcomeContainer() {
    return this.page.locator("div.portlet-body > div").first();
  }

  get blockUiLoader() {
    return this.page.locator('div.ui-blockui-content:visible');
  }

  get createLoaLink(): Locator {
    return this.page.getByRole("link", { name: this.labels.MENU.CREATE_LOA });
}
}