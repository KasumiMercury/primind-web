import { Bell, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

export interface NotificationSetupPermissionStepProps {
    isRequesting: boolean;
    onEnableNotifications: () => void;
    onCancel: () => void;
}

export function NotificationSetupPermissionStep({
    isRequesting,
    onEnableNotifications,
    onCancel,
}: NotificationSetupPermissionStepProps) {
    const { t } = useTranslation();

    return (
        <>
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">
                    {t("notificationSetup.permission.title")}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {t("notificationSetup.permission.description")}
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
                            <span>
                                {t("notificationSetup.permission.allowing")}
                            </span>
                        </>
                    ) : (
                        t("notificationSetup.permission.allow")
                    )}
                </Button>

                <Button
                    variant="ghost"
                    onPress={onCancel}
                    isDisabled={isRequesting}
                    className="mt-2 text-muted-foreground text-xs data-hovered:underline"
                >
                    {t("common.cancel")}
                </Button>
            </DialogFooter>
        </>
    );
}
