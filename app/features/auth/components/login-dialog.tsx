import {
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
    children?: React.ReactNode;
}

export function LoginDialog({
    open,
    onOpenChange,
    action = "/login",
    children,
}: LoginDialogProps) {
    return (
        <DialogContent
            isOpen={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-md"
        >
            <DialogHeader>
                <DialogTitle>Sign in</DialogTitle>
            </DialogHeader>
            <DialogDescription className="sr-only">
                Sign in to your account.
            </DialogDescription>
            {children || <LoginForm action={action} />}
        </DialogContent>
    );
}
