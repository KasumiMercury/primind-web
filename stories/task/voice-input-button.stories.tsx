import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { VoiceInputButton } from "~/features/task/components/voice-input-button";

const meta = {
    title: "Task/VoiceInputButton",
    component: VoiceInputButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="flex items-center justify-center rounded-lg border bg-card p-8">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        isListening: {
            control: "boolean",
            description: "Whether speech recognition is currently active",
        },
        isSupported: {
            control: "boolean",
            description:
                "Whether speech recognition is supported (button hidden if false)",
        },
        isDisabled: {
            control: "boolean",
            description: "Whether the button is disabled",
        },
        error: {
            control: "text",
            description: "Error message to display below the button",
        },
    },
    args: {
        onPress: fn(),
        isSupported: true,
    },
} satisfies Meta<typeof VoiceInputButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isListening: false,
    },
};

export const Listening: Story = {
    args: {
        isListening: true,
    },
};

export const Disabled: Story = {
    args: {
        isListening: false,
        isDisabled: true,
    },
};

export const WithError: Story = {
    args: {
        isListening: false,
        error: "Microphone access denied",
    },
};

export const Unsupported: Story = {
    args: {
        isListening: false,
        isSupported: false,
    },
    parameters: {
        docs: {
            description: {
                story: "When speech recognition is not supported, the button is not rendered at all.",
            },
        },
    },
};
