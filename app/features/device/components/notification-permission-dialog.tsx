import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { requestAndGetFCMToken } from "../lib/notification";
import {
    notificationDismissedAtom,
    notificationModalOpenAtom,
} from "../store/notification";
import { NotificationPermissionDialogContent } from "./notification-permission-dialog-content";

export function NotificationPermissionDialog() {
    const [isOpen, setIsOpen] = useAtom(notificationModalOpenAtom);
    const setDismissed = useSetAtom(notificationDismissedAtom);
    const [isRequesting, setIsRequesting] = useState(false);

    const handleEnableNotifications = async () => {
        setIsRequesting(true);
        try {
            const { permission, token } = await requestAndGetFCMToken();

            if (permission === "granted" && token) {
                const res = await fetch("/api/device", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        timezone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                        locale: navigator.language,
                        platform: "web",
                        fcm_token: token,
                    }),
                });
                if (!res.ok) {
                    throw new Error("Failed to register device");
                }
            }

            setIsOpen(false);
        } catch (err) {
            console.error("Failed to enable notifications:", err);
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
