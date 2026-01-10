import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

interface LoginPromptAlertProps {
    onLoginClick: () => void;
}

export function LoginPromptAlert({ onLoginClick }: LoginPromptAlertProps) {
    const { t } = useTranslation();

    return (
        <Alert className="w-full max-w-xl">
            <Info className="h-4 w-4" />
            <div className="ml-3 flex flex-row items-center justify-between">
                <div>
                    <AlertTitle>{t("loginRequired.title")}</AlertTitle>
                    <AlertDescription>
                        <p>{t("loginRequired.description")}</p>
                    </AlertDescription>
                </div>
                <Button variant="outline" size="sm" onPress={onLoginClick}>
                    {t("auth.login")}
                </Button>
            </div>
        </Alert>
    );
}
