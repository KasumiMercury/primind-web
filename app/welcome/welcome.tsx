import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { LoginDialog } from "~/auth/login-dialog";
import { Button } from "~/components/ui/button";
import {
    OperationArea,
    type TaskRegistrationEvent,
} from "~/task/operation-area";

export function Welcome() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showLogin = searchParams.get("login") === "true";

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    const handleTaskRegistered = (event: TaskRegistrationEvent) => {
        setLatestTask(event);
        console.log("Task registered:", event);
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
                        onTaskRegistered={handleTaskRegistered}
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
