import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
    Outlet,
    useLocation,
    useOutletContext,
    useRevalidator,
} from "react-router";
import { QuickEditModal } from "~/features/task/components/quick-edit-modal";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/features/task/components/task-registration";
import {
    getTaskTypeFromKey,
    TASK_TYPE_KEYS,
} from "~/features/task/lib/task-type-items";
import { activeTasksAtom } from "~/features/task/store/active-tasks";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import { useAppLayoutContext } from "~/layouts/app-layout";

export interface HomeShellContext {
    isModal: boolean;
    openLoginDialog: () => void;
}

export default function HomeShellLayout() {
    const location = useLocation();
    const { isAuthenticated, openLoginDialog } = useAppLayoutContext();
    const { revalidate } = useRevalidator();
    const setActiveTasks = useSetAtom(activeTasksAtom);

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    // track previous authentication state to detect logout
    const lastAuthenticatedRef = useRef(isAuthenticated);
    useEffect(() => {
        if (lastAuthenticatedRef.current && !isAuthenticated) {
            setLatestTask(null);
        }
        lastAuthenticatedRef.current = isAuthenticated;
    }, [isAuthenticated]);

    const handleTaskRegistered = (event: TaskRegistrationEvent) => {
        setLatestTask(event);

        // Optimistically add task to atom for duplicate color prevention
        setActiveTasks((prev) => [
            ...prev,
            {
                taskId: event.taskId,
                taskType: getTaskTypeFromKey(event.taskTypeKey),
                taskStatus: TaskStatus.ACTIVE,
                title: "",
                description: "",
                color: event.color,
            },
        ]);

        revalidate();
    };

    const handleDeleted = () => {
        setLatestTask(null);
        revalidate();
    };

    const handleClosed = () => {
        setLatestTask(null);
        revalidate();
    };

    const isModal = location.state?.modal === true;
    const outletContext: HomeShellContext = { isModal, openLoginDialog };

    return (
        <>
            <Outlet context={outletContext} />

            <QuickEditModal
                key={latestTask?.taskId}
                isOpen={latestTask !== null}
                taskId={latestTask?.taskId ?? ""}
                taskTypeKey={latestTask?.taskTypeKey ?? TASK_TYPE_KEYS.NEAR}
                color={latestTask?.color ?? ""}
                isLocalTask={latestTask?.isLocalOperation ?? false}
                onDeleted={handleDeleted}
                onClosed={handleClosed}
            />

            {/* space for fixed TaskRegistration */}
            <div
                className="h-70 w-full shrink-0 pb-[env(safe-area-inset-bottom)]"
                aria-hidden="true"
            />

            <div className="fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]">
                <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-black/30 md:hidden"
                    aria-hidden="true"
                />
                <div className="flex items-center justify-center p-4">
                    <TaskRegistration
                        className="w-full max-w-xl drop-shadow-primary/20 drop-shadow-sm dark:drop-shadow-none"
                        onTaskRegistered={handleTaskRegistered}
                    />
                </div>
            </div>
        </>
    );
}

export function useHomeShellContext() {
    return useOutletContext<HomeShellContext>();
}
