import { cva, type VariantProps } from "class-variance-authority";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none data-[focus-visible]:border-ring data-[focus-visible]:ring-ring/50 data-[focus-visible]:ring-[3px] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground data-hovered:bg-primary/90",
                destructive:
                    "bg-destructive text-white data-hovered:bg-destructive/90 data-focus-visible:ring-destructive/20 dark:data-focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background shadow-xs data-hovered:bg-accent data-hovered:text-accent-foreground dark:bg-input/30 dark:border-input dark:data-hovered:bg-input/50",
                ghost: "data-hovered:bg-accent data-hovered:text-accent-foreground dark:data-hovered:bg-accent/50",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

interface ButtonProps
    extends AriaButtonProps,
        VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
    return (
        <AriaButton
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
