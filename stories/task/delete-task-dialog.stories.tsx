import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
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
            <div className="flex min-h-50 items-center justify-center">
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Open the dialog
        const openButton = canvas.getByRole("button", {
            name: "Open Delete Dialog",
        });
        await userEvent.click(openButton);

        // Verify dialog is open (using screen because dialog is portaled)
        const dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
    },
};

export const Deleting: Story = {
    args: {
        open: true,
        isDeleting: true,
        error: false,
    },
    play: async () => {
        // Dialog is portaled, so use screen instead of canvas
        const dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();

        // Buttons inside dialog should be disabled during deletion
        const dialogCanvas = within(dialog);
        const buttons = dialogCanvas.getAllByRole("button");
        for (const button of buttons) {
            expect(button).toHaveAttribute("data-disabled", "true");
        }
    },
};

export const WithError: Story = {
    args: {
        open: true,
        isDeleting: false,
        error: true,
    },
    play: async () => {
        // Dialog is portaled, so use screen
        const dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();

        // Error message should be displayed inside dialog
        const dialogCanvas = within(dialog);
        const errorElement = dialogCanvas.getByText(/error|エラー/i);
        expect(errorElement).toBeInTheDocument();
    },
};

export const ConfirmDeletion: Story = {
    args: {
        open: true,
        isDeleting: false,
        error: false,
    },
    play: async ({ args }) => {
        // Dialog is portaled, so use screen
        const dialog = await screen.findByRole("dialog");
        const dialogCanvas = within(dialog);

        // Find and click delete button
        const deleteButton = dialogCanvas.getByRole("button", {
            name: /delete|削除/i,
        });
        await userEvent.click(deleteButton);

        expect(args.onConfirm).toHaveBeenCalled();
    },
};

export const CancelDeletion: Story = {
    args: {
        open: true,
        isDeleting: false,
        error: false,
    },
    play: async ({ args }) => {
        // Dialog is portaled, so use screen
        const dialog = await screen.findByRole("dialog");
        const dialogCanvas = within(dialog);

        // Find and click cancel button
        const cancelButton = dialogCanvas.getByRole("button", {
            name: /cancel|キャンセル/i,
        });
        await userEvent.click(cancelButton);

        expect(args.onCancel).toHaveBeenCalled();
    },
};
