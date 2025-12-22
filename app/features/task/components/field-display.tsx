import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface FieldDisplayProps {
    label: string;
    value: string;
    onEdit: () => void;
    maxHeightClass?: string;
}

export function FieldDisplay({
    label,
    value,
    onEdit,
    maxHeightClass = "max-h-24",
}: FieldDisplayProps) {
    return (
        <div className="flex w-full flex-col gap-2 rounded-md border p-3">
            <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {label}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onPress={onEdit}
                    className="shrink-0"
                >
                    <Pencil className="size-4" />
                    Edit
                </Button>
            </div>
            <p
                className={cn(
                    "overflow-y-auto whitespace-pre-wrap text-foreground text-sm",
                    maxHeightClass,
                )}
            >
                {value}
            </p>
        </div>
    );
}
