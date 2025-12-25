import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { orpc } from "~/orpc/client";
import { isAuthenticatedAtom } from "~/store/auth";
import {
    initializeFirebase,
    setupForegroundMessageHandler,
} from "../lib/fcm-client";
import {
    checkAndGetFCMToken,
    checkNotificationPermission,
} from "../lib/notification";
import {
    notificationDismissedAtom,
    notificationModalOpenAtom,
} from "../store/notification";

export function useDeviceRegistration() {
    const hasRegistered = useRef(false);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const dismissed = useAtomValue(notificationDismissedAtom);
    const setModalOpen = useSetAtom(notificationModalOpenAtom);

    useEffect(() => {
        if (!isAuthenticated) {
            hasRegistered.current = false;
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        if (hasRegistered.current) {
            return;
        }

        async function register() {
            try {
                const currentPermission = checkNotificationPermission();

                let fcmToken: string | null = null;

                if (currentPermission === "granted") {
                    fcmToken = await checkAndGetFCMToken();
                }

                const result = await orpc.device.register({
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language,
                    platform: "web",
                    fcmToken: fcmToken || undefined,
                });

                if (result.success) {
                    hasRegistered.current = true;

                    const shouldShowDialog =
                        !fcmToken &&
                        currentPermission !== "denied" &&
                        currentPermission !== "unsupported" &&
                        !dismissed;

                    if (shouldShowDialog) {
                        setModalOpen(true);
                    }
                } else {
                    console.error("Device registration failed:", result.error);
                }
            } catch (err) {
                console.error("Device registration failed:", err);
            }
        }

        register();
    }, [isAuthenticated, dismissed, setModalOpen]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const setupForegroundNotifications = async () => {
            try {
                const messagingInstance = await initializeFirebase();
                if (messagingInstance) {
                    unsubscribe =
                        setupForegroundMessageHandler(messagingInstance);
                }
            } catch (err) {
                console.error("Failed to setup foreground notifications:", err);
            }
        };

        setupForegroundNotifications();

        return () => {
            unsubscribe?.();
        };
    }, []);
}
