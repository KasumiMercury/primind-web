import type { TFunction } from "i18next";
import { ERROR_CODES } from "./error-codes";

export function getErrorMessage(
    t: TFunction,
    code: string | undefined,
): string {
    if (!code) {
        return t(`errors.${ERROR_CODES.COMMON_UNEXPECTED}`);
    }

    const translated = t(`errors.${code}`, { defaultValue: "" });

    if (!translated) {
        return t(`errors.${ERROR_CODES.COMMON_UNEXPECTED}`);
    }

    return translated;
}
