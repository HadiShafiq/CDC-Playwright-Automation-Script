import { expect, Locator, Page } from "@playwright/test";
import { mofRegistrationPage } from "./main";
import { FORM_PREFIX, LABELS, LOCATION, FILL_TEXT, URLS, ROLES, DECLARATION_DATA} from "./data";
import { Language } from "../../../shared/data";
import { TIMEOUTS } from "../../../../1-data/config/timeout-config";
import { pfSelectOneMenu } from "../../../../../utils/primeface-dropdown";
import { generateApplicantData } from "../../../../generator/applicant-generator";
import fs from 'fs';
import path from 'path';
import { TIMEOUT } from "dns";

export class mofRegistrationAction {
    private page: Page;
    private language: Language;
    public mrPage : mofRegistrationPage;
    private labels: typeof LABELS["en"];
    private roles: typeof ROLES["en"];
    private declaration: typeof DECLARATION_DATA["en"];
    private filltext: typeof FILL_TEXT;

    constructor(page: Page, language: Language){
        this.page = page;
        this.language = language;
        this.mrPage = new mofRegistrationPage(page, language);
        this.labels = LABELS[language];
        this.roles = ROLES[language];
        this.declaration = DECLARATION_DATA[language];
        this.filltext = FILL_TEXT;
    }

// --- DOC NO CATCHER ---
async getDocNo() {
  // wait for message to appear first
  await this.mrPage.DocNoField.waitFor({ state: "visible" });

  const fullMessage = (await this.mrPage.DocNoField.textContent())!.trim();

  console.log("Full Message:", fullMessage);

  // Updated regex to match both KN- and JN- patterns
  const match = fullMessage.match(/(KN|JN|KB|KU|KA|KR|JA|JB|JU|JR)-\d{8}-\d{4}/);
  const DocNo = match ? match[0] : null;

  if (!DocNo) {
    throw new Error("Document number not found in success message");
  }

  return DocNo;
}

  async fillTokenField(DocNo: string) {
    await this.page.fill('#token-field', DocNo);
  }

// --- NAVIGATION ---

async goToTaskList(): Promise<void> {
    await expect(this.mrPage.taskListMenu).toBeVisible();
    await this.mrPage.taskListMenu.click();
    await this.page.waitForLoadState("networkidle");
}

async goBackToTaskList(): Promise<void> {
    await this.page.goto(URLS.TASK_LIST);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
}

async goBacktoePAppDashboard(): Promise<void> {
    await this.page.goto(URLS.DASHBOARD);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
}


async clickHereLink() {
    await this.mrPage.hereLink.waitFor({ state: "visible" });
    await this.mrPage.hereLink.click();
  }

// --- TASK LIST ---
async clickTaskByDocNo(docNo: string): Promise<void> {
    await this.goBackToTaskList();

    const isHidden = await this.mrPage.filterDocNo.isHidden();
    if (isHidden) {
        await this.toggleNormalView();
        await this.page.waitForTimeout(500);
    }

    await expect(this.mrPage.filterDocNo).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.filterDocNo.fill(docNo);

    await this.clickSearch();
    await this.page.waitForTimeout(1000);

    const taskLink = this.mrPage.getTaskLinkByDocNo(docNo);
    await expect(taskLink).toBeVisible({ timeout: TIMEOUTS.LONG });
    await taskLink.click();
    await this.page.waitForLoadState("networkidle");
}


async clickTaskByWhatsAvailable(){
  await this.page.locator('[id$="taskListMyTaskId_data"] tr:first-child td:nth-child(3) a').click();
}
// --- SEARCH FILTERS ---

async toggleNormalView(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.normalViewToggler).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.normalViewToggler.click();
    await this.page.waitForLoadState("networkidle");
}

async toggleAdvanceView(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.advanceViewToggler).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.advanceViewToggler.click();
    await this.page.waitForLoadState("networkidle");
}

async selectFilterDocType(value: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await pfSelectOneMenu(this.page, this.mrPage.filterDocType, value);
}

async selectFilterDocStatus(value: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await pfSelectOneMenu(this.page, this.mrPage.filterDocStatus, value);
}

