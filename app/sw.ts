/// <reference lib="webworker" />

import { type FirebaseOptions, initializeApp } from "firebase/app";
import {
    getMessaging,
    type MessagePayload,
    type Messaging,
    onBackgroundMessage,
} from "firebase/messaging/sw";
import {
    firebaseConfig,
    hasFirebaseConfig,
} from "./features/device/lib/firebase-config";

declare const self: ServiceWorkerGlobalScope;

const DEFAULT_NOTIFICATION_TITLE = "New Notification";
const DEFAULT_NOTIFICATION_ICON = "/favicon.ico";
const DEFAULT_URL = "/";

let messaging: Messaging | null = null;

function resolveNotificationUrl(payload: MessagePayload): string {
    const fcmOptions = (payload as { fcmOptions?: { link?: string } })
        .fcmOptions;
    const notification = payload.notification as
        | { click_action?: string }
        | undefined;
    return (
        payload.data?.url ??
        fcmOptions?.link ??
        notification?.click_action ??
        DEFAULT_URL
    );
}

try {
    if (hasFirebaseConfig) {
        const app = initializeApp(firebaseConfig as FirebaseOptions);
        messaging = getMessaging(app);
    }
} catch (err) {
    console.error("Failed to initialize Firebase Messaging in SW:", err);
}

if (messaging) {
    onBackgroundMessage(messaging, (payload) => {
        const url = resolveNotificationUrl(payload);
        const title = payload.notification?.title ?? DEFAULT_NOTIFICATION_TITLE;
        const options: NotificationOptions = {
            body: payload.notification?.body ?? "",
            icon: payload.notification?.icon ?? DEFAULT_NOTIFICATION_ICON,
            data: { ...(payload.data ?? {}), url },
        };
        self.registration.showNotification(title, options);
    });
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const rawUrl =
        (event.notification.data?.url as string | undefined) ?? DEFAULT_URL;
    let urlToOpen: string;
    let isSameOrigin = true;
    try {
        const targetUrl = new URL(rawUrl, self.location.origin);
        urlToOpen = targetUrl.href;
        isSameOrigin = targetUrl.origin === self.location.origin;
    } catch {
        const defaultUrl = new URL(DEFAULT_URL, self.location.origin);
        urlToOpen = defaultUrl.href;
        isSameOrigin = true;
    }

    event.waitUntil(
        self.clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then(async (windowClients) => {
                const typedClients = windowClients as WindowClient[];
                if (!isSameOrigin) {
                    return self.clients.openWindow(urlToOpen);
                }
                for (const client of typedClients) {
                    if (client.url === urlToOpen) {
                        return client.focus();
                    }
                }

                if (typedClients.length > 0) {
                    const client = typedClients[0];
                    await client.focus();
                    if ("navigate" in client) {
                        return client.navigate(urlToOpen);
                    }
                    return client;
                }

                return self.clients.openWindow(urlToOpen);
            })
            .catch((err) => {
                console.error("Failed to handle notification click:", err);
            }),
    );
});
