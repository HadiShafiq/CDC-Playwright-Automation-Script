import { Locator, Page } from "@playwright/test";
import { FORM_PREFIX, LABELS, LOCATION, FILL_TEXT, SPECIFIC_BUTTON } from "./data";
import { Language } from "../../../shared/data";

export class mofRegistrationPage {
    private page: Page;
    private language: Language;
    private labels: typeof LABELS["en"];
    private specificBTN: typeof SPECIFIC_BUTTON["en"];

    constructor(page: Page, language: Language) {
        this.page = page;
        this.language = language;
        this.labels = LABELS[language];
        this.specificBTN = SPECIFIC_BUTTON[language];
    }

    // --- DOCUMENT NUMBER CATCHER ---

    get DocNoField() {
        return this.page.locator('.ui-messages-info-detail');
    }
      


    // --- NAVIGATION MENU ---

    get taskListMenu() {
        return this.page.getByRole("menuitem", { name: this.labels.TASK_LIST });
    }

    get LogoutMenu() {
        return this.page.getByRole('link', { name: this.labels.SIGNOUT, exact: true});
    }

    get avatarDropdown() {
        return this.page.locator('.user-avatar-link.dropdown-toggle');
    }

    get hereLink() {
        return this.page
          .locator('.ui-messages-info-detail')
          .locator('a', { hasText: /HERE|CLICK HERE|LINK|SINI/i });
      }

    // --- STEP NAVIGATION ---
    // Check which step is currently active
    get currentStep() {
        return this.page.locator('a.ui-commandlink.currentStep');
    }


    // --- SIDE MENU ---

    get companyInfoMenu(){
        return this.page.getByRole("link", { name: this.labels.COMPANY_INFO, exact: true});
    }

    get assocsMenu(){
        return this.page.getByRole("link", { name: this.labels.ASSOCS_PROJECT, exact: true} );
    }

    get personnelBranchMenu(){
        return this.page.getByRole("link", { name: this.labels.PERSONNEL_BRANCH, exact: true});
    }

    get capitalInforMenu(){
        return this.page.getByRole("link", { name: this.labels.CAPITAL_INFO, exact: true });
    }

    get bankInfoMenu(){
        return this.page.getByRole("link", { name: this.labels.BANK_INFO, exact: true});
    }

    get categoryCodesMenu(){
        return this.page.getByRole("link", { name: this.labels.CATEGORY_CODES, exact: true});
    }

    get supportingDocumentMenu(){
        return this.page.getByRole("link", { name: this.labels.SUPPORTING_DOCUMENTS, exact: true});
    }

    get declareApplicationPage() {
        return this.page.getByRole("link", { name: this.labels.DECLARE_APPLICATION, exact: true});
    }

    get payProcessingPage(){
        return this.page.getByRole("link", { name: this.labels.PAY_PROCESS_FEE, exact: true});
    }

    get viewVirtualPage(){
        return this.page.getByRole("link", { name: this.labels.VIEW_VIRTUAL});
    }

    get uploadCataloguePage(){
        return this.page.getByRole("link", { name: this.labels.UPLOAD_CATALOGUE, exact: true});
    }

    get softCertPage(){
        return this.page.getByRole("link", { name: this.labels.SOFT_CERT, exact: true});
    }

    // --- BUTTON ---
    
    get nextBtn() {
        return this.page.getByRole("button", { name: this.labels.NEXT });
    }

    get backBtn() {
        return this.page.getByRole("button", { name: this.labels.BACK });
    }

    get viewCommitteeBtn() {
        return this.page.getByRole("button", { name: this.labels.VIEW_COMMITTEE });
    }

    get viewBtn() {
        return this.page.getByRole("button", { name: this.labels.VIEW });
    }

    get previousBtn() {
        return this.page.getByRole("button", { name: this.labels.PREVIOUS });
    }

    get downloadAllDocumentBtn() {
        return this.page.getByRole("button", { name: this.labels.DOWNLOAD_ALL_DOCUMENT });
    }

    get prepareZipBtn() {
        return this.page.getByRole("button", { name: this.labels.PREPARE_ZIP });
    }

