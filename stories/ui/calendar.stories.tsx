import {
    type DateValue,
    getLocalTimeZone,
    parseDate,
    today,
} from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Calendar } from "~/components/ui/calendar";

const meta = {
    title: "ui/Calendar",
    component: Calendar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        isDisabled: {
            control: "boolean",
            description: "Whether the calendar is disabled",
        },
        isReadOnly: {
            control: "boolean",
            description: "Whether the calendar is read-only",
        },
    },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

function ControlledCalendar() {
    const [value, setValue] = useState<DateValue | null>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <Calendar value={value} onChange={setValue} />
            <p className="text-muted-foreground text-sm">
                Selected: {value ? value.toString() : "None"}
            </p>
        </div>
    );
}

export const Interactive: Story = {
    render: () => <ControlledCalendar />,
    parameters: {
        docs: {
            description: {
                story: "Interactive calendar with controlled state showing selected date.",
            },
        },
    },
};

export const WithDefaultValue: Story = {
    render: () => {
        const [value, setValue] = useState<DateValue>(parseDate("2025-01-15"));
        return <Calendar value={value} onChange={setValue} />;
    },
    parameters: {
        docs: {
            description: {
                story: "Calendar with a pre-selected date.",
            },
        },
    },
};

export const WithTodayHighlighted: Story = {
    render: () => {
        const [value, setValue] = useState<DateValue>(
            today(getLocalTimeZone()),
        );
        return <Calendar value={value} onChange={setValue} />;
    },
    parameters: {
        docs: {
            description: {
                story: "Calendar initialized with today's date selected.",
            },
        },
    },
};

export const Disabled: Story = {
    args: {
        isDisabled: true,
    },
};

export const ReadOnly: Story = {
    render: () => {
        return <Calendar value={parseDate("2025-01-15")} isReadOnly />;
    },
    parameters: {
        docs: {
            description: {
                story: "Read-only calendar with a value that cannot be changed.",
            },
        },
    },
};

export const WithMinMaxDate: Story = {
    render: () => {
        const minDate = parseDate("2025-01-01");
        const maxDate = parseDate("2025-01-31");
        const [value, setValue] = useState<DateValue | null>(null);
        return (
            <div className="flex flex-col items-center gap-4">
                <Calendar
                    value={value}
                    onChange={setValue}
                    minValue={minDate}
                    maxValue={maxDate}
                />
                <p className="text-muted-foreground text-sm">
                    Only January 2025 dates are selectable
                </p>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Calendar with restricted date range (min and max values).",
            },
        },
    },
};
