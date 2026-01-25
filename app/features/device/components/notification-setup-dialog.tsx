import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogContent } from "~/components/ui/dialog";
import { ERROR_CODES, showErrorToast } from "~/lib/errors";
import { orpc } from "~/orpc/client";
import { requestAndGetFCMToken } from "../lib/notification";
import { promptInstall } from "../lib/pwa-detection";
import {
    notificationSetupDialogOpenAtom,
    notificationSetupDismissedAtom,
    notificationSetupStepAtom,
} from "../store/notification-setup";
import {
    installPromptAvailableAtom,
    isStandaloneAtom,
    platformAtom,
} from "../store/pwa";
import { NotificationSetupIntroStep } from "./notification-setup-intro-step";
import { NotificationSetupPermissionStep } from "./notification-setup-permission-step";
import { NotificationSetupPwaStep } from "./notification-setup-pwa-step";

export function NotificationSetupDialog() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useAtom(notificationSetupDialogOpenAtom);
    const [step, setStep] = useAtom(notificationSetupStepAtom);
    const setDismissed = useSetAtom(notificationSetupDismissedAtom);
    const platform = useAtomValue(platformAtom);
    const isStandalone = useAtomValue(isStandaloneAtom);
    const [installPromptAvailable, setInstallPromptAvailable] = useAtom(
        installPromptAvailableAtom,
    );

    const [isInstalling, setIsInstalling] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const isIOS = platform === "ios";

    // Determine if PWA step should be shown
    const shouldShowPwaStep =
        !isStandalone && (isIOS || platform === "android");

    // Determine current step to display
    const currentStep =
        step === "intro"
            ? "intro"
            : step === "pwa-install" && shouldShowPwaStep
              ? "pwa-install"
              : "notification";

    const closeDialog = () => {
        setIsOpen(false);
        // Reset step for next time
        setStep("intro");
    };

    const goToNextStepFromIntro = () => {
        if (shouldShowPwaStep) {
            setStep("pwa-install");
        } else {
            setStep("notification");
        }
    };

    const goToNotificationStep = () => {
        setStep("notification");
    };

    // PWA Step Handlers
    const handleInstall = async () => {
        if (!installPromptAvailable) {
            goToNotificationStep();
            return;
        }

        setIsInstalling(true);
        try {
            const result = await promptInstall();
            setInstallPromptAvailable(false);
            if (result === "accepted") {
                goToNotificationStep();
            } else {
                goToNotificationStep();
            }
        } finally {
            setIsInstalling(false);
        }
    };

    const handleInstalled = () => {
        // iOS: User claims they installed the app
        // Close dialog (they should reopen the app from home screen)
        closeDialog();
    };

    const handlePwaSkip = () => {
        goToNotificationStep();
    };

    const handleDontAskAgain = () => {
        setDismissed(true);
        closeDialog();
    };

    // Notification Step Handlers
    const handleEnableNotifications = async () => {
        setIsRequesting(true);
        try {
            const { permission, token } = await requestAndGetFCMToken();

            if (permission === "granted" && token) {
                const result = await orpc.device.register({
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language,
                    platform: "web",
                    fcmToken: token,
                });
                if (!result.success) {
                    showErrorToast(
                        t,
                        result.error || ERROR_CODES.DEVICE_REGISTER_FAILED,
                    );
                    return;
                }
            }

            closeDialog();
        } catch (err) {
            console.error("Failed to enable notifications:", err);
            showErrorToast(t, ERROR_CODES.DEVICE_REGISTER_FAILED);
        } finally {
            setIsRequesting(false);
        }
    };

    // Determine if dialog can be dismissed (all steps are dismissable except when processing)
    const isProcessing = isInstalling || isRequesting;
    const canDismiss = !isProcessing;

    const renderStep = () => {
        switch (currentStep) {
            case "intro":
                return (
                    <NotificationSetupIntroStep
                        onEnable={goToNextStepFromIntro}
                        onNotNow={closeDialog}
                        onDontAskAgain={handleDontAskAgain}
                    />
                );
            case "pwa-install":
                return (
                    <NotificationSetupPwaStep
                        platform={platform}
                        isInstalling={isInstalling}
                        onInstall={handleInstall}
                        onInstalled={handleInstalled}
                        onSkip={handlePwaSkip}
                        onCancel={closeDialog}
                    />
                );
            case "notification":
                return (
                    <NotificationSetupPermissionStep
                        isRequesting={isRequesting}
                        onEnableNotifications={handleEnableNotifications}
                        onCancel={closeDialog}
                    />
                );
        }
    };

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open && canDismiss) {
                    closeDialog();
                }
            }}
            isDismissable={canDismiss}
            showCloseButton={canDismiss}
            className="sm:max-w-md"
        >
            {renderStep()}
        </DialogContent>
    );
}
