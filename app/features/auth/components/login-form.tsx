import { useActionData, useNavigation, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import type { UIProviderConfig } from "../oidc/providers";
import { uiProviders } from "../oidc/providers";

const DEFAULT_LOGIN_ACTION = "/login";

interface LoginFormContentProps {
    providers?: UIProviderConfig[];
    action?: string;
    error?: string;
    isSubmitting?: boolean;
    onSubmit?: (providerId: string) => void;
}

export function LoginFormContent({
    providers = uiProviders,
    action = DEFAULT_LOGIN_ACTION,
    error,
    isSubmitting = false,
    onSubmit,
}: LoginFormContentProps) {
    const handleProviderSubmit = (providerId: string) => {
        onSubmit?.(providerId);
    };

    return (
        <div className="space-y-6 py-4" data-action={action}>
            <div className="space-y-3">
                {providers.map((provider) => (
                    <Button
                        key={provider.id}
                        type="button"
                        onPress={() => handleProviderSubmit(provider.id)}
                        className="w-full"
                        size="lg"
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Signing in..."
                            : `Sign in with ${provider.displayName}`}
                    </Button>
                ))}
            </div>

            {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-destructive text-sm">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

interface LoginFormProps {
    action?: string;
    providers?: UIProviderConfig[];
}

export function LoginForm({
    action = DEFAULT_LOGIN_ACTION,
    providers = uiProviders,
}: LoginFormProps) {
    const submit = useSubmit();
    const actionData = useActionData<{ error?: string }>();
    const navigation = useNavigation();
    const handleProviderSubmit = (providerId: string) => {
        const formData = new FormData();
        formData.append("provider", providerId);

        submit(formData, {
            method: "post",
            action,
        });
    };

    return (
        <LoginFormContent
            providers={providers}
            action={action}
            error={actionData?.error}
            isSubmitting={navigation.state === "submitting"}
            onSubmit={handleProviderSubmit}
        />
    );
}
