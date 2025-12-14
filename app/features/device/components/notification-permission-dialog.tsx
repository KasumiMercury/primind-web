import { useAtom, useSetAtom } from "jotai";
import { Bell, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { requestAndGetFCMToken } from "../lib/notification";
import {
    notificationDismissedAtom,
    notificationModalOpenAtom,
} from "../store/notification";

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
        <DialogContent
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            isDismissable={!isRequesting}
            showCloseButton={!isRequesting}
            className="sm:max-w-md"
        >
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">
                    Enable Notifications
                </DialogTitle>
                <DialogDescription className="text-center">
                    Enable notifications to remind you.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                <Button
                    onPress={handleEnableNotifications}
                    isDisabled={isRequesting}
                    className="w-full"
                >
                    {isRequesting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Enabling...</span>
                        </>
                    ) : (
                        "Enable Notifications"
                    )}
                </Button>

                <Button
                    variant="ghost"
                    onPress={handleNotNow}
                    isDisabled={isRequesting}
                    className="w-full"
                >
                    Not now
                </Button>

                <Button
                    variant="ghost"
                    type="button"
                    onPress={handleDontAskAgain}
                    isDisabled={isRequesting}
                    className="mt-2 text-muted-foreground text-xs hover:underline disabled:opacity-50"
                >
                    Don't ask again
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
