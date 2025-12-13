import type * as React from "react";
import {
    MenuItem as AriaMenuItem,
    type MenuItemProps as AriaMenuItemProps,
    Button,
    Menu,
    type MenuProps,
    MenuTrigger,
    type MenuTriggerProps,
    Popover,
    type PopoverProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";

interface DropdownMenuProps extends MenuTriggerProps {
    children: React.ReactNode;
}

function DropdownMenu({ children, ...props }: DropdownMenuProps) {
    return (
        <MenuTrigger data-slot="dropdown-menu" {...props}>
            {children}
        </MenuTrigger>
    );
}

interface DropdownMenuTriggerProps {
    className?: string;
    children: React.ReactNode;
}

function DropdownMenuTrigger({
    className,
    children,
}: DropdownMenuTriggerProps) {
    return (
        <Button
            data-slot="dropdown-menu-trigger"
            className={cn("outline-none", className)}
        >
            {children}
        </Button>
    );
}

type Placement =
    | "bottom"
    | "bottom left"
    | "bottom right"
    | "bottom start"
    | "bottom end"
    | "top"
    | "top left"
    | "top right"
    | "top start"
    | "top end"
    | "left"
    | "left top"
    | "left bottom"
    | "start"
    | "start top"
    | "start bottom"
    | "right"
    | "right top"
    | "right bottom"
    | "end"
    | "end top"
    | "end bottom";

interface DropdownMenuContentProps
    extends Omit<PopoverProps, "children" | "placement">,
        Pick<MenuProps<object>, "onAction"> {
    className?: string;
    align?: "start" | "center" | "end";
    children: React.ReactNode;
}

function DropdownMenuContent({
    className,
    align = "start",
    children,
    onAction,
    ...props
}: DropdownMenuContentProps) {
    const placement: Placement =
        align === "end"
            ? "bottom end"
            : align === "center"
              ? "bottom"
              : "bottom start";

    return (
        <Popover
            data-slot="dropdown-menu-content"
            placement={placement}
            offset={4}
            className={cn(
                "z-50 min-w-32 overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                "data-entering:fade-in-0 data-entering:zoom-in-95 data-entering:animate-in",
                "data-exiting:fade-out-0 data-exiting:zoom-out-95 data-exiting:animate-out",
                className,
            )}
            {...props}
        >
            <Menu className="outline-none" onAction={onAction}>
                {children}
            </Menu>
        </Popover>
    );
}

interface DropdownMenuItemProps extends AriaMenuItemProps {
    className?: string;
    onSelect?: () => void;
}

function DropdownMenuItem({
    className,
    onSelect,
    ...props
}: DropdownMenuItemProps) {
    return (
        <AriaMenuItem
            data-slot="dropdown-menu-item"
            onAction={onSelect}
            className={cn(
                "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden",
                "data-focused:bg-accent data-focused:text-accent-foreground",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
};
