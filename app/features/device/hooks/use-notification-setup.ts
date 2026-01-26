import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import {
    checkNotificationPermission,
    type NotificationPermissionState,
} from "../lib/notification";
import { detectPlatform, isStandalone } from "../lib/pwa-detection";
import {
    notificationSetupDialogOpenAtom,
    notificationSetupDismissedAtom,
    notificationSetupStepAtom,
} from "../store/notification-setup";
import { isStandaloneAtom, platformAtom } from "../store/pwa";

interface OpenNotificationSetupOptions {
    /** Reset the "Don't ask again" flag before opening */
    resetDismissed?: boolean;
}

/**
 * Hook for managing notification setup dialog
 *
 * Provides:
 * - `openNotificationSetup()` - Opens the notification setup dialog
 * - `notificationPermission` - Current notification permission state
 * - `canEnableNotifications` - Whether notifications can be enabled
 */
export function useNotificationSetup() {
    const setDialogOpen = useSetAtom(notificationSetupDialogOpenAtom);
    const setDismissed = useSetAtom(notificationSetupDismissedAtom);
    const dismissed = useAtomValue(notificationSetupDismissedAtom);
    const setStep = useSetAtom(notificationSetupStepAtom);
    const setPlatform = useSetAtom(platformAtom);
    const setIsStandalone = useSetAtom(isStandaloneAtom);

    const [notificationPermission, setNotificationPermission] =
        useState<NotificationPermissionState>("unsupported");

    useEffect(() => {
        setNotificationPermission(checkNotificationPermission());
    }, []);

    const openNotificationSetup = useCallback(
        (options?: OpenNotificationSetupOptions) => {
            const { resetDismissed = false } = options ?? {};

            // Reset dismissed state if requested
            if (resetDismissed) {
                setDismissed(false);
            }

            // Detect platform and standalone status
            const platform = detectPlatform();
            const standalone = isStandalone();
            setPlatform(platform);
            setIsStandalone(standalone);

            // Start from intro step
            setStep("intro");

            // Open the dialog
            setDialogOpen(true);
        },
        [setDismissed, setPlatform, setIsStandalone, setStep, setDialogOpen],
    );

    // Whether notifications can be enabled:
    // - Not already granted
    // - Supported by browser
    const canEnableNotifications =
        notificationPermission !== "granted" &&
        notificationPermission !== "unsupported";

    // Whether the setup dialog should auto-show (for device registration)
    const shouldAutoShowDialog =
        canEnableNotifications &&
        notificationPermission !== "denied" &&
        !dismissed;

    return {
        openNotificationSetup,
        notificationPermission,
        canEnableNotifications,
        shouldAutoShowDialog,
    };
}
