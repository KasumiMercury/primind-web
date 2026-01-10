import { Bell, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

export interface NotificationPermissionDialogContentProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isRequesting: boolean;
    onEnableNotifications: () => void;
    onNotNow: () => void;
    onDontAskAgain: () => void;
}

export function NotificationPermissionDialogContent({
    isOpen,
    onOpenChange,
    isRequesting,
    onEnableNotifications,
    onNotNow,
    onDontAskAgain,
}: NotificationPermissionDialogContentProps) {
    const { t } = useTranslation();

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={!isRequesting}
            showCloseButton={!isRequesting}
            className="sm:max-w-md"
        >
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">
                    {t("notification.enable")}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {t("notification.description")}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                <Button
                    onPress={onEnableNotifications}
                    isDisabled={isRequesting}
                    className="w-full"
                >
                    {isRequesting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>{t("notification.enabling")}</span>
                        </>
                    ) : (
                        t("notification.enable")
                    )}
                </Button>

                <Button
                    variant="ghost"
                    onPress={onNotNow}
                    isDisabled={isRequesting}
                    className="w-full"
                >
                    {t("common.notNow")}
                </Button>

                <Button
                    variant="ghost"
                    type="button"
                    onPress={onDontAskAgain}
                    isDisabled={isRequesting}
                    className="mt-2 text-muted-foreground text-xs data-hovered:underline"
                >
                    {t("common.dontAskAgain")}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
