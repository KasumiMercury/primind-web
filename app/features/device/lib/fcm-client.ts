import { type FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, type Messaging } from "firebase/messaging";
import { firebaseConfig, vapidKey } from "./firebase-config";

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

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === "undefined" || !("Notification" in window)) {
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

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!("serviceWorker" in navigator)) {
        console.warn("Service workers not supported");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
        );

        await navigator.serviceWorker.ready;

        if (registration.active) {
            registration.active.postMessage({
                type: "FIREBASE_CONFIG",
                config: firebaseConfig,
            });
        }

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

    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
        console.log("Notification permission not granted");
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
