import { useEffect, useState } from "react";
import { data, useLocation } from "react-router";
import { getTask } from "~/task/get-task.server";
import type { SerializableTask } from "~/task/list-active-tasks.server";
import { TaskDetailModal } from "~/task/task-detail-modal";
import { TaskDetailPage } from "~/task/task-detail-page";
import { Welcome } from "~/welcome/welcome";
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

    const result = await getTask(request, taskId);

    if (result.error || !result.task) {
        throw data(
            { message: result.error || "Task not found" },
            { status: 404 },
        );
    }

    return { task: result.task };
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

    // If we have a background location and tasks, render Welcome + Modal
    if (isHydrated && backgroundPath && tasksFromState) {
        return (
            <>
                <Welcome tasks={tasksFromState} />
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
