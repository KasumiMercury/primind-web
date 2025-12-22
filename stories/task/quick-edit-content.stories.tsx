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
        taskTypeKey: {
            control: "select",
            options: Object.values(TASK_TYPE_KEYS),
            description: "The type of task.",
        },
        color: {
            control: "color",
            description: "The color of the task icon.",
        },
        title: {
            control: "text",
            description: "Current title value.",
        },
        description: {
            control: "text",
            description: "Current description value.",
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
            control: "boolean",
            description:
                "Whether to show error message in the delete confirmation dialog.",
        },
    },
    args: {
        onTitleChange: fn(),
        onDescriptionChange: fn(),
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
} satisfies Meta<typeof QuickEditContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const WithContent: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "New Task Title",
        description: "This is a description for my new task.",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const Saving: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "Task being saved",
        description: "This task is currently being saved.",
        isSaving: true,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const SaveSuccess: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "Successfully saved",
        description: "This task was saved.",
        isSaving: false,
        saveSuccess: true,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const SaveError: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "Failed to save",
        description: "This task failed to save.",
        isSaving: false,
        saveSuccess: false,
        saveError: true,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const ShortTask: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.SHORT,
        color: "#EF4444",
        title: "",
        description: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const RelaxedTask: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.RELAXED,
        color: "#22C55E",
        title: "",
        description: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const ScheduledTask: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.SCHEDULED,
        color: "#EAB308",
        title: "",
        description: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

export const DeleteConfirm: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "Task to delete",
        description: "About to be deleted.",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: true,
        deleteError: false,
    },
};

export const DeleteError: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "Failed to delete",
        description: "Could not delete.",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: true,
        deleteError: true,
    },
};
