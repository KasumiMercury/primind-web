import { createCookie } from "react-router";
import {
    fallbackLanguage,
    LANGUAGE_COOKIE_MAX_AGE,
    LANGUAGE_COOKIE_NAME,
    type SupportedLanguage,
    supportedLanguages,
} from "./config";

export const localeCookie = createCookie(LANGUAGE_COOKIE_NAME, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
});

function isSupported(locale: string): locale is SupportedLanguage {
    return supportedLanguages.includes(locale as SupportedLanguage);
}

function parseAcceptLanguage(header: string | null): SupportedLanguage | null {
    if (!header) return null;

    const languages = header
        .split(",")
        .map((part) => {
            const [locale, qValue] = part.trim().split(";");
            const quality = qValue
                ? Number.parseFloat(qValue.split("=")[1] ?? "1")
                : 1;
            return { locale: locale?.trim() ?? "", quality };
        })
        .sort((a, b) => b.quality - a.quality);

    for (const { locale } of languages) {
        try {
            const intlLocale = new Intl.Locale(locale);
            if (isSupported(intlLocale.language)) {
                return intlLocale.language as SupportedLanguage;
            }
        } catch {
            // Invalid locale, skip
        }
    }

    return null;
}

export async function getLocale(request: Request): Promise<string> {
    const url = new URL(request.url);
    const searchParamLocale = url.searchParams.get("lng");
    if (searchParamLocale && isSupported(searchParamLocale)) {
        return searchParamLocale;
    }

    const cookieValue = await localeCookie.parse(request.headers.get("Cookie"));
    if (typeof cookieValue === "string" && isSupported(cookieValue)) {
        return cookieValue;
    }

    const headerLocale = parseAcceptLanguage(
        request.headers.get("Accept-Language"),
    );
    if (headerLocale) {
        return headerLocale;
    }

    return fallbackLanguage;
}
