import { LoginForm } from "~/auth/login-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action?: string;
}

export function LoginDialog({
    open,
    onOpenChange,
    action = "/login",
}: LoginDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sign in</DialogTitle>
                </DialogHeader>
                <LoginForm action={action} />
            </DialogContent>
        </Dialog>
    );
}
