import { getUserSession } from "~/auth/session.server";
import { listActiveTasks } from "~/task/list-active-tasks.server";
import { Welcome } from "../welcome/welcome";
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
        <Welcome
            tasks={loaderData.tasks}
            isAuthenticated={loaderData.isAuthenticated}
        />
    );
}
