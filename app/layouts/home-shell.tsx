import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { getUserSession } from "~/features/auth/server/session.server";
import { HomeView } from "~/features/task/pages/task-list-view";
import { listActiveTasks } from "~/features/task/server/list-active-tasks.server";
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
        };
    }

    const result = await listActiveTasks(request);
    return {
        tasks: result.tasks,
        error: result.error,
        isAuthenticated: true,
    };
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

    const tasks = loaderData.tasks;
    const isAuthenticated = loaderData.isAuthenticated;

    const isModal = location.state?.modal === true;

    const isHomeRoute = location.pathname === "/";

    const outletContext: HomeShellContext = {
        isModal,
    };

    const showHomeView = isHomeRoute || isModal;

    return (
        <>
            {/* HomeView is always mounted, visibility controlled by CSS */}
            <div
                className="contents"
                style={{
                    display: showHomeView ? "contents" : "none",
                }}
                aria-hidden={!showHomeView}
            >
                <HomeView tasks={tasks} isAuthenticated={isAuthenticated} />
            </div>

            <Outlet context={outletContext} />
        </>
    );
}

export function useHomeShellContext() {
    return useOutletContext<HomeShellContext>();
}
