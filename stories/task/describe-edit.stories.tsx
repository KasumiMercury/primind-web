import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { fn } from "storybook/test";
import { DescribeEdit } from "~/features/task/components/describe-edit";

const meta = {
    title: "Task/DescribeEdit",
    component: DescribeEdit,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="w-80 rounded-lg border bg-card p-4">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        value: {
            control: "text",
            description: "Current textarea value",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text for the textarea",
        },
        isDisabled: {
            control: "boolean",
            description: "Whether the textarea is disabled",
        },
        autoFocus: {
            control: "boolean",
            description: "Whether the textarea should auto-focus on mount",
        },
        enableVoiceInput: {
            control: "boolean",
            description: "Whether to show the voice input button",
        },
    },
    args: {
        onChange: fn(),
        placeholder: "Enter description...",
        enableVoiceInput: true,
    },
} satisfies Meta<typeof DescribeEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: "",
    },
};

export const WithValue: Story = {
    args: {
        value: "This is a task description that can span multiple lines.\n\nIt supports voice input for hands-free editing.",
    },
};

export const Disabled: Story = {
    args: {
        value: "This is disabled",
        isDisabled: true,
    },
};

export const WithVoiceInput: Story = {
    args: {
        value: "",
        enableVoiceInput: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Shows the voice input button below the textarea (right-aligned). The button is only visible when the browser supports the Web Speech API.",
            },
        },
    },
};

export const WithoutVoiceInput: Story = {
    args: {
        value: "",
        enableVoiceInput: false,
    },
    parameters: {
        docs: {
            description: {
                story: "Voice input can be disabled by setting enableVoiceInput to false.",
            },
        },
    },
};

export const Interactive: Story = {
    args: {
        value: "",
    },
    render: (args) => {
        const [value, setValue] = React.useState(args.value);
        return (
            <DescribeEdit
                {...args}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                    args.onChange(newValue);
                }}
            />
        );
    },
};
