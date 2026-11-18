import { Language } from "../../../shared/data";

const LABELS_EN = {

    // --- MENU ---
    TASK_LIST: "Task List",
    SUPPORTING_DOCUMENTS: "Supporting Documents",
    PO_DECISION: "PO Decision",
    APPROVER_DECISION: "Approver Decision",

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
    CHOOSE: "Choose",
    YES: "Yes",
    NO: "No",
    OK: "OK",
    SUBMIT: "Submit",
    APPROVE: "Approve",
    REJECT: "Reject",
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
    // --- BUTTONS (MOF APPLICATION) ---
    CLAIM: "Claim",
    RECEIVE_ALL: "Receive All",
    VERIFY: "Verify",
    ALL_VALID: "All Valid",

    // --- TASK TITLES ---
    MOF_VERIFY_TASK: "Update MOF application - verify supporting documents",
    MOF_REVIEW_TASK: "Review Update MOF application",
    MOF_REVIEW_ESCALATED_TASK: "Review Escalated Update MOF application",

    APP_VERIFIED_BY_PO: "Application Verified By PO",
};

const LABELS_MY = {
    // --- MENU ---
    TASK_LIST: "Senarai Tugasan",
    SUPPORTING_DOCUMENTS: "Supporting Documents",
    PO_DECISION: "PO Decision",
    APPROVER_DECISION: "Approver Decision",

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
    CHOOSE: "Pilih",
    DELETE: "Hapus",
    ADD: "Tambah",
    YES: "Ya",
    NO: "Tidak",
    OK: "OK",
    SUBMIT: "Serah",
    APPROVE: "Approve",
    REJECT: "Reject",
    REMOVE: "Remove",
    ADD_APPROVAL: "Add",
    SELECT: "Pilih",   // TODO: verify
    OPTION: "Option",
    UPDATE: "Update",
    REVISE: "Kaji Semula",
    NEXT_SECTION: "Seterusnya",
    RECOMMEND: "Cadangkan untuk Lulus",
    DECLARE: "Isytihar",
    PROCEED: "Seterusnya",
    CLAIM: "Tuntut",
    RECEIVE_ALL: "Terima Semua",
    VERIFY: "Verify",
    ALL_VALID: "All Valid",
    MOF_VERIFY_TASK: "Kemaskini permohonan MOF - semak dokumen sokongan",
    MOF_REVIEW_TASK: "Review Update MOF application",
    MOF_REVIEW_ESCALATED_TASK: "Review Escalated Update MOF application",
    APP_VERIFIED_BY_PO: "Application Verified By PO",
};

export const LABELS: Record<Language, typeof LABELS_EN> = {
    en: LABELS_EN,
    my: LABELS_MY,
};