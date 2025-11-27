import { LoginForm } from "~/auth/login-form";

interface LoginPageContentProps {
    title?: string;
    action?: string;
    children?: React.ReactNode;
}

export function LoginPageContent({
    title = "Sign In",
    action,
    children,
}: LoginPageContentProps) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h2 className="font-bold text-2xl tracking-tight">
                        {title}
                    </h2>
                </div>

                {children || <LoginForm action={action} />}
            </div>
        </div>
    );
}
