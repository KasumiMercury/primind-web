import { LogIn, User } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LoginDialog } from "~/auth/login-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { SerializableTask } from "~/task/list-active-tasks.server";
import { QuickEdit } from "~/task/quick-edit";
import { TaskCardGrid } from "~/task/task-card-grid";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/task/task-registration";

interface WelcomeProps {
    tasks: SerializableTask[];
}

export function Welcome({ tasks }: WelcomeProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = true; // Replace with actual authentication check

    const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    const handleDeleted = () => {
        setLatestTask(null);
    };

    const handleClosed = () => {
        console.log("QuickEdit closed");
        setLatestTask(null);
    };

    const handleTaskClick = (task: SerializableTask) => {
        navigate(`/tasks/${task.taskId}`, {
            state: {
                backgroundLocation: location,
                tasks: tasks,
            },
        });
    };

    return (
        <>
            <main className="flex items-center justify-center pt-8">
                <div className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4">
                    <header className="w-full max-w-4xl">
                        <div className="flex w-full items-center justify-end">
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="inline-flex cursor-pointer items-center rounded-full bg-background p-3 text-primary text-sm ring-2 ring-secondary hover:bg-background hover:text-primary hover:ring-primary focus:outline-none focus:ring-2"
                                            type="button"
                                        >
                                            <User className="h-5 w-5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                    >
                                        <DropdownMenuItem>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <button
                                    onClick={() => setShowLoginDialog(true)}
                                    className="inline-flex cursor-pointer items-center rounded-full bg-primary p-3 text-primary-foreground text-sm ring-2 ring-secondary hover:bg-background hover:text-primary hover:ring-primary focus:outline-none focus:ring-2"
                                    type="button"
                                >
                                    <LogIn className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </header>
                    {latestTask && (
                        <div className="w-full max-w-md rounded-lg border-2 border-secondary px-3 py-3">
                            <QuickEdit
                                key={latestTask.taskId}
                                className="w-full"
                                taskId={latestTask.taskId}
                                taskTypeKey={latestTask.taskTypeKey}
                                color={latestTask.color}
                                onDeleted={handleDeleted}
                                onClosed={handleClosed}
                            />
                        </div>
                    )}

                    <section className="w-full max-w-4xl">
                        <TaskCardGrid
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                        />
                    </section>

                    {/* space for OperationArea */}
                    <div className="h-70 w-full shrink-0" aria-hidden="true" />
                </div>
                <div className="fixed inset-x-0 bottom-0 flex items-center justify-center p-4">
                    <TaskRegistration
                        className="w-full max-w-xl"
                        onTaskRegistered={setLatestTask}
                    />
                </div>
            </main>

            <LoginDialog
                open={showLoginDialog}
                onOpenChange={(open) => !open && setShowLoginDialog(false)}
            />
        </>
    );
}
