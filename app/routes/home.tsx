import { getUserSession } from "~/features/auth/server/session.server";
import { TaskListPage } from "~/features/task/pages/task-list-page";
import { listActiveTasks } from "~/features/task/server/list-active-tasks.server";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const { sessionToken } = await getUserSession(request);
    const isAuthenticated = Boolean(sessionToken);

    if (!isAuthenticated) {
        return {
            tasks: [],
            isAuthenticated: false,
        };
    }

    const result = await listActiveTasks(request);
    return {
        tasks: result.tasks,
        error: result.error,
        isAuthenticated: true,
    };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (
        <TaskListPage
            tasks={loaderData.tasks}
            isAuthenticated={loaderData.isAuthenticated}
        />
    );
}
