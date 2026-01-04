import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UnsupportedBrowser() {
    const { t } = useTranslation();

    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <AlertTriangle className="size-12 text-muted-foreground" />
            <div className="space-y-2">
                <h2 className="font-semibold text-lg">
                    {t("error.unsupportedBrowser.title")}
                </h2>
                <p className="text-muted-foreground">
                    {t("error.unsupportedBrowser.description")}
                </p>
            </div>
        </div>
    );
}
