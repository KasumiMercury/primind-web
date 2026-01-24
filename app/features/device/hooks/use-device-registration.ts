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
import { detectPlatform, isStandalone } from "../lib/pwa-detection";
import {
    notificationDismissedAtom,
    notificationModalOpenAtom,
} from "../store/notification";
import {
    isStandaloneAtom,
    platformAtom,
    pwaInstallDismissedAtom,
    pwaInstallModalOpenAtom,
} from "../store/pwa";

export function useDeviceRegistration() {
    const hasRegistered = useRef(false);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const dismissed = useAtomValue(notificationDismissedAtom);
    const setModalOpen = useSetAtom(notificationModalOpenAtom);
    const pwaInstallDismissed = useAtomValue(pwaInstallDismissedAtom);
    const setPwaModalOpen = useSetAtom(pwaInstallModalOpenAtom);
    const setPlatform = useSetAtom(platformAtom);
    const setIsStandalone = useSetAtom(isStandaloneAtom);

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
                        const platform = detectPlatform();
                        const standalone = isStandalone();

                        // Update atoms for dialog to use
                        setPlatform(platform);
                        setIsStandalone(standalone);

                        if (platform === "ios" && !standalone) {
                            // iOS: PWA dialog is required for notifications
                            setPwaModalOpen(true);
                        } else if (
                            platform === "android" &&
                            !standalone &&
                            !pwaInstallDismissed
                        ) {
                            // Android: PWA dialog is recommended
                            setPwaModalOpen(true);
                        } else {
                            // Already PWA or other platform: go to notification dialog
                            setModalOpen(true);
                        }
                    }
                } else {
                    console.error("Device registration failed:", result.error);
                }
            } catch (err) {
                console.error("Device registration failed:", err);
            }
        }

        register();
    }, [
        isAuthenticated,
        dismissed,
        setModalOpen,
        pwaInstallDismissed,
        setPwaModalOpen,
        setPlatform,
        setIsStandalone,
    ]);

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
