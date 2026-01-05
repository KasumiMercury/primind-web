import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { sessionInvalidModalOpenAtom } from "~/features/auth/store/session-invalid";
import { isAuthenticatedAtom } from "~/store/auth";
import { createTaskService, type TaskService } from "../store/task-service";
import type { TaskOperationResult } from "../store/types";

export function useTaskService(): TaskService {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const setSessionInvalid = useSetAtom(sessionInvalidModalOpenAtom);

    return useMemo(() => {
        const baseService = createTaskService(isAuthenticated);

        return new Proxy(baseService, {
            get(target, prop) {
                if (!(prop in target)) return undefined;
                const method = target[prop as keyof TaskService];

                return async (...args: unknown[]) => {
                    const result = await (
                        method as (
                            ...args: unknown[]
                        ) => Promise<TaskOperationResult<unknown>>
                    ) // abstracting the TaskService methods
                        .apply(target, args);
                    if (result.sessionInvalid) {
                        setSessionInvalid(true);
                    }
                    return result;
                };
            },
        }) as TaskService;
    }, [isAuthenticated, setSessionInvalid]);
}
