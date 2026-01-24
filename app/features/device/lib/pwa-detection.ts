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
 * Check if the device is iOS/iPadOS
 * Handles iPadOS 13+ which reports as Mac desktop
 */
function isIOSDevice(): boolean {
    if (typeof navigator === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // Direct iOS detection via userAgent (iPhone, iPad pre-iPadOS 13, iPod)
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return true;
    }

    // iOS-specific: navigator.standalone property only exists on iOS Safari
    if ("standalone" in navigator) {
        return true;
    }

    // iPadOS 13+ detection: Reports as Mac but has touch support
    // - iPads typically have 5+ touch points
    // - MacBook Pro Touch Bar reports maxTouchPoints === 1
    // - Apple Silicon Macs without touch report maxTouchPoints === 0
    // Using threshold > 1 to avoid false positives from Touch Bar Macs
    const isMacUserAgent = userAgent.includes("macintosh");
    const hasTouchSupport = navigator.maxTouchPoints > 1;

    if (isMacUserAgent && hasTouchSupport) {
        return true;
    }

    return false;
}

/**
 * Check if the device is Android
 */
function isAndroidDevice(): boolean {
    if (typeof navigator === "undefined") {
        return false;
    }

    return /android/i.test(navigator.userAgent);
}

/**
 * Detect the platform (iOS, Android, or other)
 */
export function detectPlatform(): Platform {
    // Check iOS first (includes iPadOS 13+)
    if (isIOSDevice()) {
        return "ios";
    }

    // Check Android
    if (isAndroidDevice()) {
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
        return outcome;
    } catch {
        return "unavailable";
    } finally {
        // Always clear deferredPrompt after use (success or error)
        // The prompt can only be used once per beforeinstallprompt event
        deferredPrompt = null;
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
