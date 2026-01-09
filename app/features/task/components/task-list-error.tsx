import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface TaskListErrorProps {
    error?: string;
}

export function TaskListError({ error }: TaskListErrorProps) {
    const { t } = useTranslation();
    const { revalidate, state } = useRevalidator();

    const isLoading = state === "loading";

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
                <p className="font-medium text-foreground">
                    {t("errors.task.list.failed")}
                </p>
                {error && (
                    <p className="text-muted-foreground text-sm">{error}</p>
                )}
            </div>
            <Button
                variant="outline"
                size="sm"
                onPress={() => revalidate()}
                isDisabled={isLoading}
            >
                <RefreshCw
                    className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
                />
                {t("common.retry", "Retry")}
            </Button>
        </div>
    );
}
