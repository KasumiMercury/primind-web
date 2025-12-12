import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";
import type { SerializableTask } from "~/task/list-active-tasks.server";
import { TaskDetailContent } from "~/task/task-detail-content";

function createMockTask(
    overrides: Partial<SerializableTask> = {},
): SerializableTask {
    const now = Math.floor(Date.now() / 1000);
    return {
        taskId: "019afbaa-64e4-70d9-9cd1-cd544220afb3",
        taskType: TaskType.NORMAL,
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
        isEditing: {
            control: "boolean",
            description: "Whether the component is in edit mode.",
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
        isDirty: {
            control: "boolean",
            description: "Whether there are unsaved changes.",
        },
        showDeleteConfirm: {
            control: "boolean",
            description: "Whether to show the delete confirmation dialog.",
        },
        deleteError: {
            control: "text",
            description:
                "Error message to display in the delete confirmation dialog.",
        },
        title: {
            control: "text",
            description: "Current title value.",
        },
        description: {
            control: "text",
            description: "Current description value.",
        },
    },
    args: {
        onTitleChange: fn(),
        onDescriptionChange: fn(),
        onEditClick: fn(),
        onEditCancel: fn(),
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
        title: "Sample Task Title",
        description: "This is a sample task description for testing purposes.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const Urgent: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.URGENT,
            title: "Urgent Task",
            color: "#EF4444",
        }),
        title: "Urgent Task",
        description: "This requires immediate attention.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const Normal: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.NORMAL,
            title: "Normal Priority Task",
            color: "#3B82F6",
        }),
        title: "Normal Priority Task",
        description: "Standard priority task with moderate deadline.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const Low: Story = {
    args: {
        task: createMockTask({
            taskType: TaskType.LOW,
            title: "Low Priority Task",
            color: "#22C55E",
        }),
        title: "Low Priority Task",
        description: "Can be done when time permits.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
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
        title: "Scheduled Task",
        description: "Task with a specific due time.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const EmptyTitle: Story = {
    args: {
        task: createMockTask({ title: "" }),
        title: "",
        description: "Task without a title.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const EmptyDescription: Story = {
    args: {
        task: createMockTask({ description: "" }),
        title: "Task Without Description",
        description: "",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const LongContent: Story = {
    args: {
        task: createMockTask({
            title: "This is an extremely long task title that might need to wrap or be truncated depending on the layout",
        }),
        title: "This is an extremely long task title that might need to wrap or be truncated depending on the layout",
        description:
            "This is a very detailed description that spans multiple lines. It contains lots of information about what needs to be done, why it needs to be done, and how it should be accomplished. The description goes on and on to test how the component handles long text content.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const Editing: Story = {
    args: {
        task: createMockTask(),
        title: "Sample Task Title",
        description: "This is a sample task description for testing purposes.",
        isEditing: true,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const EditingWithChanges: Story = {
    args: {
        task: createMockTask(),
        title: "Modified Title",
        description: "Modified description with unsaved changes.",
        isEditing: true,
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
    },
};

export const Saving: Story = {
    args: {
        task: createMockTask(),
        title: "Task being saved",
        description: "This task is currently being saved to the server.",
        isEditing: true,
        isSaving: true,
        saveSuccess: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
    },
};

export const SaveSuccess: Story = {
    args: {
        task: createMockTask(),
        title: "Successfully saved task",
        description: "This task was successfully saved.",
        isEditing: false,
        isSaving: false,
        saveSuccess: true,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const SaveError: Story = {
    args: {
        task: createMockTask(),
        title: "Failed to save task",
        description: "This task failed to save to the server.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        saveError: true,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
    },
};

export const DeleteError: Story = {
    args: {
        task: createMockTask(),
        title: "Task failed to delete",
        description: "This task could not be deleted.",
        isEditing: false,
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: true,
        deleteError: "Failed to delete task. Please try again.",
    },
};
