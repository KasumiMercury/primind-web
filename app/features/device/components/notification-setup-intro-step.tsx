import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

export interface NotificationSetupIntroStepProps {
    onEnable: () => void;
    onNotNow: () => void;
    onDontAskAgain: () => void;
}

export function NotificationSetupIntroStep({
    onEnable,
    onNotNow,
    onDontAskAgain,
}: NotificationSetupIntroStepProps) {
    const { t } = useTranslation();

    return (
        <>
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">
                    {t("notificationSetup.intro.title")}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {t("notificationSetup.intro.description")}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                <Button onPress={onEnable} className="w-full">
                    {t("notificationSetup.intro.enable")}
                </Button>

                <Button variant="ghost" onPress={onNotNow} className="w-full">
                    {t("common.notNow")}
                </Button>

                <Button
                    variant="ghost"
                    type="button"
                    onPress={onDontAskAgain}
                    className="mt-2 text-muted-foreground text-xs data-hovered:underline"
                >
                    {t("common.dontAskAgain")}
                </Button>
            </DialogFooter>
        </>
    );
}
