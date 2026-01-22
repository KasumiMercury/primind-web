import { useSetAtom } from "jotai";
import { useEffect } from "react";
import {
    detectPlatform,
    isStandalone,
    setupDisplayModeChangeListener,
    setupInstallPromptListener,
} from "../lib/pwa-detection";
import {
    installPromptAvailableAtom,
    isStandaloneAtom,
    platformAtom,
} from "../store/pwa";

/**
 * Hook to initialize PWA detection and listeners
 * Should be called once at app startup
 */
export function usePwaInstall() {
    const setPlatform = useSetAtom(platformAtom);
    const setIsStandalone = useSetAtom(isStandaloneAtom);
    const setInstallPromptAvailable = useSetAtom(installPromptAvailableAtom);

    useEffect(() => {
        // Detect platform and standalone mode on mount
        const platform = detectPlatform();
        const standalone = isStandalone();

        setPlatform(platform);
        setIsStandalone(standalone);

        // Set up beforeinstallprompt listener (Android)
        const cleanupInstallPrompt = setupInstallPromptListener(() => {
            setInstallPromptAvailable(true);
        });

        // Set up display-mode change listener (detects PWA installation)
        const cleanupDisplayMode = setupDisplayModeChangeListener(
            (newStandalone) => {
                setIsStandalone(newStandalone);
            },
        );

        return () => {
            cleanupInstallPrompt();
            cleanupDisplayMode();
        };
    }, [setPlatform, setIsStandalone, setInstallPromptAvailable]);
}
