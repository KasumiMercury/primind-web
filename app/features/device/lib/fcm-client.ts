import { type FirebaseApp, initializeApp } from "firebase/app";
import {
    getMessaging,
    getToken,
    type MessagePayload,
    type Messaging,
    onMessage,
    type Unsubscribe,
} from "firebase/messaging";
import { firebaseConfig, vapidKey } from "./firebase-config";

const DEFAULT_NOTIFICATION_TITLE = "New Notification";
const DEFAULT_NOTIFICATION_ICON = "/favicon.ico";

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export async function initializeFirebase(): Promise<Messaging | null> {
    if (typeof window === "undefined") {
        return null;
    }

    if (!firebaseConfig.apiKey) {
        console.warn("Firebase configuration not found");
        return null;
    }

    if (!app) {
        app = initializeApp(firebaseConfig);
    }

    if (!messaging) {
        try {
            messaging = getMessaging(app);
        } catch (err) {
            console.error("Failed to initialize Firebase Messaging:", err);
            return null;
        }
    }

    return messaging;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!("serviceWorker" in navigator)) {
        console.warn("Service workers not supported");
        return null;
    }

    try {
        const isProduction = import.meta.env.MODE === "production";
        const swPath = isProduction ? "/sw.js" : "/dev-sw.js?dev-sw";
        const registration = await navigator.serviceWorker.register(swPath, {
            type: isProduction ? "classic" : "module",
        });

        await navigator.serviceWorker.ready;

        return registration;
    } catch (err) {
        console.error("Failed to register service worker:", err);
        return null;
    }
}

export async function getFCMToken(): Promise<string | null> {
    const messagingInstance = await initializeFirebase();
    if (!messagingInstance) {
        return null;
    }

    try {
        const registration = await registerServiceWorker();
        if (!registration) {
            return null;
        }

        const token = await getToken(messagingInstance, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        return token;
    } catch (err) {
        console.error("Failed to get FCM token:", err);
        return null;
    }
}

export function setupForegroundMessageHandler(
    messagingInstance: Messaging,
    callback?: (payload: MessagePayload) => void,
): Unsubscribe {
    return onMessage(messagingInstance, (payload) => {
        callback?.(payload);

        if (Notification.permission === "granted") {
            try {
                const title =
                    payload.notification?.title ?? DEFAULT_NOTIFICATION_TITLE;
                const options: NotificationOptions = {
                    body: payload.notification?.body ?? "",
                    icon: payload.notification?.icon ?? DEFAULT_NOTIFICATION_ICON,
                    data: payload.data,
                };
                const notification = new Notification(title, options);
                notification.onclick = (event) => {
                    event.preventDefault();
                    const url = (payload.data?.url as string | undefined) ?? "/";
                    window.focus();
                    window.location.href = url;
                };
            } catch (err) {
                console.error("Failed to display foreground notification:", err);
            }
        }
    });
}
