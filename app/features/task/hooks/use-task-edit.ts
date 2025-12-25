import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { orpc } from "~/orpc/client";
import type { EditedValues } from "../components/quick-edit-content";

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
    const [isPending, startTransition] = useTransition();

    const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
    const [lastSavedDescription, setLastSavedDescription] =
        useState(initialDescription);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pendingSaveValues = useRef<{
        title: string;
        description: string;
    } | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

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

    const processSave = useCallback(
        async (values: { title: string; description: string }) => {
            setIsProcessing(true);

            try {
                const result = await orpc.task.update({
                    taskId,
                    title: values.title,
                    description: values.description,
                    updateMask: ["title", "description"],
                });

                if (result.success) {
                    setLastSavedTitle(values.title);
                    setLastSavedDescription(values.description);

                    // Check if there are pending changes made during this save
                    if (
                        pendingSaveValues.current &&
                        (pendingSaveValues.current.title !== values.title ||
                            pendingSaveValues.current.description !==
                                values.description)
                    ) {
                        // Process pending changes
                        const pendingValues = pendingSaveValues.current;
                        pendingSaveValues.current = null;
                        await processSave(pendingValues);
                        return;
                    }

                    pendingSaveValues.current = null;
                    setSaveSuccess(true);

                    if (saveResetTimer.current) {
                        clearTimeout(saveResetTimer.current);
                    }
                    saveResetTimer.current = setTimeout(() => {
                        setSaveSuccess(false);
                    }, SAVE_SUCCESS_DURATION_MS);
                } else {
                    pendingSaveValues.current = null;
                    setSaveError(true);
                    if (errorResetTimer.current) {
                        clearTimeout(errorResetTimer.current);
                    }
                    errorResetTimer.current = setTimeout(() => {
                        setSaveError(false);
                    }, ERROR_DISPLAY_DURATION_MS);
                }
            } catch {
                pendingSaveValues.current = null;
                setSaveError(true);
                if (errorResetTimer.current) {
                    clearTimeout(errorResetTimer.current);
                }
                errorResetTimer.current = setTimeout(() => {
                    setSaveError(false);
                }, ERROR_DISPLAY_DURATION_MS);
            } finally {
                setIsProcessing(false);
            }
        },
        [taskId],
    );

    const handleSave = useCallback(
        (values: EditedValues) => {
            pendingSaveValues.current = values;

            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            setSaveSuccess(false);

            if (isPending || isProcessing) {
                // Save is in progress, pending values will be processed after current save
                return;
            }

            startTransition(async () => {
                await processSave(values);
            });
        },
        [isPending, isProcessing, processSave],
    );

    const syncWithExternalData = useCallback(
        (data: ExternalSyncData) => {
            if (isDirty) {
                return;
            }
            setLastSavedTitle(data.title);
            setLastSavedDescription(data.description);
            setSaveSuccess(false);
            pendingSaveValues.current = null;
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
        isSaving: isPending || isProcessing,
        saveSuccess,
        saveError,
        isDirty,
        setIsDirty,
        handleSave,
        syncWithExternalData,
    };
}