    get downloadBtn() {
        return this.page.getByRole("button", { name: this.labels.DOWNLOAD });
    }

    get searchBtn() {
        return this.page.getByRole("button", { name: this.labels.SEARCH });
    }

    get resetBtn() {
        return this.page.getByRole("button", { name: this.labels.RESET });
    }

    get downloadAllBtn() {
        return this.page.getByRole("button", { name: this.labels.DOWNLOAD_ALL });
    }

    get signOffBtn() {
        return this.page.getByRole("button", { name: this.labels.SIGN_OFF });
    }

    get saveBtn() {
        return this.page.getByRole("button", { name: this.labels.SAVE })
        .filter({visible: true});
    }

    get deleteBtn() {
        return this.page.getByRole("button", { name: this.labels.DELETE });
    }

    get addBtn() {
        return this.page.getByRole("button", { name: this.labels.ADD });
    }

    get addEmployeeBtn() {
        return this.page
          .locator('button')
          .filter({ hasText: this.labels.ADD })
          .filter({ has: this.page.locator('span.ui-button-text') })
          .first();
      }

    get yesBtn() {
        return this.page.getByRole("button", { name: this.labels.YES });
    }

    get okBtn() {
        return this.page.getByRole("button", { name: this.labels.OK });
    }

    get submitBtn() {
        return this.page.getByRole("button", { name: this.labels.SUBMIT });
    }

    get removeBtn(){
        return this.page.getByTitle(this.labels.REMOVE, {exact: true});
    }

    get addApprovalBtn(){
        return this.page.getByTitle(this.labels.ADD_APPROVAL, {exact: true});
    }

    get reviseBtn(){
        return this.page.getByTitle(this.labels.REVISE, {exact: true});
    }

    get nextSectionBtn(){
        return this.page.getByRole("button", { name: this.labels.NEXT_SECTION});
    }

    get recommendBtn(){
        return this.page.getByRole("button", { name: this.labels.RECOMMEND});
    }

    get editBtn() {
        return this.page.locator('img[title="Edit"], img[title="Kemaskini"]');
      }

    get addWorkExperienceBtn() {
        return this.page.locator(
            'button[onclick*="update:\'_MOFApplication_WAR_NGePportlet_:form:tt:equiJobFunctionInfo\'"]'
        );
    }
    
    get addAcademicBtn() {
        return this.page.locator(
            'button[onclick*="update:\'_MOFApplication_WAR_NGePportlet_:form:tt:equiAcadInfo\'"]'
        );
    }

    get addProfesionalBodyBtn(){
        return this.page.locator(
            'button[onclick*="update:\'_MOFApplication_WAR_NGePportlet_:form:tt:equiShrProfBeanInfo\'"]'
        );
    }

    get addCompanyShareBtn(){
        return this.page.locator(
            'button[onclick*="update:\'_MOFApplication_WAR_NGePportlet_:form:tt:eqiCompDialog\'"]'
        );
    }

    get DeleteDocBtn() {
        return this.page.getByRole('button', { name: this.specificBTN.DELETE});
    }

    get declareBtn() {
        return this.page.getByRole('button', {name: this.labels.DECLARE });
    }

    get proceedBtn(){
        return this.page.getByRole('button', {name:this.labels.PROCEED, exact: true});
    }

     // --- DROPDOWN MENU ---

     get dropdownSelection() {
        return this.page.locator(
            `[id^="${FORM_PREFIX}existingcommitteesearchid:"].ui-selectomenu-trigger`
        );
    }

    // --- GROUP TASK PAGINATOR ---

    get groupTaskPaginator() {
        return this.page.locator(
            '[id="_BpmTaskList_WAR_NGePportlet_:form:taskListGroupId_paginator_bottom"]'
        );
    }

    // --- TASK LIST PAGINATOR (MY TASK ONLY) ---
    get noBtn() {
        return this.page.getByRole("button", { name: this.labels.NO });
    }

    get optionBtn() {
        return this.page.getByRole("button", { name: this.labels.OPTION });
    }

    get updateMenuItem() {
        return this.page.getByRole("menuitem", { name: this.labels.UPDATE });
    }

    // --- TASK LIST PAGINATOR (shared BpmTaskList portlet) ---

