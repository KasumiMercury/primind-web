import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "~/components/ui/input";
import {
	Description,
	FieldError,
	Label,
	TextField,
} from "~/components/ui/text-field";

const meta = {
	title: "ui/TextField",
	component: TextField,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<TextField className="w-64">
			<Input placeholder="Enter text..." />
		</TextField>
	),
};

export const WithLabel: Story = {
	render: () => (
		<TextField className="w-64">
			<Label>Email</Label>
			<Input placeholder="email@example.com" />
		</TextField>
	),
};

export const WithDescription: Story = {
	render: () => (
		<TextField className="w-64">
			<Label>Email</Label>
			<Input placeholder="email@example.com" />
			<Description>We'll never share your email with anyone.</Description>
		</TextField>
	),
};

export const Invalid: Story = {
	render: () => (
		<TextField className="w-64" isInvalid>
			<Label>Email</Label>
			<Input placeholder="email@example.com" defaultValue="invalid-email" />
			<FieldError>Please enter a valid email address.</FieldError>
		</TextField>
	),
};

export const Required: Story = {
	render: () => (
		<TextField className="w-64" isRequired>
			<Label>Email</Label>
			<Input placeholder="email@example.com" />
		</TextField>
	),
};

export const Disabled: Story = {
	render: () => (
		<TextField className="w-64" isDisabled>
			<Label>Email</Label>
			<Input placeholder="email@example.com" />
		</TextField>
	),
};
