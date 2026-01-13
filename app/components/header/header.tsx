import { useAtomValue } from "jotai";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { isAuthenticatedAtom } from "~/store/auth";
import { LoginButton } from "./login-button";
import logo from "./logo.svg";
import { MenuButton } from "./menu-button";
import { SidebarMenu } from "./sidebar-menu";

interface HeaderProps {
    onLoginClick: () => void;
    onLogout: () => void;
}

export function Header({ onLoginClick, onLogout }: HeaderProps) {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);

    return (
        <header className="w-full border-border border-b">
            <div className="grid grid-cols-3 items-center px-4 py-3">
                {/* Logo */}
                <div className="flex items-center justify-start">
                    <img
                        src={logo}
                        className="h-auto max-h-5 w-auto max-w-full sm:max-h-7"
                        aria-hidden="true"
                        alt="logo"
                    />
                </div>

                <div />

                {/* User actions */}
                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                    {!isAuthenticated && <LoginButton onPress={onLoginClick} />}
                    <Sheet>
                        <MenuButton />
                        <SheetContent>
                            <SidebarMenu onLogout={onLogout} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
