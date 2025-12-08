import { LogIn } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { LoginDialog } from "~/auth/login-dialog";
import { Button } from "~/components/ui/button";
import { QuickEdit } from "~/task/quick-edit";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/task/task-registration";

export function Welcome() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showLogin = searchParams.get("login") === "true";

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    const handleDeleted = () => {
        setLatestTask(null);
    };

    const handleClosed = () => {
        console.log("QuickEdit closed");
        // TODO: add latestTask to list of tasks
        setLatestTask(null);
    };

    return (
        <>
            <main className="flex items-center justify-center pt-8">
                <div className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4">
                    <header className="w-full max-w-4xl">
                        <div className="flex w-full items-center justify-end">
                            <Button
                                onClick={() =>
                                    setSearchParams({ login: "true" })
                                }
                                variant="default"
                                size="default"
                            >
                                <LogIn /> Sign In
                            </Button>
                        </div>
                    </header>
                    {latestTask && (
                        <div className="w-full max-w-md rounded-md border-2 border-secondary px-3 py-3">
                            <QuickEdit
                                key={latestTask.taskId}
                                className="w-full"
                                taskId={latestTask.taskId}
                                taskTypeKey={latestTask.taskTypeKey}
                                onDeleted={handleDeleted}
                                onClosed={handleClosed}
                            />
                        </div>
                    )}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-4">
                    <TaskRegistration
                        className="w-full max-w-xl"
                        innerClassName="bg-secondary"
                        onTaskRegistered={setLatestTask}
                    />
                </div>
            </main>

            <LoginDialog
                open={showLogin}
                onOpenChange={(open) => !open && setSearchParams({})}
            />
        </>
    );
}
