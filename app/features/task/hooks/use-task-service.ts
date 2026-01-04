import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "~/store/auth";
import { createTaskService } from "../store/task-service";

export function useTaskService() {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);
	return useMemo(() => createTaskService(isAuthenticated), [isAuthenticated]);
}
