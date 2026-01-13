import { Settings } from "lucide-react";
import { Button } from "react-aria-components";
import { useTranslation } from "react-i18next";

export function MenuButton() {
    const { t } = useTranslation();

    return (
        <Button className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-background px-3 py-2 text-foreground text-sm ring-2 ring-primary data-hovered:bg-primary data-hovered:text-primary-foreground data-focus-visible:outline-none data-focus-visible:ring-2 data-hovered:ring-primary">
            <Settings className="h-4 w-4" />
            {t("menu.title")}
        </Button>
    );
}
