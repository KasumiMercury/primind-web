import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import type { ButtonsConfig } from "~/task/operation-area";
import { OperationArea } from "~/task/operation-area";

const defaultButtons: ButtonsConfig = {
    top: {
        label: "Button 1",
        onClick: () => console.log("Button 1 clicked"),
    },
    bottomLeft: {
        label: "Button A",
        onClick: () => console.log("Button A clicked"),
    },
    bottomCenter: {
        label: "Button B",
        onClick: () => console.log("Button B clicked"),
    },
    bottomRight: {
        label: "Button C",
        onClick: () => console.log("Button C clicked"),
    },
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
    },
} satisfies Meta<typeof OperationArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        width: 400,
        radius: 10,
        buttons: {
            top: {
                label: "Button 1",
                onClick: fn(() => console.log("Button 1 clicked")),
            },
            bottomLeft: {
                label: "Button A",
                onClick: fn(() => console.log("Button A clicked")),
            },
            bottomCenter: {
                label: "Button B",
                onClick: fn(() => console.log("Button B clicked")),
            },
            bottomRight: {
                label: "Button C",
                onClick: fn(() => console.log("Button C clicked")),
            },
        },
    },
};

export const Small: Story = {
    args: {
        width: 250,
        radius: 10,
        buttons: {
            ...defaultButtons,
            top: { ...defaultButtons.top, onClick: fn() },
            bottomLeft: { ...defaultButtons.bottomLeft, onClick: fn() },
            bottomCenter: { ...defaultButtons.bottomCenter, onClick: fn() },
            bottomRight: { ...defaultButtons.bottomRight, onClick: fn() },
        },
    },
};

export const Large: Story = {
    args: {
        width: 600,
        radius: 10,
        buttons: {
            ...defaultButtons,
            top: { ...defaultButtons.top, onClick: fn() },
            bottomLeft: { ...defaultButtons.bottomLeft, onClick: fn() },
            bottomCenter: { ...defaultButtons.bottomCenter, onClick: fn() },
            bottomRight: { ...defaultButtons.bottomRight, onClick: fn() },
        },
    },
};

export const SharpCorners: Story = {
    args: {
        width: 400,
        radius: 0,
        buttons: {
            ...defaultButtons,
            top: { ...defaultButtons.top, onClick: fn() },
            bottomLeft: { ...defaultButtons.bottomLeft, onClick: fn() },
            bottomCenter: { ...defaultButtons.bottomCenter, onClick: fn() },
            bottomRight: { ...defaultButtons.bottomRight, onClick: fn() },
        },
    },
};

export const RoundedCorners: Story = {
    args: {
        width: 400,
        radius: 25,
        buttons: {
            ...defaultButtons,
            top: { ...defaultButtons.top, onClick: fn() },
            bottomLeft: { ...defaultButtons.bottomLeft, onClick: fn() },
            bottomCenter: { ...defaultButtons.bottomCenter, onClick: fn() },
            bottomRight: { ...defaultButtons.bottomRight, onClick: fn() },
        },
    },
};

export const Interactive: Story = {
    args: {
        width: 400,
        radius: 10,
        buttons: {
            top: {
                label: "Click Me!",
                onClick: fn(() => alert("Top button clicked!")),
            },
            bottomLeft: {
                label: "Left",
                onClick: fn(() => alert("Left button clicked!")),
            },
            bottomCenter: {
                label: "Center",
                onClick: fn(() => alert("Center button clicked!")),
            },
            bottomRight: {
                label: "Right",
                onClick: fn(() => alert("Right button clicked!")),
            },
        },
    },
};
