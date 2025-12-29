import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "~/components/ui/button";
import { NotificationPermissionDialogContent } from "~/features/device/components/notification-permission-dialog-content";

const meta = {
    title: "Device/NotificationPermissionDialog",
    component: NotificationPermissionDialogContent,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        isOpen: {
            control: "boolean",
            description: "Whether the dialog is open",
        },
        isRequesting: {
            control: "boolean",
            description:
                "Whether the notification permission request is in progress",
        },
    },
    args: {
        onOpenChange: fn(),
        onEnableNotifications: fn(),
        onNotNow: fn(),
        onDontAskAgain: fn(),
    },
} satisfies Meta<typeof NotificationPermissionDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogWithTrigger({
    isRequesting = false,
}: {
    isRequesting?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onPress={() => setOpen(true)}>Enable Notifications</Button>
            <NotificationPermissionDialogContent
                isOpen={open}
                onOpenChange={setOpen}
                isRequesting={isRequesting}
                onEnableNotifications={() => {
                    // Simulate API call
                    console.log("Enable notifications clicked");
                }}
                onNotNow={() => setOpen(false)}
                onDontAskAgain={() => setOpen(false)}
            />
        </>
    );
}

export const Default: Story = {
    args: {
        isOpen: false,
        isRequesting: false,
    },
    render: () => <DialogWithTrigger />,
    parameters: {
        docs: {
            description: {
                story: "Default state with a trigger button that opens the dialog.",
            },
        },
    },
};

export const Requesting: Story = {
    args: {
        isOpen: false,
        isRequesting: true,
    },
    render: () => <DialogWithTrigger isRequesting />,
    parameters: {
        docs: {
            description: {
                story: "Shows the loading state while requesting notification permission.",
            },
        },
    },
};
