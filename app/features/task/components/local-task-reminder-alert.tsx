import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export function LocalTaskReminderAlert() {
    const { t } = useTranslation();

    return (
        <Alert className="border-warning bg-warning/5 dark:bg-transparent">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("localTask.reminder.title")}</AlertTitle>
            <AlertDescription>
                {t("localTask.reminder.description")}
            </AlertDescription>
        </Alert>
    );
}