async clickSearch(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.searchBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.searchBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickReset(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.resetBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.resetBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickOption(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.optionBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.optionBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickUpdate(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.updateMenuItem).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.updateMenuItem.click();
    await this.page.waitForLoadState("networkidle");
}

async processAvailableEdits2(): Promise<void> {

        const data = generateApplicantData();

        const editBtn = this.mrPage.editBtn.first();

        await editBtn.click();

        await this.fillEPFNo(data.epf);
        await this.selectRace("MELAYU");
        await this.fillExpYear(this.declaration.EXPYEAR);

        await this.selectMailingAddress(this.labels.RESIDENTIAL_ADDRESS)
        await this.selectResidentAddress(this.labels.RESIDENTIAL_ADDRESS);
        await this.selectOfficeAddress(this.labels.OFFICE_ADDRESS);

        await this.clickAddWorkExperience();

        await this.fillWorkExperience(
            data.companyName,
            'SADAM hussein',
            "2020",
            "2024"
        );

        if(await this.mrPage.addProfesionalBodyBtn.isVisible()){
          await this.mrPage.addProfesionalBodyBtn.click();

          await this.fillProfBody(
            this.filltext.PB_choice,
            data.professionalBody
          );

          await this.clickSave();
        }

        await this.clickAddAcademic();

        await this.fillAcademic(
            "2018",
            data.institute,
            this.declaration.QUALIFICATION_LEVEL,
            "Aero Angkasa"
        );

        await this.clickSave();

        await this.page.waitForLoadState("networkidle");
}

//NEW METHOD TO BYPASS EVEN SSM DATA ENTRY

async processAvailableEdits(): Promise<void> {
  // Expand panel if collapsed
  const panel = this.page.locator('[id$="persInfoDtPanel"]');
  const panelContent = panel.locator('.ui-datatable-tablewrapper');
  const isVisible = await panelContent.isVisible().catch(() => false);

  if (!isVisible) {
      // If no toggler, maybe the panel is already expanded but the content is empty
      //it always visible, so we can just log and continue
      console.log('Panel toggler not found – assuming expanded.');
  }

  // Debug: verify table state
  const table = this.page.locator('[id$="personDt_data"]');

  await expect(table).toBeVisible({
      timeout: 30000
  });
  console.log('Table visible:', await table.isVisible());
  const totalRows = await table.locator('tr[data-ri]').count();
  console.log('Total rows:', totalRows);

  let processed = 0;
  let hasEdit = true;

    const rows = table.locator('tr[data-ri]');

  console.log('Rows:', await rows.count());


  for (let i = 0; i < await rows.count(); i++) {
      console.log(`Row ${i}:`);
      console.log(await rows.nth(i).innerText());
  }

  while (hasEdit) {
    const rowsToEdit = this.page.locator('[id*="personDt_data"] tr[data-ri]').filter({
      has: this.page.locator('td:nth-child(9) a:has(img[title="Edit"]), td:nth-child(9) a:has(img[title="Kemaskini"])')
    }).filter({
      has: this.page.locator('td:nth-child(8)').filter({ hasText: /N\/A/ })
    });

    const count = await rowsToEdit.count();
    console.log(`Found ${count} rows to edit (N/A academic + Edit button).`);

    if (count === 0) {
      hasEdit = false;
      break;
    }

    const firstRow = rowsToEdit.nth(0);

    const roleInEP = await firstRow.locator('td:nth-child(7)').textContent() || '';
    console.log(`Role in eP: "${roleInEP.trim()}"`);


    const editBtn = firstRow.locator('img[title="Edit"], img[title="Kemaskini"]').first();

    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();
    await this.page.waitForLoadState('networkidle');

    // Role‑specific logic - add in more roles as needed
    if (roleInEP.includes('Supplier Administrator') || roleInEP.includes('Pentadbir Pembekal') || roleInEP.includes('Temporary Supplier Admin') || roleInEP.includes('Pentadbir Sementara Pembekal')) {
      await this.editSupplierAdministrator();
    } 
    
    if (roleInEP.includes('Supplier User') || roleInEP.includes('Pengguna Pembekal') || roleInEP.includes('Catalogue User') || roleInEP.includes('Pengguna Katalog') || roleInEP.includes('Delete eP Role') || roleInEP.includes('Hapus Peranan dalam eP')) {
      await this.editSupplierUser();
    }

    await this.page.waitForTimeout(500);

    processed++;
    console.log(`Processed row ${processed}`);
  }

  console.log(`All editable rows processed (${processed} rows).`);
}

async processAvailableEdits_perunding(): Promise<void> {
  // Expand panel if collapsed
  const panel = this.page.locator('[id$="persInfoDtPanel"]');
  const panelContent = panel.locator('.ui-datatable-tablewrapper');
  const isVisible = await panelContent.isVisible().catch(() => false);

  if (!isVisible) {
      // If no toggler, maybe the panel is already expanded but the content is empty
      //it always visible, so we can just log and continue
      console.log('Panel toggler not found – assuming expanded.');
  }

  // Debug: verify table state
  const table = this.page.locator('[id$="personDt_data"]');

  await expect(table).toBeVisible({
      timeout: 30000
  });
  console.log('Table visible:', await table.isVisible());
  const totalRows = await table.locator('tr[data-ri]').count();
  console.log('Total rows:', totalRows);

  let processed = 0;
  let hasEdit = true;

    const rows = table.locator('tr[data-ri]');

  console.log('Rows:', await rows.count());


  for (let i = 0; i < await rows.count(); i++) {
      console.log(`Row ${i}:`);
      console.log(await rows.nth(i).innerText());
  }

  while (hasEdit) {
    const rowsToEdit = this.page.locator('[id*="personDt_data"] tr[data-ri]').filter({
      has: this.page.locator('td:nth-child(8) a:has(img[title="Edit"]), td:nth-child(8) a:has(img[title="Kemaskini"])')
    }).filter({
      has: this.page.locator('td:nth-child(7)').filter({ hasText: /N\/A/ })
    });

    const count = await rowsToEdit.count();
    console.log(`Found ${count} rows to edit (N/A academic + Edit button).`);

    if (count === 0) {
      hasEdit = false;
      break;
    }

    const firstRow = rowsToEdit.nth(0);

    const roleInEP = await firstRow.locator('td:nth-child(6)').textContent() || '';
    console.log(`Role in eP: "${roleInEP.trim()}"`);


    const editBtn = firstRow.locator('img[title="Edit"], img[title="Kemaskini"]').first();

    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();
    await this.page.waitForLoadState('networkidle');

    // Role‑specific logic - add in more roles as needed
    if (roleInEP.includes('Supplier Administrator') || roleInEP.includes('Pentadbir Pembekal') || roleInEP.includes('Temporary Supplier Admin') || roleInEP.includes('Pentadbir Sementara Pembekal')) {
      await this.editSupplierAdministrator();
    } 
    
    if (roleInEP.includes('Supplier User') || roleInEP.includes('Pengguna Pembekal') || roleInEP.includes('Catalogue User') || roleInEP.includes('Pengguna Katalog') || roleInEP.includes('Delete eP Role') || roleInEP.includes('Hapus Peranan dalam eP')) {
      await this.editSupplierUser();
    }

    await this.page.waitForTimeout(500);

    processed++;
    console.log(`Processed row ${processed}`);
  }

  console.log(`All editable rows processed (${processed} rows).`);
}

// Data Entry for process available edit

// For Supplier Administrator
async editSupplierAdministrator(): Promise<void> {
  const data = generateApplicantData();

  await this.fillEPFNo(data.epf);
  await this.selectRace('MELAYU');
  await this.fillExpYear(this.declaration.EXPYEAR);

  // Maybe additional steps specific to admin
  await this.selectMailingAddress(this.labels.RESIDENTIAL_ADDRESS);
  await this.selectResidentAddress(this.labels.RESIDENTIAL_ADDRESS);
  await this.selectOfficeAddress(this.labels.OFFICE_ADDRESS);

  await this.clickAddWorkExperience();
  await this.fillWorkExperience(data.companyName, 'SADAM hussein', '2020', '2024');

  if (await this.mrPage.addProfesionalBodyBtn.isVisible()) {

    await this.mrPage.addProfesionalBodyBtn.click();
    await this.fillProfBody(this.filltext.PB_choice, data.professionalBody);
    await this.clickSave();
  
  }

  await this.clickAddAcademic();
  await this.fillAcademic('2018', data.institute, this.declaration.QUALIFICATION_LEVEL, 'Aero Angkasa');
  await this.clickSave();
}

// For Supplier User / Catalogue User (different steps)
async editSupplierUser(): Promise<void> {
  const data = generateApplicantData();

  // Maybe fewer steps or different field values
  await this.fillEPFNo(data.epf);
  await this.selectRace('MELAYU');
  await this.fillExpYear(this.declaration.EXPYEAR);

  await this.selectBumiputera(this.labels.YES);

  await this.selectReligion(this.declaration.RELIGION);

  await this.clickRole(this.roles.MANAGEMENT);

   await this.selectMailingAddress(this.labels.RESIDENTIAL_ADDRESS);

  // Skip address or professional body? Up to you.
  await this.clickAddWorkExperience();
  await this.fillWorkExperience(data.companyName, 'SADAM hussein', '2020', '2024');

  if (await this.mrPage.addProfesionalBodyBtn.isVisible()) {
    await this.mrPage.addProfesionalBodyBtn.click();
    await this.fillProfBody(this.filltext.PB_choice, data.professionalBody);
    await this.clickSave();
  }

  await this.clickAddAcademic();
  await this.fillAcademic('2018', data.institute, this.declaration.QUALIFICATION_LEVEL, 'Aero Angkasa');
  await this.clickSave();
}


// --- DUMMY DATA UPLOADER ---
async uploadDummyFile(page: Page): Promise<void> {
  const dialog = page.locator('div.ui-dialog:visible')
    .filter({ hasText: 'Choose Files' });

  await expect(dialog).toBeVisible({ timeout: 10000 });

  const fileInput = dialog.locator('input[type="file"]');

  await expect(fileInput).toBeAttached({ timeout: 10000 });

  const filePath = this.getFirstUploadFile();

  await fileInput.setInputFiles(filePath);

  await expect(dialog.locator('table.files, .fileupload-content')).toContainText(
    /\.(pdf|doc|docx|zip)/i,
    { timeout: 10000 }
  );
}

// uploader for supporting document in registration
getFirstUploadFile(): string {
  // CDC Playwright Automation Script: the test PDF shipped with the repo (the original read the user's Downloads folder).
  const file = path.resolve(__dirname, '../../../../../../../fixtures/files/File_pdf_for_testing.pdf');
  if (!fs.existsSync(file)) throw new Error(`Upload file not found: ${file}`);
  return file;
}

async openUploadDialog(row: Locator): Promise<void> {
  const uploadBtn = row.locator('img[src*="upload.png"]');

  await expect(uploadBtn).toBeVisible({ timeout: 10000 });

  await uploadBtn.click();
}


async uploadMandatoryDocument(page: Page, documentName: string): Promise<void> {
  const table = page
    .locator('div.ui-datatable')
    .filter({ hasText: 'Mandatory supporting documents' })
    .first();

  const row = table.locator('tbody tr')
    .filter({ hasText: documentName })
    .first();

  const fileRow = row.locator('tr.template-upload');

  await expect(row).toBeVisible({ timeout: 10000 });

  // STEP 1: CHECK IF ALREADY UPLOADED
  const alreadyUploaded = row.locator('text=/remove|delete|download/i');

  if (await alreadyUploaded.count() > 0) {
    console.log(`✔ Skipping ${documentName} (already uploaded)`);
    return;
  }

  // STEP 2: CLICK UPLOAD BUTTON
  const uploadBtn = row.locator('img[src*="upload.png"]');

  await expect(uploadBtn).toBeVisible({ timeout: 10000 });
  await uploadBtn.click();

  // STEP 3: HANDLE DIALOG
  const dialog = page.locator('div.ui-dialog:visible')
    .filter({ hasText: 'Choose Files' });

  await expect(dialog).toBeVisible({ timeout: 10000 });

  const fileInput = dialog.locator('input[type="file"]');

  await expect(fileInput).toBeAttached({ timeout: 10000 });

  const filePath = this.getFirstUploadFile();

  await fileInput.setInputFiles(filePath);

 // STEP 4: VERIFY UPLOAD SUCCESS (FIXED)
const uploadedFile = dialog.locator('table.files');

await expect(uploadedFile).toContainText(
  /\.(pdf|doc|docx|zip)/i,
  { timeout: 10000 }
);

   //  Click START button
   const startBtn = dialog.locator('td.start button');

   await expect(startBtn).toBeVisible({ timeout: 10000 });
   await startBtn.click();
 
   // Wait for upload to finish (row disappears or changes state)
   await expect(fileRow).toBeHidden({ timeout: 20000 });
 
   // Optional stability wait (PrimeFaces AJAX sync)
   await page.waitForTimeout(500);

   await expect(uploadedFile).not.toContainText(
    /\.(pdf|doc|docx|zip)/i,
    { timeout: 20000 }
  );
 
   // Close dialog (X button)
   const closeBtn = dialog.locator('span.ui-icon-closethick');
 
   await expect(closeBtn).toBeVisible({ timeout: 10000 });
   await closeBtn.click();
 
   // Ensure dialog closed
   await expect(dialog).toBeHidden({ timeout: 10000 });

  console.log(`✔ Uploaded: ${documentName}`);
}


//check if document available or not
async isDocumentAvailable(page: Page, title: string) {
  const tableBody = await page.locator('tbody[id$="mandatoryTableId_data"]');
  const rows = tableBody.locator('tr');
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matchingRow = rows.filter({
    has: page.locator(`span`, { hasText: new RegExp(escapedTitle, 'i') })
  });
  return await matchingRow.count() > 0;
}


async uploadAllMissingMandatoryDocuments(page: Page): Promise<void> {
  const table = page
    .locator('div.ui-datatable')
    .filter({ hasText: 'Mandatory supporting documents' })
    .first();

  const tbody = table.locator('tbody[id$="mandatoryTableId_data"]');
  const rows = tbody.locator('tr[data-ri]');
  
  const rowCount = await rows.count();
  console.log(`Found ${rowCount} mandatory document rows`);
  
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const dataRi = await row.getAttribute('data-ri');
    
    // Get the document description (2nd column)
    const descriptionCell = row.locator('td:nth-child(2) span');
    const description = (await descriptionCell.textContent())?.trim() || `Row ${dataRi}`;
    
    // Get the document name cell (4th column) - check if already uploaded
    const docNameCell = row.locator('td:nth-child(4)');
    // an empty row has no link: read the cell (textContent() on a missing link would wait 30 s and throw)
    const docNameLink = docNameCell.locator('a').first();
    const docNameText = (await docNameLink.count()) ? await docNameLink.textContent() : (await docNameCell.innerText()).trim();
    
    // Check if document is already uploaded (has filename text)
    const hasDocument = docNameText && docNameText.trim().length > 0 && docNameText.trim() !== '';
    
    if (hasDocument) {
      console.log(`✔ Row ${dataRi}: "${description}" - Already uploaded (${docNameText?.trim()})`);
      continue;
    }
    
    console.log(`📤 Row ${dataRi}: "${description}" - No document, uploading...`);
    
    // Click the upload button (3rd column) using data-ri attribute
    const uploadBtn = row.locator('td:nth-child(3) img[src*="upload.png"]');
    await expect(uploadBtn).toBeVisible({ timeout: 5000 });
    await uploadBtn.click();
    
    // Handle the upload dialog
    await this.handleUploadDialog(page, description, dataRi!);
  }
}

// ---- UPLOAD FOR MISSING DOCUMENT ----

async uploadMissingDocumentByDataRi(page: Page, targetDataRi: string): Promise<void> {
  const table = page
    .locator('div.ui-datatable')
    .filter({ hasText: 'Mandatory supporting documents' })
    .first();

  const tbody = table.locator('tbody[id$="mandatoryTableId_data"]');
  
  // Find row by data-ri attribute
  const row = tbody.locator(`tr[data-ri="${targetDataRi}"]`).first();
  
  if (!(await row.isVisible())) {
    console.log(`❌ Row with data-ri="${targetDataRi}" not found`);
    return;
  }
  
  const dataRi = await row.getAttribute('data-ri');
  const descriptionCell = row.locator('td:nth-child(2) span');
  const description = (await descriptionCell.textContent())?.trim() || `Row ${dataRi}`;
  
  // Check if already uploaded
  const docNameCell = row.locator('td:nth-child(4)');
  const docNameLink = docNameCell.locator('a').first();
  const docNameText = await docNameLink.textContent();
  
  if (docNameText && docNameText.trim().length > 0 && docNameText.trim() !== '') {
    console.log(`✔ Row ${dataRi}: "${description}" already uploaded`);
    return;
  }
  
  console.log(`📤 Uploading Row ${dataRi}: "${description}"`);
  
  const uploadBtn = row.locator('td:nth-child(3) img[src*="upload.png"]');
  await expect(uploadBtn).toBeVisible({ timeout: 5000 });
  await uploadBtn.click();
  
  await this.handleUploadDialog(page, description, dataRi!);
}

private async handleUploadDialog(page: Page, description: string, dataRi: string): Promise<void> {
  const dialog = page.locator('div.ui-dialog:visible').filter({ hasText: 'Choose Files' });
  await expect(dialog).toBeVisible({ timeout: 10000 });
  
  // Upload file
  const fileInput = dialog.locator('input[type="file"]');
  await expect(fileInput).toBeAttached({ timeout: 10000 });
  
  // Replace with your file path logic
  const filePath = this.getFirstUploadFile();
  await fileInput.setInputFiles(filePath);
  
  // Wait for file to appear in the list
  const uploadedFile = dialog.locator('table.files');
  await expect(uploadedFile).toContainText(/\.(pdf|doc|docx|zip)/i, { timeout: 10000 });
  
  // Click START button
  const startBtn = dialog.locator('td.start button');
  await expect(startBtn).toBeVisible({ timeout: 10000 });
  await startBtn.click();
  
  // Wait for upload to complete
  const fileRow = dialog.locator('tr.template-upload');
  await expect(fileRow).toBeHidden({ timeout: 20000 });
  
  // Wait for the uploaded filename to appear
  await expect(uploadedFile).not.toContainText(/\.(pdf|doc|docx|zip)/i, { timeout: 20000 });
  
  // Close dialog
  const closeBtn = dialog.locator('span.ui-icon-closethick');
  await expect(closeBtn).toBeVisible({ timeout: 10000 });
  await closeBtn.click();
  await expect(dialog).toBeHidden({ timeout: 10000 });
  
  console.log(`✔ Uploaded: ${description} (Row ${dataRi})`);
  
  // Wait for the table to update
  await page.waitForTimeout(500);
}

// Alternative: Get all empty rows and their data-ri values
async getEmptyDocumentRows(page: Page): Promise<{ dataRi: string; description: string }[]> {
  const emptyRows: { dataRi: string; description: string }[] = [];
  
  const table = page
    .locator('div.ui-datatable')
    .filter({ hasText: 'Mandatory supporting documents' })
    .first();

  const tbody = table.locator('tbody[id$="mandatoryTableId_data"]');
  const rows = tbody.locator('tr[data-ri]');
  
  const rowCount = await rows.count();
  
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const dataRi = await row.getAttribute('data-ri');
    
    const docNameCell = row.locator('td:nth-child(4)');
    // an empty row has no link: read the cell (textContent() on a missing link would wait 30 s and throw)
    const docNameLink = docNameCell.locator('a').first();
    const docNameText = (await docNameLink.count()) ? await docNameLink.textContent() : (await docNameCell.innerText()).trim();
    
    const hasDocument = docNameText && docNameText.trim().length > 0 && docNameText.trim() !== '';
    
    if (!hasDocument) {
      const descriptionCell = row.locator('td:nth-child(2) span');
      const description = (await descriptionCell.textContent())?.trim() || '';
      
      emptyRows.push({
        dataRi: dataRi!,
        description: description
      });
    }
  }
  
  return emptyRows;
}

