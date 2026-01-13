import { Settings } from "lucide-react";
import { Button } from "react-aria-components";
import { useTranslation } from "react-i18next";

export function MenuButton() {
    const { t } = useTranslation();

    return (
        <Button className="inline-flex shrink-0 cursor-pointer flex-col items-center gap-0.5 whitespace-nowrap rounded-md bg-background px-1.5 py-1 text-foreground text-xs data-hovered:bg-primary data-hovered:text-primary-foreground data-focus-visible:outline-none data-focus-visible:ring-2 data-hovered:ring-primary sm:flex-row sm:gap-1 sm:px-3 sm:py-2 sm:text-sm">
            <Settings className="size-3 sm:size-4" />
            {t("menu.title")}
        </Button>
    );
}
