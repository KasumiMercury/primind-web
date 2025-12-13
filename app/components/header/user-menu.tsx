import { User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface UserMenuProps {
    onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="inline-flex cursor-pointer items-center rounded-full bg-background p-3 text-primary text-sm ring-2 ring-secondary data-hovered:bg-background data-hovered:text-primary data-focus-visible:ring-2 data-hovered:ring-primary"
                aria-label="User menu"
            >
                <User className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onSelect={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
