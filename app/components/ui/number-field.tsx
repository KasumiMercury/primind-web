import { ChevronDown, ChevronUp } from "lucide-react";
import {
    NumberField as AriaNumberField,
    type NumberFieldProps as AriaNumberFieldProps,
    Button,
    Group,
    Input,
} from "react-aria-components";

import { cn } from "~/lib/utils";

interface NumberFieldProps extends AriaNumberFieldProps {
    className?: string;
    inputClassName?: string;
}

function NumberField({
    className,
    inputClassName,
    ...props
}: NumberFieldProps) {
    return (
        <AriaNumberField
            data-slot="number-field"
            className={cn("flex flex-col gap-1", className)}
            {...props}
        >
            <Group
                className={cn(
                    "relative flex h-9 items-center rounded-md border border-input bg-transparent shadow-xs dark:bg-input/30",
                    "data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50",
                    "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
                    "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
                )}
            >
                <Input
                    className={cn(
                        "w-10 bg-transparent px-1 py-1 text-center text-base outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm",
                        inputClassName,
                    )}
                />
                <div className="flex flex-col border-input border-l">
                    <Button
                        slot="increment"
                        className={cn(
                            "flex h-4 w-5 items-center justify-center border-input border-b transition-colors",
                            "data-hovered:bg-muted data-pressed:bg-muted/80",
                            "data-focus-visible:bg-muted data-focus-visible:outline-none",
                            "data-disabled:pointer-events-none data-disabled:opacity-50",
                        )}
                    >
                        <ChevronUp className="size-3" />
                    </Button>
                    <Button
                        slot="decrement"
                        className={cn(
                            "flex h-4 w-5 items-center justify-center transition-colors",
                            "data-hovered:bg-muted data-pressed:bg-muted/80",
                            "data-focus-visible:bg-muted data-focus-visible:outline-none",
                            "data-disabled:pointer-events-none data-disabled:opacity-50",
                        )}
                    >
                        <ChevronDown className="size-3" />
                    </Button>
                </div>
            </Group>
        </AriaNumberField>
    );
}

export { NumberField };
