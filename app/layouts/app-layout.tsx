import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { data, Outlet, useOutletContext } from "react-router";
import { Header } from "~/components/header/header";
import { LoginDialog } from "~/features/auth/components/login-dialog";
import { SessionInvalidDialog } from "~/features/auth/components/session-invalid-dialog";
import {
    getUserSession,
    sessionStorage,
} from "~/features/auth/server/session.server";
import { validateSession } from "~/features/auth/server/validate-session.server";
import { NotificationPermissionDialog } from "~/features/device/components/notification-permission-dialog";
import { PwaInstallDialog } from "~/features/device/components/pwa-install-dialog";
import { useDeviceRegistration } from "~/features/device/hooks/use-device-registration";
import { usePwaInstall } from "~/features/device/hooks/use-pwa-install";
import { ERROR_CODES, showErrorToast } from "~/lib/errors";
import { orpc } from "~/orpc/client";
import { type AuthState, authStateAtom } from "~/store/auth";
import type { Route } from "./+types/app-layout";

function PwaInstallInit() {
    usePwaInstall();
    return null;
}

function DeviceRegistration() {
    useDeviceRegistration();
    return null;
}

export async function loader({ request }: Route.LoaderArgs) {
    const { sessionToken, getSession } = await getUserSession(request);

    if (!sessionToken) {
        return { isAuthenticated: false };
    }

    const validation = await validateSession(request);

    if (!validation.isValid) {
        // clear cookie
        const session = getSession();
        const headers = new Headers();
        headers.set("Set-Cookie", await sessionStorage.destroySession(session));
        return data({ isAuthenticated: false }, { headers });
    }

    return { isAuthenticated: true };
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
    const { t } = useTranslation();
    const { isAuthenticated } = loaderData;
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleLogout = async () => {
        try {
            const result = await orpc.auth.logout();
            if (result.success) {
                window.location.href = "/";
            } else {
                console.error(
                    "Logout failed: server returned unsuccessful response",
                );
                showErrorToast(t, ERROR_CODES.AUTH_LOGOUT_FAILED);
            }
        } catch (error) {
            console.error("Logout error:", error);
            showErrorToast(t, ERROR_CODES.AUTH_LOGOUT_FAILED);
        }
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
                <PwaInstallInit />
                <DeviceRegistration />
                <Header
                    onLoginClick={() => setShowLoginDialog(true)}
                    onLogout={handleLogout}
                />
                <main className="flex items-center justify-center pt-6">
                    <div className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4 sm:px-6">
                        <Outlet context={contextValue} />
                    </div>
                </main>

                <LoginDialog
                    open={showLoginDialog}
                    onOpenChange={setShowLoginDialog}
                />
                <PwaInstallDialog />
                <NotificationPermissionDialog />
                <SessionInvalidDialog />
            </AuthHydrator>
        </Provider>
    );
}

export function useAppLayoutContext() {
    return useOutletContext<AppLayoutContext>();
}
