import { data } from "react-router";
import { getUserSession } from "~/features/auth/server/session.server";
import { TaskDetailModal } from "~/features/task/components/task-detail-modal";
import { TaskDetailPage } from "~/features/task/pages/task-detail-page";
import { getTask } from "~/features/task/server/get-task.server";
import { useHomeShellContext } from "~/layouts/home-shell";
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
    const { isModal } = useHomeShellContext();

    if (isModal) {
        return (
            <TaskDetailModal
                key={loaderData.task.taskId}
                task={loaderData.task}
            />
        );
    }

    return <TaskDetailPage task={loaderData.task} />;
}
