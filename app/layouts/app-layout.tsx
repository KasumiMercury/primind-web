import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import { LoginDialog } from "~/auth/login-dialog";
import { getUserSession } from "~/auth/session.server";
import { Header } from "~/components/header/header";
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

    const authState: AuthState = {
        isAuthenticated,
        user: null,
    };

    const contextValue: AppLayoutContext = {
        isAuthenticated,
    };

    return (
        <Provider>
            <AuthHydrator authState={authState}>
                <main className="flex items-center justify-center pt-8">
                    <div className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4">
                        <Header onLoginClick={() => setShowLoginDialog(true)} />
                        <Outlet context={contextValue} />
                    </div>
                </main>

                <LoginDialog
                    open={showLoginDialog}
                    onOpenChange={(open) => !open && setShowLoginDialog(false)}
                />
            </AuthHydrator>
        </Provider>
    );
}

export function useAppLayoutContext() {
    return useOutletContext<AppLayoutContext>();
}
