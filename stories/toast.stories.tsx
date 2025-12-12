import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

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
    title: "Feedback/Toast",
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
