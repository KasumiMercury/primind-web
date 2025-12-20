import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TaskCardGrid } from "~/features/task/components/task-card-grid";
import { TASK_COLORS } from "~/features/task/lib/task-colors";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";

function createMockTask(
    id: string,
    taskType: TaskType,
    title: string,
    hoursAgo: number,
    colorIndex = 0,
): SerializableTask {
    const now = Math.floor(Date.now() / 1000);
    return {
        taskId: id,
        taskType,
        taskStatus: TaskStatus.ACTIVE,
        title,
        description: "",
        createdAt: {
            seconds: (now - hoursAgo * 3600).toString(),
        },
        color: TASK_COLORS[colorIndex % TASK_COLORS.length],
    };
}

const sampleTasks: SerializableTask[] = [
    createMockTask(
        "019afbaa-0001-70d9-9cd1-cd544220afb3",
        TaskType.SHORT,
        "Fix critical bug in production",
        2,
    ),
    createMockTask(
        "019afbaa-0002-70d9-9cd1-cd544220afb3",
        TaskType.NEAR,
        "Review pull request",
        5,
    ),
    createMockTask(
        "019afbaa-0003-70d9-9cd1-cd544220afb3",
        TaskType.RELAXED,
        "Update documentation",
        24,
    ),
    createMockTask(
        "019afbaa-0004-70d9-9cd1-cd544220afb3",
        TaskType.SCHEDULED,
        "Team meeting preparation",
        48,
    ),
    createMockTask(
        "019afbaa-0005-70d9-9cd1-cd544220afb3",
        TaskType.NEAR,
        "Implement new feature for user dashboard",
        72,
    ),
    createMockTask(
        "019afbaa-0006-70d9-9cd1-cd544220afb3",
        TaskType.SHORT,
        "Deploy hotfix",
        1,
    ),
];

const manyTasks: SerializableTask[] = [
    ...sampleTasks,
    createMockTask(
        "019afbaa-0007-70d9-9cd1-cd544220afb3",
        TaskType.RELAXED,
        "Refactor legacy code",
        96,
    ),
    createMockTask(
        "019afbaa-0008-70d9-9cd1-cd544220afb3",
        TaskType.NEAR,
        "Write unit tests",
        120,
    ),
    createMockTask(
        "019afbaa-0009-70d9-9cd1-cd544220afb3",
        TaskType.SCHEDULED,
        "Quarterly review",
        168,
    ),
    createMockTask(
        "019afbaa-0010-70d9-9cd1-cd544220afb3",
        TaskType.SHORT,
        "",
        3,
    ),
];

const meta = {
    title: "Task/TaskCardGrid",
    component: TaskCardGrid,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        className: {
            control: "text",
            description: "Additional CSS classes to apply to the grid.",
        },
    },
    args: {
        onTaskClick: fn(),
    },
} satisfies Meta<typeof TaskCardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        tasks: sampleTasks,
    },
};

export const Empty: Story = {
    args: {
        tasks: [],
    },
};

export const SingleTask: Story = {
    args: {
        tasks: [sampleTasks[0]],
    },
};

export const TwoTasks: Story = {
    args: {
        tasks: sampleTasks.slice(0, 2),
    },
};

export const ManyTasks: Story = {
    args: {
        tasks: manyTasks,
    },
};

export const AllTaskTypes: Story = {
    args: {
        tasks: [
            createMockTask(
                "019afbaa-type-0001-9cd1-cd544220afb3",
                TaskType.SHORT,
                "Urgent Task",
                1,
            ),
            createMockTask(
                "019afbaa-type-0002-9cd1-cd544220afb3",
                TaskType.NEAR,
                "Normal Task",
                2,
            ),
            createMockTask(
                "019afbaa-type-0003-9cd1-cd544220afb3",
                TaskType.RELAXED,
                "Low Priority Task",
                3,
            ),
            createMockTask(
                "019afbaa-type-0004-9cd1-cd544220afb3",
                TaskType.SCHEDULED,
                "Scheduled Task",
                4,
            ),
        ],
    },
};

export const WithEmptyTitles: Story = {
    args: {
        tasks: [
            createMockTask(
                "019afbaa-empty-0001-9cd1-cd544220afb3",
                TaskType.SHORT,
                "",
                1,
            ),
            createMockTask(
                "019afbaa-empty-0002-9cd1-cd544220afb3",
                TaskType.NEAR,
                "Has a title",
                2,
            ),
            createMockTask(
                "019afbaa-empty-0003-9cd1-cd544220afb3",
                TaskType.RELAXED,
                "",
                3,
            ),
            createMockTask(
                "019afbaa-empty-0004-9cd1-cd544220afb3",
                TaskType.SCHEDULED,
                "Another titled task",
                4,
            ),
        ],
    },
};

export const WithLongTitles: Story = {
    args: {
        tasks: [
            createMockTask(
                "019afbaa-long-0001-9cd1-cd544220afb3",
                TaskType.SHORT,
                "This is an extremely long task title that should definitely be truncated when displayed in the card",
                1,
            ),
            createMockTask(
                "019afbaa-long-0002-9cd1-cd544220afb3",
                TaskType.NEAR,
                "Another very long title for testing truncation behavior in the task card component",
                2,
            ),
            createMockTask(
                "019afbaa-long-0003-9cd1-cd544220afb3",
                TaskType.RELAXED,
                "Short",
                3,
            ),
            createMockTask(
                "019afbaa-long-0004-9cd1-cd544220afb3",
                TaskType.SCHEDULED,
                "Medium length title here",
                4,
            ),
        ],
    },
};
