import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type IconComponent, ITEMS, type TaskTypeKey } from "./task-type-items";

interface QuickEditProps {
    className?: string;
    taskId: string;
    taskTypeKey: TaskTypeKey;
}
export function QuickEdit({ className, taskId, taskTypeKey }: QuickEditProps) {
    console.log("QuickEdit rendered for taskId:", taskId);

    const taskType = ITEMS[taskTypeKey];
    const TaskTypeIcon: IconComponent = taskType.icon;

    return (
        <form className={className}>
            <div className="mb-2 flex w-full items-start justify-between">
                <div className="w-15">
                    <TaskTypeIcon
                        className={taskType.className}
                        label={taskType.label}
                    />
                </div>
                <Button variant="destructive" size="sm" type="button">
                    <Trash />
                </Button>
            </div>

            <Input type="text" placeholder="Task Title" />
            <Textarea placeholder="Task Description" className="mt-2" />
            <Button type="submit" className="mt-4 w-full">
                Save
            </Button>
        </form>
    );
}