    get myTaskPaginator() {
        return this.page.locator(
            '[id="_BpmTaskList_WAR_NGePportlet_:form:taskListMyTaskId_paginator_bottom"]'
        );
    }

    getPageButton(pageNum: number) {
        return this.myTaskPaginator.getByText(String(pageNum), { exact: true });
    }

    // --- TASK LIST TABLE (shared BpmTaskList portlet) ---

    getMatchingRowsOnPage(status: string) {
        return this.page
            .locator('[id="_BpmTaskList_WAR_NGePportlet_:form:taskListMyTaskId_data"]')
            .getByRole("row")
            .filter({ has: this.page.getByRole("gridcell", { name: status, exact: true }) })
            .filter({ hasNot: this.page.locator("td", { hasText: /do not use/i }) });
    }

    getTaskLinkByStatus(status: string) {
        return this.page
            .getByRole("row")
            .filter({ has: this.page.getByRole("gridcell", { name: status, exact: true }) })
            .filter({ hasNot: this.page.locator("td", { hasText: /do not use/i }) })
            .first()
            .getByRole("link")
            .first();
    }

    getDocumentNoByStatus(status: string) {
        return this.page
            .getByRole("row")
            .filter({ has: this.page.getByRole("gridcell", { name: status, exact: true }) })
            .first()
            .getByRole("gridcell")
            .first();
    }

    getTaskLinkByDocNo(docNo: string) {
        return this.page
            .getByRole("row")
            .filter({ has: this.page.getByRole("gridcell", { name: docNo, exact: true }) })
            .getByRole("link")
            .first();
    }

    // --- SEARCH FILTERS (shared BpmTaskList portlet) ---

    get advanceViewToggler() {
        return this.page.locator(
            '[id="_BpmTaskList_WAR_NGePportlet_:form:advanceViewPanelId_toggler"]'
        );
    }

    get normalViewToggler() {
        return this.page.locator(
            '[id="_BpmTaskList_WAR_NGePportlet_:form:normalViewPanelId_toggler"]'
        );
    }

    get filterDocNo() {
        return this.page
            .getByRole('row')
            .filter({ has: this.page.getByRole('cell', { name: this.labels.DOC_NO }) })
            .getByRole('textbox')
            .first();
    }

    get filterDocType() {
        return "_BpmTaskList_WAR_NGePportlet_:form:docTypeNormalId";
    }

    get filterDocStatus() {
        return "_BpmTaskList_WAR_NGePportlet_:form:docStatus";
    }

    get filterSortBy() {
        return "_BpmTaskList_WAR_NGePportlet_:form:taskListSortBy";
    }

    get filterOrderBy() {
        return "_BpmTaskList_WAR_NGePportlet_:form:taskListOrderBy";
    }

    get filterDateFrom() {
        return this.page.locator(
            '[id="_BpmTaskList_WAR_NGePportlet_:form:myTaskCreatedDateFrom_input"]'
        );
    }

    get filterDateTo() {
        return this.page.locator(
            '[id="_BpmTaskList_WAR_NGePportlet_:form:myTaskCreatedDateTo_input"]'
        );
    }

    // --- ROLE CHECKBOX FILTER ---
/*
    getRoleCheckbox(role: string) {
        // Find the span with role text
        const roleSpan = this.UserRolesPanel.locator(`span:has-text("${role}")`).first();
        
        // Get the column index safely
        const columnIndex = roleSpan.evaluate(el => {
            const td = el.closest('td');
            if (!td) return 1;
            
            const row = td.closest('tr');
            if (!row) return 1;
            
            const cells = Array.from(row.cells);
            return cells.indexOf(td) + 1;
        });
        
        // Get checkbox in the same column
        return roleSpan.locator('..').locator(`..`).locator(`td:nth-child(${columnIndex}) .ui-chkbox-box`);
    }
*/
    getResiAddrCheckBox(value: string){
        return this.ResiAddress
        .locator('tr', { has: this.page.locator('text=' + value) })
        .locator('div.ui-chkbox-box')
        .first();
    }

    getOfficeAddrCheckBox(value: string){
        return this.OffiAddress
        .locator('tr', { has: this.page.locator('text=' + value) })
        .locator('div.ui-chkbox-box')
        .first();
    }

