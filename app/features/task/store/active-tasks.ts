import { atom } from "jotai";
import type { SerializableTask } from "../server/list-active-tasks.server";

/**
 * Stores the currently loaded active tasks.
 * Used to prevent duplicate colors within the same task type when creating new tasks.
 */
export const activeTasksAtom = atom<SerializableTask[]>([]);
