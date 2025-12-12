import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { LoginForm } from "./login-form";

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action?: string;
    modal?: boolean;
    withOverlay?: boolean;
    inline?: boolean;
    children?: React.ReactNode;
}

export function LoginDialog({
    open,
    onOpenChange,
    action = "/login",
    modal = true,
    children,
}: LoginDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sign in</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Sign in to your account.
                </DialogDescription>
                {children || <LoginForm action={action} />}
            </DialogContent>
        </Dialog>
    );
}
