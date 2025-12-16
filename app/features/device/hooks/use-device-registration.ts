import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
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

interface DeviceInfo {
    timezone: string;
    locale: string;
    platform: string;
    fcm_token?: string;
}

interface RegisterDeviceResponse {
    success?: boolean;
    device_id?: string;
    is_new?: boolean;
    error?: string;
}

async function registerDevice(
    deviceInfo: DeviceInfo,
): Promise<RegisterDeviceResponse> {
    const response = await fetch("/api/device", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceInfo),
    });

    return response.json();
}

export function useDeviceRegistration() {
    const hasRegistered = useRef(false);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const dismissed = useAtomValue(notificationDismissedAtom);
    const setModalOpen = useSetAtom(notificationModalOpenAtom);

    useEffect(() => {
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

                const deviceInfo: DeviceInfo = {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language,
                    platform: "web",
                    fcm_token: fcmToken || undefined,
                };

                const result = await registerDevice(deviceInfo);

                if (result.success) {
                    hasRegistered.current = true;

                    if (
                        isAuthenticated &&
                        currentPermission === "default" &&
                        !dismissed
                    ) {
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
                    unsubscribe = setupForegroundMessageHandler(messagingInstance);
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
