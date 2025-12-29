import { Time } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { TimeValue } from "react-aria-components";
import { Label } from "~/components/ui/text-field";
import { TimeField, TimeInput, TimeSegment } from "~/components/ui/time-field";

const meta = {
    title: "ui/TimeField",
    component: TimeField,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="w-64">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        isDisabled: {
            control: "boolean",
            description: "Whether the time field is disabled",
        },
        isReadOnly: {
            control: "boolean",
            description: "Whether the time field is read-only",
        },
    },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <TimeField>
            <TimeInput>
                {(segment) => <TimeSegment segment={segment} />}
            </TimeInput>
        </TimeField>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <TimeField>
            <Label>Time</Label>
            <TimeInput>
                {(segment) => <TimeSegment segment={segment} />}
            </TimeInput>
        </TimeField>
    ),
};

function ControlledTimeField() {
    const [value, setValue] = useState<TimeValue | null>(null);
    return (
        <div className="flex flex-col gap-4">
            <TimeField value={value} onChange={setValue}>
                <Label>Select Time</Label>
                <TimeInput>
                    {(segment) => <TimeSegment segment={segment} />}
                </TimeInput>
            </TimeField>
            <p className="text-muted-foreground text-sm">
                Selected: {value ? value.toString() : "None"}
            </p>
        </div>
    );
}

export const Interactive: Story = {
    render: () => <ControlledTimeField />,
    parameters: {
        docs: {
            description: {
                story: "Interactive time field with controlled state.",
            },
        },
    },
};

export const WithDefaultValue: Story = {
    render: () => {
        const [value, setValue] = useState<TimeValue | null>(new Time(14, 30));
        return (
            <TimeField value={value} onChange={setValue}>
                <Label>Meeting Time</Label>
                <TimeInput>
                    {(segment) => <TimeSegment segment={segment} />}
                </TimeInput>
            </TimeField>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Time field with a pre-filled time (2:30 PM).",
            },
        },
    },
};

export const WithCurrentTime: Story = {
    render: () => {
        const now = new Date();
        const [value, setValue] = useState<TimeValue | null>(
            new Time(now.getHours(), now.getMinutes()),
        );
        return (
            <TimeField value={value} onChange={setValue}>
                <Label>Current Time</Label>
                <TimeInput>
                    {(segment) => <TimeSegment segment={segment} />}
                </TimeInput>
            </TimeField>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Time field initialized with the current time.",
            },
        },
    },
};

export const Disabled: Story = {
    render: () => (
        <TimeField isDisabled>
            <Label>Disabled</Label>
            <TimeInput>
                {(segment) => <TimeSegment segment={segment} />}
            </TimeInput>
        </TimeField>
    ),
};

export const ReadOnly: Story = {
    render: () => (
        <TimeField value={new Time(9, 0)} isReadOnly>
            <Label>Read Only</Label>
            <TimeInput>
                {(segment) => <TimeSegment segment={segment} />}
            </TimeInput>
        </TimeField>
    ),
    parameters: {
        docs: {
            description: {
                story: "Read-only time field with a value that cannot be changed.",
            },
        },
    },
};

export const HourCycle24: Story = {
    render: () => {
        const [value, setValue] = useState<TimeValue | null>(new Time(18, 45));
        return (
            <TimeField value={value} onChange={setValue} hourCycle={24}>
                <Label>24-Hour Format</Label>
                <TimeInput>
                    {(segment) => <TimeSegment segment={segment} />}
                </TimeInput>
            </TimeField>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Time field with 24-hour format.",
            },
        },
    },
};

export const WithMinMax: Story = {
    render: () => {
        const [value, setValue] = useState<TimeValue | null>(null);
        return (
            <div className="flex flex-col gap-4">
                <TimeField
                    value={value}
                    onChange={setValue}
                    minValue={new Time(9, 0)}
                    maxValue={new Time(17, 0)}
                >
                    <Label>Business Hours</Label>
                    <TimeInput>
                        {(segment) => <TimeSegment segment={segment} />}
                    </TimeInput>
                </TimeField>
                <p className="text-muted-foreground text-sm">
                    Only times between 9:00 AM and 5:00 PM are valid
                </p>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Time field with restricted time range (business hours).",
            },
        },
    },
};
