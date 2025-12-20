import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { QuickEditContent } from "~/features/task/components/quick-edit-content";
import { TASK_TYPE_KEYS } from "~/features/task/lib/task-type-items";

const meta = {
    title: "Task/QuickEditContent",
    component: QuickEditContent,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        className: {
            control: "text",
            description: "Additional CSS classes to apply to the component.",
        },
        taskTypeKey: {
            control: "select",
            options: Object.values(TASK_TYPE_KEYS),
            description: "The type of the task.",
        },
        title: {
            control: "text",
            description: "The title of the task.",
        },
        description: {
            control: "text",
            description: "The description of the task.",
        },
        isSaving: {
            control: "boolean",
            description: "Whether the save action is in progress.",
        },
        saveSuccess: {
            control: "boolean",
            description: "Whether the save action was successful.",
        },
        saveError: {
            control: "boolean",
            description: "Whether the save action failed.",
        },
        isDeleting: {
            control: "boolean",
            description: "Whether the delete action is in progress.",
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
    },
    args: {
        color: "#3B82F6",
        onTitleChange: fn(),
        onDescriptionChange: fn(),
        onSave: fn(),
        onDelete: fn(),
        onDeleteConfirm: fn(),
        onDeleteCancel: fn(),
    },
} satisfies Meta<typeof QuickEditContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        title: "",
        description: "",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const WithContent: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.SHORT,
        title: "Complete project documentation",
        description:
            "Write comprehensive documentation for the new API endpoints including examples and error handling.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const Saving: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        title: "Task being saved",
        description: "This task is currently being saved to the server.",
        isSaving: true,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const SaveSuccess: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        title: "Successfully saved task",
        description: "This task was successfully saved.",
        isSaving: false,
        saveSuccess: true,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const DeleteConfirmDialog: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.RELAXED,
        title: "Task to delete",
        description: "This task will be deleted after confirmation.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: true,
    },
};

export const Deleting: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.RELAXED,
        title: "Task being deleted",
        description: "This task is currently being deleted.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: true,
        showDeleteConfirm: true,
    },
};

export const Scheduled: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.SCHEDULED,
        title: "Scheduled task",
        description: "This is a scheduled task with a due time.",
        isSaving: false,
        saveSuccess: false,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const SaveError: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        title: "Failed to save task",
        description: "This task failed to save.",
        isSaving: false,
        saveSuccess: false,
        saveError: true,
        isDeleting: false,
        showDeleteConfirm: false,
    },
};

export const DeleteError: Story = {
    args: {
        className: "w-full max-w-md",
        taskTypeKey: TASK_TYPE_KEYS.RELAXED,
        title: "Task failed to delete",
        description: "This task could not be deleted.",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        showDeleteConfirm: true,
        deleteError: true,
    },
};
