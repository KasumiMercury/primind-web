import { XIcon } from "lucide-react";
import type * as React from "react";
import {
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Button,
    type DialogTriggerProps,
    Heading,
    Modal,
    ModalOverlay,
} from "react-aria-components";
import { useTranslation } from "react-i18next";

import { cn } from "~/lib/utils";

interface SheetProps extends Omit<DialogTriggerProps, "children"> {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function Sheet({ open, onOpenChange, children, ...props }: SheetProps) {
    return (
        <AriaDialogTrigger
            data-slot="sheet"
            isOpen={open}
            onOpenChange={onOpenChange}
            {...props}
        >
            {children}
        </AriaDialogTrigger>
    );
}

/**
 * SheetContent supports two usage patterns:
 * 1. Within Sheet (DialogTrigger): State is managed by the parent Sheet component.
 *    Simply nest SheetContent inside Sheet without isOpen/onOpenChange props.
 * 2. Standalone controlled: Provide both isOpen and onOpenChange props for
 *    direct control without a Sheet wrapper.
 */
interface SheetContentProps {
    className?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    isDismissable?: boolean;
    /** For standalone controlled usage. When used inside Sheet, omit this. */
    isOpen?: boolean;
    /** For standalone controlled usage. When used inside Sheet, omit this. */
    onOpenChange?: (open: boolean) => void;
}

function SheetContent({
    className,
    children,
    showCloseButton = true,
    isDismissable = true,
    isOpen,
    onOpenChange,
}: SheetContentProps) {
    const { t } = useTranslation();

    // Only forward isOpen/onOpenChange when both are explicitly provided (standalone controlled mode).
    // Otherwise, let ModalOverlay inherit state from parent DialogTrigger (Sheet).
    const controlledProps =
        isOpen !== undefined && onOpenChange !== undefined
            ? { isOpen, onOpenChange }
            : {};

    return (
        <ModalOverlay
            data-slot="sheet-overlay"
            {...controlledProps}
            isDismissable={isDismissable}
            className={cn(
                "fixed inset-0 z-50 bg-black/50",
                "data-entering:fade-in-0 data-entering:animate-in",
                "data-exiting:fade-out-0 data-exiting:animate-out",
            )}
        >
            <Modal
                data-slot="sheet-content"
                className={cn(
                    "fixed inset-y-0 right-0 z-50 flex h-full w-80 flex-col border-sidebar-border border-l bg-sidebar shadow-lg duration-300",
                    "data-entering:slide-in-from-right data-entering:animate-in",
                    "data-exiting:slide-out-to-right data-exiting:animate-out",
                    className,
                )}
            >
                <AriaDialog className="flex h-full flex-col outline-none">
                    {({ close }) => (
                        <>
                            {children}
                            {showCloseButton && (
                                <Button
                                    onPress={close}
                                    data-slot="sheet-close"
                                    className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity data-hovered:bg-sidebar-accent data-hovered:opacity-100 data-focus-visible:outline-hidden data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                                >
                                    <XIcon className="size-6" />
                                    <span className="sr-only">
                                        {t("menu.close")}
                                    </span>
                                </Button>
                            )}
                        </>
                    )}
                </AriaDialog>
            </Modal>
        </ModalOverlay>
    );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sheet-header"
            className={cn(
                "flex flex-col gap-2 border-sidebar-border border-b px-6 py-4",
                className,
            )}
            {...props}
        />
    );
}

interface SheetTitleProps extends React.ComponentProps<typeof Heading> {
    className?: string;
}

function SheetTitle({ className, ...props }: SheetTitleProps) {
    return (
        <Heading
            slot="title"
            data-slot="sheet-title"
            className={cn(
                "font-semibold text-lg text-sidebar-foreground leading-none",
                className,
            )}
            {...props}
        />
    );
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sheet-body"
            className={cn("flex-1 overflow-y-auto px-6 py-4", className)}
            {...props}
        />
    );
}

export { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle };
