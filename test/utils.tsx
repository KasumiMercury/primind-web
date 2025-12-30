import { type RenderOptions, render } from "@testing-library/react";
import i18next from "i18next";
import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";

function AllProviders({ children }: { children: ReactNode }) {
    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

function customRender(ui: React.ReactElement, options?: RenderOptions) {
    return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };

export function createMockTask(
    overrides: Partial<SerializableTask> = {},
): SerializableTask {
    return {
        taskId: "test-task-id",
        taskType: TaskType.NEAR,
        taskStatus: TaskStatus.ACTIVE,
        title: "Test Task",
        description: "Test description",
        createdAt: { seconds: String(Math.floor(Date.now() / 1000)) },
        color: "#3B82F6",
        ...overrides,
    };
}
