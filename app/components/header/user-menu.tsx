import { Check, Globe, Monitor, Moon, Palette, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSubmenuTrigger,
    DropdownMenuTrigger,
    DropdownSubmenu,
} from "~/components/ui/dropdown-menu";
import { useLanguage } from "~/hooks/use-language";

interface UserMenuProps {
    onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="inline-flex cursor-pointer items-center rounded-full bg-background p-3 text-primary text-sm ring-2 ring-secondary data-hovered:bg-background data-hovered:text-primary data-focus-visible:ring-2 data-hovered:ring-primary"
                aria-label="User menu"
            >
                <User className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuSubmenuTrigger>
                    <DropdownMenuItem>
                        <Globe />
                        {t("language.title")}
                    </DropdownMenuItem>
                    <DropdownSubmenu className="outline-none">
                        <DropdownMenuItem onSelect={() => setLanguage("en")}>
                            English
                            {language === "en" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setLanguage("ja")}>
                            日本語
                            {language === "ja" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                    </DropdownSubmenu>
                </DropdownMenuSubmenuTrigger>
                <DropdownMenuSubmenuTrigger>
                    <DropdownMenuItem>
                        <Palette />
                        {t("theme.title")}
                    </DropdownMenuItem>
                    <DropdownSubmenu className="outline-none">
                        <DropdownMenuItem onSelect={() => setTheme("light")}>
                            <Sun />
                            {t("theme.light")}
                            {theme === "light" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTheme("dark")}>
                            <Moon />
                            {t("theme.dark")}
                            {theme === "dark" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTheme("system")}>
                            <Monitor />
                            {t("theme.system")}
                            {theme === "system" && (
                                <Check className="ml-auto" />
                            )}
                        </DropdownMenuItem>
                    </DropdownSubmenu>
                </DropdownMenuSubmenuTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onLogout}>
                    {t("auth.logout")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
