import {
    FieldError as AriaFieldError,
    Label as AriaLabel,
    TextField as AriaTextField,
    type TextFieldProps as AriaTextFieldProps,
    type FieldErrorProps,
    type LabelProps,
    Text,
    type TextProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";

function TextField({ className, ...props }: AriaTextFieldProps) {
    return (
        <AriaTextField
            data-slot="text-field"
            className={cn("flex flex-col gap-1.5", className)}
            {...props}
        />
    );
}

function Label({ className, ...props }: LabelProps) {
    return (
        <AriaLabel
            data-slot="label"
            className={cn(
                "font-medium text-foreground text-sm",
                "data-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

function Description({ className, ...props }: TextProps) {
    return (
        <Text
            slot="description"
            data-slot="description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

function FieldError({ className, ...props }: FieldErrorProps) {
    return (
        <AriaFieldError
            data-slot="field-error"
            className={cn("text-destructive text-sm", className)}
            {...props}
        />
    );
}

export { TextField, Label, Description, FieldError };
