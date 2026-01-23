import type { Ref } from "react";
import { Input as AriaInput, type InputProps } from "react-aria-components";

import { cn } from "~/lib/utils";

interface InputPropsWithRef extends InputProps {
    ref?: Ref<HTMLInputElement>;
}

function Input({ className, ref, ...props }: InputPropsWithRef) {
    return (
        <AriaInput
            ref={ref}
            data-slot="input"
            className={cn(
                "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground md:text-sm dark:bg-input/30",
                "data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50",
                "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
                "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
