export type Platform = "ios" | "android" | "other";

let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

/**
 * Detect the platform (iOS, Android, or other)
 */
export function detectPlatform(): Platform {
    if (typeof navigator === "undefined") {
        return "other";
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // iOS detection (iPhone, iPad, iPod)
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return "ios";
    }

    // Android detection
    if (/android/.test(userAgent)) {
        return "android";
    }

    return "other";
}

/**
 * Check if the app is running in standalone mode (installed as PWA)
 */
export function isStandalone(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    // Check display-mode media query
    if (window.matchMedia("(display-mode: standalone)").matches) {
        return true;
    }

    // iOS Safari standalone mode
    if (
        "standalone" in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
        return true;
    }

    return false;
}

/**
 * Set up the beforeinstallprompt event listener for Android
 * Returns a cleanup function
 */
export function setupInstallPromptListener(
    onPromptAvailable?: () => void,
): () => void {
    if (typeof window === "undefined") {
        return () => {};
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event for later use
        deferredPrompt = e;
        onPromptAvailable?.();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
        window.removeEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
        );
    };
}

/**
 * Trigger the install prompt (Android only)
 * Returns the user's choice or "unavailable" if prompt is not available
 */
export async function promptInstall(): Promise<
    "accepted" | "dismissed" | "unavailable"
> {
    if (!deferredPrompt) {
        return "unavailable";
    }

    try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        return outcome;
    } catch {
        return "unavailable";
    }
}

/**
 * Check if the install prompt is available
 */
export function isInstallPromptAvailable(): boolean {
    return deferredPrompt !== null;
}

/**
 * Set up a listener for display-mode changes (detects when user installs PWA)
 */
export function setupDisplayModeChangeListener(
    onStandaloneChange: (isStandalone: boolean) => void,
): () => void {
    if (typeof window === "undefined") {
        return () => {};
    }

    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handleChange = (e: MediaQueryListEvent) => {
        onStandaloneChange(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
        mediaQuery.removeEventListener("change", handleChange);
    };
}
