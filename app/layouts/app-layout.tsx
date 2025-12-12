import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useState } from "react";
import { Outlet, useOutletContext, useSubmit } from "react-router";
import { Header } from "~/components/header/header";
import { LoginDialog } from "~/features/auth/components/login-dialog";
import { getUserSession } from "~/features/auth/server/session.server";
import { type AuthState, authStateAtom } from "~/store/auth";
import type { Route } from "./+types/app-layout";

export async function loader({ request }: Route.LoaderArgs) {
    const { sessionToken } = await getUserSession(request);
    return {
        isAuthenticated: Boolean(sessionToken),
    };
}

export interface AppLayoutContext {
    isAuthenticated: boolean;
    openLoginDialog: () => void;
}

function AuthHydrator({
    authState,
    children,
}: {
    authState: AuthState;
    children: React.ReactNode;
}) {
    useHydrateAtoms([[authStateAtom, authState]], {
        dangerouslyForceHydrate: true,
    });
    return <>{children}</>;
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
    const { isAuthenticated } = loaderData;
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const submit = useSubmit();

    const handleLogout = () => {
        submit(null, { method: "post", action: "/api/logout" });
    };

    const authState: AuthState = {
        isAuthenticated,
        user: null,
    };

    const contextValue: AppLayoutContext = {
        isAuthenticated,
        openLoginDialog: () => setShowLoginDialog(true),
    };

    return (
        <Provider>
            <AuthHydrator authState={authState}>
                <main className="flex items-center justify-center pt-8">
                    <div className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4">
                        <Header
                            onLoginClick={() => setShowLoginDialog(true)}
                            onLogout={handleLogout}
                        />
                        <Outlet context={contextValue} />
                    </div>
                </main>

                <LoginDialog
                    open={showLoginDialog}
                    onOpenChange={setShowLoginDialog}
                />
            </AuthHydrator>
        </Provider>
    );
}

export function useAppLayoutContext() {
    return useOutletContext<AppLayoutContext>();
}
