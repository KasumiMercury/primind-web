import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

interface DeleteTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    error?: boolean;
    isDeleting?: boolean;
}

export function DeleteTaskDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    error,
    isDeleting,
}: DeleteTaskDialogProps) {
    const { t } = useTranslation();

    return (
        <DialogContent
            isOpen={open}
            onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen);
                if (!nextOpen) onCancel();
            }}
            showCloseButton={false}
        >
            <DialogHeader>
                <DialogTitle>{t("deleteTask.title")}</DialogTitle>
                <DialogDescription>
                    {t("deleteTask.description")}
                </DialogDescription>
            </DialogHeader>
            {error && (
                <div className="rounded-md bg-red-50 p-3 text-red-600 text-sm dark:bg-red-950 dark:text-red-400">
                    {t("deleteTask.error")}
                </div>
            )}
            <DialogFooter>
                <Button
                    variant="outline"
                    onPress={onCancel}
                    isDisabled={isDeleting}
                >
                    {t("common.cancel")}
                </Button>
                <Button
                    variant="destructive"
                    onPress={onConfirm}
                    isDisabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>{t("common.deleting")}</span>
                        </>
                    ) : (
                        t("common.delete")
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
