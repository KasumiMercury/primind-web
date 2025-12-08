import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickEdit } from "~/task/quick-edit";
import { TASK_TYPE_KEYS } from "~/task/task-type-items";

const meta = {
    title: "Task/QuickEdit",
    component: QuickEdit,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        className: {
            control: "text",
            description: "Additional CSS classes to apply to the component.",
            defaultValue: "",
        },
        taskId: {
            control: "text",
            description: "The ID of the task to edit.",
            defaultValue: "019afbaa-64e4-70d9-9cd1-cd544220afb3",
        },
    },
} satisfies Meta<typeof QuickEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        className: "",
        taskId: "019afbaa-64e4-70d9-9cd1-cd544220afb3",
        taskTypeKey: TASK_TYPE_KEYS.NORMAL,
    },
};
