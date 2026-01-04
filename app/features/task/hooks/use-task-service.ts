import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { isAuthenticatedAtom } from "~/store/auth";
import { createTaskService } from "../store/task-service";

export function useTaskService() {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    return useMemo(() => createTaskService(isAuthenticated), [isAuthenticated]);
}
