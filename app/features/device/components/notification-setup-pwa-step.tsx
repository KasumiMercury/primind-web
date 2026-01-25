import { Download, Loader2, Share, SquarePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import type { Platform } from "../lib/pwa-detection";

export interface NotificationSetupPwaStepProps {
    platform: Platform;
    isInstalling: boolean;
    onInstall: () => void;
    onInstalled: () => void;
    onSkip: () => void;
    onCancel: () => void;
}

export function NotificationSetupPwaStep({
    platform,
    isInstalling,
    onInstall,
    onInstalled,
    onSkip,
    onCancel,
}: NotificationSetupPwaStepProps) {
    const { t } = useTranslation();

    const isIOS = platform === "ios";
    const isRequired = isIOS;

    return (
        <>
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Download className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">
                    {t("notificationSetup.pwa.title")}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {isRequired
                        ? t("notificationSetup.pwa.descriptionRequired")
                        : t("notificationSetup.pwa.descriptionRecommended")}
                </DialogDescription>
            </DialogHeader>

            {isIOS && (
                <div className="mt-4 space-y-3 rounded-lg bg-muted/50 p-4">
                    <p className="font-medium text-sm">
                        {t("notificationSetup.pwa.iosInstructions.title")}
                    </p>
                    <ol className="space-y-2 text-muted-foreground text-sm">
                        <li className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                                1
                            </span>
                            <Share className="h-4 w-4 shrink-0" />
                            <span>
                                {t(
                                    "notificationSetup.pwa.iosInstructions.step1",
                                )}
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                                2
                            </span>
                            <SquarePlus className="h-4 w-4 shrink-0" />
                            <span>
                                {t(
                                    "notificationSetup.pwa.iosInstructions.step2",
                                )}
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                                3
                            </span>
                            <span className="ml-6">
                                {t(
                                    "notificationSetup.pwa.iosInstructions.step3",
                                )}
                            </span>
                        </li>
                    </ol>
                </div>
            )}

            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                {isIOS ? (
                    <>
                        <Button onPress={onInstalled} className="w-full">
                            {t("notificationSetup.pwa.iosInstalled")}
                        </Button>

                        <Button
                            variant="ghost"
                            onPress={onCancel}
                            className="mt-2 text-muted-foreground text-xs data-hovered:underline"
                        >
                            {t("common.cancel")}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onPress={onInstall}
                            isDisabled={isInstalling}
                            className="w-full"
                        >
                            {isInstalling ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>
                                        {t("notificationSetup.pwa.installing")}
                                    </span>
                                </>
                            ) : (
                                t("notificationSetup.pwa.installButton")
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            onPress={onSkip}
                            isDisabled={isInstalling}
                            className="w-full"
                        >
                            {t("common.skip")}
                        </Button>

                        <Button
                            variant="ghost"
                            onPress={onCancel}
                            isDisabled={isInstalling}
                            className="mt-2 text-muted-foreground text-xs data-hovered:underline"
                        >
                            {t("common.cancel")}
                        </Button>
                    </>
                )}
            </DialogFooter>
        </>
    );
}
