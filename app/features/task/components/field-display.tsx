import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface FieldDisplayProps {
    label: string;
    value: string;
    onEdit: () => void;
    maxHeightClass?: string;
    emptyText?: string;
}

export function FieldDisplay({
    label,
    value,
    onEdit,
    maxHeightClass = "max-h-24",
    emptyText,
}: FieldDisplayProps) {
    const { t } = useTranslation();
    const isEmpty = !value.trim();
    const displayValue = isEmpty && emptyText ? emptyText : value;

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
                    {t("common.edit")}
                </Button>
            </div>
            <p
                className={cn(
                    "overflow-y-auto whitespace-pre-wrap text-sm",
                    maxHeightClass,
                    isEmpty && emptyText
                        ? "text-muted-foreground italic"
                        : "text-foreground",
                )}
            >
                {displayValue}
            </p>
        </div>
    );
}
