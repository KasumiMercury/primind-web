import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { getUserSession } from "~/features/auth/server/session.server";
import { TaskCardGridSkeleton } from "~/features/task/components/task-card-grid-skeleton";
import { TaskRegistration } from "~/features/task/components/task-registration";
import { HomeView } from "~/features/task/pages/task-list-view";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { listActiveTasks } from "~/features/task/server/list-active-tasks.server";
import { getTaskDB } from "~/features/task/store/db.client";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import type { Route } from "./+types/home-shell";

export interface HomeShellContext {
    isModal: boolean;
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const isHomeRoute = url.pathname === "/";

    const { sessionToken } = await getUserSession(request);
    const isAuthenticated = Boolean(sessionToken);

    // Only fetch tasks when at home route
    // For direct access to /tasks/:taskId, skip fetching
    // For modal navigation from home, shouldRevalidate prevents re-run and keeps existing data
    if (!isHomeRoute || !isAuthenticated) {
        // Return resolved promise for consistency with deferred pattern
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

export default function HomeShellLayout({ loaderData }: Route.ComponentProps) {
    const location = useLocation();
    const { isAuthenticated, tasks: tasksPromise } = loaderData;

    const isModal = location.state?.modal === true;
    const isHomeRoute = location.pathname === "/";

    const outletContext: HomeShellContext = {
        isModal,
    };

    const showHomeView = isHomeRoute || isModal;

    return (
        <>
            <div
                className="contents"
                style={{
                    display: showHomeView ? "contents" : "none",
                }}
                aria-hidden={!showHomeView}
            >
                <HomeView
                    tasksPromise={tasksPromise}
                    isAuthenticated={isAuthenticated}
                />
            </div>

            <Outlet context={outletContext} />
        </>
    );
}

export function useHomeShellContext() {
    return useOutletContext<HomeShellContext>();
}

export function HydrateFallback() {
    return (
        <>
            <section className="w-full max-w-4xl">
                <TaskCardGridSkeleton count={4} />
            </section>

            {/* space for OperationArea */}
            <div className="h-70 w-full shrink-0" aria-hidden="true" />

            <div className="fixed inset-x-0 bottom-0">
                <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-black/30 md:hidden"
                    aria-hidden="true"
                />
                <div className="flex items-center justify-center p-4">
                    <TaskRegistration className="w-full max-w-xl drop-shadow-primary/20 drop-shadow-xl" />
                </div>
            </div>
        </>
    );
}
