import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    calculateDimensions,
    OperationShape,
} from "~/features/task/components/operation-shape";

const meta = {
    title: "Task/OperationShape",
    component: OperationShape,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        radius: {
            control: { type: "range", min: 0, max: 50, step: 1 },
            description: "Corner radius for the shape",
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof OperationShape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dimensions: calculateDimensions(400),
        radius: 10,
        children: (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "bold",
                }}
            >
                Content Area
            </div>
        ),
    },
};

export const Small: Story = {
    args: {
        dimensions: calculateDimensions(250),
        radius: 10,
        children: (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "16px",
                }}
            >
                Small
            </div>
        ),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "250px" }}>
                <Story />
            </div>
        ),
    ],
};

export const Large: Story = {
    args: {
        dimensions: calculateDimensions(600),
        radius: 10,
        children: (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "32px",
                }}
            >
                Large
            </div>
        ),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "600px" }}>
                <Story />
            </div>
        ),
    ],
};

export const SharpCorners: Story = {
    args: {
        dimensions: calculateDimensions(400),
        radius: 0,
        children: (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "24px",
                }}
            >
                Sharp Corners
            </div>
        ),
    },
};

export const VeryRounded: Story = {
    args: {
        dimensions: calculateDimensions(400),
        radius: 30,
        children: (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "24px",
                }}
            >
                Very Rounded
            </div>
        ),
    },
};
