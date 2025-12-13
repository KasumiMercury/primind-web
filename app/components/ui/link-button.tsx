import type { VariantProps } from "class-variance-authority";
import { Link, type LinkProps } from "react-aria-components";

import { cn } from "~/lib/utils";
import { buttonVariants } from "./button";

interface LinkButtonProps
    extends LinkProps,
        VariantProps<typeof buttonVariants> {}

function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
    return (
        <Link
            data-slot="link-button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { LinkButton };