// ---- UPLOAD FOR OVERLAPPING CATEGORY DOCUMENT ----

/**
 * Check if Overlap Category Supporting Documents table exists
 */
async isOverlapTableVisible(page: Page): Promise<boolean> {
  // Look for the table wrapper or any part of the overlap table
  const table = page.locator('div[id$="overlapCatSuppDocDtId"]');
  return await table.isVisible({ timeout: 3000 }).catch(() => false);
}

/**
* Get empty document rows from Overlap Category table
*/
async getEmptyOverlapRows(page: Page): Promise<{ dataRi: string; description: string }[]> {
  const emptyRows: { dataRi: string; description: string }[] = [];
  
  const tableExists = await this.isOverlapTableVisible(page);
  if (!tableExists) {
      return emptyRows;
  }
  
  // Look for tbody with dynamic ID - use partial match or locate within the table
  const table = page.locator('div[id$="overlapCatSuppDocDtId"]');
  const rows = table.locator('tbody tr[data-ri]');
  const rowCount = await rows.count();
  
  console.log(`📋 Found ${rowCount} row(s) in Overlap Category table`);
  
  for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const dataRi = await row.getAttribute('data-ri');
      
      // Check Document Name column (5th column)
      const docNameCell = row.locator('td:nth-child(5)');
      const docNameText = await docNameCell.textContent();
      
      const hasDocument = docNameText && docNameText.trim().length > 0 && docNameText.trim() !== 'N/A';
      
      if (!hasDocument) {
          // Get description from Document Description column (3rd column)
          const descriptionCell = row.locator('td:nth-child(3) span');
          const description = (await descriptionCell.textContent())?.trim() || `Row ${dataRi}`;
          
          emptyRows.push({ dataRi: dataRi!, description });
      }
  }
  
  return emptyRows;
}

