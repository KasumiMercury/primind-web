import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "~/components/ui/input";
import { TextField } from "~/components/ui/text-field";

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
        defaultValue: "Hello World",
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
        <TextField isInvalid>
            <Input placeholder="Invalid input" />
        </TextField>
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