    getMailAddrCheckBox(value: string){
        return this.MailAddress
        .locator('tr', { has: this.page.locator('text=' + value) })
        .locator('div.ui-chkbox-box')
        .first();
    }

    // --- DATE PICKER ---
    get pickDate() {
        return this.page.locator('[id*="purchaseDate"] .ui-datepicker-trigger');
      }
    get DateOfBirth(){
        return this.page.locator('[id*="equiPerDob"] .ui-datepicker-trigger');
    }

    // --- FILLER ---

    getCapitalInput(field: string) {
        const map: Record<string, string> = {
          'Bumiputera': 'bumiAmt',
          'Non - Bumiputera': 'nomBumAmt',
          'Non - Malaysian': 'frgAmt',
        };
      
        const suffix = map[field];
        if (!suffix) throw new Error(`Unknown capital field: ${field}`);
      
        return this.page.locator(
          `tr:has-text("${field}") input[id$="${suffix}"]`
        );
      }

    get ShareAmount(){
        return this.page.locator('input[id$="equiShrDetAmt"]');
    }
      
    get facilityOwnerInput() {
        return this.page.locator('[id$="fcltyOwnerName"]');
      }
    
      get purchasePriceInput() {
        return this.page.locator('[id$="purchasePrice"]');
      }
    
        // Basic Info
     get nameInput() {
        return this.page.locator('[id$="equiPerNam"]');
     }

    get icInput() {
        return this.page.locator('[id$="equiPerIcNum"]');
    }

    get ExpYear(){
        return this.page.locator('[id$="equiExper"]')
    }


    get PositionInCompany(){
        return this.page.locator('[id$="smPerDesignation"]');
    }

    //company basic info

    get bumiStaffInput() {
        return this.page.locator('[id$="bumiStf"]');
    }

    get OwnershipType() {
        return this.page.locator('[id$="ownTypeId"]');
      }

    get FacilityType() {
        return this.page.locator('[id*="rentedFacTypeId"]');
    }

    get ReligionType(){
        return this.page.locator('[id*="muslimRadioOutPanelId"]');
    }

    get BumiStatus(){
        return this.page.locator('[id*="bumiRadioOutPanelId"]');
    }

    get UserRolesPanel() {
        return this.page.locator('[id$="shrRolesPanel_content"]');
      }

    get EmpAddress(){
        return this.page.locator('[id$="equiPersPermAddrLine"]');
    }

    get EmpPostcode(){
        return this.page.locator('[id$="equiPersPermAddrPostCodeMy"]');
    }

    get ResiAddress(){
        return this.page.locator('[id$="resiAddrPan"]');
    }

    get MailAddress(){
        return this.page.locator('[id$="mailAddrPan"]');
    }

    get OffiAddress(){
        return this.page.locator('[id$="offcAddrPan"]');
    }

    get EpfNo(){
        return this.page.locator('[id$="equiEpfNo"]');
    }

    get incometaxNo(){
        return this.page.locator('input[id$="smIncTaxNum"]');
    }

    // problem with ajax primeface

    // for management and other role
    get EmpState() {
         return 'shrPermState';
    }

    get EmpDistrict() {
        return 'shrPermDist';
    }

    get EmpCity() {
        return 'shrPermCity';
    }

    // for staff role

    get EmpStateStaff() {
        return 'staffEquiPersPermState';
     }
  
    get EmpDistrictstaff() {
        return 'staffEquiPersPermDist';
    }
  
    get EmpCitystaff() {
         return 'staffEquiPersPermCity';
    }

    get EmpAddressstaff(){
        return this.page.locator('[id$="staffEquiPersPermAddrLine"]');
    }

    get EmpPostcodestaff(){
        return this.page.locator('[id$="staffEquiPersPermAddrPostCodeMy"]');
    }



    // Work Experience
    get companyNameInput() {
        return this.page.locator('[id$="equiJbFnInfCmpName"]');
     }

    get designationInput() {
        return this.page.locator('[id$="equiJbFnInfDesg"]');
    }