/**
* Fill justification and upload document in Overlap Category table
*/
async uploadOverlapDocumentByRi(page: Page, targetDataRi: string, justificationText: string = "Justification for document upload - Auto generated"): Promise<void> {
  const tableExists = await this.isOverlapTableVisible(page);
  if (!tableExists) {
      console.log(`ℹ️ Overlap table not found - skipping upload for row ${targetDataRi}`);
      return;
  }
  
  const table = page.locator('div[id$="overlapCatSuppDocDtId"]');
  const row = table.locator(`tbody tr[data-ri="${targetDataRi}"]`).first();
  
  if (!(await row.isVisible().catch(() => false))) {
      console.log(`❌ Overlap row ${targetDataRi} not found`);
      return;
  }
  
  const dataRi = await row.getAttribute('data-ri');
  
  // Check if already uploaded (Column 5 - Document Name)
  const docNameCell = row.locator('td:nth-child(5)');
  const docNameText = await docNameCell.textContent();
  
  if (docNameText && docNameText.trim().length > 0 && docNameText.trim() !== 'N/A') {
      console.log(`✔ Overlap row ${dataRi}: Already uploaded - skipping`);
      return;
  }
  
  // Get description (Column 3 - Document Description)
  const descriptionCell = row.locator('td:nth-child(3) span');
  const description = (await descriptionCell.textContent())?.trim() || `Row ${dataRi}`;
  
  // STEP 1: Fill justification field (Column 2)
  console.log(`📝 Filling justification for: "${description}" (Row ${dataRi})`);
  const justificationTextarea = row.locator('td:nth-child(2) textarea');
  await expect(justificationTextarea).toBeVisible({ timeout: 5000 });
  await justificationTextarea.fill(justificationText);
  
  // STEP 2: Click upload button (Column 4)
  console.log(`📤 Uploading Overlap doc: "${description}" (Row ${dataRi})`);
  const uploadBtn = row.locator('td:nth-child(4) img[src*="upload.png"]');
  await expect(uploadBtn).toBeVisible({ timeout: 5000 });
  await uploadBtn.click();
  
  await this.handleOverlapUploadDialog(page, description, dataRi!);
}

