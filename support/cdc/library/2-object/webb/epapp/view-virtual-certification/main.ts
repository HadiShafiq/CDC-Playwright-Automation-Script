import { Locator, Page } from "@playwright/test";
import { LABELS } from "./data";
import { Language } from "../../../shared/data";

export class VirtualCertPage {
    private page: Page;
    private labels: typeof LABELS["en"]

    constructor(page: Page, language: Language) {
        this.page = page;
        this.labels = LABELS[language];
    }

  // All radio groups on page
  get radioGroups(): Locator {
    return this.page.locator("table.ui-selectoneradio");
  }

  getRadioGroup(index: number): Locator {
    return this.radioGroups.nth(index);
  }

  get submitBtn() {
    return this.page.getByRole("button", {name: this.labels.SUBMIT});
  }

  get yesBtn() {
    return this.page.getByRole("button", {name: this.labels.YES});
  }
}