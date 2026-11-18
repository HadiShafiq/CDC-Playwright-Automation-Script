import { BASE_URL } from "../../../../../base-url";
import { Language } from "../../../shared/data";

export  const FORM_PREFIX = {
  Perunding:  "_DirectMofRegistration_WAR_NGePportlet_:form:tt:",
  Kontraktor: "_MOFApplication_WAR_NGePportlet_:form:tt:",
};

export const URLS = {
    HOME: `${BASE_URL}/home`,
    DASHBOARD: `${BASE_URL}/web/epapp/dashboard#!`,
    TASK_LIST: `${BASE_URL}/web/epapp/task-list#!`,
};


// --- EMPLOYEE LOCATION DATA ---

export const LOCATION = {
    ADDR: '31-23, Jalan 53, Pekan Kepong, 52100 Kuala Lumpur, Selangor',
    STATE_1: "SELANGOR",
    DISTRICT_1: "GOMBAK",
    CITY_1: "KEPONG",
    POSTCODE_1: "51800",
};




// --- MANDATORY DOCUMENTS ---
export const MANDATORY_DOCUMENTS = {
    // === SARAWAK PROPRIETORSHIP ===
    BORANG_PENGISYTIHARAN_KEMENTERIAN_KEWANGAN: 'BORANG PENGISYTIHARAN KEMENTERIAN KEWANGAN YANG SUDAH DITANDATANGANI',
    LESEN_PERNIAGAAN_R_22_DAN_IRD_NO_7: 'LESEN PERNIAGAAN R.22 DAN IRD NO. 7',
    SALINAN_LESEN_BERNIAGA_IRD_NO_7: 'SALINAN LESEN BERNIAGA IRD NO. 7 YANG MASIH BERKUATKUASA',
    BORANG_PENGISYTIHARAN_MOF: 'BORANG PENGISYTIHARAN MOF (Boleh dimuat turun melalui pautan https://www.eperolehan.gov.my/supplier-registration-guide)',
    PENYATA_AKAUN_SEMASA: 'PENYATA AKAUN SEMASA YANG TERKINI ATAS NAMA SYARIKAT / SLIP DEPOSIT',

    // === ROB SOLE PROPRIETORSHIP & PARTNERSHIP ===
    PERJANJIAN_SEWA_DIMATIKAN_SETEM: 'PERJANJIAN SEWA DIMATIKAN SETEM/ GERAN/ S&P/ BIL UTILITI YANG MENGANDUNGI NAMA DAN ALAMAT SYARIKAT/ SURAT KEBENARAN YANG DITANDATANGAN OLEH PEMILIK PREMIS',

    // === ALL BUSINESS TYPES (KONTRAKTOR & PERUNDING) ===
    SALINAN_PENYATA_AKAUN_BANK: 'SALINAN PENYATA AKAUN BANK SEMASA TERKINI (HENDAKLAH DIPALANGKAN DENGAN PERKATAAN "UNTUK KEGUNAAN KEMENTERIAN KEWANGAN SAHAJA")',
    BORANG_A_DAN_RESIT_CARUMAN_KWSP: 'SALINAN BORANG A SERTA RESIT BAYARAN CARUMAN, ATAU PENYATA CARUMAN KWSP BAGI KAKITANGAN PROFESIONAL, SEMI PROFESIONAL DAN KAKITANGAN PERKERANIAN BAGI TEMPOH 3 BULAN TERKINI',
    CURRICULUM_VITAE: 'SEMUA PEMILIK, PENGARAH, KAKITANGAN PROFESIONAL DAN SEMI PROFESIONAL DIWAJIBKAN MENGEMUKAKAN "CURRICULUM VITAE" (CV)',
    BORANG_PERINCIAN_PENANDATANGAN_CEK: 'BORANG PERINCIAN PENANDATANGAN CEK YANG DISAHKAN OLEH BANK SYARIKAT/FIRMA PERUNDING',
    CLBG_DOCUMENT: 'CLBG Document from PM Module - Testing Redmine #33783',

    // === PERUNDING (CONSULTANCY) SPECIFIC ===
    // Note: Some documents overlap with Kontraktor - only unique items listed below
    // For Perunding, the following entity types apply:
    // ROB - Perkongsian, ROB - Perseorangan, ROC - Bhd, ROC - Sdn Bhd,
    // Perkongsian Liabiliti Terhad (PLT), Badan Profesional, Persatuan,
    // Pendaftaran Sabah (Perkongsian/Perseorangan),
    // Pendaftaran Sarawak (Perkongsian/Perseorangan)

    Testing: 'TESTING',


    SURAT_AKUAN_SUMPAH_PERUNDING: 'SURAT AKUAN/SUMPAH ',
    SIJIL_PENDAFTARAN_ROC: 'SIJIL PENDAFTARAN ROC (Borang 9/24/45/49)',
    SIJIL_PENDAFTARAN_PLT: 'SIJIL PENDAFTARAN PERKONGSIAN LIABILITI TERHAD',
    SIJIL_PENDAFTARAN_ROS: 'SIJIL PENDAFTARAN ROS/JPPM - Untuk Pertubuhan/Persatuan',
    BORANG_A_ROB: 'BORANG A (Pendaftaran Perniagaan) - Untuk ROB Perkongsian/Perseorangan',
    BORANG_A_SABAH: 'BORANG A/SIJIL PENDAFTARAN PERNIAGAAN SABAH - Untuk Pendaftaran Sabah',
    BORANG_A_SARAWAK: 'BORANG A/SIJIL NAMA PERNIAGAN SARAWAK ',
    DOKUMEN_HAKMILIK: 'DOKUMEN HAKMILIK/GERAN ',
    SURAT_KEBENARAN_PEMILIK_PREMIS: 'SURAT KEBENARAN YANG DITANDATANGAN OLEH PEMILIK PREMIS',
    BIL_UTILITI: 'BIL UTILITI YANG MENGANDUNGI NAMA DAN ALAMAT SYARIKAT',

    // === ADDITIONAL FOR KONTRAKTOR ===
    // Entity types for Kontraktor:
    // ROC - Bhd, ROC - Sdn Bhd, PLT, Koperasi (SKM), ROS/JPPM, Persatuan,
    // ROB Perkongsian/Perseorangan, Sabah/Sarawak registrations

    SIJIL_PENDAFTARAN_KOPERASI_SKM: 'SIJIL PENDAFTARAN KOPERASI (SKM)',
    LESEN_PERKHIDMATAN_KONTRAKTOR: 'LESEN PERKHIDMATAN/CIDB/SPKK '
};



