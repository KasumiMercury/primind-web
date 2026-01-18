import { WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export function OfflineAlert() {
    const { t } = useTranslation();

    return (
        <Alert className="border-warning bg-warning/5 dark:bg-transparent">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>{t("offline.title")}</AlertTitle>
            <AlertDescription>{t("offline.description")}</AlertDescription>
        </Alert>
    );
}
