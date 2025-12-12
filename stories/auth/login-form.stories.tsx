import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LoginFormContent } from "~/features/auth/components/login-form";
import { mockProviders, singleProvider } from "./mock-providers";

const meta = {
    title: "Auth/LoginForm",
    component: LoginFormContent,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        onSubmit: fn(),
    },
} satisfies Meta<typeof LoginFormContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        providers: singleProvider,
    },
};

export const MultipleProviders: Story = {
    args: {
        providers: mockProviders,
    },
};

export const Loading: Story = {
    args: {
        providers: mockProviders,
        isSubmitting: true,
    },
};

export const WithError: Story = {
    args: {
        providers: singleProvider,
        error: "Invalid credentials. Please try again.",
    },
};

export const LongError: Story = {
    args: {
        providers: singleProvider,
        error: "Authentication failed: The provided credentials could not be verified. This could be due to an incorrect email address, an expired session, or a network connectivity issue. Please check your credentials and try again.",
    },
};

export const Interactive: Story = {
    args: {
        providers: mockProviders,
        onSubmit: fn((providerId: string) => {
            console.log(`Signing in with provider: ${providerId}`);
        }),
    },
};

export const CustomAction: Story = {
    args: {
        providers: mockProviders,
        action: "/api/custom-login",
    },
};
