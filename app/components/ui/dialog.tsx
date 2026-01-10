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

import { cn } from "~/lib/utils";

interface DialogProps extends Omit<DialogTriggerProps, "children"> {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function Dialog({ open, onOpenChange, children, ...props }: DialogProps) {
    return (
        <AriaDialogTrigger
            data-slot="dialog"
            isOpen={open}
            onOpenChange={onOpenChange}
            {...props}
        >
            {children}
        </AriaDialogTrigger>
    );
}

interface DialogContentProps {
    className?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    isDismissable?: boolean;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    isDismissable = true,
    isOpen,
    onOpenChange,
}: DialogContentProps) {
    return (
        <ModalOverlay
            data-slot="dialog-overlay"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={isDismissable}
            className={cn(
                "fixed inset-0 z-50 backdrop-blur-xs",
                "data-entering:fade-in-0 data-entering:animate-in",
                "data-exiting:fade-out-0 data-exiting:animate-out",
            )}
        >
            <Modal
                data-slot="dialog-content"
                className={cn(
                    "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 sm:max-w-lg",
                    "data-entering:fade-in-0 data-entering:zoom-in-95 data-entering:animate-in",
                    "data-exiting:fade-out-0 data-exiting:zoom-out-95 data-exiting:animate-out",
                    className,
                )}
            >
                <AriaDialog className="outline-none">
                    {({ close }) => (
                        <>
                            {children}
                            {showCloseButton && (
                                <Button
                                    onPress={close}
                                    data-slot="dialog-close"
                                    className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity data-hovered:opacity-100 data-focus-visible:outline-hidden data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                                >
                                    <XIcon />
                                    <span className="sr-only">Close</span>
                                </Button>
                            )}
                        </>
                    )}
                </AriaDialog>
            </Modal>
        </ModalOverlay>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn(
                "flex flex-col gap-2 text-center sm:text-left",
                className,
            )}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

interface DialogTitleProps extends React.ComponentProps<typeof Heading> {
    className?: string;
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
    return (
        <Heading
            slot="title"
            data-slot="dialog-title"
            className={cn("font-semibold text-lg leading-none", className)}
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
};
