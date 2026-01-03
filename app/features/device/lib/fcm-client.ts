import {
    type FirebaseApp,
    type FirebaseOptions,
    initializeApp,
} from "firebase/app";
import {
    getMessaging,
    getToken,
    type MessagePayload,
    type Messaging,
    onMessage,
    type Unsubscribe,
} from "firebase/messaging";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import {
    firebaseConfig,
    hasFirebaseConfig,
    hasVapidKey,
    vapidKey,
} from "./firebase-config";

const DEFAULT_NOTIFICATION_TITLE = "New Notification";
const DEFAULT_NOTIFICATION_ICON = "/favicon.ico";

function resolveTaskUrl(
    data: Record<string, string> | undefined,
): string | null {
    const taskId = data?.task_id;
    if (!taskId || !uuidValidate(taskId) || uuidVersion(taskId) !== 7) {
        return null;
    }
    return `/tasks/${taskId}`;
}

const SW_ACTIVATION_TIMEOUT_MS = 30000;
const FCM_TOKEN_RETRY_COUNT = 3;
const FCM_TOKEN_RETRY_DELAY_MS = 1000;
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export async function initializeFirebase(): Promise<Messaging | null> {
    if (typeof window === "undefined") {
        return null;
    }

    if (!hasFirebaseConfig) {
        console.warn("Firebase configuration not found");
        return null;
    }

    if (!app) {
        app = initializeApp(firebaseConfig as FirebaseOptions);
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

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForServiceWorkerActive(
    registration: ServiceWorkerRegistration,
    timeoutMs: number,
): Promise<ServiceWorkerRegistration> {
    return new Promise((resolve, reject) => {
        if (registration.active) {
            resolve(registration);
            return;
        }

        const timeoutId = setTimeout(() => {
            reject(new Error("Service worker activation timeout"));
        }, timeoutMs);

        const serviceWorker = registration.installing || registration.waiting;

        if (!serviceWorker) {
            clearTimeout(timeoutId);
            reject(new Error("No service worker found in registration"));
            return;
        }

        const handleStateChange = () => {
            if (serviceWorker.state === "activated") {
                clearTimeout(timeoutId);
                serviceWorker.removeEventListener(
                    "statechange",
                    handleStateChange,
                );
                resolve(registration);
            } else if (serviceWorker.state === "redundant") {
                clearTimeout(timeoutId);
                serviceWorker.removeEventListener(
                    "statechange",
                    handleStateChange,
                );
                reject(new Error("Service worker became redundant"));
            }
        };

        serviceWorker.addEventListener("statechange", handleStateChange);

        if (serviceWorker.state === "activated") {
            clearTimeout(timeoutId);
            serviceWorker.removeEventListener("statechange", handleStateChange);
            resolve(registration);
        }
    });
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

        if (!registration.active) {
            try {
                await waitForServiceWorkerActive(
                    registration,
                    SW_ACTIVATION_TIMEOUT_MS,
                );
            } catch (err) {
                console.warn(
                    "Service worker activation check failed, continuing:",
                    err,
                );
            }
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

    if (!hasVapidKey) {
        console.warn("Firebase VAPID key not found");
        return null;
    }

    const registration = await registerServiceWorker();
    if (!registration) {
        return null;
    }

    for (let attempt = 1; attempt <= FCM_TOKEN_RETRY_COUNT; attempt++) {
        try {
            const token = await getToken(messagingInstance, {
                vapidKey: vapidKey as string,
                serviceWorkerRegistration: registration,
            });

            if (token) {
                return token;
            }

            console.warn(
                `FCM token is empty (attempt ${attempt}/${FCM_TOKEN_RETRY_COUNT})`,
            );
        } catch (err) {
            console.error(
                `Failed to get FCM token (attempt ${attempt}/${FCM_TOKEN_RETRY_COUNT}):`,
                err,
            );
        }

        if (attempt < FCM_TOKEN_RETRY_COUNT) {
            await delay(FCM_TOKEN_RETRY_DELAY_MS * attempt);
        }
    }

    return null;
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
                const fcmOptions = (
                    payload as { fcmOptions?: { link?: string } }
                ).fcmOptions;
                const notificationPayload = payload.notification as
                    | { click_action?: string }
                    | undefined;
                const taskUrl = resolveTaskUrl(payload.data);
                const url =
                    taskUrl ??
                    payload.data?.url ??
                    fcmOptions?.link ??
                    notificationPayload?.click_action ??
                    "/";
                const options: NotificationOptions = {
                    body: payload.notification?.body ?? "",
                    icon:
                        payload.notification?.icon ?? DEFAULT_NOTIFICATION_ICON,
                    data: { ...(payload.data ?? {}), url },
                };
                const notification = new Notification(title, options);
                notification.onclick = (event) => {
                    event.preventDefault();
                    window.focus();
                    window.location.href = url;
                };
            } catch (err) {
                console.error(
                    "Failed to display foreground notification:",
                    err,
                );
            }
        }
    });
}
