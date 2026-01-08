import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ERROR_CODES, showErrorToast } from "~/lib/errors";
import { orpc } from "~/orpc/client";
import { requestAndGetFCMToken } from "../lib/notification";
import {
    notificationDismissedAtom,
    notificationModalOpenAtom,
} from "../store/notification";
import { NotificationPermissionDialogContent } from "./notification-permission-dialog-content";

export function NotificationPermissionDialog() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useAtom(notificationModalOpenAtom);
    const setDismissed = useSetAtom(notificationDismissedAtom);
    const [isRequesting, setIsRequesting] = useState(false);

    const handleEnableNotifications = async () => {
        setIsRequesting(true);
        try {
            const { permission, token } = await requestAndGetFCMToken();

            if (permission === "granted" && token) {
                const result = await orpc.device.register({
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language,
                    platform: "web",
                    fcmToken: token,
                });
                if (!result.success) {
                    showErrorToast(
                        t,
                        result.error || ERROR_CODES.DEVICE_REGISTER_FAILED,
                    );
                    return;
                }
            }

            setIsOpen(false);
        } catch (err) {
            console.error("Failed to enable notifications:", err);
            showErrorToast(t, ERROR_CODES.DEVICE_REGISTER_FAILED);
        } finally {
            setIsRequesting(false);
        }
    };

    const handleNotNow = () => {
        setIsOpen(false);
    };

    const handleDontAskAgain = () => {
        setDismissed(true);
        setIsOpen(false);
    };

    return (
        <NotificationPermissionDialogContent
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            isRequesting={isRequesting}
            onEnableNotifications={handleEnableNotifications}
            onNotNow={handleNotNow}
            onDontAskAgain={handleDontAskAgain}
        />
    );
}
