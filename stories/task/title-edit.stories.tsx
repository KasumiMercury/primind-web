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
        canRevert: {
            control: "boolean",
            description: "Whether to show the revert button",
        },
    },
    args: {
        onChange: fn(),
        placeholder: "Enter title...",
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

export const WithoutVoiceInput: Story = {
    args: {
        value: "",
        voiceInput: undefined,
    },
    parameters: {
        docs: {
            description: {
                story: "Voice input is hidden when voiceInput prop is undefined.",
            },
        },
    },
};

export const VoiceInputSupported: Story = {
    args: {
        value: "",
        voiceInput: {
            isSupported: true,
            isListening: false,
            error: null,
            onStartListening: fn(),
            onStopListening: fn(),
            onClearError: fn(),
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Voice input button is shown when browser supports the Web Speech API.",
            },
        },
    },
};

export const VoiceInputListening: Story = {
    args: {
        value: "Previous text",
        voiceInput: {
            isSupported: true,
            isListening: true,
            error: null,
            onStartListening: fn(),
            onStopListening: fn(),
            onClearError: fn(),
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Voice input button shows listening state when actively recording.",
            },
        },
    },
};

export const VoiceInputError: Story = {
    args: {
        value: "",
        voiceInput: {
            isSupported: true,
            isListening: false,
            error: "Microphone access denied",
            onStartListening: fn(),
            onStopListening: fn(),
            onClearError: fn(),
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Voice input shows error state when speech recognition fails.",
            },
        },
    },
};

export const VoiceInputUnsupported: Story = {
    args: {
        value: "",
        voiceInput: {
            isSupported: false,
            isListening: false,
            error: null,
            onStartListening: fn(),
            onStopListening: fn(),
            onClearError: fn(),
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Voice input button is hidden when speech recognition is not supported.",
            },
        },
    },
};

export const WithRevertButton: Story = {
    args: {
        value: "Text after voice input",
        canRevert: true,
        onRevert: fn(),
        voiceInput: {
            isSupported: true,
            isListening: false,
            error: null,
            onStartListening: fn(),
            onStopListening: fn(),
            onClearError: fn(),
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Revert button is shown when canRevert is true, allowing users to undo voice input.",
            },
        },
    },
};

export const Interactive: Story = {
    args: {
        value: "",
        voiceInput: {
            isSupported: true,
            isListening: false,
            error: null,
            onStartListening: fn(),
            onStopListening: fn(),
            onClearError: fn(),
        },
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
