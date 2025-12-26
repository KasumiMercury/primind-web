export const supportedLanguages = ["en", "ja"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const fallbackLanguage: SupportedLanguage = "en";
export const defaultNamespace = "translation" as const;

export const LANGUAGE_COOKIE_NAME = "lng";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
