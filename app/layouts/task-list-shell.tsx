import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Outlet, useLocation, useNavigate, useRevalidator } from "react-router";
import { getUserSession } from "~/features/auth/server/session.server";
import { sessionInvalidModalOpenAtom } from "~/features/auth/store/session-invalid";
import { QuickEditModal } from "~/features/task/components/quick-edit-modal";
import { TaskCardGridSkeleton } from "~/features/task/components/task-card-grid-skeleton";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/features/task/components/task-registration";
import {
    getTaskTypeFromKey,
    TASK_TYPE_KEYS,
} from "~/features/task/lib/task-type-items";
import { TaskListView } from "~/features/task/pages/task-list-view";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { listActiveTasks } from "~/features/task/server/list-active-tasks.server";
import { activeTasksAtom } from "~/features/task/store/active-tasks";
import { getTaskDB } from "~/features/task/store/db.client";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import { useAppLayoutContext } from "~/layouts/app-layout";
import {
    type HomeShellContext,
    useHomeShellContext,
} from "~/layouts/home-shell";
import type { Route } from "./+types/task-list-shell";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const isHomeRoute = url.pathname === "/";

    const { sessionToken } = await getUserSession(request);
    const isAuthenticated = Boolean(sessionToken);

    // Only fetch tasks when at home route
    // For direct access to /tasks/:taskId, skip fetching
    // For modal navigation from home, shouldRevalidate prevents re-run and keeps existing data
    if (!isHomeRoute || !isAuthenticated) {
        return {
            tasks: Promise.resolve({ tasks: [] } as ActiveTasksResult),
            isAuthenticated,
        };
    }

    const tasksPromise = listActiveTasks(request);
    return {
        tasks: tasksPromise,
        isAuthenticated: true,
    };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    const serverData = await serverLoader();

    if (serverData.isAuthenticated) {
        // Pass through the server's deferred promise
        return serverData;
    }

    // For guest users: return IndexedDB fetch as a deferred promise
    const tasksPromise = (async (): Promise<ActiveTasksResult> => {
        const db = getTaskDB();
        if (!db) {
            return { tasks: [] };
        }

        try {
            const localTasks = await db.tasks
                .where("taskStatus")
                .equals(TaskStatus.ACTIVE)
                .toArray();

            localTasks.sort(
                (a, b) =>
                    Number(a.targetAt?.seconds ?? Infinity) -
                    Number(b.targetAt?.seconds ?? Infinity),
            );

            return { tasks: localTasks as SerializableTask[] };
        } catch (error) {
            console.error("Failed to load local tasks:", error);
            return { tasks: [], error: "Failed to load local tasks" };
        }
    })();

    return {
        ...serverData,
        tasks: tasksPromise,
    };
}
clientLoader.hydrate = true;

// Prevent loader re-run when navigating from home to task detail
export function shouldRevalidate({
    currentUrl,
    nextUrl,
}: ShouldRevalidateFunctionArgs) {
    const isFromHome = currentUrl.pathname === "/";
    const isToTaskDetail = nextUrl.pathname.startsWith("/tasks/");

    // Don't revalidate when opening modal from home
    if (isFromHome && isToTaskDetail) {
        return false;
    }

    return true;
}

export default function TaskListShellLayout({
    loaderData,
}: Route.ComponentProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const homeShellContext = useHomeShellContext();
    const { isAuthenticated: appIsAuthenticated } = useAppLayoutContext();
    const { isAuthenticated, tasks: tasksPromise } = loaderData;
    const setActiveTasks = useSetAtom(activeTasksAtom);
    const setSessionInvalid = useSetAtom(sessionInvalidModalOpenAtom);

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    // track previous authentication state to detect logout
    const lastAuthenticatedRef = useRef(appIsAuthenticated);
    useEffect(() => {
        if (lastAuthenticatedRef.current && !appIsAuthenticated) {
            setLatestTask(null);
        }
        lastAuthenticatedRef.current = appIsAuthenticated;
    }, [appIsAuthenticated]);

    // Hydrate active tasks atom when promise resolves
    useEffect(() => {
        let aborted = false;

        tasksPromise
            .then((result) => {
                if (aborted) return;

                // Trigger session invalid dialog if session expired
                if (result.sessionInvalid) {
                    setSessionInvalid(true);
                    return;
                }

                if (!result.error) {
                    setActiveTasks(result.tasks);
                }
            })
            .catch((error) => {
                if (aborted) return;
                console.error("Failed to hydrate active tasks:", error);
            });

        return () => {
            aborted = true;
        };
    }, [tasksPromise, setActiveTasks, setSessionInvalid]);

    const isHomeRoute = location.pathname === "/";
    const showHomeView = isHomeRoute || homeShellContext.isModal;

    const handleTaskClick = (task: SerializableTask) => {
        navigate(`/tasks/${task.taskId}`, {
            state: { modal: true },
            preventScrollReset: true,
        });
    };

    const handleTaskRegistered = (event: TaskRegistrationEvent) => {
        setLatestTask(event);

        // Optimistically add task to atom for duplicate color prevention
        setActiveTasks((prev) => [
            ...prev,
            {
                taskId: event.taskId,
                taskType: getTaskTypeFromKey(event.taskTypeKey),
                taskStatus: TaskStatus.ACTIVE,
                title: "",
                description: "",
                color: event.color,
            },
        ]);

        revalidate();
    };

    const handleDeleted = () => {
        setLatestTask(null);
        revalidate();
    };

    const handleClosed = () => {
        setLatestTask(null);
        revalidate();
    };

    // Pass through HomeShellContext to child routes
    const outletContext: HomeShellContext = homeShellContext;

    return (
        <>
            <div
                className="contents"
                style={{ display: showHomeView ? "contents" : "none" }}
                aria-hidden={!showHomeView}
            >
                <TaskListView
                    tasksPromise={tasksPromise}
                    isAuthenticated={isAuthenticated}
                    onTaskClick={handleTaskClick}
                />
            </div>

            <Outlet context={outletContext} />

            <QuickEditModal
                key={latestTask?.taskId}
                isOpen={latestTask !== null}
                taskId={latestTask?.taskId ?? ""}
                taskTypeKey={latestTask?.taskTypeKey ?? TASK_TYPE_KEYS.NEAR}
                color={latestTask?.color ?? ""}
                isLocalTask={latestTask?.isLocalOperation ?? false}
                onDeleted={handleDeleted}
                onClosed={handleClosed}
            />

            {showHomeView && (
                <>
                    {/* space for fixed TaskRegistration */}
                    <div
                        className="h-70 w-full shrink-0 pb-[env(safe-area-inset-bottom)]"
                        aria-hidden="true"
                    />

                    <div className="fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]">
                        <div
                            className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-black/30 md:hidden"
                            aria-hidden="true"
                        />
                        <div className="flex items-center justify-center p-4">
                            <TaskRegistration
                                className="w-full max-w-xl drop-shadow-primary/20 drop-shadow-sm dark:drop-shadow-none"
                                onTaskRegistered={handleTaskRegistered}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export function HydrateFallback() {
    return (
        <section className="w-full max-w-4xl">
            <TaskCardGridSkeleton count={4} />
        </section>
    );
}
