import { data, isRouteErrorResponse } from "react-router";
import { UnsupportedBrowser } from "~/components/ui/unsupported-browser";
import { getUserSession } from "~/features/auth/server/session.server";
import { TaskDetailModal } from "~/features/task/components/task-detail-modal";
import { TaskNotFoundErrorPage } from "~/features/task/components/task-not-found-error-page";
import { TaskDetailPage } from "~/features/task/pages/task-detail-page";
import { getTask } from "~/features/task/server/get-task.server";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
import { getTaskDB } from "~/features/task/store/db.client";
import { useHomeShellContext } from "~/layouts/home-shell";
import type { Route } from "./+types/tasks.$taskId";

export function meta({ loaderData, error }: Route.MetaArgs) {
    if (isRouteErrorResponse(error) && error.status === 404) {
        return [
            { title: "Task Not Found | PriMind" },
            { name: "description", content: "Task not found" },
        ];
    }
    const title = loaderData?.task?.title?.trim() || "Task Detail";
    return [
        { title: `${title} | PriMind` },
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

    // delegate to clientLoader for IndexedDB check
    if (!isAuthenticated) {
        return {
            task: null,
            isAuthenticated: false,
            isLocalOperation: true,
            taskId,
        };
    }

    // fetch from server
    const result = await getTask(request, taskId);

    if (result.error || !result.task) {
        throw data(
            {
                message: result.error || "Task not found",
                isAuthenticated: true,
            },
            { status: 404 },
        );
    }

    return {
        task: result.task,
        isAuthenticated: true,
        isLocalOperation: false,
        taskId,
    };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    const serverData = await serverLoader();

    if (serverData.isAuthenticated && serverData.task) {
        return {
            ...serverData,
            storageUnavailable: false,
            isLocalOperation: false,
        };
    }

    // fetch from IndexedDB
    const db = getTaskDB();
    if (!db) {
        return {
            task: null,
            isAuthenticated: false,
            isLocalOperation: true,
            taskId: serverData.taskId,
            storageUnavailable: true,
        };
    }

    try {
        const task = await db.tasks.get(serverData.taskId);

        if (!task) {
            throw data(
                { message: "Task not found", isAuthenticated: false },
                { status: 404 },
            );
        }

        return {
            task: task as SerializableTask,
            isAuthenticated: false,
            isLocalOperation: true,
            taskId: serverData.taskId,
            storageUnavailable: false,
        };
    } catch (error) {
        if (error instanceof Response) {
            throw error;
        }
        throw data(
            { message: "Task not found", isAuthenticated: false },
            { status: 404 },
        );
    }
}
clientLoader.hydrate = true;

export default function TaskDetailRoute({ loaderData }: Route.ComponentProps) {
    const { isModal } = useHomeShellContext();

    if ("storageUnavailable" in loaderData && loaderData.storageUnavailable) {
        return <UnsupportedBrowser />;
    }

    if (!loaderData.task) {
        throw data(
            {
                message: "Task not found",
                isAuthenticated: loaderData.isAuthenticated,
            },
            { status: 404 },
        );
    }

    const task = loaderData.task;
    const isLocalTask =
        loaderData.isLocalOperation ?? !loaderData.isAuthenticated;

    if (isModal) {
        return (
            <TaskDetailModal
                key={task.taskId}
                task={task}
                isLocalTask={isLocalTask}
            />
        );
    }

    return <TaskDetailPage task={task} isLocalTask={isLocalTask} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    if (isRouteErrorResponse(error) && error.status === 404) {
        const isAuthenticated =
            typeof error.data?.isAuthenticated === "boolean"
                ? error.data.isAuthenticated
                : false;

        return <TaskNotFoundErrorPage isAuthenticated={isAuthenticated} />;
    }

    throw error;
}
