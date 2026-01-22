import { Download, Loader2, Share, SquarePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import type { Platform } from "../lib/pwa-detection";

export interface PwaInstallDialogContentProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    platform: Platform;
    isInstalling: boolean;
    onInstall: () => void;
    onInstalled: () => void;
    onSkip: () => void;
    onDontAskAgain: () => void;
}

export function PwaInstallDialogContent({
    isOpen,
    onOpenChange,
    platform,
    isInstalling,
    onInstall,
    onInstalled,
    onSkip,
    onDontAskAgain,
}: PwaInstallDialogContentProps) {
    const { t } = useTranslation();

    const isIOS = platform === "ios";
    const isRequired = isIOS;

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={!isRequired && !isInstalling}
            showCloseButton={!isRequired && !isInstalling}
            className="sm:max-w-md"
        >
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Download className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center">
                    {t("pwaInstall.title")}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {isRequired
                        ? t("pwaInstall.descriptionRequired")
                        : t("pwaInstall.descriptionRecommended")}
                </DialogDescription>
            </DialogHeader>

            {isIOS && (
                <div className="mt-4 space-y-3 rounded-lg bg-muted/50 p-4">
                    <p className="font-medium text-sm">
                        {t("pwaInstall.iosInstructions.title")}
                    </p>
                    <ol className="space-y-2 text-muted-foreground text-sm">
                        <li className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                                1
                            </span>
                            <Share className="h-4 w-4 shrink-0" />
                            <span>{t("pwaInstall.iosInstructions.step1")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                                2
                            </span>
                            <SquarePlus className="h-4 w-4 shrink-0" />
                            <span>{t("pwaInstall.iosInstructions.step2")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                                3
                            </span>
                            <span className="ml-6">
                                {t("pwaInstall.iosInstructions.step3")}
                            </span>
                        </li>
                    </ol>
                </div>
            )}

            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                {isIOS ? (
                    <Button onPress={onInstalled} className="w-full">
                        {t("pwaInstall.iosInstalled")}
                    </Button>
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
                                    <span>{t("pwaInstall.installing")}</span>
                                </>
                            ) : (
                                t("pwaInstall.installButton")
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            onPress={onSkip}
                            isDisabled={isInstalling}
                            className="w-full"
                        >
                            {t("common.notNow")}
                        </Button>

                        <Button
                            variant="ghost"
                            type="button"
                            onPress={onDontAskAgain}
                            isDisabled={isInstalling}
                            className="mt-2 text-muted-foreground text-xs data-hovered:underline"
                        >
                            {t("common.dontAskAgain")}
                        </Button>
                    </>
                )}
            </DialogFooter>
        </DialogContent>
    );
}
