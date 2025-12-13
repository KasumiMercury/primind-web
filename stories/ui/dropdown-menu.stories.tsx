import type { Meta, StoryObj } from "@storybook/react-vite";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const meta = {
    title: "ui/DropdownMenu",
    component: DropdownMenu,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: null,
    },
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => alert("Edit clicked")}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => alert("Duplicate clicked")}>
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => alert("Delete clicked")}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const AlignEnd: Story = {
    args: {
        children: null,
    },
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger>Menu (End Aligned)</DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};
