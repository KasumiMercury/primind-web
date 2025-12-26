import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "~/locales/en";
import ja from "~/locales/ja";
import { fallbackLanguage, supportedLanguages } from "./config";

const resources = {
    en: { translation: en },
    ja: { translation: ja },
};

export async function initI18next() {
    await i18next
        .use(initReactI18next)
        .use(I18nextBrowserLanguageDetector)
        .init({
            resources,
            fallbackLng: fallbackLanguage,
            supportedLngs: [...supportedLanguages],
            detection: {
                order: ["htmlTag", "cookie", "navigator"],
                caches: ["cookie"],
                cookieMinutes: 60 * 24 * 365,
            },
            interpolation: {
                escapeValue: false,
            },
        });

    return i18next;
}
