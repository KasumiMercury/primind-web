import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TaskCard } from "~/features/task/components/task-card";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";

function createMockTask(
    overrides: Partial<SerializableTask> = {},
): SerializableTask {
    const now = Math.floor(Date.now() / 1000);
    return {
        taskId: "019afbaa-64e4-70d9-9cd1-cd544220afb3",
        taskType: TaskType.NEAR,
        taskStatus: TaskStatus.ACTIVE,
        title: "Sample Task",
        description: "This is a sample task description.",
        createdAt: {
            seconds: (now - 3600).toString(),
        },
        color: "#3B82F6",
        ...overrides,
    };
}

const meta = {
    title: "Task/TaskCard",
    component: TaskCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        className: {
            control: "text",
            description: "Additional CSS classes to apply to the component.",
        },
    },
    args: {
        onPress: fn(),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "200px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        task: createMockTask(),
    },
};

export const Urgent: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.SHORT,
            title: "Urgent Task",
        }),
    },
};

export const Normal: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.NEAR,
            title: "Normal Priority Task",
        }),
    },
};

export const Low: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.RELAXED,
            title: "Low Priority Task",
        }),
    },
};

export const Scheduled: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.SCHEDULED,
            title: "Scheduled Task",
        }),
    },
};

export const EmptyTitle: Story = {
    name: "Empty Title (No Title Displayed)",
    args: {
        task: createMockTask({
            title: "",
        }),
    },
};

export const LongTitle: Story = {
    args: {
        task: createMockTask({
            title: "This is a very long task title that should be truncated when it exceeds the available width of the card component",
        }),
    },
};

export const CreatedJustNow: Story = {
    args: {
        task: createMockTask({
            title: "Just Created",
            createdAt: {
                seconds: Math.floor(Date.now() / 1000).toString(),
            },
        }),
    },
};

export const CreatedYesterday: Story = {
    args: {
        task: createMockTask({
            title: "Created Yesterday",
            createdAt: {
                seconds: (Math.floor(Date.now() / 1000) - 86400).toString(),
            },
        }),
    },
};

export const CreatedLastWeek: Story = {
    args: {
        task: createMockTask({
            title: "Created Last Week",
            createdAt: {
                seconds: (Math.floor(Date.now() / 1000) - 7 * 86400).toString(),
            },
        }),
    },
};
