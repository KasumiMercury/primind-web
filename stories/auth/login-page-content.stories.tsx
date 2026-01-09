import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LoginFormContent } from "~/features/auth/components/login-form";
import { LoginPageContent } from "~/features/auth/components/login-page-content";
import { mockProviders, singleProvider } from "./mock-providers";

const meta = {
    title: "Auth/LoginPageContent",
    component: LoginPageContent,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof LoginPageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <LoginFormContent providers={singleProvider} onSubmit={fn()} />
        ),
    },
};

export const CustomTitle: Story = {
    args: {
        title: "Welcome Back",
        children: (
            <LoginFormContent providers={singleProvider} onSubmit={fn()} />
        ),
    },
};

export const CustomAction: Story = {
    args: {
        title: "Login",
        children: (
            <LoginFormContent
                providers={mockProviders}
                action="/api/custom-login"
                onSubmit={fn()}
            />
        ),
    },
};

export const WithError: Story = {
    args: {
        title: "Login",
        children: (
            <LoginFormContent
                providers={singleProvider}
                error="Invalid credentials. Please try again."
                onSubmit={fn()}
            />
        ),
    },
};

export const WithCustomContent: Story = {
    args: {
        title: "Custom Login",
        children: (
            <div className="space-y-4 text-center">
                <p className="text-muted-foreground text-sm">
                    This is a custom login page content.
                </p>
                <LoginFormContent
                    providers={mockProviders}
                    error="This is a custom error message."
                    onSubmit={fn()}
                />
            </div>
        ),
    },
};

export const FullPage: Story = {
    args: {
        title: "Login to Your Account",
        children: (
            <LoginFormContent providers={mockProviders} onSubmit={fn()} />
        ),
    },
};
