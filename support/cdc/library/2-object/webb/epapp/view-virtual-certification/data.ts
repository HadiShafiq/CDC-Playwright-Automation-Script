import { Language } from "../../../shared/data";

const LABELS_MY = {
    DROPDOWN_DEFAULT: "- Pilih Satu -",
    NEXT: "Seterusnya",
    PREVIOUS: "Sebelum",
    SUBMIT: "Serah",
    YES: "Ya",
}

const LABELS_EN = {
    DROPDOWN_DEFAULT: "- Select One -",
    NEXT: "Next",
    PREVIOUS: "Previous",
    SUBMIT: "Submit",
    YES: "Yes",
}

export const LABELS: Record<Language, typeof LABELS_EN> = {
    my: LABELS_MY,
    en: LABELS_EN,
};