/**
* Handle Overlap Category upload dialog
*/
private async handleOverlapUploadDialog(page: Page, description: string, dataRi: string): Promise<void> {
  const dialog = page.locator('div[id$="overlapCatUploadDialog"]:visible');
  await expect(dialog).toBeVisible({ timeout: 10000 });
  
  // Upload file
  const fileInput = dialog.locator('input[type="file"]');
  await expect(fileInput).toBeAttached({ timeout: 10000 });
  
  // Use your existing file path method
  const filePath = this.getFirstUploadFile();
  await fileInput.setInputFiles(filePath);
  
  // Wait for file to appear
  const uploadedFile = dialog.locator('table.files');
  await expect(uploadedFile).toContainText(/\.(pdf|doc|docx|zip)/i, { timeout: 10000 });
  
  // Click upload/start button
  const startBtn = dialog.locator('td.start button, button:has-text("Start")');
  if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      
      // Wait for upload to complete
      const fileRow = dialog.locator('tr.template-upload');
      await expect(fileRow).toBeHidden({ timeout: 20000 });
  }
  
  /* this part doesnt have to close dialog
  // Close dialog
  const closeBtn = dialog.locator('span.ui-icon-closethick, .ui-dialog-titlebar-close');
  await expect(closeBtn).toBeVisible({ timeout: 10000 });
  await closeBtn.click();
  await expect(dialog).toBeHidden({ timeout: 10000 });
  */

  console.log(`✔ Uploaded Overlap doc: ${description} (Row ${dataRi})`);
  await page.waitForTimeout(500);
}

/**
* Main method to process all missing Overlap Category documents
*/
async processMissingOverlapDocs(page: Page, justificationText: string = "Justification for document upload - Auto generated"): Promise<void> {
  // Check if the overlap table exists
  const tableExists = await this.isOverlapTableVisible(page);
  if (!tableExists) {
      console.log("ℹ️ No Overlap Category Supporting Documents table - skipping");
      return;
  }
  
  console.log("📋 Processing Overlap Category Supporting Documents...");
  
  const emptyRows = await this.getEmptyOverlapRows(page);
  
  if (emptyRows.length === 0) {
      console.log("✅ All Overlap Category documents already uploaded");
      return;
  }
  
  console.log(`📤 Found ${emptyRows.length} missing Overlap document(s)`);
  
  for (const row of emptyRows) {
      console.log(`  → Row ${row.dataRi}: ${row.description}`);
      await this.uploadOverlapDocumentByRi(page, row.dataRi, justificationText);
      await page.waitForTimeout(500);
  }
  
  console.log("✅ Overlap Category processing complete");
}

/**
* Alternative: Check if any overlap category exists at all (alert or table)
*/
async hasOverlapCategories(page: Page): Promise<boolean> {
  // Check for alert message or the table itself
  const alertExists = await page.locator('span.warning:has-text("Overlapped categories")').isVisible({ timeout: 2000 }).catch(() => false);
  const tableExists = await this.isOverlapTableVisible(page);
  
  return alertExists || tableExists;
}

// --- MENU --- 

async declareApplicationMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.declareApplicationPage).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.declareApplicationPage.click();
    await this.page.waitForLoadState("networkidle");
}

async payProcessingfeeMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.payProcessingPage).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.payProcessingPage.click();
    await this.page.waitForLoadState("networkidle");
}

async viewVirtualMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.viewVirtualPage).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.viewVirtualPage.click();
    await this.page.waitForLoadState("networkidle");
}

async uploadCatalogueMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.uploadCataloguePage).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.uploadCataloguePage.click();
    await this.page.waitForLoadState("networkidle");
}

async clickSoftCertMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.softCertPage).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.softCertPage.click();
    await this.page.waitForLoadState("networkidle");
}


// --- SIDE MENU ---

async clickCompanyInfoMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.companyInfoMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.companyInfoMenu.click();
    await this.page.waitForLoadState("networkidle");
}

async clickAssocsMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.assocsMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.assocsMenu.click();
    await this.page.waitForLoadState("networkidle");
}

async clickPersonnelBranchMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.personnelBranchMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.personnelBranchMenu.click();
    await this.page.waitForLoadState("networkidle");
}

async clickBankInfoMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.bankInfoMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.bankInfoMenu.click();
    await this.page.waitForLoadState("networkidle");
}

async clickCategoryCodesMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.categoryCodesMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.categoryCodesMenu.click();
    await this.page.waitForLoadState("networkidle");
}

async clickSupportingDocumentMenu(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.supportingDocumentMenu).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.supportingDocumentMenu.click();
    await this.page.waitForLoadState("networkidle");
}


// --- FIELDS ---

// Selects any radio option that is NOT currently checked within a given radio group ID
async selectAnyCheckbox(root: Locator): Promise<void> {
  await this.page.waitForTimeout(1000);

  const items = root.locator('.ui-selectlistbox-item');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const checkboxBox = item.locator('.ui-chkbox-box');

      const isChecked = await checkboxBox.evaluate(el =>
          el.classList.contains('ui-state-active')
      );

      if (!isChecked) {
          await checkboxBox.click();
          await this.page.waitForTimeout(2000);
          return;
      }
  }

  // fallback
  await items.nth(0).locator('.ui-chkbox-box').click();
}

async selectRadioByLabel( radioGroup: string | Locator, labelText: string ): Promise<void> {
  
    const root = await this.resolvePrimeFacesRoot(radioGroup);
  
    // -------------------------
    // 1. RADIO ATTEMPT (ONLY TRY ONCE)
    // -------------------------
    try {
      const label = root.locator('label').filter({
        hasText: labelText
      }).first();
  
      const targetId = await label.getAttribute('for');
  
      if (!targetId) {
        throw new Error(`Radio label missing 'for' attribute for "${labelText}"`);
      }
  
      const radioBox = this.page
        .locator(`[id="${targetId}"]`)
        .locator('xpath=ancestor::div[contains(@class,"ui-radiobutton")]')
        .locator('.ui-radiobutton-box');
  
      if (await radioBox.count() === 0) {
        throw new Error('Radio box not found');
      }
  
      await radioBox.click();
  
      return; // SUCCESS → STOP HERE
    } 
    catch (err) {
      // ONLY NOW fallback is allowed
    }
  
    // -------------------------
    // 2. FALLBACK (CHECKBOX MODE ONLY IF RADIO FAILS)
    // -------------------------
    const optionSpan = root.locator('span', {
      hasText: labelText
    }).first();
  
    if (await optionSpan.count() > 0) {
      const row = optionSpan.locator('xpath=ancestor::tr[1]');
      const checkbox = row.locator('.ui-chkbox-box');
  
      if (await checkbox.count() > 0) {
        await checkbox.click();
        return;
      }
    }
  
    throw new Error(`Option "${labelText}" not found in radio or checkbox group`);
  }


  async resolvePrimeFacesRoot(selector: string | Locator): Promise<Locator> {
    const base =
      typeof selector === 'string'
        ? this.page.locator(selector)
        : selector;
  
    if (typeof selector !== 'string') {
      return base;
    }
  
    // 1. Direct content lookup (BEST CASE)
    const content = this.page.locator(`${selector}_content`);
    if (await content.count() > 0) {
      return content.first();
    }
  
    // 2. fallback: any content block containing base id
    const fallback = this.page
      .locator('[id$="_content"]')
      .filter({ has: this.page.locator(selector) });
  
    if (await fallback.count() > 0) {
      return fallback.first();
    }
  
    // 3. last fallback
    return base;
  }


