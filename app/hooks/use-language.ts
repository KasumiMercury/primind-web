import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import type { SupportedLanguage } from "~/lib/i18n/config";

export function useLanguage() {
    const { i18n } = useTranslation();
    const fetcher = useFetcher();

    const language = i18n.language as SupportedLanguage;

    const setLanguage = useCallback(
        (lng: SupportedLanguage) => {
            fetcher.submit(
                { language: lng },
                { method: "POST", action: "/api/set-language" },
            );
            i18n.changeLanguage(lng);
        },
        [i18n, fetcher],
    );

    return {
        language,
        setLanguage,
    };
}
