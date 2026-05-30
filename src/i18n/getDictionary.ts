import en from "./dictionaries/en";
import fr from "./dictionaries/fr";
import type { Locale } from "./config";

const dictionaries = {
    en,
    fr,
};

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale];
}