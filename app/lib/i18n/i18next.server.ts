import { createCookie } from "react-router";
import { RemixI18Next } from "remix-i18next/server";
import en from "~/locales/en";
import ja from "~/locales/ja";
import {
    fallbackLanguage,
    LANGUAGE_COOKIE_MAX_AGE,
    LANGUAGE_COOKIE_NAME,
    supportedLanguages,
} from "./config";

export const localeCookie = createCookie(LANGUAGE_COOKIE_NAME, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
});

const resources = {
    en: { translation: en },
    ja: { translation: ja },
};

export const i18next = new RemixI18Next({
    detection: {
        supportedLanguages: [...supportedLanguages],
        fallbackLanguage,
        cookie: localeCookie,
    },
    i18next: {
        resources,
        interpolation: {
            escapeValue: false,
        },
    },
});

export async function getLocale(request: Request): Promise<string> {
    return i18next.getLocale(request);
}

export function getFixedT(locale: string) {
    return i18next.getFixedT(locale);
}
