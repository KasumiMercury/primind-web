import { LogIn } from "lucide-react";

interface LoginButtonProps {
    onClick: () => void;
}

export function LoginButton({ onClick }: LoginButtonProps) {
    return (
        <button
            onClick={onClick}
            className="inline-flex cursor-pointer items-center rounded-full bg-primary p-3 text-primary-foreground text-sm ring-2 ring-secondary hover:bg-background hover:text-primary hover:ring-primary focus:outline-none focus:ring-2"
            type="button"
        >
            <LogIn className="h-5 w-5" />
        </button>
    );
}