// --- CONFIRMATION DIALOG ---


async clickConfirmationYes(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.yesBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.yesBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickConfirmationNo(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.noBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.noBtn.click();
    await this.page.waitForLoadState("networkidle");
}


// --- ASSERTIONS ---

async selectDistrict(value: string){
  await pfSelectOneMenu(this.page, this.mrPage.basicCompDistrict, value);
}

async selectCity(value: string){
  await pfSelectOneMenu(this.page, this.mrPage.basicCompCity, value);
}

async fillAnnualRevenue(value: string){
    await pfSelectOneMenu( this.page, this.mrPage.AnnualRevenue, value );
}

async fillBumiStaff(count: string){
    await this.mrPage.bumiStaffInput.waitFor({ state: 'visible' });
    await this.mrPage.bumiStaffInput.click();
    await this.mrPage.bumiStaffInput.fill(count);
    await this.page.waitForLoadState("domcontentloaded");
}

async fillAllBumiStaff(count: string) {
  const inputs = this.mrPage.bumiStaffInput;
  const count_elements = await inputs.count();
  
  for (let i = 0; i < count_elements; i++) {
      await inputs.nth(i).waitFor({ state: 'visible' });
      await inputs.nth(i).click();
      await inputs.nth(i).fill(count);
  }
  await this.page.waitForLoadState("domcontentloaded");
}

async fillBumiCapital(value: string) {
  await this.mrPage.getCapitalInput('Bumiputera').fill(value);
}

async fillNonBumiCapital(value: string) {
  await this.mrPage.getCapitalInput('Non - Bumiputera').fill(value);
}

async fillNonMalaysianCapital(value: string) {
  await this.mrPage.getCapitalInput('Non - Malaysian').fill(value);
}

async fillExpYear(value: string){
  await this.mrPage.ExpYear.fill(value);
}

async fillIncomeTax(value: string){
    await this.mrPage.incometaxNo.fill(value);
}

async fillShareAmount(value: string){
    await this.mrPage.ShareAmount.fill(value);
}

async editAndFillShareAmount(rowIndex: number, amount: string) {
  const rowEditButton = this.page.locator(
      `tr[data-ri="${rowIndex}"] img[title="Edit"], tr[data-ri="${rowIndex}"] img[title="Kemaskini"]`
  );
  
  await expect(rowEditButton).toBeVisible({ timeout: TIMEOUTS.LONG });
  await rowEditButton.click();
  
  // Wait for modal/dialog to open
  await this.page.waitForTimeout(2000);
  await this.page.waitForLoadState("networkidle");
  
  // Fill the amount
  await this.fillShareAmount(amount);
}

async fillEpfNo(value: string){
    await this.mrPage.EpfNo.fill(value);
}

async fillFacility(owner: string, price: string, value: string) {
    await this.selectRadioByLabel(
        this.mrPage.FacilityType,
        value
      );
    await this.mrPage.facilityOwnerInput.fill(owner);
    await this.mrPage.pickDate.first().click();
    await this.page.waitForSelector("#ui-datepicker-div", { state: "visible" });
    await this.page.locator('#ui-datepicker-div td a:text-is("1")').click();
    await this.mrPage.purchasePriceInput.fill(price);
  }

  async fillFacilityPerunding(owner: string, price: string) {
    await this.mrPage.facilityOwnerInput.fill(owner);
    await this.mrPage.pickDate.first().click();
    await this.page.waitForSelector("#ui-datepicker-div", { state: "visible" });
    await this.page.locator('#ui-datepicker-div td a:text-is("1")').click();
    await this.mrPage.purchasePriceInput.fill(price);
  }

  async fillBasicInfo(name: string, ic: string) {
    await this.mrPage.nameInput.fill(name);
    await this.mrPage.icInput.fill(ic);
    await this.page.waitForTimeout(1000);
  }

  async fillDOB(year = '1985'){
    await this.mrPage.DateOfBirth.click();
    await this.page.waitForSelector("#ui-datepicker-div", { state: "visible" });
    // CDC Playwright Automation Script: pick a past year when the calendar has a year list (the original picked day 1 of the
    // current month, i.e. a newborn).
    const yearSelect = this.page.locator('#ui-datepicker-div select.ui-datepicker-year');
    if (await yearSelect.count()) {
      const years = await yearSelect.locator('option').allTextContents();
      await yearSelect.selectOption(years.includes(year) ? year : years[0]);
    }
    await this.page.locator('#ui-datepicker-div td a:text-is("1")').click();
  }

  async fillEPFNo(value: string){
    await this.page.waitForLoadState('domcontentloaded');
    await this.mrPage.EpfNo.fill(value);
  }

  async fillPosition(position: string){
    await this.page.waitForLoadState('domcontentloaded');
    await this.mrPage.PositionInCompany.fill(position);
  }



 // --- FOR MANAGEMENT AND OTHERS --- 

  async fillAddress(line1: string) {
    await this.mrPage.EmpAddress.focus();
    await this.page.keyboard.insertText(line1);
    await this.page.waitForTimeout(1000);
}

 async FillEmpState(value: string) {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForLoadState('domcontentloaded');
  await pfSelectOneMenu(this.page, this.mrPage.EmpState, value);
  await this.page.waitForLoadState('domcontentloaded');
 }

 async FillEmpDist(value: string) {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForLoadState('domcontentloaded');
  await pfSelectOneMenu(this.page, this.mrPage.EmpDistrict, value);
  await this.page.waitForLoadState('domcontentloaded');
 }

 async FillEmpCity(value: string){
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForLoadState('domcontentloaded');
  await pfSelectOneMenu(this.page, this.mrPage.EmpCity, value);
  await this.page.waitForLoadState('domcontentloaded');
 }

 async fillEmpPost(value: string){
    await expect(this.mrPage.EmpPostcode).toBeVisible();
    await this.mrPage.EmpPostcode.fill(value);
    await this.page.waitForTimeout(1000);
 }

// --- FOR STAFF ROLE ---

  async fillAddressStaff(line1: string) {
    await this.mrPage.EmpAddressstaff.focus();
    await this.page.keyboard.insertText(line1);
    await this.page.waitForTimeout(1000);
}

 async FillEmpStateStaff(value: string) {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForLoadState('domcontentloaded');
  await pfSelectOneMenu(this.page, this.mrPage.EmpStateStaff, value);
  await this.page.waitForLoadState('domcontentloaded');
 }

 async FillEmpDistStaff(value: string) {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForLoadState('domcontentloaded');
  await pfSelectOneMenu(this.page, this.mrPage.EmpDistrictstaff, value);
  await this.page.waitForLoadState('domcontentloaded');
 }

 async FillEmpCityStaff(value: string){
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForLoadState('domcontentloaded');
  await pfSelectOneMenu(this.page, this.mrPage.EmpCitystaff, value);
  await this.page.waitForLoadState('domcontentloaded');
 }

 async fillEmpPostStaff(value: string){
    await expect(this.mrPage.EmpPostcodestaff).toBeVisible();
    await this.mrPage.EmpPostcodestaff.fill(value);
    await this.page.waitForTimeout(1000);
 }

  
  async fillWorkExperience(
    company: string,
    role: string,
    from: string,
    to: string
  ) {
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
    await this.mrPage.companyNameInput.fill(company);

    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
    await this.mrPage.designationInput.fill(role);
  
    await pfSelectOneMenu(this.page, this.mrPage.yearFromId, from);
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.yearToId, to);
  
    await this.clickSave();
    await this.page.waitForTimeout(1000);
  }

  async fillProfBody(
    ProfBody: string,
    RegNo: string,
  ){
     await pfSelectOneMenu(this.page, this.mrPage.ProfBodyLabel, ProfBody);
     await this.page.waitForLoadState('networkidle');

     await this.page.waitForTimeout(1000);
     await this.page.waitForLoadState('networkidle');
     this.mrPage.profBodyRegNo.fill(RegNo);

     await this.page.waitForLoadState('networkidle');
     await this.selectDate10YearsFromNow();

     await this.clickSave();

  }

  async selectDate10YearsFromNow() {
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + 10);
    
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
    
    // Target the datepicker inside the Professional Body Information dialog
    await this.page.locator('.ui-dialog .ui-datepicker-trigger').click();
    // Or more specific: await this.page.locator('#ui-datepicker-div').first().click();
    
    await this.page.locator('#ui-datepicker-div').waitFor({ state: 'visible' });
    await this.page.locator('.ui-datepicker-year').selectOption(targetYear.toString());
    await this.page.locator('.ui-datepicker-month').selectOption(targetMonth.toString());
    await this.page.locator(`td[data-year="${targetYear}"][data-month="${targetMonth}"] a:has-text("${targetDay}")`).click();
  }
  
  async fillAcademic(
    year: string,
    institute: string,
    qualification: string,
    field: string
  ) {

    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.academicYearId, year);

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    await this.mrPage.academicInstituteInput.fill(institute);


    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.academicQualificationId, qualification);


    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.academicFieldId, field);
  
    await this.clickSave();
    await this.page.waitForTimeout(1000);
  }


  async fillBankDetails(
    purpose: string,
    branch: string,
    address: string,
    state: string,
    district: string,
    city: string,
    postcode: string,
    termNCond: string
  ) {
    await pfSelectOneMenu(this.page, this.mrPage.bankPurposeId, purpose);
    
    await this.page.waitForLoadState('networkidle');
    await this.mrPage.bankBranchInput.fill(branch);
    await this.mrPage.bankBranchInput.fill(branch);
    await this.page.waitForTimeout(1000);

    await this.page.waitForLoadState('networkidle');
    await this.mrPage.bankAddressInput.fill(address);

    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.bankStateId, state);

    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.bankDistrictId, district);

    await this.page.waitForLoadState('networkidle');
    await pfSelectOneMenu(this.page, this.mrPage.bankCityId, city);
  
    await this.page.waitForLoadState('networkidle');
    await this.mrPage.bankPostcodeInput.fill(postcode);

    await this.page.waitForLoadState('networkidle');
    await this.mrPage.bankTermnCndInput.fill(termNCond);

    await this.selectAnyCheckbox(this.mrPage.bankSignCheckBox);
  
    await this.page.waitForTimeout(1000);
  }


  //---SELECTION ---

  async selectSalutation(value: string) {
    await pfSelectOneMenu(this.page, this.mrPage.salutationId, value);
  }
  
  async selectRace(value : string) {
    await pfSelectOneMenu(this.page, this.mrPage.raceId, value);

    await this.page.waitForLoadState('networkidle');
  }


  async selectReligion(religion: string){
    await this.selectRadioByLabel(
        this.mrPage.ReligionType,
        religion
    );
}

