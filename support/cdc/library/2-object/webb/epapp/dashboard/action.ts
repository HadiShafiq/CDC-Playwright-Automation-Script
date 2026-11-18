import { expect, Page } from "@playwright/test";
import { DashboardPage } from "./main";
import { LABELS, URLS } from "./data";
import { Language } from "../../../shared/data";
import { TIMEOUTS } from "../../../../1-data/config/timeout-config";

export class DashboardAction {
  private page: Page;
  private language: Language;
  public dashboardPage: DashboardPage;

  private labels: typeof LABELS["en"];

  constructor(page: Page, language: Language) {
    this.page = page;
    this.language = language;

    this.dashboardPage = new DashboardPage(page, language);
    this.labels = LABELS[language];
  }

  async waitForLoaderToDisappear(): Promise<void> {
    const loader = this.dashboardPage.blockUiLoader;
  
    try {
      await loader.waitFor({ state: 'visible', timeout: 3000 });
      await loader.waitFor({ state: 'hidden', timeout: TIMEOUTS.EXTENDED });
    } catch {
      // Loader never appeared — continue
    }
  }

  async goBacktoePAppDashboard(): Promise<void> {
    await this.page.goto(URLS.DASHBOARD);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
}

  async goToTaskList(): Promise<void> {
    await this.page.goto(URLS.TASK_LIST);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
}

  async extractDisplayName(): Promise<string> {
    const welcomeText = this.dashboardPage.welcomeContainer;
  
    await expect(welcomeText).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
  
    const text = (await welcomeText.textContent())?.trim() ?? "";
  
    const match = text.match(/Welcome,\s*(.+)/i);
  
    if (!match) {
      throw new Error(`Display name not found in: ${text}`);
    }
  
    return match[1].trim();
  }

  async searchApplicationStatus(docNo: string): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");

    await expect(this.dashboardPage.searchField).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });

    await this.dashboardPage.searchField.fill(docNo);
    await this.dashboardPage.searchButton.click();
    await this.waitForLoaderToDisappear();

    await expect.poll(async () => {
      return await this.dashboardPage.tableRows.count();
    }).toBeGreaterThan(0);
  }

  async extractLoginIDs(taskName: string): Promise<string[]> {
    const escaped = taskName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
    const row = this.dashboardPage.tableBodyRows.filter({
      has: this.page.locator("td").filter({ hasText: new RegExp(`^\\s*${escaped}\\s*$`) }),
    }).first();
  
    const isVisible = await row.isVisible().catch(() => false);
    if (!isVisible) {
      return [];
    }
  
    const assigneeCell = row.locator("td").nth(2);
    const text = (await assigneeCell.textContent())?.trim() ?? "";
  
    const ids = text
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  
    return ids;
  }

  async clickCreateLoaLink(): Promise<void> {
    await this.dashboardPage.createLoaLink.click();
}
}