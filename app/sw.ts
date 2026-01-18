/// <reference lib="webworker" />

import { validate as uuidValidate, version as uuidVersion } from "uuid";

declare const self: ServiceWorkerGlobalScope;

const DEFAULT_NOTIFICATION_TITLE = "New Notification";
const DEFAULT_NOTIFICATION_ICON = "/favicon.ico";
const DEFAULT_URL = "/";

interface FcmPayload {
    notification?: {
        title?: string;
        body?: string;
        icon?: string;
        click_action?: string;
    };
    data?: Record<string, string>;
    fcmOptions?: {
        link?: string;
    };
}

function resolveTaskUrl(
    data: Record<string, string> | undefined,
): string | null {
    const taskId = data?.task_id;
    if (!taskId || !uuidValidate(taskId) || uuidVersion(taskId) !== 7) {
        return null;
    }
    return `/tasks/${taskId}`;
}

function resolveNotificationUrl(payload: FcmPayload): string {
    const taskUrl = resolveTaskUrl(payload.data);
    if (taskUrl) {
        return taskUrl;
    }
    return (
        payload.data?.url ??
        payload.fcmOptions?.link ??
        payload.notification?.click_action ??
        DEFAULT_URL
    );
}

// Use push event listener directly instead of Firebase SDK's onBackgroundMessage
// to prevent duplicate notifications (Firebase SDK auto-shows notification when
// notification payload is present, causing duplicates with manual showNotification)
self.addEventListener("push", (event) => {
    if (!event.data) {
        return;
    }

    let payload: FcmPayload;
    try {
        payload = event.data.json() as FcmPayload;
    } catch {
        return;
    }

    const url = resolveNotificationUrl(payload);
    const title = payload.notification?.title ?? DEFAULT_NOTIFICATION_TITLE;
    const options: NotificationOptions = {
        body: payload.notification?.body ?? "",
        icon: payload.notification?.icon ?? DEFAULT_NOTIFICATION_ICON,
        data: { ...(payload.data ?? {}), url },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

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
