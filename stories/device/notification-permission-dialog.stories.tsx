import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider, useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { DialogContent } from "~/components/ui/dialog";
import { NotificationSetupIntroStep } from "~/features/device/components/notification-setup-intro-step";
import { NotificationSetupPermissionStep } from "~/features/device/components/notification-setup-permission-step";
import { NotificationSetupPwaStep } from "~/features/device/components/notification-setup-pwa-step";
import type { Platform } from "~/features/device/lib/pwa-detection";
import {
    type NotificationSetupStep,
    notificationSetupDialogOpenAtom,
    notificationSetupStepAtom,
} from "~/features/device/store/notification-setup";
import {
    installPromptAvailableAtom,
    isStandaloneAtom,
    platformAtom,
} from "~/features/device/store/pwa";

// Meta for Notification Step
const meta = {
    title: "Device/NotificationSetupDialog",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <Provider>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta;

export default meta;

// Helper component for intro step stories
function IntroStepDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>
                Start Notification Setup
            </Button>
            <DialogContent
                isOpen={open}
                onOpenChange={setOpen}
                isDismissable
                showCloseButton
                className="sm:max-w-md"
            >
                <NotificationSetupIntroStep
                    onEnable={() => {
                        console.log(
                            "Enable clicked - would proceed to next step",
                        );
                        setOpen(false);
                    }}
                    onNotNow={() => setOpen(false)}
                    onDontAskAgain={() => setOpen(false)}
                />
            </DialogContent>
        </>
    );
}

// Helper component for permission step stories
function PermissionStepDialog({
    isRequesting = false,
}: {
    isRequesting?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>Enable Notifications</Button>
            <DialogContent
                isOpen={open}
                onOpenChange={setOpen}
                isDismissable={!isRequesting}
                showCloseButton={!isRequesting}
                className="sm:max-w-md"
            >
                <NotificationSetupPermissionStep
                    isRequesting={isRequesting}
                    onEnableNotifications={() => {
                        console.log("Enable notifications clicked");
                    }}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </>
    );
}