async selectMailingAddress(address: string){
    await this.mrPage.getMailAddrCheckBox(address).click();
   }

async selectResidentAddress(address: string){
 await this.mrPage.getResiAddrCheckBox(address).click();
}

async selectOfficeAddress(address: string){
 await this.mrPage.getOfficeAddrCheckBox(address).click(); 
}

async selectBumiputera(status: string){
    await this.selectRadioByLabel(
        this.mrPage.BumiStatus,
        status
    );
}

// --- Select role for MOF  ---
async getRoleCheckbox(role: string): Promise<Locator> {
   // Find the span with role text
   const roleSpan = this.mrPage.UserRolesPanel
  .locator('span', { hasText: new RegExp(`^${role}$`) })
  .first();
        
   // Get the column index safely
   const columnIndex = await roleSpan.evaluate(el => {
       const td = el.closest('td');
       if (!td) return 1;
       
       const row = td.closest('tr');
       if (!row) return 1;
       
       const cells = Array.from(row.cells);
       const currentIndex = cells.indexOf(td);

       return currentIndex;
   });
   
   const checkboxColumn = columnIndex;

   // Get checkbox in the same column
   return roleSpan.locator('..').locator(`..`).locator(`td:nth-child(${checkboxColumn}) .ui-chkbox-box`);
}

/** True when the User Roles panel offers this role (Cooperative has no "Equity Owner"). */
async hasRole(role: string): Promise<boolean> {
  return (await this.mrPage.UserRolesPanel.locator('span', { hasText: new RegExp(`^${role}$`) }).count()) > 0;
}

async clickRole(role: string) {
  const checkbox = await this.getRoleCheckbox(role);
  await expect(checkbox).toBeVisible({ timeout: 10000 });
  await checkbox.click();
}

async selectOwnershipType(value: string) {
    await this.selectRadioByLabel(
      this.mrPage.OwnershipType,
      value
    );
}

// --- SElECT FOR KOD BIDANG ---

