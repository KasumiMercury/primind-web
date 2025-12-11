import { LoginButton } from "./login-button";
import { UserMenu } from "./user-menu";

interface HeaderProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
}

export function Header({ isAuthenticated, onLoginClick }: HeaderProps) {
    return (
        <header className="w-full max-w-4xl">
            <div className="flex w-full items-center justify-end">
                {isAuthenticated ? (
                    <UserMenu />
                ) : (
                    <LoginButton onClick={onLoginClick} />
                )}
            </div>
        </header>
    );
}
