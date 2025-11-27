import { LoginForm } from "~/auth/login-form";

export default function LoginPageContent() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h2 className="font-bold text-2xl tracking-tight">
                        Sign In
                    </h2>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
