import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

export interface SessionInvalidDialogContentProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onGoHome: () => void;
    isPending?: boolean;
}

export function SessionInvalidDialogContent({
    isOpen,
    onOpenChange,
    onGoHome,
    isPending,
}: SessionInvalidDialogContentProps) {
    const { t } = useTranslation();

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            showCloseButton={false}
            className="sm:max-w-md"
        >
            <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <LogOut className="h-6 w-6 text-muted-foreground" />
                </div>
                <DialogTitle className="text-center">
                    {t("session.invalid.title")}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {t("session.invalid.description")}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
                <Button
                    onPress={onGoHome}
                    className="w-full"
                    isPending={isPending}
                    isDisabled={isPending}
                >
                    {t("session.invalid.goHome")}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
