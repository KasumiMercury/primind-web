import { getFCMToken } from "./fcm-client";
import { hasFirebaseConfig, hasVapidKey } from "./firebase-config";

export type NotificationPermissionState =
    | "default"
    | "granted"
    | "denied"
    | "unsupported";

function isMessagingEnabled(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    return hasFirebaseConfig && hasVapidKey;
}

export function checkNotificationPermission(): NotificationPermissionState {
    if (typeof window === "undefined" || !("Notification" in window)) {
        return "unsupported";
    }

    if (!isMessagingEnabled()) {
        return "unsupported";
    }
    return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === "undefined" || !("Notification" in window)) {
        return "denied";
    }

    if (!isMessagingEnabled()) {
        return "denied";
    }

    if (Notification.permission === "granted") {
        return "granted";
    }

    if (Notification.permission === "denied") {
        return "denied";
    }

    return Notification.requestPermission();
}

export async function checkAndGetFCMToken(): Promise<string | null> {
    const permission = checkNotificationPermission();
    if (permission !== "granted") {
        return null;
    }

    try {
        const token = await getFCMToken();

        return token;
    } catch (err) {
        console.error("Failed to get FCM token:", err);
        return null;
    }
}

export async function requestAndGetFCMToken(): Promise<{
    permission: NotificationPermission;
    token: string | null;
}> {
    const permission = await requestNotificationPermission();

    if (permission !== "granted") {
        return { permission, token: null };
    }

    const token = await getFCMToken();
    return { permission, token };
}
