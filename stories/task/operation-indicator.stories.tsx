import type { Meta, StoryObj } from "@storybook/react-vite";
import { OperationIndicator } from "~/task/operation-indicator";

const meta = {
    title: "Task/OperationIndicator",
    component: OperationIndicator,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        itemCount: {
            control: { type: "range", min: 0, max: 12, step: 1 },
            description: "Total number of items in the carousel",
        },
        selectedIndex: {
            control: { type: "range", min: 0, max: 11, step: 1 },
            description: "Currently selected item index",
        },
        className: {
            control: { type: "text" },
            description: "Container className",
        },
        selectedClassName: {
            control: { type: "text" },
            description: "Selected dot className",
        },
        unselectedClassName: {
            control: { type: "text" },
            description: "Unselected dot className",
        },
    },
} satisfies Meta<typeof OperationIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        itemCount: 4,
        selectedIndex: 0,
    },
};

export const MiddleSelected: Story = {
    args: {
        itemCount: 5,
        selectedIndex: 2,
    },
};

export const LastSelected: Story = {
    args: {
        itemCount: 4,
        selectedIndex: 3,
    },
};

export const FewItems: Story = {
    args: {
        itemCount: 2,
        selectedIndex: 0,
    },
};

export const SingleItem: Story = {
    args: {
        itemCount: 1,
        selectedIndex: 0,
    },
};

export const ManyItems: Story = {
    args: {
        itemCount: 8,
        selectedIndex: 4,
    },
};

export const NoItems: Story = {
    args: {
        itemCount: 0,
        selectedIndex: 0,
    },
};

export const LargeDots: Story = {
    args: {
        itemCount: 4,
        selectedIndex: 1,
        selectedClassName: "size-3 bg-primary",
        unselectedClassName: "size-3 border-2 border-primary/50 bg-transparent",
    },
};

export const WideSpacing: Story = {
    args: {
        itemCount: 4,
        selectedIndex: 2,
        className:
            "gap-3 rounded-full bg-background/80 px-4 py-3 backdrop-blur-sm",
    },
};

export const CustomColors: Story = {
    args: {
        itemCount: 5,
        selectedIndex: 2,
        selectedClassName: "size-1.5 bg-blue-500",
        unselectedClassName: "size-1.5 border border-blue-300 bg-transparent",
    },
};

export const SolidBackground: Story = {
    args: {
        itemCount: 4,
        selectedIndex: 1,
        className: "gap-1.5 rounded-full bg-secondary px-3 py-2",
    },
};

export const NarrowContainer: Story = {
    args: {
        itemCount: 6,
        selectedIndex: 3,
        className:
            "gap-1 rounded-full bg-background/90 px-2 py-1.5 backdrop-blur-sm",
    },
};
