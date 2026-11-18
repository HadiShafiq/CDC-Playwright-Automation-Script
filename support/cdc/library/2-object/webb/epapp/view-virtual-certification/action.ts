import { expect, Page } from "@playwright/test";
import { VirtualCertPage } from "./main";

export class VirtualCertAction {
  private page: Page;
  private virtualCertPage: VirtualCertPage;

  constructor(page: Page) {
    this.page = page;
    this.virtualCertPage = new VirtualCertPage(page, "en");
  }

  /**
   * Select Ya/Tidak by radio group index
   *
   * Example:
   * await selectAnswer(0, "Ya");
   * await selectAnswer(1, "Tidak");
   */
  async selectAnswer(
    questionIndex: number,
    answer: "Ya" | "Tidak"
  ): Promise<void> {
    const group = this.virtualCertPage.getRadioGroup(questionIndex);
    await this.page.waitForTimeout(3000);
    await expect(group).toBeVisible();
  
    const label = group
      .locator("label")
      .filter({ hasText: answer })
      .first();
  
    await expect(label).toBeVisible();
  
    // label is in a <td>; the radiobutton-box is in the immediately preceding <td>
    const radioBox = label
      .locator("xpath=../preceding-sibling::td[1]")
      .locator(".ui-radiobutton-box");
  
    await expect(radioBox).toBeVisible();
    await radioBox.click();
  }

  async answerYes(
    questionIndex: number
  ): Promise<void> {
    await this.selectAnswer(questionIndex, "Ya");
  }

  async answerNo(
    questionIndex: number
  ): Promise<void> {
    await this.selectAnswer(questionIndex, "Tidak");
  }

  async clickSubmit() {
    await this.virtualCertPage.submitBtn.click();
}

  async clickYes() {
    await this.virtualCertPage.yesBtn.click();
  }
}