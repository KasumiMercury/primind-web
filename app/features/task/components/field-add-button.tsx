import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface FieldAddButtonProps {
    label: string;
    optionalLabel?: string;
    onPress: () => void;
}

export function FieldAddButton({
    label,
    optionalLabel,
    onPress,
}: FieldAddButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={onPress}
            aria-label={label}
            className={cn(
                "group flex w-full items-center justify-between rounded-md border border-muted-foreground/50 border-dashed p-3 text-left transition-colors",
                "data-hovered:border-primary data-hovered:bg-primary/10",
            )}
        >
            <div className="flex items-center gap-2">
                <span className="font-medium text-foreground text-sm">
                    {label}
                </span>
                {optionalLabel && (
                    <span className="text-muted-foreground text-xs">
                        {optionalLabel}
                    </span>
                )}
            </div>
            <Plus className="size-5 text-muted-foreground group-data-hovered:text-primary" />
        </Button>
    );
}
