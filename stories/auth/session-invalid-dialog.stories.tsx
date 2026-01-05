import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "~/components/ui/button";
import { SessionInvalidDialogContent } from "~/features/auth/components/session-invalid-dialog-content";

const meta = {
    title: "Auth/SessionInvalidDialog",
    component: SessionInvalidDialogContent,
    parameters: {
        layout: "centered",
    },
    tags: [],
    argTypes: {
        isOpen: {
            control: "boolean",
            description: "Whether the dialog is open",
        },
    },
    args: {
        onOpenChange: fn(),
        onGoHome: fn(),
    },
} satisfies Meta<typeof SessionInvalidDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogWithTrigger() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>
                Show Session Invalid Dialog
            </Button>
            <SessionInvalidDialogContent
                isOpen={open}
                onOpenChange={setOpen}
                onGoHome={() => {
                    console.log("Go home clicked");
                    setOpen(false);
                }}
            />
        </>
    );
}

export const Default: Story = {
    args: {
        isOpen: false,
    },
    render: () => <DialogWithTrigger />,
    parameters: {
        docs: {
            description: {
                story: "Default state with a trigger button that opens the dialog. This dialog is shown when the user's session has been invalidated (e.g., signed out from another device).",
            },
        },
    },
};

export const Open: Story = {
    args: {
        isOpen: true,
    },
    parameters: {
        docs: {
            description: {
                story: "The dialog in its open state. Note that the dialog cannot be dismissed by clicking outside or pressing Escape - the user must click the button.",
            },
        },
    },
};
