import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { fn } from "storybook/test";
import { LoginDialog } from "~/auth/login-dialog";
import { LoginFormContent } from "~/auth/login-form";
import { Button } from "~/components/ui/button";
import { mockProviders, singleProvider } from "./mock-providers";

const meta = {
    title: "Auth/LoginDialog",
    component: LoginDialog,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    args: {
        onOpenChange: fn(),
    },
} satisfies Meta<typeof LoginDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
    args: {
        open: false,
        children: (
            <LoginFormContent providers={singleProvider} onSubmit={fn()} />
        ),
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Button onClick={() => setOpen(true)}>Open Login Dialog</Button>
                <LoginDialog {...args} open={open} onOpenChange={setOpen} />
            </div>
        );
    },
};

export const Closed: Story = {
    args: {
        open: false,
        children: (
            <LoginFormContent providers={singleProvider} onSubmit={fn()} />
        ),
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return <LoginDialog {...args} open={open} onOpenChange={setOpen} />;
    },
};

export const WithMultipleProviders: Story = {
    args: {
        open: false,
        children: (
            <LoginFormContent providers={mockProviders} onSubmit={fn()} />
        ),
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Button onClick={() => setOpen(true)}>Open Login Dialog</Button>
                <LoginDialog {...args} open={open} onOpenChange={setOpen} />
            </div>
        );
    },
};

export const WithError: Story = {
    args: {
        open: false,
        children: (
            <LoginFormContent
                providers={singleProvider}
                error="Invalid credentials. Please try again."
                onSubmit={fn()}
            />
        ),
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Button onClick={() => setOpen(true)}>Open Login Dialog</Button>
                <LoginDialog {...args} open={open} onOpenChange={setOpen} />
            </div>
        );
    },
};

export const CustomAction: Story = {
    args: {
        open: false,
        children: (
            <LoginFormContent
                providers={mockProviders}
                action="/api/custom-login"
                onSubmit={fn()}
            />
        ),
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Button onClick={() => setOpen(true)}>Open Login Dialog</Button>
                <LoginDialog {...args} open={open} onOpenChange={setOpen} />
            </div>
        );
    },
};

export const Interactive: Story = {
    args: {
        open: false,
        children: (
            <LoginFormContent providers={mockProviders} onSubmit={fn()} />
        ),
    },
    render: (args) => {
        const [open, setOpen] = React.useState(args.open);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Button onClick={() => setOpen(true)}>Open Login Dialog</Button>
                <LoginDialog {...args} open={open} onOpenChange={setOpen} />
            </div>
        );
    },
};
