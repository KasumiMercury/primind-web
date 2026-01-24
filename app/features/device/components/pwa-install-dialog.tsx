import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { promptInstall } from "../lib/pwa-detection";
import { notificationModalOpenAtom } from "../store/notification";
import {
    installPromptAvailableAtom,
    platformAtom,
    pwaInstallDismissedAtom,
    pwaInstallModalOpenAtom,
} from "../store/pwa";
import { PwaInstallDialogContent } from "./pwa-install-dialog-content";

export function PwaInstallDialog() {
    const [isOpen, setIsOpen] = useAtom(pwaInstallModalOpenAtom);
    const platform = useAtomValue(platformAtom);
    const setDismissed = useSetAtom(pwaInstallDismissedAtom);
    const setNotificationModalOpen = useSetAtom(notificationModalOpenAtom);
    const [installPromptAvailable, setInstallPromptAvailable] = useAtom(
        installPromptAvailableAtom,
    );
    const [isInstalling, setIsInstalling] = useState(false);

    const proceedToNotificationDialog = () => {
        setIsOpen(false);
        setNotificationModalOpen(true);
    };

    const handleInstall = async () => {
        if (!installPromptAvailable) {
            // If no prompt available, skip to notification dialog
            proceedToNotificationDialog();
            return;
        }

        setIsInstalling(true);
        try {
            const result = await promptInstall();
            // Reset atom since deferredPrompt has been consumed
            setInstallPromptAvailable(false);
            if (result === "accepted") {
                // User installed the app, close dialog
                setIsOpen(false);
            } else {
                // User dismissed the prompt, proceed to notification dialog
                proceedToNotificationDialog();
            }
        } finally {
            setIsInstalling(false);
        }
    };

    const handleInstalled = () => {
        // iOS: User claims they installed the app
        // Close dialog (they should reopen the app from home screen)
        setIsOpen(false);
    };

    const handleSkip = () => {
        // Android: Skip for now, show notification dialog
        proceedToNotificationDialog();
    };

    const handleDontAskAgain = () => {
        setDismissed(true);
        proceedToNotificationDialog();
    };

    return (
        <PwaInstallDialogContent
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            platform={platform}
            isInstalling={isInstalling}
            onInstall={handleInstall}
            onInstalled={handleInstalled}
            onSkip={handleSkip}
            onDontAskAgain={handleDontAskAgain}
        />
    );
}
