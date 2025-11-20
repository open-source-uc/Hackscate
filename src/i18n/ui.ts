import esString from "@/locales/es.json";
import enString from "@/locales/en.json";

export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = "es";

export const ui = {
  es: esString,
  en: enString,
} as const;