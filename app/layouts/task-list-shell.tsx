import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getUserSession } from "~/features/auth/server/session.server";
import { TaskCardGridSkeleton } from "~/features/task/components/task-card-grid-skeleton";
import { TaskListView } from "~/features/task/pages/task-list-view";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { listActiveTasks } from "~/features/task/server/list-active-tasks.server";
import { getTaskDB } from "~/features/task/store/db.client";
import { TaskStatus } from "~/gen/task/v1/task_pb";
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
    const homeShellContext = useHomeShellContext();
    const { isAuthenticated, tasks: tasksPromise } = loaderData;

    const isHomeRoute = location.pathname === "/";
    const showHomeView = isHomeRoute || homeShellContext.isModal;

    const handleTaskClick = (task: SerializableTask) => {
        navigate(`/tasks/${task.taskId}`, {
            state: { modal: true },
            preventScrollReset: true,
        });
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
