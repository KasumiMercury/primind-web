import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "FIREBASE_CONFIG") {
        initializeApp(event.data.config);
        initializeMessaging();
    }
});

function initializeMessaging() {
    const messaging = getMessaging();

    messaging.onBackgroundMessage((payload) => {
        console.log("Received background message:", payload);

        const notificationTitle =
            payload.notification?.title || "New Notification";
        const notificationOptions = {
            body: payload.notification?.body || "",
            icon: "/favicon.ico",
            data: payload.data,
        };

        self.registration.showNotification(
            notificationTitle,
            notificationOptions,
        );
    });
}

self.addEventListener("notificationclick", (event) => {
    console.log("Notification click:", event);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url === urlToOpen && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            }),
    );
});
