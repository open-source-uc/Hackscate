import esString from "@/locales/es.json";
import enString from "@/locales/en.json";

export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = "en";

export const ui = {
  es: esString,
  en: enString,
} as const;