// Helper component for PWA step stories
function PwaStepDialog({
    platform,
    isInstalling = false,
}: {
    platform: Platform;
    isInstalling?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>Install App</Button>
            <DialogContent
                isOpen={open}
                onOpenChange={setOpen}
                isDismissable={!isInstalling}
                showCloseButton={!isInstalling}
                className="sm:max-w-md"
            >
                <NotificationSetupPwaStep
                    platform={platform}
                    isInstalling={isInstalling}
                    onInstall={() => {
                        console.log("Install clicked");
                    }}
                    onInstalled={() => setOpen(false)}
                    onSkip={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </>
    );
}

// Helper component for full flow demo
function FullFlowDialog({
    initialPlatform,
    initialStandalone = false,
}: {
    initialPlatform: Platform;
    initialStandalone?: boolean;
}) {
    const [isOpen, setIsOpen] = useAtom(notificationSetupDialogOpenAtom);
    const [step, setStep] = useAtom(notificationSetupStepAtom);
    const setPlatform = useSetAtom(platformAtom);
    const setIsStandalone = useSetAtom(isStandaloneAtom);
    const setInstallPromptAvailable = useSetAtom(installPromptAvailableAtom);

    const [isInstalling, setIsInstalling] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const isIOS = initialPlatform === "ios";
    const shouldShowPwaStep =
        !initialStandalone && (isIOS || initialPlatform === "android");

    // Initialize atoms
    useEffect(() => {
        setPlatform(initialPlatform);
        setIsStandalone(initialStandalone);
        setInstallPromptAvailable(initialPlatform === "android");

        // Always start from intro step
        setStep("intro");
    }, [
        initialPlatform,
        initialStandalone,
        setPlatform,
        setIsStandalone,
        setInstallPromptAvailable,
        setStep,
    ]);

    // Determine current step to display
    const currentStep: NotificationSetupStep =
        step === "intro"
            ? "intro"
            : step === "pwa-install" && shouldShowPwaStep
              ? "pwa-install"
              : "notification";

    const isProcessing = isInstalling || isRequesting;
    const canDismiss = !isProcessing;

    const closeDialog = () => {
        setIsOpen(false);
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

    const handleInstall = async () => {
        setIsInstalling(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsInstalling(false);
        goToNotificationStep();
    };

    const handleEnableNotifications = async () => {
        setIsRequesting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsRequesting(false);
        closeDialog();
    };

    const renderStep = () => {
        switch (currentStep) {
            case "intro":
                return (
                    <NotificationSetupIntroStep
                        onEnable={goToNextStepFromIntro}
                        onNotNow={closeDialog}
                        onDontAskAgain={closeDialog}
                    />
                );
            case "pwa-install":
                return (
                    <NotificationSetupPwaStep
                        platform={initialPlatform}
                        isInstalling={isInstalling}
                        onInstall={handleInstall}
                        onInstalled={closeDialog}
                        onSkip={goToNotificationStep}
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
        <>
            <Button onPress={() => setIsOpen(true)}>
                Start Notification Setup
            </Button>
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
        </>
    );
}

// Intro Step Stories
export const IntroStep: StoryObj = {
    render: () => <IntroStepDialog />,
    parameters: {
        docs: {
            description: {
                story: "The intro step asking if the user wants to enable notifications. This is the first step in the flow.",
            },
        },
    },
};

// Permission Step Stories
export const PermissionStep: StoryObj = {
    render: () => <PermissionStepDialog />,
    parameters: {
        docs: {
            description: {
                story: "The notification permission step of the setup flow.",
            },
        },
    },
};

export const PermissionStepRequesting: StoryObj = {
    render: () => <PermissionStepDialog isRequesting />,
    parameters: {
        docs: {
            description: {
                story: "Permission step in requesting state.",
            },
        },
    },
};

// PWA Step Stories - iOS
export const PwaStepIOS: StoryObj = {
    render: () => <PwaStepDialog platform="ios" />,
    parameters: {
        docs: {
            description: {
                story: "PWA installation step for iOS. Shows manual installation instructions. Dialog cannot be dismissed.",
            },
        },
    },
};

// PWA Step Stories - Android
export const PwaStepAndroid: StoryObj = {
    render: () => <PwaStepDialog platform="android" />,
    parameters: {
        docs: {
            description: {
                story: "PWA installation step for Android. Shows install button with skip option.",
            },
        },
    },
};

export const PwaStepAndroidInstalling: StoryObj = {
    render: () => <PwaStepDialog platform="android" isInstalling />,
    parameters: {
        docs: {
            description: {
                story: "Android PWA step in installing state.",
            },
        },
    },
};

// Full Flow Stories
export const FullFlowIOS: StoryObj = {
    render: () => <FullFlowDialog initialPlatform="ios" />,
    parameters: {
        docs: {
            description: {
                story: "Complete notification setup flow for iOS. PWA installation is required before proceeding to notifications.",
            },
        },
    },
};

export const FullFlowAndroid: StoryObj = {
    render: () => <FullFlowDialog initialPlatform="android" />,
    parameters: {
        docs: {
            description: {
                story: "Complete notification setup flow for Android. PWA installation can be skipped.",
            },
        },
    },
};

export const FullFlowDesktop: StoryObj = {
    render: () => <FullFlowDialog initialPlatform="other" />,
    parameters: {
        docs: {
            description: {
                story: "Notification setup flow for desktop. Skips PWA step and goes directly to notification permission.",
            },
        },
    },
};

export const FullFlowAlreadyPWA: StoryObj = {
    render: () => (
        <FullFlowDialog initialPlatform="android" initialStandalone />
    ),
    parameters: {
        docs: {
            description: {
                story: "Notification setup flow when already running as PWA. Skips PWA step.",
            },
        },
    },
};