// --- DECLARE ANY DATA FOR INPUT HERE ---

const DECLARE_DATA_EN = {
    //company and employee registration section
    DATE_FROM: '2021',
    DATE_FUTURE: '2024',
    YEAR: '2020',
    QUALIFICATION_LEVEL: "Bachelor'S Degree",
    EDUCATION_FIELD: 'Aero Angkasa',
    ANNUAL_REVENUE: 'RM500,001 -',
    BUMI_STAFF: '3',
    PREMISE_TYPE: 'Owned',
    FACILITY_TYPE: 'Home Office',
    OWNER: 'MAHMUD',
    PRICE: '10',
    SALUTATION: 'Cik',
    RACE: 'BAJAU',
    RELIGION: 'Non - Muslim',
    EXPYEAR: '5',

    //bank section
    BNK_PURPOSE: 'Both (Payment,Registration)',
    BNK_BRANCH: 'PETALING JAYA',
    BNK_ADDRESS: 'PETANGLING STREET LOT 67',
    STATE_BANK: 'WILAYAH PERSEKUTUAN KUALA LUMPUR',
    DISTRICT_BANK: 'W.P. KUALA LUMPUR',
    CITY_BANK: 'MUKIM PETALING',
    POST_BANK: '65000',


};

const DECLARE_DATA_MY = {
    //company and employee registration section
    DATE_FROM: '2021',
    DATE_FUTURE: '2024',
    YEAR: '2020',
    QUALIFICATION_LEVEL: 'IJAZAH SARJANA MUDA',
    EDUCATION_FIELD: 'Aero Angkasa',
    ANNUAL_REVENUE: 'RM500,001 -',
    BUMI_STAFF: '3',
    PREMISE_TYPE: 'Milik Sendiri',
    FACILITY_TYPE: 'Rumah Kediaman sebagai Pejabat',
    OWNER: 'MAHMUD',
    PRICE: '10',
    SALUTATION: 'Cik',
    RACE: 'BAJAU',
    RELIGION: 'Bukan Islam',
    EXPYEAR: '5',


    //bank section
    BNK_PURPOSE: 'Kedua-duanya (Pembayaran,Pendaftaran)',
    BNK_BRANCH: 'PETALING JAYA',
    BNK_ADDRESS: 'PETANGLING STREET LOT 67',
    STATE_BANK: 'WILAYAH PERSEKUTUAN KUALA LUMPUR',
    DISTRICT_BANK: 'W.P. KUALA LUMPUR',
    CITY_BANK: 'MUKIM PETALING',
    POST_BANK: '65000',
};

