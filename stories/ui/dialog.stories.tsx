import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

const meta = {
    title: "ui/Dialog",
    component: Dialog,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDialogExample() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>Open Dialog</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>
                            This is a dialog description. It provides additional
                            context about the dialog content.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Dialog content goes here.</p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onPress={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onPress={() => setOpen(false)}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export const Default: Story = {
    args: {
        children: null,
    },
    render: () => <ControlledDialogExample />,
};

function NoCloseButtonExample() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>Open Dialog</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this item? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onPress={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onPress={() => setOpen(false)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export const WithoutCloseButton: Story = {
    args: {
        children: null,
    },
    render: () => <NoCloseButtonExample />,
};
