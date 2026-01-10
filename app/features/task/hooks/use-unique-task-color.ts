import { useAtomValue } from "jotai";
import type { TaskType } from "~/gen/task/v1/task_pb";
import { getRandomTaskColorExcluding } from "../lib/task-colors";
import { activeTasksAtom } from "../store/active-tasks";

export function useUniqueTaskColor() {
    const activeTasks = useAtomValue(activeTasksAtom);

    return (taskType: TaskType): string => {
        const usedColors = new Set(
            activeTasks
                .filter((task) => task.taskType === taskType)
                .map((task) => task.color),
        );
        return getRandomTaskColorExcluding(usedColors);
    };
}
