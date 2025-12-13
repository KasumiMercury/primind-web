import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "~/store/auth";
import { LoginButton } from "./login-button";
import { UserMenu } from "./user-menu";

interface HeaderProps {
    onLoginClick: () => void;
    onLogout: () => void;
}

export function Header({ onLoginClick, onLogout }: HeaderProps) {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);

    return (
        <header className="w-full max-w-4xl">
            <div className="flex w-full items-center justify-end">
                {isAuthenticated ? (
                    <UserMenu onLogout={onLogout} />
                ) : (
                    <LoginButton onPress={onLoginClick} />
                )}
            </div>
        </header>
    );
}
