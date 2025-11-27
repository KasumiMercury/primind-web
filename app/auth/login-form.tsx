import { Form, useActionData, useNavigation } from "react-router";
import { uiProviders } from "~/auth/oidc/providers";
import { Button } from "~/components/ui/button";

interface LoginFormProps {
    action?: string;
}

export function LoginForm({ action = "/login" }: LoginFormProps) {
    const actionData = useActionData<{ error?: string }>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {uiProviders.map((provider) => (
                    <Form key={provider.id} method="post" action={action}>
                        <input
                            type="hidden"
                            name="provider"
                            value={provider.id}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Signing in..."
                                : `Sign in with ${provider.displayName}`}
                        </Button>
                    </Form>
                ))}
            </div>

            {actionData?.error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-destructive text-sm">
                    <p className="font-medium">Error</p>
                    <p>{actionData.error}</p>
                </div>
            )}
        </div>
    );
}