export const DECLARATION_DATA: Record<Language, typeof DECLARE_DATA_EN> = {
    en: DECLARE_DATA_EN,
    my: DECLARE_DATA_MY,
}

// --- ROLES ---

const ROLES_EN = {
    EQUITY_OWNER: 'Equity Owner',
    DIRECTOR: 'Director',
    HIGHER_MANAGEMENT: 'Higher Management',
    MANAGEMENT: 'Management',
    STAFF: 'Staff',
    CLERICAL_STAFF: 'Clerical Staff',
    SEMI_PROF: 'Semi-Professional',
    PROF: 'Professional',
} 

const ROLES_MY = {
    EQUITY_OWNER: 'Pemilik Ekuiti',
    DIRECTOR: 'Pengarah',
    HIGHER_MANAGEMENT: 'Pengurusan Atas',
    MANAGEMENT: 'Pengurusan',
    STAFF: 'Kakitangan',
    CLERICAL_STAFF: 'Kakitangan Perkeranian',
    SEMI_PROF: 'Separa Profesional',
    PROF: 'Profesional',
} 

export const ROLES: Record<Language, typeof ROLES_EN> = {
    en: ROLES_EN,
    my: ROLES_MY,
};

// --- SPECIFIC BUTTON ---
const SPECIFIC_BUTTON_EN = {
    DELETE: 'Delete',
};

const SPECIFIC_BUTTON_MY = {
    DELETE: 'Hapus Draf Permohonan',
};

export const SPECIFIC_BUTTON = {
    en: SPECIFIC_BUTTON_EN,
    my:SPECIFIC_BUTTON_MY,
};

// --- FOR FILLING THAT DOESNT NEED EN OR MY VALUE ---
export const FILL_TEXT = {
    APPROVE: "APPROVE",
    DESIG_DEF:'SENIOR OFFICER',
    CAPITAL_VALUE: '60001',
    FIRST_CAP_VAL: '50001',
    SECOND_CAP_VAL: '10000',
    BANK_TERM: 'SEBAB BOLEH',
    //kontraktor
    BIDANG: "01 - PENERBITAN DAN PENYIARAN",        // 01 - penerbitan dan penyiaran
    SUB_BIDANG: "06 - PERALATAN PENDIDIKAN DAN LATIHAN",    // 06 - peralatan pendidikan dan latihan
    PECAHAN: "02 - BAHAN PENDIDIKAN",    // 02 - bahan pendidikan
    
    //perunding
    BIDANG_2:"34 - SCENARIO 14 (NEW) - PERKHIDMATAN PERUNDING BUKAN FIZIKAL - (TESTER S)",
    SUB_BIDANG_2:"01 - SOSIO EKONOMI",
    PECAHAN_2:"01 - KAJIAN ORGANISASI",

    //Professional Body Info
    PB_choice: "FAIROZE CERITIFED BY CERTIFIER YANG TELAH MEMBERIKAN PENGIKTIRAFAN DALAM BIDANG INI SELAMA 20 TAHUN DAN AKAN TERUS BERKHIDMAT DENGAN PENUH INTEGRITI",
};

// --- FOR NORMAL LIBRARY DATA ---

