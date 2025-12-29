import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateValue } from "react-aria-components";
import { DatePicker } from "~/components/ui/date-picker";

const meta = {
    title: "ui/DatePicker",
    component: DatePicker,
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
        label: {
            control: "text",
            description: "Label for the date picker",
        },
        isDisabled: {
            control: "boolean",
            description: "Whether the date picker is disabled",
        },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Select Date",
    },
};

function ControlledDatePicker() {
    const [value, setValue] = useState<DateValue | null>(null);
    return <DatePicker label="Select Date" value={value} onChange={setValue} />;
}

export const Interactive: Story = {
    render: () => <ControlledDatePicker />,
    parameters: {
        docs: {
            description: {
                story: "Interactive date picker with controlled state.",
            },
        },
    },
};

export const WithLabel: Story = {
    args: {
        label: "Due Date",
    },
};

export const WithDefaultValue: Story = {
    render: () => {
        const [value, setValue] = useState<DateValue | null>(
            parseDate("2025-01-15"),
        );
        return (
            <DatePicker label="Event Date" value={value} onChange={setValue} />
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Date picker with a pre-selected date.",
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
            <DatePicker label="Start Date" value={value} onChange={setValue} />
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Date picker initialized with today's date.",
            },
        },
    },
};

export const Disabled: Story = {
    args: {
        label: "Disabled",
        isDisabled: true,
    },
};

export const NoLabel: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: "Date picker without a label.",
            },
        },
    },
};
