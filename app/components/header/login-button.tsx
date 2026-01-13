import { LogIn } from "lucide-react";
import { Button } from "react-aria-components";
import { useTranslation } from "react-i18next";

interface LoginButtonProps {
    onPress: () => void;
}

export function LoginButton({ onPress }: LoginButtonProps) {
    const { t } = useTranslation();

    return (
        <Button
            onPress={onPress}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary p-2 text-primary-foreground ring-2 ring-primary data-hovered:bg-background data-hovered:text-primary data-focus-visible:outline-none data-focus-visible:ring-2 data-hovered:ring-primary sm:p-2"
            aria-label={t("auth.login")}
        >
            <LogIn className="size-4" />
        </Button>
    );
}
