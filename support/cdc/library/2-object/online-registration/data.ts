import { BASE_URL } from "../../../base-url";
import { Language } from "../shared/data";

export const FORM_PREFIX = "_onlineRegistration_WAR_NGePportlet_:form:";

export const URLS = {
    HOME: `${BASE_URL}/home`,
    ONLINE_REG: `${BASE_URL}/online-registration`,
};

export const LANGUAGE = {
    EN: "en_US",
};

export const ACCOUNT_LABELS = { 
    BASIC: "Basic Account", 
    MOF: "MOF Account", 
    G2G: "G2G Account", 
};

export const RADIO = {
    BUMIPUTERA: {
        YES: "Yes",
        NO: "No",
    },
    RELIGION: {
        MUSLIM: "Muslim",
        NON_MUSLIM: "Non - Muslim",
    },
};

const LABELS_MY = {
    DROPDOWN_DEFAULT: "- Pilih Satu -",
    NEXT: "Seterusnya",
    PREVIOUS: "Sebelum",
    SUBMIT: "Serah",
    SEARCH: "Cari",
    VIEW_MAP: "Lihat Peta",
    SELECT: "Pilih",
    RESET: "Set Semula",
    CANCEL: "Batal",
    ADD: "Tambah",
    PROCEED: "Seterusnya",
    SUPPLIER_CHECKBOX: "Sila klik",
    TERMS_AND_CONDITIONS: "Saya terima",
    SABAH_PARTNERSHIP: "Pendaftaran Perniagaan di Sabah (Perkongsian)",
    SABAH_SOLE: "Pendaftaran Perniagaan di Sabah (Perseorangan)",
    SARAWAK_PARTNERSHIP: "Pendaftaran Perniagaan di Sarawak (Perkongsian)",
    SARAWAK_SOLE: "Pendaftaran Perniagaan di Sarawak (Perseorangan)",
    ROB_PARTNERSHIP: "ROB - Perkongsian",
    ROB_SOLE: "ROB - Perseorangan",
    ROC_BHD: "ROC - Bhd",
    ROC_SDN_BHD: "ROC - Sdn Bhd",
    LLP: "Perkongsian Liabiliti Terhad (PLT)",
    COOPERATIVE: "Koperasi (Berdaftar dengan SKM)",
    SOCIETY: "Persatuan",
    ROS: "ROS - Pertubuhan (Berdaftar dengan JPPM)",
    ORGANIZATION: "Pertubuhan (Lain-lain)",
    INDIVIDUAL: "Individu",
    G2G_ORG_TYPE_FEDERAL_STATUTORY_BODY: "Badan Berkanun Persekutuan",
    G2G_ORG_TYPE_STATE_STATUTORY_BODY: "Badan Berkanun Negeri",
    G2G_ORG_TYPE_STATE_GOVERNMENT: "Kerajaan Negeri",
    G2G_ORG_TYPE_LOCAL_AUTHORITY: "Pihak Berkuasa Tempatan",
    AGENCY_NAME: "Nama Agensi",
    POSITION_IN_COMPANY: "Jawatan dalam Perniagaan / Syarikat",
    DEPARTMENT_DIVISION: "Jabatan / Bahagian",
    UNIT_SECTION: "Unit / Seksyen",
    HEAD_QUARTERS: "Ibu Pejabat",
    MUSLIM: "Islam", 
};

const LABELS_EN = {
    DROPDOWN_DEFAULT: "- Select One -",
    NEXT: "Next",
    PREVIOUS: "Previous",
    SUBMIT: "Submit",
    SEARCH: "Search",
    VIEW_MAP: "View Map",
    SELECT: "Select",
    RESET: "Reset",
    CANCEL: "Cancel",
    ADD: "Add",
    PROCEED: "Proceed",
    SUPPLIER_CHECKBOX: "Please click if supplier administrator",
    TERMS_AND_CONDITIONS: "I Accept the Terms and",
    SABAH_PARTNERSHIP: "Business Registration in Sabah (partnership)",
    SABAH_SOLE: "Business Registration in Sabah (Sole-Proprietorship)",
    SARAWAK_PARTNERSHIP: "Business Registration in Sarawak (partnership)",
    SARAWAK_SOLE: "Business Registration in Sarawak (Sole-Proprietorship)",
    ROB_PARTNERSHIP: "ROB - Partnership",
    ROB_SOLE: "ROB - Sole-Proprietorship",
    ROC_BHD: "ROC - Bhd",
    ROC_SDN_BHD: "ROC - Sdn Bhd",
    LLP: "Limited Liability Partnership (LLP)",
    COOPERATIVE: "Cooperative (Registered with SKM)",
    SOCIETY: "Society",
    ROS: "ROS - Organization (Registered with JPPM)",
    ORGANIZATION: "Organization (Others)",
    INDIVIDUAL: "Individual",
    G2G_ORG_TYPE_FEDERAL_STATUTORY_BODY: "Federal Statutory Body",
    G2G_ORG_TYPE_STATE_STATUTORY_BODY: "State Statutory Body",
    G2G_ORG_TYPE_STATE_GOVERNMENT: "State Government",
    G2G_ORG_TYPE_LOCAL_AUTHORITY: "Local Authority",
    AGENCY_NAME: "Agency Name",
    POSITION_IN_COMPANY: "Position in Business / Company",
    DEPARTMENT_DIVISION: "Department / Division",
    UNIT_SECTION: "Unit / Section",
    HEAD_QUARTERS: "Head Quarters",
    MUSLIM: "Muslim",
};

