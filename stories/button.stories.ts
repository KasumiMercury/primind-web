import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { Button } from "~/components/ui/button";

const meta = {
    title: "shadcn-ui/button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Button",
        variant: "default",
    },
};

export const Destructive: Story = {
    args: {
        children: "Button",
        variant: "destructive",
    },
};

export const Outline: Story = {
    args: {
        children: "Button",
        variant: "outline",
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
};

export const Ghost: Story = {
    args: {
        children: "Button",
        variant: "ghost",
    },
};

export const Link: Story = {
    args: {
        children: "Button",
        variant: "link",
    },
};

// Size stories
export const Small: Story = {
    args: {
        children: "Button",
        size: "sm",
    },
};

export const Large: Story = {
    args: {
        children: "Button",
        size: "lg",
    },
};

export const Icon: Story = {
    args: {
        children: "🔔",
        size: "icon",
    },
};

export const IconSmall: Story = {
    args: {
        children: "🔔",
        size: "icon-sm",
    },
};

export const IconLarge: Story = {
    args: {
        children: "🔔",
        size: "icon-lg",
    },
};

export const Disabled: Story = {
    args: {
        children: "Button",
        disabled: true,
    },
};
