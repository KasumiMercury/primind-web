import { Form, useActionData } from "react-router";
import { Button } from "~/components/ui/button";

export default function LoginSelector() {
    const actionData = useActionData<{ error?: string }>();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h1 className="font-bold text-3xl tracking-tight">
                        Sign In
                    </h1>
                </div>

                <Form method="post">
                    <input type="hidden" name="provider" value="google" />
                    <Button type="submit" className="w-full" size="lg">
                        Sign in with Google
                    </Button>
                </Form>
            </div>

            {actionData?.error && (
                <div className="-translate-x-1/2 fixed bottom-4 left-1/2 transform rounded bg-red-500 px-4 py-2 text-white">
                    {actionData.error}
                </div>
            )}
        </div>
    );
}
