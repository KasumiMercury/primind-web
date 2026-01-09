import { LinkButton } from "~/components/ui/link-button";

export type CallbackState = "loading" | "success" | "error";

export interface CallbackError {
    type: "missing_parameters" | "invalid_state" | "authentication_failed";
    message: string;
}

interface CallbackStatusProps {
    provider: string;
    state: CallbackState;
    error?: CallbackError;
}

export function CallbackStatus({
    provider,
    state,
    error,
}: CallbackStatusProps) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-md px-4 text-center">
                {state === "loading" && (
                    <>
                        <h1 className="font-semibold text-2xl">
                            Processing login...
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Please wait while we complete your {provider} login.
                        </p>
                    </>
                )}

                {state === "error" && error && (
                    <>
                        <h1 className="font-semibold text-2xl text-destructive">
                            Authentication Failed
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {error.message}
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <LinkButton href="/login">Back to Login</LinkButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
