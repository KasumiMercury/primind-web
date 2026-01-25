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
    notificationSetupDialogOpenAtom,
    notificationSetupDismissedAtom,
    notificationSetupStepAtom,
} from "../store/notification-setup";
import { isStandaloneAtom, platformAtom } from "../store/pwa";

export function useDeviceRegistration() {
    const hasRegistered = useRef(false);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const dismissed = useAtomValue(notificationSetupDismissedAtom);
    const setDialogOpen = useSetAtom(notificationSetupDialogOpenAtom);
    const setStep = useSetAtom(notificationSetupStepAtom);
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

                        // Always start from intro step
                        setStep("intro");

                        setDialogOpen(true);
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
        setDialogOpen,
        setStep,
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
