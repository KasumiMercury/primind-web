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
            description: "Saved title value.",
        },
        description: {
            control: "text",
            description: "Saved description value.",
        },
        editingField: {
            control: "select",
            options: ["none", "title", "description"],
            description: "Which field is currently being edited.",
        },
        editingValue: {
            control: "text",
            description: "Current value of the field being edited.",
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
        onStartEditTitle: fn(),
        onStartEditDescription: fn(),
        onEditingValueChange: fn(),
        onCancelEdit: fn(),
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

// Default view (plus buttons)
export const Default: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// With saved title (shows edit button)
export const WithSavedTitle: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "My Task Title",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// With saved description (shows edit button)
export const WithSavedDescription: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "This is my task description.",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// With both saved (shows edit buttons)
export const WithBothSaved: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "My Task Title",
        description: "This is my task description.",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Editing title
export const EditingTitle: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "title",
        editingValue: "New Task Title",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Editing description
export const EditingDescription: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "description",
        editingValue: "This is a description for my new task.",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Saving title
export const SavingTitle: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "title",
        editingValue: "Task being saved",
        isSaving: true,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Save success
export const SaveSuccess: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "Successfully saved",
        description: "",
        editingField: "title",
        editingValue: "Successfully saved",
        isSaving: false,
        saveSuccess: true,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Save error
export const SaveError: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "title",
        editingValue: "Failed to save",
        isSaving: false,
        saveSuccess: false,
        saveError: true,
        isDeleting: false,
        isDirty: true,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Short task (default view)
export const ShortTask: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.SHORT,
        color: "#EF4444",
        title: "",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Relaxed task (default view)
export const RelaxedTask: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.RELAXED,
        color: "#22C55E",
        title: "",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Scheduled task (default view)
export const ScheduledTask: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.SCHEDULED,
        color: "#EAB308",
        title: "",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: false,
        deleteError: false,
    },
};

// Delete confirmation dialog
export const DeleteConfirm: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: true,
        deleteError: false,
    },
};

// Delete error
export const DeleteError: Story = {
    args: {
        taskTypeKey: TASK_TYPE_KEYS.NEAR,
        color: "#3B82F6",
        title: "",
        description: "",
        editingField: "none",
        editingValue: "",
        isSaving: false,
        saveSuccess: false,
        saveError: false,
        isDeleting: false,
        isDirty: false,
        showDeleteConfirm: true,
        deleteError: true,
    },
};
