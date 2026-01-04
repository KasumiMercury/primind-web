import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { Loading } from "~/components/ui/loading";
import { getUserSession } from "~/features/auth/server/session.server";
import { useGuestInitialLoad } from "~/features/task/hooks/use-guest-initial-load";
import { HomeView } from "~/features/task/pages/task-list-view";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
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
        return {
            tasks: [],
            isAuthenticated,
            error: undefined,
        };
    }

    const result = await listActiveTasks(request);
    return {
        tasks: result.tasks,
        error: result.error,
        isAuthenticated: true,
    };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    const serverData = await serverLoader();

    if (serverData.isAuthenticated) {
        return serverData;
    }

    // fetch from IndexedDB
    const db = getTaskDB();
    if (!db) {
        return {
            ...serverData,
            tasks: [] as SerializableTask[],
        };
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

        return {
            ...serverData,
            tasks: localTasks as SerializableTask[],
        };
    } catch (error) {
        console.error("Failed to load local tasks:", error);
        return {
            ...serverData,
            tasks: [] as SerializableTask[],
        };
    }
}

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
    const { isAuthenticated, tasks } = loaderData;

    const { isLoading } = useGuestInitialLoad({ isAuthenticated });

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
                {isLoading ? (
                    <Loading />
                ) : (
                    <HomeView tasks={tasks} isAuthenticated={isAuthenticated} />
                )}
            </div>

            <Outlet context={outletContext} />
        </>
    );
}

export function useHomeShellContext() {
    return useOutletContext<HomeShellContext>();
}
