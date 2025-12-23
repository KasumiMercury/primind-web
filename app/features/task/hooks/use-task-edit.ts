import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { EditedValues } from "../components/quick-edit-content";
import { createUpdateTaskFormData } from "../lib/quick-edit-form-data";

const SAVE_SUCCESS_DURATION_MS = 2500;
const ERROR_DISPLAY_DURATION_MS = 2500;

interface UseTaskEditOptions {
    taskId: string;
    initialTitle?: string;
    initialDescription?: string;
}

interface ExternalSyncData {
    title: string;
    description: string;
}

interface UseTaskEditReturn {
    lastSavedTitle: string;
    lastSavedDescription: string;
    isSaving: boolean;
    saveSuccess: boolean;
    saveError: boolean;
    isDirty: boolean;
    setIsDirty: (dirty: boolean) => void;
    handleSave: (values: EditedValues) => void;
    syncWithExternalData: (data: ExternalSyncData) => void;
}

export function useTaskEdit({
    taskId,
    initialTitle = "",
    initialDescription = "",
}: UseTaskEditOptions): UseTaskEditReturn {
    const saveFetcher = useFetcher({ key: `save-${taskId}` });

    const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
    const [lastSavedDescription, setLastSavedDescription] =
        useState(initialDescription);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const isSaving = saveFetcher.state !== "idle";

    const hasStartedSaving = useRef(false);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pendingSaveValues = useRef<{
        title: string;
        description: string;
    } | null>(null);

    const submittedValues = useRef<{
        title: string;
        description: string;
    } | null>(null);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!hasStartedSaving.current) {
            return;
        }

        if (saveFetcher.state !== "idle") {
            return;
        }

        if (saveFetcher.data?.success) {
            if (submittedValues.current) {
                setLastSavedTitle(submittedValues.current.title);
                setLastSavedDescription(submittedValues.current.description);
            }

            const hasPendingChanges =
                pendingSaveValues.current &&
                submittedValues.current &&
                (pendingSaveValues.current.title !==
                    submittedValues.current.title ||
                    pendingSaveValues.current.description !==
                        submittedValues.current.description);

            if (hasPendingChanges && pendingSaveValues.current) {
                submittedValues.current = pendingSaveValues.current;
                const formData = createUpdateTaskFormData(
                    taskId,
                    pendingSaveValues.current.title,
                    pendingSaveValues.current.description,
                );
                saveFetcher.submit(formData, {
                    method: "post",
                    action: "/api/task/update",
                });
                return;
            }

            hasStartedSaving.current = false;
            pendingSaveValues.current = null;
            submittedValues.current = null;
            setSaveSuccess(true);

            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            saveResetTimer.current = setTimeout(() => {
                setSaveSuccess(false);
            }, SAVE_SUCCESS_DURATION_MS);
            return;
        }

        if (saveFetcher.data?.error) {
            hasStartedSaving.current = false;
            pendingSaveValues.current = null;
            submittedValues.current = null;
            setSaveError(true);
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
            }
            errorResetTimer.current = setTimeout(() => {
                setSaveError(false);
            }, ERROR_DISPLAY_DURATION_MS);
        }
    }, [saveFetcher.state, saveFetcher.data, taskId, saveFetcher]);

    const handleSave = useCallback(
        (values: EditedValues) => {
            hasStartedSaving.current = true;
            pendingSaveValues.current = values;

            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            setSaveSuccess(false);

            if (isSaving) {
                return;
            }

            submittedValues.current = values;
            const formData = createUpdateTaskFormData(
                taskId,
                values.title,
                values.description,
            );
            saveFetcher.submit(formData, {
                method: "post",
                action: "/api/task/update",
            });
        },
        [taskId, isSaving, saveFetcher],
    );

    const syncWithExternalData = useCallback(
        (data: ExternalSyncData) => {
            if (isDirty) {
                return;
            }
            setLastSavedTitle(data.title);
            setLastSavedDescription(data.description);
            setSaveSuccess(false);
            hasStartedSaving.current = false;
            pendingSaveValues.current = null;
            submittedValues.current = null;
            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
                saveResetTimer.current = null;
            }
        },
        [isDirty],
    );

    return {
        lastSavedTitle,
        lastSavedDescription,
        isSaving,
        saveSuccess,
        saveError,
        isDirty,
        setIsDirty,
        handleSave,
        syncWithExternalData,
    };
}
