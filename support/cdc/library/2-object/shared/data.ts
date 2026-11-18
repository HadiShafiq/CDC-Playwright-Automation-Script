export type Language = "my" | "en";

export const LANGUAGE_MAP: Record<Language, string> = {
    en: "en_US",
    my: "ms_MY",
};

const MENU_LABELS_MY = {
    MY_APPLICATION: "PLACEHOLDER_REPLACE_ME",
    CREATE_LOA: "PLACEHOLDER_REPLACE_ME",
    SUPPLIER_REGISTRATION: "PLACEHOLDER_REPLACE_ME",
};

const MENU_LABELS_EN = {
    MY_APPLICATION: "My Application ",
    CREATE_LOA: "Create LOA",
    SUPPLIER_REGISTRATION: "New Supplier Registration",
};
