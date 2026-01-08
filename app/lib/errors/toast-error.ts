import type { TFunction } from "i18next";
import { toast } from "sonner";
import { getErrorMessage } from "./error-utils";

export function showErrorToast(
    t: TFunction,
    errorCode: string | undefined,
): void {
    const message = getErrorMessage(t, errorCode);
    toast.error(message);
}
