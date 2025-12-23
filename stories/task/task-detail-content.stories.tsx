import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TaskDetailContent } from "~/features/task/components/task-detail-content";
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
        title: "Sample Task Title",
        description: "This is a sample task description for testing purposes.",
        createdAt: {
            seconds: (now - 3600).toString(),
        },
        color: "#3B82F6",
        ...overrides,
    };
}

const meta = {
    title: "Task/TaskDetailContent",
    component: TaskDetailContent,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        defaultEditingField: {
            control: "select",
            options: ["none", "title", "description"],
            description: "Initial editing field state (for Storybook).",
        },
        defaultEditingValue: {
            control: "text",
            description: "Initial editing value (for Storybook).",
        },
        isSaving: {
            control: "boolean",
            description: "Whether a save operation is in progress.",
        },
        saveSuccess: {
            control: "boolean",
            description:
                "Whether the save was successful (shows success feedback).",
        },
        saveError: {
            control: "boolean",
            description:
                "Whether the save action failed (shows error feedback).",
        },
        isDeleting: {
            control: "boolean",
            description: "Whether a delete operation is in progress.",
        },
        showDeleteConfirm: {
            control: "boolean",
            description: "Whether to show the delete confirmation dialog.",
        },
        deleteError: {
            control: "boolean",
            description:
                "Whether to show error message in the delete confirmation dialog.",
        },
        initialTitle: {
            control: "text",
            description: "Saved title value.",
        },
        initialDescription: {
            control: "text",
            description: "Saved description value.",
        },
    },
    args: {
        onDirtyChange: fn(),
        onSave: fn(),
        onDelete: fn(),
        onDeleteConfirm: fn(),
        onDeleteCancel: fn(),
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-lg rounded-lg border bg-card p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TaskDetailContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const Urgent: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.SHORT,
            title: "Urgent Task",
            color: "#EF4444",
        }),
        initialTitle: "Urgent Task",
        initialDescription: "This requires immediate attention.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const Normal: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.NEAR,
            title: "Normal Priority Task",
            color: "#3B82F6",
        }),
        initialTitle: "Normal Priority Task",
        initialDescription: "Standard priority task with moderate deadline.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const Low: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.RELAXED,
            title: "Low Priority Task",
            color: "#22C55E",
        }),
        initialTitle: "Low Priority Task",
        initialDescription: "Can be done when time permits.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const Scheduled: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.SCHEDULED,
            title: "Scheduled Task",
            color: "#EAB308",
            targetAt: {
                seconds: (Math.floor(Date.now() / 1000) + 86400).toString(),
            },
        }),
        initialTitle: "Scheduled Task",
        initialDescription: "Task with a specific due time.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const EmptyTitle: Story = {
    args: {
        task: createMockTask({ title: "" }),
        initialTitle: "",
        initialDescription: "Task without a title.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const EmptyDescription: Story = {
    args: {
        task: createMockTask({ description: "" }),
        initialTitle: "Task Without Description",
        initialDescription: "",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const LongContent: Story = {
    args: {
        task: createMockTask({
            title: "This is an extremely long task title that might need to wrap or be truncated depending on the layout",
        }),
        initialTitle:
            "This is an extremely long task title that might need to wrap or be truncated depending on the layout",
        initialDescription:
            "This is a very detailed description that spans multiple lines. It contains lots of information about what needs to be done, why it needs to be done, and how it should be accomplished. The description goes on and on to test how the component handles long text content.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const EditingTitle: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        defaultEditingField: "title",
        defaultEditingValue: "Sample Task Title",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const EditingTitleWithChanges: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        defaultEditingField: "title",
        defaultEditingValue: "Modified Title",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const EditingDescription: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        defaultEditingField: "description",
        defaultEditingValue:
            "This is a sample task description for testing purposes.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const EditingDescriptionWithChanges: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        defaultEditingField: "description",
        defaultEditingValue: "Modified description with unsaved changes.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const SavingTitle: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        defaultEditingField: "title",
        defaultEditingValue: "Modified Title",
        isSaving: true,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const SavingDescription: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Sample Task Title",
        initialDescription:
            "This is a sample task description for testing purposes.",
        defaultEditingField: "description",
        defaultEditingValue: "Modified description being saved.",
        isSaving: true,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const SaveSuccess: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Successfully saved task",
        initialDescription: "This task was successfully saved.",
        defaultEditingField: "title",
        defaultEditingValue: "Successfully saved task",
        isSaving: false,
        saveSuccess: true,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const SaveError: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Failed to save task",
        initialDescription: "This task failed to save to the server.",
        defaultEditingField: "title",
        defaultEditingValue: "Failed to save task",
        isSaving: false,
        saveSuccess: false,
        saveError: true,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const DeleteError: Story = {
    args: {
        task: createMockTask(),
        initialTitle: "Task failed to delete",
        initialDescription: "This task could not be deleted.",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        showDeleteConfirm: true,
        deleteError: true,
    },
};