    // Academic
     get academicInstituteInput() {
         return this.page.locator('[id$="equiStfAcaInst"]');
    }



    // Bank
      get bankDialog() {
        return this.page.getByRole("dialog", { name: /Bank Information/i });
      }

      get bankDialogSaveBtn() {
        return this.bankDialog.getByRole("button", { name: this.labels.SAVE });
      }

      get bankBranchInput() {
        return this.page.locator('[id$="smBankBranchName"]');
      }
      
      get bankAddressInput() {
        return this.page.locator('[id$="suppBankAddrs"]');
      }
      
      get bankPostcodeInput() {
        return this.page.locator('[id$="suppBankPostCodeMy"]');
      }

      get bankTermnCndInput() {
        return this.page.locator('[id$="banCqTnc"]');
      }

      get bankSignCheckBox(){
        return this.page.locator('[id$="bankCheqSignId"]');
      }



    // Professional Body
    
     get profBodyRegNo(){
        return this.page.locator(`[id$="equiPrfBdyRegNo"]`);
     }

     get profBodyEndDate(){
        return this.page.locator(`[id$="equiPrfBdyEndDt"]`);
     }

    // Kod bidang (PrimeFaces selectOneMenu suffix ids)
    get bidangId() {
        return 'catCodeLvl1';
      }
    
      get subBidangId() {
        return 'catCodeLvl2';
      }
    
      get pecahanId() {
        return 'catCodeLvl3';
      }

    // suffix for  pfselectonemenu for "dropdown" not "radio button"

    get basicCompDistrict(){
        return 'basicCompDist'
    }

    get basicCompCity(){
        return 'basicCompCity'
    }

    get AnnualRevenue(){
        return 'smSupAnnRev';
    }

    get salutationId(){
        return 'equiPerSalutation';
    }

    get raceId(){
        return 'equiPerRace';
   }

   get yearFromId(){
     return 'YrFrm';
   }

   get yearToId(){
    return 'YrTo';
   }

   get academicYearId(){
    return 'equiStfAcaYr';
   }

   get academicQualificationId(){
    return 'equiStfAcaQl';
   }

   get academicFieldId(){
    return 'equiStfAcaEduFld';
   }

   get bankPurposeId(){
    return 'smBankAcctPurposeVal';
   }

   get bankStateId(){
    return 'smBankState';
   }

   get bankDistrictId() {
    return 'smBankDist';
   }

   get bankCityId() {
    return 'smBankCity';
   }

   get ProfBodyLabel(){
    return 'equiStfPrdBdyLbl';
   }


   // --- VERIFY ---

   get AcademicQualificationTitle() {
    return this.page.getByRole('dialog', { name: this.labels.ACADEMIC_QUALIFICATION });
  }

   get CapitalEquityCompanyHeader() {
    return this.page
.getByText(this.labels.CAPITAL_EQUITY_HEADER);
   }

   get CapitalEquityCompanyPopUpTitle() {
    return this.page.getByRole('dialog', { name: this.labels.CAPITAL_EQUITY_POPUP_HEADER});
   }

   get BankInformationPopUpTitle() {
    return this.page.getByRole('dialog', { name: this.labels.BANK_INFO_POPUP_TITLE});
   }

   get LabelNameNonMalay() {
    return this.page.getByRole('dialog', { name: this.labels.LABEL_NAME_NON_MALAY});
   }


   get NonMalaysiangridcell(){
   /* const table = this.page.locator(`[id$="contrPerSumTable"]`);
    return table.locator(`tr:has(td:has-text("${this.labels.NONMALAYSIAN}"))`);*/
   // return this.page.getByText("string").filter({ hasText: this.labels.NONMALAYSIAN });
    return this.page.getByText(new RegExp(`^\\s*${this.labels.NONMALAYSIAN}\\s*$`, 'i')).first();
  }
  
  get CapitalEquityHeaderName(){
    return this.page.locator(".ui-panel-title", { hasText: this.labels.CAPITAL_EQUITY_HELD_BY_COMPANY});
  }

  get CapitalEquityPopUptitle(){
    return this.page.locator(".ui-panel-title", { hasText: this.labels.CAPITAL_EQUITY_HELD_BY_COMPANY});
  }

}