const LABELS_EN = {

    // --- MENU ---
    TASK_LIST: "Task List",
    SIGNOUT: "Sign Out",
    DECLARE_APPLICATION: "Declare Application",
    PAY_PROCESS_FEE: "Pay Processing Fee",
    PAY_REGISTRATION_FEE: "Pay Registration Fee",
    VIEW_VIRTUAL: "View Virtual Certificate",
    UPLOAD_CATALOGUE: "Upload Catalogue",
    SOFT_CERT: "Soft Certification Application",

    // --- SIDE MENU ---
    COMPANY_INFO: "Company Info",
    ASSOCS_PROJECT: "Assocs / Projects",
    PERSONNEL_BRANCH: "Personnel / Branch",
    CAPITAL_INFO: "Capital Info",
    BANK_INFO: "Bank Info",
    CATEGORY_CODES: "Category Codes",
    SUPPORTING_DOCUMENTS: "Supporting Documents",

    // --- BUTTONS ---
    NEXT: "Next",
    BACK: "<< Back",
    VIEW_COMMITTEE: "View Committee",
    VIEW: "View",
    PREVIOUS: "Previous",
    DOWNLOAD_ALL_DOCUMENT: "Download All Document",
    PREPARE_ZIP: "Prepare Zip",
    DOWNLOAD: "Download",
    SEARCH: "Search",
    RESET: "Reset",
    DOWNLOAD_ALL: "Download All",
    SIGN_OFF: "Sign Off",
    SAVE: "Save",
    DELETE: "Delete",
    ADD: "Add",
    YES: "Yes",
    NO: "No",
    OK: "OK",
    SUBMIT: "Submit",
    REMOVE: "Remove",
    ADD_APPROVAL: "Add",
    SELECT: "Select",
    OPTION: "Option",
    UPDATE: "Update",
    REVISE: "Revise",
    NEXT_SECTION: "Next Section",
    RECOMMEND: "Recommend to Approve",
    DECLARE: "Declare",
    PROCEED: "Proceed",

    // --- FIELDS ---
    PROCUREMENT_TYPE_CATEGORY: "Procurement Type Category",
    "Procurement Type Category": "Procurement Type Category",
    EXISTING_CONTRACT_NO: "Existing Contract No. (if any)",
    QUOTATION_TENDER_TYPE: "Quotation / Tender Type",
    OPEN: "Open",
    RESTRICTED_TENDER: "Restricted Tender",


    // --- ICONS ---
    SC_INDICATOR_TEXT: "SC",  // pencil indicator label (English)
    ADD_FILE: "Add File",

    // --- FILTER ---
    DOC_NO: "Document No :",
    QT_DOC_NO: "Document No.",
    DOC_TYPE_QT_DETAILS: "Quotation/Tender", // TODO: verify exact dropdown label
    CAPITAL_TYPE: "Bumiputera",
    LABEL_NAME_NON_MALAY: "Non - Malaysian",

    // --- DUMMY FILE NAME ---
    DOC_1: "FL_NGEP_PURCHASE_ORDER_260417125504.pdf",

    // -- DUMMY FILE DIRECTORY ---
    DUMMY_DOC_TYPE: "application/pdf",
    DOC_BUFFER: "automation file",

    // --- PAGE TITLE ---
    MOF_REGISTRATION: "New MOF Account Registration",
    PREPARE_QUOTATION_TENDER_DETAILS: "Prepare Quotation/Tender Details",
    QT_DETAILS: "Quotation / Tender Details",
    BANK_INFO_POPUP_TITLE:"Bank Information",

    // --- PANELS ---
    COMMITTEE_APPOINTMENT_PANEL: "COMMITTEE APPOINTMENT",
    APPROVAL_PANEL: "APPROVAL",
    RESIDENTIAL_ADDRESS: "Same as permanent address",
    OFFICE_ADDRESS: "Same as company address",
    ACADEMIC_QUALIFICATION: "Academic Qualification",
    

    // --- TABLE HEADERS ---
    CAPITAL_EQUITY_HEADER: "CAPITAL/ EQUITY HELD BY COMPANY",
    CAPITAL_EQUITY_POPUP_HEADER: "Capital/Equity Held by Company Information",



    // --- DROPDOWN OPTIONS ---
    SUPPLY_OF_GOODS: "Supply Of Goods",
    SERVICES: "Services",

    // --- VERIFY ---
    NONMALAYSIAN: "Non-Malaysian",
    CAPITAL_EQUITY_HELD_BY_COMPANY: "CAPITAL/ EQUITY HELD BY COMPANY",
    CAPITAL_EQUITY_HELD_BY_COMPANY_POPUP: "Capital/Equity Held by Company Information",

};

