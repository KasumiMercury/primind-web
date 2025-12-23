import { Check, Monitor, Moon, Palette, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSubmenuTrigger,
    DropdownMenuTrigger,
    DropdownSubmenu,
} from "~/components/ui/dropdown-menu";

interface UserMenuProps {
    onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
    const { theme, setTheme } = useTheme();

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
                        <Palette />
                        Theme
                    </DropdownMenuItem>
                    <DropdownSubmenu className="outline-none">
                        <DropdownMenuItem onSelect={() => setTheme("light")}>
                            <Sun />
                            Light
                            {theme === "light" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTheme("dark")}>
                            <Moon />
                            Dark
                            {theme === "dark" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setTheme("system")}>
                            <Monitor />
                            System
                            {theme === "system" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                    </DropdownSubmenu>
                </DropdownMenuSubmenuTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
