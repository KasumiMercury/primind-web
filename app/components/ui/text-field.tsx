import {
	TextField as AriaTextField,
	Label as AriaLabel,
	Text,
	FieldError as AriaFieldError,
	type TextFieldProps as AriaTextFieldProps,
	type LabelProps,
	type TextProps,
	type FieldErrorProps,
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
				"text-sm font-medium text-foreground",
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
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function FieldError({ className, ...props }: FieldErrorProps) {
	return (
		<AriaFieldError
			data-slot="field-error"
			className={cn("text-sm text-destructive", className)}
			{...props}
		/>
	);
}

export { TextField, Label, Description, FieldError };
