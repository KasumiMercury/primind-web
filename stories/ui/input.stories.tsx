import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "~/components/ui/input";

const meta = {
    title: "ui/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Enter text...",
    },
};

export const WithValue: Story = {
    args: {
        value: "Hello World",
    },
};

export const Disabled: Story = {
    args: {
        placeholder: "Disabled input",
        disabled: true,
    },
};

export const Invalid: Story = {
    render: () => (
        <div className="w-64">
            <Input placeholder="Invalid input" aria-invalid="true" />
        </div>
    ),
};

export const TypeEmail: Story = {
    args: {
        type: "email",
        placeholder: "email@example.com",
    },
};

export const TypePassword: Story = {
    args: {
        type: "password",
        placeholder: "Enter password",
    },
};
