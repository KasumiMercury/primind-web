const env = import.meta.env ?? {};
const isProduction = import.meta.env?.PROD === true;

function getEnv(key: string): string | undefined {
    const value = env[key];
    if (!value && isProduction) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const firebaseConfig = {
    apiKey: getEnv("VITE_FIREBASE_API_KEY"),
    authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("VITE_FIREBASE_APP_ID"),
    measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID"),
};

export const hasFirebaseConfig =
    Boolean(firebaseConfig.apiKey) &&
    Boolean(firebaseConfig.authDomain) &&
    Boolean(firebaseConfig.projectId) &&
    Boolean(firebaseConfig.storageBucket) &&
    Boolean(firebaseConfig.messagingSenderId) &&
    Boolean(firebaseConfig.appId);

export const vapidKey = getEnv("VITE_FIREBASE_VAPID_KEY");
export const hasVapidKey = Boolean(vapidKey);
