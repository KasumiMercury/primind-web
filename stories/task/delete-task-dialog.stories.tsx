import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { fn } from "storybook/test";
import { DeleteTaskDialog } from "~/features/task/components/delete-task-dialog";

const meta = {
    title: "Task/DeleteTaskDialog",
    component: DeleteTaskDialog,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        open: {
            control: "boolean",
            description: "Whether the dialog is open.",
        },
        error: {
            control: "boolean",
            description: "Whether to show the error message.",
        },
        isDeleting: {
            control: "boolean",
            description: "Whether a delete operation is in progress.",
        },
    },
    args: {
        onOpenChange: fn(),
        onConfirm: fn(),
        onCancel: fn(),
    },
} satisfies Meta<typeof DeleteTaskDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        open: false,
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <div className="flex min-h-[200px] items-center justify-center">
                <button
                    type="button"
                    className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => setOpen(true)}
                >
                    Open Delete Dialog
                </button>
                <DeleteTaskDialog
                    {...args}
                    open={open}
                    onOpenChange={setOpen}
                    onCancel={() => setOpen(false)}
                />
            </div>
        );
    },
};

export const Deleting: Story = {
    args: {
        open: true,
        isDeleting: true,
        error: false,
    },
};

export const WithError: Story = {
    args: {
        open: true,
        isDeleting: false,
        error: true,
    },
};
