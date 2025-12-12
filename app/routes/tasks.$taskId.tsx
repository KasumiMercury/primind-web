import { useEffect, useState } from "react";
import { data, useLocation } from "react-router";
import { getUserSession } from "~/features/auth/server/session.server";
import { TaskDetailModal } from "~/features/task/components/task-detail-modal";
import { TaskDetailPage } from "~/features/task/pages/task-detail-page";
import { TaskListPage } from "~/features/task/pages/task-list-page";
import { getTask } from "~/features/task/server/get-task.server";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
import type { Route } from "./+types/tasks.$taskId";

export function meta({ loaderData }: Route.MetaArgs) {
    const title = loaderData?.task?.title?.trim() || "Task Detail";
    return [
        { title: `${title} | Primind` },
        { name: "description", content: "Task detail view" },
    ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
    const taskId = params.taskId;

    if (!taskId) {
        throw data({ message: "Task ID is required" }, { status: 400 });
    }

    const { sessionToken } = await getUserSession(request);
    const isAuthenticated = Boolean(sessionToken);

    const result = await getTask(request, taskId);

    if (result.error || !result.task) {
        throw data(
            { message: result.error || "Task not found" },
            { status: 404 },
        );
    }

    return { task: result.task, isAuthenticated };
}

export default function TaskDetailRoute({ loaderData }: Route.ComponentProps) {
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;
    const tasksFromState = Array.isArray(location.state?.tasks)
        ? (location.state?.tasks as SerializableTask[])
        : undefined;
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const backgroundPath =
        backgroundLocation && typeof backgroundLocation === "object"
            ? backgroundLocation.pathname
            : undefined;

    // If we have a background location and tasks, render TaskListPage + Modal
    if (isHydrated && backgroundPath && tasksFromState) {
        return (
            <>
                <TaskListPage
                    tasks={tasksFromState}
                    isAuthenticated={loaderData.isAuthenticated}
                />
                <TaskDetailModal
                    key={loaderData.task.taskId}
                    task={loaderData.task}
                    backgroundLocation={backgroundPath}
                />
            </>
        );
    }

    // Otherwise, render as standalone page
    return <TaskDetailPage task={loaderData.task} />;
}
