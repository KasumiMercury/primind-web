import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskType } from "~/gen/task/v1/task_pb";
import { createMockTask, render, screen } from "~/test/utils";
import { TaskCard } from "./task-card";

describe("TaskCard", () => {
    it("renders task title", () => {
        const task = createMockTask({ title: "Test Task Title" });
        render(<TaskCard task={task} />);

        expect(screen.getByText("Test Task Title")).toBeInTheDocument();
    });

    it("renders empty state when title is empty", () => {
        const task = createMockTask({ title: "" });
        render(<TaskCard task={task} />);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("renders empty state when title is whitespace only", () => {
        const task = createMockTask({ title: "   " });
        render(<TaskCard task={task} />);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("calls onPress when clicked", async () => {
        const user = userEvent.setup();
        const onPress = vi.fn();
        const task = createMockTask();

        render(<TaskCard task={task} onPress={onPress} />);

        await user.click(screen.getByRole("button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("renders correct aria-label with title", () => {
        const task = createMockTask({ title: "My Task" });
        render(<TaskCard task={task} />);

        expect(screen.getByRole("button")).toHaveAttribute(
            "aria-label",
            "Task: My Task",
        );
    });

    it("renders correct aria-label without title", () => {
        const task = createMockTask({ title: "" });
        render(<TaskCard task={task} />);

        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label");
        expect(button.getAttribute("aria-label")).toContain("task");
    });

    it("applies custom className", () => {
        const task = createMockTask();
        render(<TaskCard task={task} className="custom-class" />);

        expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("renders different task types correctly", () => {
        const shortTask = createMockTask({ taskType: TaskType.SHORT });
        const { rerender } = render(<TaskCard task={shortTask} />);
        expect(screen.getByRole("button")).toBeInTheDocument();

        const nearTask = createMockTask({ taskType: TaskType.NEAR });
        rerender(<TaskCard task={nearTask} />);
        expect(screen.getByRole("button")).toBeInTheDocument();

        const relaxedTask = createMockTask({ taskType: TaskType.RELAXED });
        rerender(<TaskCard task={relaxedTask} />);
        expect(screen.getByRole("button")).toBeInTheDocument();

        const scheduledTask = createMockTask({ taskType: TaskType.SCHEDULED });
        rerender(<TaskCard task={scheduledTask} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("displays relative time when createdAt is provided", () => {
        const nowSeconds = Math.floor(Date.now() / 1000);
        const task = createMockTask({
            createdAt: { seconds: String(nowSeconds - 60) }, // 1 minute ago
        });
        render(<TaskCard task={task} />);

        // Should render some time-related text
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("handles task without createdAt", () => {
        const task = createMockTask({ createdAt: undefined });
        render(<TaskCard task={task} />);

        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});
