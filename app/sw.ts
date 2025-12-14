/// <reference lib="webworker" />

import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { firebaseConfig } from "./features/device/lib/firebase-config";

const swSelf = globalThis as unknown as ServiceWorkerGlobalScope;

swSelf.addEventListener("activate", async () => {
    try {
        if (!firebaseConfig.apiKey) {
            return;
        }

        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        onBackgroundMessage(messaging, (payload) => {
            const title = payload.notification?.title || "New Notification";
            const options = {
                body: payload.notification?.body || "",
                icon: "/favicon.ico",
                data: payload.data,
            };
            (
                swSelf as unknown as ServiceWorkerGlobalScope
            ).registration.showNotification(title, options);
        });
    } catch (err) {
        console.error("Failed to initialize Firebase Messaging in SW:", err);
    }
});

swSelf.addEventListener("notificationclick", (event) => {
    const notificationEvent = event as NotificationEvent;
    notificationEvent.notification.close();
    const urlToOpen = notificationEvent.notification.data?.url || "/";

    notificationEvent.waitUntil(
        (swSelf as unknown as ServiceWorkerGlobalScope).clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url === urlToOpen && "focus" in client) {
                        return (client as WindowClient).focus();
                    }
                }
                return (
                    swSelf as unknown as ServiceWorkerGlobalScope
                ).clients.openWindow(urlToOpen);
            }),
    );
});
