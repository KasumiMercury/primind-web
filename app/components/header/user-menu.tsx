import { User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="inline-flex cursor-pointer items-center rounded-full bg-background p-3 text-primary text-sm ring-2 ring-secondary hover:bg-background hover:text-primary hover:ring-primary focus:outline-none focus:ring-2"
                    type="button"
                >
                    <User className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
