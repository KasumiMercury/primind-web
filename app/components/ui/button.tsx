import { cva, type VariantProps } from "class-variance-authority";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer rounded-md text-sm font-medium transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none data-[focus-visible]:border-ring data-[focus-visible]:ring-ring/50 data-[focus-visible]:ring-[3px] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-sm data-hovered:bg-primary/85 data-pressed:bg-primary/80",
                destructive:
                    "bg-destructive text-white data-hovered:bg-destructive/90 data-focus-visible:ring-destructive/20 dark:data-focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border-2 border-primary/80 bg-transparent text-foreground shadow-xs data-hovered:bg-primary/10 data-hovered:border-primary dark:data-hovered:bg-primary/20 dark:data-hovered:border-primary/60",
                "accent-outline":
                    "border-2 border-accent/80 bg-transparent text-foreground shadow-xs data-hovered:bg-accent/10 data-hovered:border-accent dark:data-hovered:bg-accent/20 dark:data-hovered:border-accent/60",
                ghost: "text-foreground data-hovered:bg-primary/10 dark:data-hovered:bg-primary/15",
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
