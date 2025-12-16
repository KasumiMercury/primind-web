/// <reference lib="webworker" />

import { initializeApp } from "firebase/app";
import {
    getMessaging,
    type Messaging,
    onBackgroundMessage,
} from "firebase/messaging/sw";
import { firebaseConfig } from "./features/device/lib/firebase-config";

declare const self: ServiceWorkerGlobalScope;

const DEFAULT_NOTIFICATION_TITLE = "New Notification";
const DEFAULT_NOTIFICATION_ICON = "/favicon.ico";
const DEFAULT_URL = "/";

let messaging: Messaging | null = null;

try {
    if (firebaseConfig.apiKey) {
        const app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);
    }
} catch (err) {
    console.error("Failed to initialize Firebase Messaging in SW:", err);
}

if (messaging) {
    onBackgroundMessage(messaging, (payload) => {
        const title = payload.notification?.title ?? DEFAULT_NOTIFICATION_TITLE;
        const options: NotificationOptions = {
            body: payload.notification?.body ?? "",
            icon: payload.notification?.icon ?? DEFAULT_NOTIFICATION_ICON,
            data: payload.data,
        };
        self.registration.showNotification(title, options);
    });
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const urlToOpen =
        (event.notification.data?.url as string | undefined) ?? DEFAULT_URL;

    event.waitUntil(
        self.clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url === urlToOpen && "focus" in client) {
                        return client.focus();
                    }
                }
                return self.clients.openWindow(urlToOpen);
            })
            .catch((err) => {
                console.error("Failed to handle notification click:", err);
            }),
    );
});
