import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import { v7 as uuidv7 } from "uuid";
import { LoginDialog } from "~/auth/login-dialog";
import { Button } from "~/components/ui/button";
import { OperationArea } from "~/task/operation-area";
import { createTaskFormData } from "~/task/task-form-data";
import type { TaskTypeKey } from "~/task/task-type-items";

export interface TaskRegistrationEvent {
    taskId: string;
    taskTypeKey: TaskTypeKey;
}

export function Welcome() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showLogin = searchParams.get("login") === "true";
    const fetcher = useFetcher();

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    const handleRegister = (taskTypeKey: TaskTypeKey) => {
        const taskId = uuidv7();
        const formData = createTaskFormData(taskId, taskTypeKey);

        fetcher.submit(formData, {
            method: "post",
            action: "/api/task",
        });

        setLatestTask({ taskId, taskTypeKey });
        console.log("Task registered:", { taskId, taskTypeKey });
    };

    // TODO: remove this useEffect after actual implementation
    useEffect(() => {
        if (latestTask) {
            console.log("Latest task updated:", latestTask);
        }
    }, [latestTask]);

    return (
        <>
            <main className="flex items-center justify-center pt-8">
                <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
                    <header className="w-full max-w-4xl">
                        <div className="flex w-full items-center justify-end px-4">
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
                    <div className="w-full max-w-[300px] space-y-6 px-4"></div>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-4">
                    <OperationArea
                        className="w-full max-w-xl"
                        innerClassName="bg-secondary"
                        onRegister={handleRegister}
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
