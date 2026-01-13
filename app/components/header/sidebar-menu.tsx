import { useAtomValue } from "jotai";
import {
    Check,
    Globe,
    LogOut,
    Monitor,
    Moon,
    Palette,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { SheetBody, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { useLanguage } from "~/hooks/use-language";
import { cn } from "~/lib/utils";
import { isAuthenticatedAtom } from "~/store/auth";

interface SidebarMenuProps {
    onLogout: () => void;
}

function MenuSection({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sidebar-foreground text-sm">
                <Icon className="h-4 w-4" />
                {title}
            </div>
            <div className="flex flex-col gap-1">{children}</div>
        </div>
    );
}

function MenuOption({
    selected,
    onPress,
    children,
}: {
    selected: boolean;
    onPress: () => void;
    children: React.ReactNode;
}) {
    return (
        <Button
            onPress={onPress}
            className={cn(
                "inline-flex w-full items-center justify-between gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-sidebar-ring",
                selected
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-accent-foreground data-hovered:bg-sidebar-primary/20",
            )}
        >
            <span className="flex items-center gap-1.5">{children}</span>
            {selected && <Check className="h-3.5 w-3.5" />}
        </Button>
    );
}

export function SidebarMenu({ onLogout }: SidebarMenuProps) {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);

    return (
        <>
            <SheetHeader>
                <SheetTitle>{t("menu.title")}</SheetTitle>
            </SheetHeader>
            <SheetBody className="space-y-6">
                {/* Language Section */}
                <MenuSection icon={Globe} title={t("language.title")}>
                    <MenuOption
                        selected={language === "en"}
                        onPress={() => setLanguage("en")}
                    >
                        English
                    </MenuOption>
                    <MenuOption
                        selected={language === "ja"}
                        onPress={() => setLanguage("ja")}
                    >
                        日本語
                    </MenuOption>
                </MenuSection>

                {/* Theme Section */}
                <MenuSection icon={Palette} title={t("theme.title")}>
                    <MenuOption
                        selected={theme === "light"}
                        onPress={() => setTheme("light")}
                    >
                        <Sun className="h-4 w-4" />
                        {t("theme.light")}
                    </MenuOption>
                    <MenuOption
                        selected={theme === "dark"}
                        onPress={() => setTheme("dark")}
                    >
                        <Moon className="h-4 w-4" />
                        {t("theme.dark")}
                    </MenuOption>
                    <MenuOption
                        selected={theme === "system"}
                        onPress={() => setTheme("system")}
                    >
                        <Monitor className="h-4 w-4" />
                        {t("theme.system")}
                    </MenuOption>
                </MenuSection>

                {/* Logout Section - Only show when authenticated */}
                {isAuthenticated && (
                    <>
                        <div className="border-sidebar-border border-t" />
                        <Button
                            onPress={onLogout}
                            className={cn(
                                "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors",
                                "bg-sidebar-accent text-sidebar-accent-foreground",
                                "data-hovered:bg-destructive data-hovered:text-destructive-foreground",
                                "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-sidebar-ring",
                            )}
                        >
                            <LogOut className="h-4 w-4" />
                            {t("auth.logout")}
                        </Button>
                    </>
                )}
            </SheetBody>
        </>
    );
}