async selectCategoryCodes(
  bidang: string,
  subBidang: string,
  pecahan: string
): Promise<void> {
  const popup = this.page.locator('[id$="catCodePopup"]:visible');

  const subBidangEl = popup.locator('[id$="catCodeLvl2"]');
  const pecahanEl = popup.locator('[id$="catCodeLvl3"]');

  // Level 1. The popup can still be loading when the first pick is made, so the AJAX that fills level 2 never fires
  // (SIT 2026-11-24, KN-24112026-0035): pick again — via another option so the change event really fires — up to 3 times.
  await popup.first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
  await this.page.waitForLoadState('networkidle').catch(() => {});
  for (let attempt = 1; ; attempt++) {
    if (attempt > 1) {
      const other = (await popup.locator('[id$="catCodeLvl1"] option').allTextContents())
        .map((o) => o.trim())
        .find((o) => o && o !== bidang && !/Select/i.test(o));
      if (other) await pfSelectOneMenu(this.page, this.mrPage.bidangId, other).catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
    await pfSelectOneMenu(this.page, this.mrPage.bidangId, bidang);
    try {
      await this.waitDropdownPopulated(subBidangEl);
      break;
    } catch (e) {
      if (attempt >= 3) throw e;
    }
  }

  // Level 2
  await pfSelectOneMenu(this.page, this.mrPage.subBidangId, subBidang);

  await this.waitDropdownPopulated(pecahanEl);

  // Level 3
  await pfSelectOneMenu(this.page, this.mrPage.pecahanId, pecahan);
}

private async waitDropdownPopulated(dropdown: Locator) {
  await expect.poll(async () => {
    const options = await dropdown.locator('option').allTextContents();
    return options.filter(o => o.trim() && o !== '- Select One -').length;
  }).toBeGreaterThan(0);
}

  // --- BUTTONS ---

  async clickNext(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.nextBtn).toBeVisible();
    await this.mrPage.nextBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickViewCommittee(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.viewCommitteeBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.viewCommitteeBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickView(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.viewBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.viewBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickPrevious(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.previousBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.previousBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickBack(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.backBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.backBtn.click();
    await this.page.waitForLoadState("networkidle");
}


async clickDownloadAll(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.downloadAllBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    const downloadPromise = this.page.waitForEvent("download");
    await this.mrPage.downloadAllBtn.click();
    await downloadPromise;
}

async clickSignOff(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.signOffBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.signOffBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickSave(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.saveBtn.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.saveBtn.first().click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");
}

async clickBankDialogSave(): Promise<void> {
    await expect(this.mrPage.bankDialog).toBeVisible({ timeout: TIMEOUTS.LONG });
    await expect(this.mrPage.bankDialogSaveBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.bankDialogSaveBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickEdit(): Promise<void> {
  await this.page.waitForTimeout(1000);
  await expect(this.mrPage.editBtn.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
  await this.mrPage.editBtn.first().click();
  await this.page.waitForTimeout(2000);
  await this.page.waitForLoadState("networkidle");
}

async clickDelete(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.deleteBtn.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.deleteBtn.first().click();
    await this.page.waitForLoadState("networkidle");
}

async clickAdd(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.addBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.addBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickAddEmployee(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.addEmployeeBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.addEmployeeBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickYes(): Promise<void> {
  await this.page.waitForTimeout(1000);
  await expect(this.mrPage.yesBtn.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
  await this.mrPage.yesBtn.first().click();
  await this.page.waitForLoadState("networkidle");
}

async clickOK(): Promise<void>{
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.okBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.okBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickSubmit(): Promise<void>{
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.submitBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.mrPage.submitBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickRemove(): Promise<void>{
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.removeBtn).toBeVisible({ timeout: TIMEOUTS.LONG});
    await this.mrPage.removeBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickAddapproval(): Promise<void>{
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.addApprovalBtn).toBeVisible({ timeout: TIMEOUTS.LONG});
    await this.mrPage.addApprovalBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickRevise(): Promise<void>{
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.reviseBtn).toBeVisible({timeout: TIMEOUTS.LONG});
    await this.mrPage.reviseBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickNextsection(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.nextSectionBtn).toBeVisible({timeout: TIMEOUTS.LONG});
    await this.mrPage.nextSectionBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickRecommend(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.mrPage.recommendBtn).toBeVisible({timeout: TIMEOUTS.LONG});
    await this.mrPage.recommendBtn.click();
    await this.page.waitForLoadState("networkidle");
}

async clickAddWorkExperience(): Promise<void> {
    await expect(this.mrPage.addWorkExperienceBtn)
        .toBeVisible({ timeout: TIMEOUTS.LONG });

    await this.mrPage.addWorkExperienceBtn.first().click();
}

async clickAddAcademic(): Promise<void> {
    await expect(this.mrPage.addAcademicBtn)
        .toBeVisible({ timeout: TIMEOUTS.LONG });

    await this.mrPage.addAcademicBtn.first().click();
}

async clickAddProfessionalBody(): Promise<void> {
  await expect(this.mrPage.addProfesionalBodyBtn)
      .toBeVisible({ timeout: TIMEOUTS.LONG });

  await this.mrPage.addProfesionalBodyBtn.first().click();
}

async clickDeleteDoc(): Promise<void> {
  await expect(this.mrPage.DeleteDocBtn.first())
      .toBeVisible({ timeout: TIMEOUTS.LONG });

  await this.mrPage.DeleteDocBtn.first().click();
}

async clickDeclare(): Promise<void> {
  await expect(this.mrPage.declareBtn)
      .toBeVisible({ timeout: TIMEOUTS.LONG });

  await this.mrPage.declareBtn.first().click();
}

async clickProceed(): Promise<void> {
  await expect(this.mrPage.proceedBtn)
  .toBeVisible({ timeout: TIMEOUTS.LONG });

await this.mrPage.proceedBtn.first().click();
}

async clickAddCompanyShare(): Promise<void> {
  await this.page.waitForTimeout(1000);
  await expect(this.mrPage.addCompanyShareBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
  await this.mrPage.addCompanyShareBtn.click();
  await this.page.waitForLoadState("networkidle");
}

async clickClosePopup(): Promise<void> {
  await this.page.waitForTimeout(1000);
  
  // Wait for visible close button specifically
  const closeBtn = this.page.locator('.ui-dialog .ui-dialog-titlebar-close:visible').first();
  await expect(closeBtn).toBeVisible({ timeout: TIMEOUTS.LONG });
  await closeBtn.click();
  await this.page.waitForLoadState("networkidle");
}

// --- VERIFY ---

async verifyAcademicQualificationTitle(): Promise<void> {
  await expect (this.mrPage.AcademicQualificationTitle).toBeVisible({timeout: TIMEOUTS.LONG});
}

async verifyCapitalEquityCompanyHeader(): Promise<void> {
  await expect (this.mrPage.CapitalEquityCompanyHeader).toBeVisible({timeout: TIMEOUTS.LONG});
}

async verifyCapitalEquityCompanyPopUpTitle(): Promise<void> {
  await expect (this.mrPage.CapitalEquityCompanyPopUpTitle).toBeVisible({timeout: TIMEOUTS.LONG});
}

async verifyBankInformationPopUpTitle(): Promise<void> {
  await expect (this.mrPage.BankInformationPopUpTitle).toBeVisible({timeout: TIMEOUTS.LONG});
}

async verifyLabelNameNonMalay(): Promise<void> {
  await expect (this.mrPage.LabelNameNonMalay).toBeVisible({timeout: TIMEOUTS.LONG});
}

async verifyNonMalaysiangridcell(): Promise<void> {
  await expect ( this.mrPage.NonMalaysiangridcell).toBeVisible({timeout: TIMEOUTS.LONG});
}

async VerifyCapitalEquityHeaderName(): Promise<void> {
  await expect( this.mrPage.CapitalEquityHeaderName).toBeVisible({timeout: TIMEOUTS.LONG});
}

async VerifyCapitalEquityPopUpTitle(): Promise<void> {
  await expect( this.mrPage.CapitalEquityPopUptitle).toBeVisible({timeout: TIMEOUTS.LONG});
}


}