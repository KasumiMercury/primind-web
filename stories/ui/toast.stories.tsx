import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ToasterPositioned } from "~/components/ui/toaster-positioned";

function ToastDemo({ message }: { message: string }) {
    return (
        <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => toast.error(message)}
        >
            Show Error Toast
        </button>
    );
}

const meta = {
    title: "ui/Toast",
    component: ToastDemo,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        message: {
            control: "text",
            description: "The error message to display in the toast.",
        },
    },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GenericError: Story = {
    args: {
        message: "An error occurred.",
    },
};

function ToastVariantsDemo() {
    return (
        <div className="flex flex-col gap-4">
            <Button
                onPress={() =>
                    toast.success("Operation completed successfully")
                }
            >
                Success Toast
            </Button>
            <Button onPress={() => toast.error("An error occurred")}>
                Error Toast
            </Button>
            <Button onPress={() => toast.warning("Warning: Please review")}>
                Warning Toast
            </Button>
            <Button onPress={() => toast.info("Information message")}>
                Info Toast
            </Button>
            <Button onPress={() => toast("Default notification")}>
                Default Toast
            </Button>
        </div>
    );
}

export const AllVariants: Story = {
    args: {
        message: "An error occurred.",
    },
    render: () => <ToastVariantsDemo />,
    parameters: {
        docs: {
            description: {
                story: "Shows all toast variants: success, error, warning, info, and default.",
            },
        },
    },
};

function PositionDemo({
    position,
}: {
    position: "top-center" | "bottom-right";
}) {
    return (
        <div className="flex flex-col gap-4">
            <ToasterPositioned position={position} />
            <p className="text-muted-foreground text-sm">
                Toast position: <strong>{position}</strong>
            </p>
            <Button onPress={() => toast.success("This is a toast message")}>
                Show Toast
            </Button>
        </div>
    );
}

export const PositionBottomRight: Story = {
    args: {
        message: "This is a toast message.",
    },
    render: () => <PositionDemo position="bottom-right" />,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                story: "Toast positioned at bottom-right (desktop layout).",
            },
        },
    },
};

export const PositionTopCenter: Story = {
    args: {
        message: "This is a toast message.",
    },
    render: () => <PositionDemo position="top-center" />,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                story: "Toast positioned at top-center (mobile layout).",
            },
        },
    },
};
