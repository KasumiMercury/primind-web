import { Form, useActionData, useNavigation } from "react-router";
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
            <div className="text-center">
                <h2 className="font-bold text-2xl tracking-tight">Sign In</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                    Sign in with your Google account to continue
                </p>
            </div>

            <Form method="post" action={action}>
                <input type="hidden" name="provider" value="google" />
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Signing in..." : "Sign in with Google"}
                </Button>
            </Form>

            {actionData?.error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-destructive text-sm">
                    <p className="font-medium">Error</p>
                    <p>{actionData.error}</p>
                </div>
            )}
        </div>
    );
}
