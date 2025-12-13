import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "~/components/ui/textarea";

const meta = {
    title: "ui/Textarea",
    component: Textarea,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Enter description...",
    },
};

export const WithValue: Story = {
    args: {
        value: "This is a multi-line text area with some content.",
    },
};

export const Disabled: Story = {
    args: {
        placeholder: "Disabled textarea",
        isDisabled: true,
    },
};

export const Invalid: Story = {
    render: () => (
        <div className="w-64">
            <Textarea placeholder="Invalid textarea" aria-invalid={true} />
        </div>
    ),
};
