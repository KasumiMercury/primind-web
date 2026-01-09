import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { AsyncTaskCardGrid } from "~/features/task/components/async-task-card-grid";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { useHomeShellContext } from "~/layouts/home-shell";

interface TaskListViewProps {
    tasksPromise: Promise<ActiveTasksResult>;
    isAuthenticated: boolean;
    onTaskClick?: (task: SerializableTask) => void;
}

export function TaskListView({
    tasksPromise,
    isAuthenticated,
    onTaskClick,
}: TaskListViewProps) {
    const { t } = useTranslation();
    const { openLoginDialog } = useHomeShellContext();

    return (
        <>
            {!isAuthenticated && (
                <Alert className="w-full max-w-xl">
                    <Info className="h-4 w-4" />
                    <div className="ml-3 flex flex-row items-center justify-between">
                        <div>
                            <AlertTitle>{t("loginRequired.title")}</AlertTitle>
                            <AlertDescription>
                                <p>{t("loginRequired.description")}</p>
                            </AlertDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onPress={openLoginDialog}
                        >
                            {t("auth.login")}
                        </Button>
                    </div>
                </Alert>
            )}

            <section className="w-full max-w-4xl">
                <AsyncTaskCardGrid
                    tasksPromise={tasksPromise}
                    onTaskClick={onTaskClick}
                />
            </section>
        </>
    );
}
