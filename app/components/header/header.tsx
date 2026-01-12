import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "~/store/auth";
import { LoginButton } from "./login-button";
import logo from "./logo.svg";
import { UserMenu } from "./user-menu";

interface HeaderProps {
    onLoginClick: () => void;
    onLogout: () => void;
}

export function Header({ onLoginClick, onLogout }: HeaderProps) {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);

    return (
        <header className="w-full border-border border-b">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                {/* Logo */}
                <div className="flex items-center">
                    <img
                        src={logo}
                        className="aspect-auto h-6"
                        aria-hidden="true"
                        alt="logo"
                    />
                </div>

                {/* User actions */}
                <div className="flex items-center">
                    {isAuthenticated ? (
                        <UserMenu onLogout={onLogout} />
                    ) : (
                        <LoginButton onPress={onLoginClick} />
                    )}
                </div>
            </div>
        </header>
    );
}
