import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import type { OperationConfig } from "~/features/task/components/operation-area";
import { OperationArea } from "~/features/task/components/operation-area";

const defaultOperation: OperationConfig = {
    upAction: () => console.log("Up"),
    downAction: () => console.log("Down"),
    leftAction: () => console.log("Left"),
    rightAction: () => console.log("Right"),
};

const meta = {
    title: "Task/OperationArea",
    component: OperationArea,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        width: {
            control: { type: "range", min: 200, max: 800, step: 50 },
            description: "Width of the operation area",
        },
        radius: {
            control: { type: "range", min: 0, max: 30, step: 1 },
            description: "Corner radius for the shape",
        },
        innerClassName: {
            control: { type: "text" },
            description:
                "Custom className for the inner button container (e.g., 'bg-blue-500', 'bg-secondary')",
        },
    },
} satisfies Meta<typeof OperationArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        width: 400,
        radius: 10,
        operation: {
            upAction: fn(() => console.log("Up action")),
            downAction: fn(() => console.log("Down action")),
            leftAction: fn(() => console.log("Left action")),
            rightAction: fn(() => console.log("Right action")),
        },
    },
};

export const Small: Story = {
    args: {
        width: 250,
        radius: 10,
        operation: { ...defaultOperation, upAction: fn(), downAction: fn() },
    },
};

export const Large: Story = {
    args: {
        width: 600,
        radius: 10,
        operation: { ...defaultOperation, upAction: fn(), downAction: fn() },
    },
};

export const SharpCorners: Story = {
    args: {
        width: 400,
        radius: 0,
        operation: { ...defaultOperation, upAction: fn(), downAction: fn() },
    },
};

export const RoundedCorners: Story = {
    args: {
        width: 400,
        radius: 25,
        operation: { ...defaultOperation, upAction: fn(), downAction: fn() },
    },
};

export const Interactive: Story = {
    args: {
        width: 400,
        radius: 10,
        operation: {
            upAction: fn(() => alert("Top / swipe up")),
            leftAction: fn(() => alert("Left / swipe left")),
            downAction: fn(() => alert("Center / swipe down")),
            rightAction: fn(() => alert("Right / swipe right")),
        },
    },
};

export const CustomBackground: Story = {
    args: {
        innerClassName: "bg-blue-500",
        operation: { ...defaultOperation, upAction: fn(), downAction: fn() },
    },
};