const LABELS_MY = {
    // --- MENU ---
    TASK_LIST: "Senarai Tugasan",
    SIGNOUT: "Log Keluar",
    DECLARE_APPLICATION: "Isytihar Permohonan",
    PAY_PROCESS_FEE: "Bayar Fi Proses",
    PAY_REGISTRATION_FEE: "Bayar Fi Pendaftaran",
    VIEW_VIRTUAL: "Paparan Sijil Maya",
    UPLOAD_CATALOGUE: "Muat Naik Katalog",
    SOFT_CERT: "Permohonan Sijil Digital",



    // --- SIDE MENU ---
    COMPANY_INFO: "Maklumat Syarikat",
    ASSOCS_PROJECT: "Syarikat Bersekutu / Projek",
    PERSONNEL_BRANCH: "Maklumat Personel / Cawangan",
    CAPITAL_INFO: "Modal / Ekuiti Pengisytiharan",
    BANK_INFO: "Maklumat Bank",
    CATEGORY_CODES: "Kod Bidang",
    SUPPORTING_DOCUMENTS: "Dokumen Sokongan ",


    // --- BUTTONS ---
    NEXT: "Seterusnya",
    BACK: "<< Kembali",
    VIEW_COMMITTEE: "Pinda Jawatankuasa",
    VIEW: "Lihat",
    PREVIOUS: "Sebelumnya",
    DOWNLOAD_ALL_DOCUMENT: "Muat Turun Semua Dokumen",
    PREPARE_ZIP: "Sediakan Zip",
    DOWNLOAD: "Muat Turun", 
    SEARCH: "Cari",
    RESET: "Set Semula",
    DOWNLOAD_ALL: "Muat Turun Semua",
    SIGN_OFF: "Perakuan",
    SAVE: "Simpan",
    DELETE: "Hapus",
    ADD: "Tambah",
    YES: "Ya",
    NO: "Tidak",
    OK: "OK",
    SUBMIT: "Serah",
    REMOVE: "Remove",
    ADD_APPROVAL: "Add",
    SELECT: "Pilih",   // TODO: verify
    OPTION: "Option",
    UPDATE: "Update",
    REVISE: "Kaji Semula",
    NEXT_SECTION: "Seterusnya",
    RECOMMEND: "Cadangkan untuk Lulus",
    DECLARE: "Isytihar",
    PROCEED: "Teruskan",

    // --- FIELDS ---
    PROCUREMENT_TYPE_CATEGORY: "Kategori Jenis Perolehan",          // TODO: verify
    "Procurement Type Category": "Kategori Jenis Perolehan",
    EXISTING_CONTRACT_NO: "No. Kontrak Sedia Ada (jika ada)",        // TODO: verify
    QUOTATION_TENDER_TYPE: "Jenis Sebutharga / Tender",              // TODO: verify
    OPEN: "Terbuka",                                                  // TODO: verify
    RESTRICTED_TENDER: "Tender Terhad",                               // TODO: verify


    // --- ICONS ---
    SC_INDICATOR_TEXT: "JKS",  // pencil indicator label (Bahasa Melayu)
    ADD_FILE: "Tambah fail",

    // --- FILTER ---
    DOC_NO: "No Dokumen :",
    QT_DOC_NO: "Document No.",
    DOC_TYPE_QT_DETAILS: "Sebut harga/Tender", // TODO: verify
    CAPITAL_TYPE: "Bumiputera",
    LABEL_NAME_NON_MALAY: "Bukan Warganegara Malaysia",

    
    // --- DUMMY FILE NAME ---
    DOC_1: "FL_NGEP_PURCHASE_ORDER_260417125504.pdf",

    // -- DUMMY FILE DIRECTORY ---
    DUMMY_DOC_TYPE: "application/pdf",
    DOC_BUFFER: "automation file",

    // --- PAGE TITLE --- 
    MOF_REGISTRATION: "Pendaftaran Akaun MOF Baharu",
    PREPARE_QUOTATION_TENDER_DETAILS: "Penyediaan Maklumat Sebut Harga/Tender",
    QT_DETAILS: "Butiran Sebutharga / Tender", // TODO: verify
    BANK_INFO_POPUP_TITLE:"Maklumat Bank",

    // --- PANELS ---
    COMMITTEE_APPOINTMENT_PANEL: "PELANTIKAN JAWATANKUASA",
    APPROVAL_PANEL: "KELULUSAN",
    RESIDENTIAL_ADDRESS: "Sama seperti alamat tetap",
    OFFICE_ADDRESS: "Sama seperti alamat syarikat",
    ACADEMIC_QUALIFICATION: "Kelayakan Akademik",

    // --- TABLE HEADERS ---
    CAPITAL_EQUITY_HEADER: "MODAL/ EKUITI DIPEGANG OLEH SYARIKAT",
    CAPITAL_EQUITY_POPUP_HEADER: "Maklumat Modal/Ekuiti Dipegang oleh Syarikat",

    // --- DROPDOWN OPTIONS ---
    SUPPLY_OF_GOODS: "Bekalan",
    SERVICES: "Perkhidmatan",

    // --- VERIFY ---
    NONMALAYSIAN: "Bukan Warganegara Malaysia",
    CAPITAL_EQUITY_HELD_BY_COMPANY: "MODAL/ EKUITI DIPEGANG OLEH SYARIKAT",
    CAPITAL_EQUITY_HELD_BY_COMPANY_POPUP: "Maklumat Modal/Ekuiti Dipegang oleh Syarikat",

};

export const LABELS: Record<Language, typeof LABELS_EN> = {
    en: LABELS_EN,
    my: LABELS_MY,
};
