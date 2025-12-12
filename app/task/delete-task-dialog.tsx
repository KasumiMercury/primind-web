import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this task?
                    </DialogDescription>
                </DialogHeader>
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-red-600 text-sm dark:bg-red-950 dark:text-red-400">
                        Failed to delete this task. Please try again.
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
