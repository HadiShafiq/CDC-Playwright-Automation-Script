import { Language } from "../../shared/data";

const LABELS_MY = {
    ACCOUNT_MENU_PREFIX: "Akaun Saya",
    LOGOUT_MENU: "Log Keluar",
};

const LABELS_EN = {
    ACCOUNT_MENU_PREFIX: "My Account",
    LOGOUT_MENU: "Sign Out",
};

export const LABELS: Record<Language, typeof LABELS_EN> = {
    my: LABELS_MY,
    en: LABELS_EN,
};
