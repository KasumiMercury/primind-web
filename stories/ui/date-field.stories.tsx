import {
    type DateValue,
    getLocalTimeZone,
    parseDate,
    today,
} from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateField, DateInput, DateSegment } from "~/components/ui/date-field";
import { Label } from "~/components/ui/text-field";

const meta = {
    title: "ui/DateField",
    component: DateField,
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
            description: "Whether the date field is disabled",
        },
        isReadOnly: {
            control: "boolean",
            description: "Whether the date field is read-only",
        },
    },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <DateField>
            <DateInput>
                {(segment) => <DateSegment segment={segment} />}
            </DateInput>
        </DateField>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <DateField>
            <Label>Date</Label>
            <DateInput>
                {(segment) => <DateSegment segment={segment} />}
            </DateInput>
        </DateField>
    ),
};

function ControlledDateField() {
    const [value, setValue] = useState<DateValue | null>(null);
    return (
        <div className="flex flex-col gap-4">
            <DateField value={value} onChange={setValue}>
                <Label>Select Date</Label>
                <DateInput>
                    {(segment) => <DateSegment segment={segment} />}
                </DateInput>
            </DateField>
            <p className="text-muted-foreground text-sm">
                Selected: {value ? value.toString() : "None"}
            </p>
        </div>
    );
}

export const Interactive: Story = {
    render: () => <ControlledDateField />,
    parameters: {
        docs: {
            description: {
                story: "Interactive date field with controlled state.",
            },
        },
    },
};

export const WithDefaultValue: Story = {
    render: () => {
        const [value, setValue] = useState<DateValue | null>(
            parseDate("2025-01-15"),
        );
        return (
            <DateField value={value} onChange={setValue}>
                <Label>Event Date</Label>
                <DateInput>
                    {(segment) => <DateSegment segment={segment} />}
                </DateInput>
            </DateField>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Date field with a pre-filled date.",
            },
        },
    },
};

export const WithTodayValue: Story = {
    render: () => {
        const [value, setValue] = useState<DateValue | null>(
            today(getLocalTimeZone()),
        );
        return (
            <DateField value={value} onChange={setValue}>
                <Label>Today</Label>
                <DateInput>
                    {(segment) => <DateSegment segment={segment} />}
                </DateInput>
            </DateField>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Date field initialized with today's date.",
            },
        },
    },
};

export const Disabled: Story = {
    render: () => (
        <DateField isDisabled>
            <Label>Disabled</Label>
            <DateInput>
                {(segment) => <DateSegment segment={segment} />}
            </DateInput>
        </DateField>
    ),
};

export const ReadOnly: Story = {
    render: () => (
        <DateField value={parseDate("2025-01-15")} isReadOnly>
            <Label>Read Only</Label>
            <DateInput>
                {(segment) => <DateSegment segment={segment} />}
            </DateInput>
        </DateField>
    ),
    parameters: {
        docs: {
            description: {
                story: "Read-only date field with a value that cannot be changed.",
            },
        },
    },
};
