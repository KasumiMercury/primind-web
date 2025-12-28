import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { fn } from "storybook/test";
import { TitleEdit } from "~/features/task/components/title-edit";

const meta = {
    title: "Task/TitleEdit",
    component: TitleEdit,
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
            description: "Current input value",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text for the input",
        },
        isDisabled: {
            control: "boolean",
            description: "Whether the input is disabled",
        },
        autoFocus: {
            control: "boolean",
            description: "Whether the input should auto-focus on mount",
        },
        enableVoiceInput: {
            control: "boolean",
            description: "Whether to show the voice input button",
        },
    },
    args: {
        onChange: fn(),
        placeholder: "Enter title...",
        enableVoiceInput: true,
    },
} satisfies Meta<typeof TitleEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: "",
    },
};

export const WithValue: Story = {
    args: {
        value: "買い物",
    },
};

export const Disabled: Story = {
    args: {
        value: "",
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
                story: "Shows the voice input button below the input field (right-aligned). The button is only visible when the browser supports the Web Speech API.",
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
            <TitleEdit
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
