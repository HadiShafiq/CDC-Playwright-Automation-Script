import { BASE_URL } from "../../../../../base-url";
import { Language } from "../../../shared/data";

const LABELS_EN = {
    // --- MENU ---
    TASK_LIST: "Task List",
    SIGNOUT: "Sign Out",

    MENU: {
        CREATE_LOA: "Create LOA",
        TASK_LIST: "PLACEHOLDER_REPLACE_ME",
    },

    // --- TABS ---
    MEETING_DECISION: "Meeting Decision",

    // --- MEETING DECISION ---
    ITEMIZED: "Itemized",
    PACKAGED_WISE: "Packaged Wise",
    RESET_CONFIRMATION_MESSAGE: "Data that has been entered based on the previous Supplier Finalization Method selection will be reset. Are you sure to proceed?",

    // --- BUTTONS ---
    YES: "Yes",
    NO: "No",
    SEARCH: "Search",

    // --- FILTER ---
    DOC_NO: "Document No :",
};

const LABELS_MY = {
    // --- MENU ---
    TASK_LIST: "Senarai Tugasan",
    SIGNOUT: "Log Keluar",

    MENU: {
        CREATE_LOA: "Cipta Surat Setuju Terima",
        TASK_LIST: "Senarai Tugasan",
    },

    // --- TABS ---
    MEETING_DECISION: "Keputusan Mesyuarat",

    // --- MEETING DECISION ---
    ITEMIZED: "Item",
    PACKAGED_WISE: "Pakej",
    RESET_CONFIRMATION_MESSAGE: "Data yang telah dikunci masuk berdasarkan Kaedah Memuktamadkan Pembekal yang telah dipilih sebelum ini akan diset semula. Adakah anda pasti untuk meneruskannya?",

    // --- BUTTONS ---
    YES: "Ya",
    NO: "Tidak",
    SEARCH: "Cari",

    // --- FILTER ---
    DOC_NO: "No Dokumen :",
};

export const LABELS: Record<Language, typeof LABELS_EN> = {
    en: LABELS_EN,
    my: LABELS_MY,
};

export const URLS = {
    HOME: `${BASE_URL}/home`,
    TASK_LIST: `${BASE_URL}/web/epapp/task-list#!`,
    DASHBOARD: `${BASE_URL}/web/epapp/dashboard#!`,
};