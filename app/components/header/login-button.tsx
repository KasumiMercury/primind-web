import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";

interface LoginButtonProps {
    onPress: () => void;
}

export function LoginButton({ onPress }: LoginButtonProps) {
    const { t } = useTranslation();

    return (
        <Button
            size="icon"
            onPress={onPress}
            className="rounded-md bg-primary p-2 text-primary-foreground text-sm ring-2 ring-primary data-hovered:bg-background data-hovered:text-primary data-focus-visible:outline-none data-focus-visible:ring-2 data-hovered:ring-primary"
            type="button"
            aria-label={t("auth.login")}
        >
            <LogIn className="h-4 w-4" />
        </Button>
    );
}
