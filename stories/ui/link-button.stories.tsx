import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft } from "lucide-react";
import { MemoryRouter } from "react-router";
import { RouterProvider } from "~/components/router-provider";

import { LinkButton } from "~/components/ui/link-button";

const meta = {
    title: "ui/LinkButton",
    component: LinkButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <RouterProvider>
                    <Story />
                </RouterProvider>
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        href: "/",
        children: "Link Button",
    },
};

export const Outline: Story = {
    args: {
        href: "/",
        variant: "outline",
        children: "Outline Link",
    },
};

export const Ghost: Story = {
    args: {
        href: "/",
        variant: "ghost",
        children: "Ghost Link",
    },
};

export const WithIcon: Story = {
    render: () => (
        <LinkButton href="/" variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back
        </LinkButton>
    ),
};

export const Destructive: Story = {
    args: {
        href: "/",
        variant: "destructive",
        children: "Delete",
    },
};
