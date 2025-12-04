import type { Meta, StoryObj } from "@storybook/react-vite";
import { OperationArea } from "~/task/operation-area";

const meta = {
    title: "Task/OperationArea",
    component: OperationArea,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof OperationArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