export const LABELS: Record<Language, typeof LABELS_EN> = {
    my: LABELS_MY,
    en: LABELS_EN,
};

export const CHECKBOX_LABELS = {
    TERMS_AND_CONDITIONS: "I Accept the Terms and",
    SUPPLIER: "Please click if supplier"
};

export const DROPDOWN_OPTIONS = {
    BUSINESS_TYPE: {
        SABAH_PARTNERSHIP: "Business Registration in Sabah (partnership)",
        SABAH_SOLE: "Business Registration in Sabah (Sole-Proprietorship)",
        SARAWAK_PARTNERSHIP: "Business Registration in Sarawak (partnership)",
        SARAWAK_SOLE: "Business Registration in Sarawak (Sole-Proprietorship)",
        ROB_PARTNERSHIP: "ROB - Partnership",
        ROB_SOLE: "ROB - Sole-Proprietorship",
        ROC_BHD: "ROC - Bhd",
        ROC_SDN_BHD: "ROC - Sdn Bhd",
        LLP: "Limited Liability Partnership (LLP)",
        COOPERATIVE: "Cooperative (Registered with SKM)",
        SOCIETY: "Society",
        ROS: "ROS - Organization (Registered with JPPM)",
        ORGANIZATION: "Organization (Others)",
        INDIVIDUAL: "Individual",
    },
    G2G_ORG_TYPE: {
        en: {
            FEDERAL_STATUTORY_BODY: "Federal Statutory Body",
            STATE_STATUTORY_BODY: "State Statutory Body",
            STATE_GOVERNMENT: "State Government",
            LOCAL_AUTHORITY: "Local Authority",
        },
        my: {
            FEDERAL_STATUTORY_BODY: "Badan Berkanun Persekutuan",
            STATE_STATUTORY_BODY: "Badan Berkanun Negeri",
            STATE_GOVERNMENT: "Kerajaan Negeri",
            LOCAL_AUTHORITY: "Pihak Berkuasa Tempatan",
        },
    },
    COUNTRY: {
        MALAYSIA: "MALAYSIA",
    },
    STATE: {
        SELANGOR: "SELANGOR",
        NEGERI_SEMBILAN: "NEGERI SEMBILAN",
        PAHANG: "PAHANG",
        PERAK: "PERAK",
        PERLIS: "PERLIS",
        PULAU_PINANG: "PULAU PINANG",
        SABAH: "SABAH",
        SARAWAK: "SARAWAK",
    },
    DISTRICT: {
        GOMBAK: "GOMBAK",
        ULU_LANGAT: "ULU LANGAT",
        KOTA_KINABALU: "KOTA KINABALU",
        BEAUFORT: "BEAUFORT",
    },
    CITY: {
        AMPANG: "AMPANG",
        CHERAS: "CHERAS",
        GOMBAK_SETIA: "GOMBAK SETIA",
        KEPONG: "KEPONG",
        KOTA_KINABALU: "KOTA KINABALU",
        BEAUFORT: "BEAUFORT",
    },
    LOCAL_AUTHORITY: {
        DBKK: "Dewan Bandaraya Kota Kinabalu",
    },
    NOB_CODE: {
        47597: "47597",
        10201: "10201",
    },
    NOB_DESC: {
        TERNAK: "Ternakan udang air tawar",
        RUNCIT: "Jualan runcit sistem keselamatan",
        PENGETINAN: "Pengetinan ikan, krustasea dan moluska",
    },
    SALUTATION: {
        CIK: "Cik",
        DATIN: "Datin",
        DATU: "Datu"
    },
    TELCO: {
        CELCOM: "Celcom",
        DIGI: "Digi",
        MAXIS: "Maxis",
    },
}
// --- HELPERS ---
    export function generateLoginId(companyName: string): string {
    return companyName
        .replace(/[^a-zA-Z0-9]/g, '') // remove special characters and spaces
        .toUpperCase()                  // uppercase
        .substring(0, 12);             // max 12 characters
};
