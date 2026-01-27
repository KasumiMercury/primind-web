import type { TFunction } from "i18next";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { NumberField } from "~/components/ui/number-field";
import { TaskType } from "~/gen/task/v1/task_pb";
import { ERROR_CODES, showErrorToast } from "~/lib/errors";
import { cn } from "~/lib/utils";
import { orpc } from "~/orpc/client";
import type { PeriodSetting } from "~/orpc/schemas/period-setting";

const TASK_TYPES = [
    { type: TaskType.SHORT, key: "short" },
    { type: TaskType.NEAR, key: "near" },
    { type: TaskType.RELAXED, key: "relaxed" },
] as const;

const DEFAULT_PERIODS: Record<number, number> = {
    [TaskType.SHORT]: 30,
    [TaskType.NEAR]: 180,
    [TaskType.RELAXED]: 1440,
};

interface PeriodInput {
    days: number;
    hours: number;
    minutes: number;
}

function minutesToPeriodInput(totalMinutes: number): PeriodInput {
    const days = Math.floor(totalMinutes / 1440);
    const remainingAfterDays = totalMinutes % 1440;
    const hours = Math.floor(remainingAfterDays / 60);
    // Round minutes to nearest 5
    const rawMinutes = remainingAfterDays % 60;
    const minutes = Math.round(rawMinutes / 5) * 5;
    return { days, hours, minutes };
}

function periodInputToMinutes(input: PeriodInput): number {
    return input.days * 1440 + input.hours * 60 + input.minutes;
}

function formatPeriod(minutes: number, t: TFunction): string {
    const { days, hours, minutes: mins } = minutesToPeriodInput(minutes);
    const parts: string[] = [];

    if (days > 0) {
        parts.push(`${days}${t("settings.periodSettings.days")}`);
    }
    if (hours > 0) {
        parts.push(`${hours}${t("settings.periodSettings.hours")}`);
    }
    if (mins > 0 || parts.length === 0) {
        parts.push(`${mins}${t("settings.periodSettings.minutes")}`);
    }

    return parts.join(" ");
}

interface PeriodSettingsFormProps {
    className?: string;
}

export function PeriodSettingsForm({ className }: PeriodSettingsFormProps) {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<Map<TaskType, number>>(new Map());
    const [defaults, setDefaults] = useState<Map<TaskType, number>>(new Map());

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const result = await orpc.periodSetting.get();
                if (result.error) {
                    showErrorToast(t, result.error);
                    return;
                }

                const settingsMap = new Map<TaskType, number>();
                for (const setting of result.settings) {
                    settingsMap.set(setting.taskType, setting.periodMinutes);
                }
                setSettings(settingsMap);

                const defaultsMap = new Map<TaskType, number>();
                for (const def of result.defaults) {
                    defaultsMap.set(def.taskType, def.periodMinutes);
                }
                setDefaults(defaultsMap);
            } catch {
                showErrorToast(t, ERROR_CODES.SETTINGS_GET_FAILED);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, [t]);

    const handlePeriodFieldChange = (
        taskType: TaskType,
        field: keyof PeriodInput,
        value: number,
    ) => {
        const currentMinutes = getCurrentPeriod(taskType);
        const currentInput = minutesToPeriodInput(currentMinutes);
        const newInput = { ...currentInput, [field]: value };
        const newMinutes = periodInputToMinutes(newInput);

        // Clamp to 1-10080 minutes (1 min to 7 days)
        const clampedMinutes = Math.max(1, Math.min(newMinutes, 10080));

        setSettings((prev) => {
            const next = new Map(prev);
            next.set(taskType, clampedMinutes);
            return next;
        });
    };

    const handleReset = (taskType: TaskType) => {
        setSettings((prev) => {
            const next = new Map(prev);
            next.delete(taskType);
            return next;
        });
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                const settingsArray: PeriodSetting[] = [];
                for (const [taskType, periodMinutes] of settings) {
                    settingsArray.push({ taskType, periodMinutes });
                }

                const result = await orpc.periodSetting.update({
                    settings: settingsArray,
                });

                if (result.error) {
                    showErrorToast(t, result.error);
                    return;
                }

                const newSettings = new Map<TaskType, number>();
                for (const setting of result.settings) {
                    newSettings.set(setting.taskType, setting.periodMinutes);
                }
                setSettings(newSettings);

                toast.success(t("settings.periodSettings.saved"));
            } catch {
                showErrorToast(t, ERROR_CODES.SETTINGS_UPDATE_FAILED);
            }
        });
    };

    const getDefaultPeriod = (taskType: TaskType): number => {
        return defaults.get(taskType) ?? DEFAULT_PERIODS[taskType] ?? 30;
    };

    const getCurrentPeriod = (taskType: TaskType): number => {
        return settings.get(taskType) ?? getDefaultPeriod(taskType);
    };

    const hasCustomSetting = (taskType: TaskType): boolean => {
        return settings.has(taskType);
    };

    if (isLoading) {
        return (
            <div className={cn("animate-pulse space-y-4", className)}>
                {TASK_TYPES.map(({ type }) => (
                    <div key={type} className="h-16 rounded-md bg-muted" />
                ))}
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="space-y-2">
                <h3 className="font-medium text-lg">
                    {t("settings.periodSettings.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t("settings.periodSettings.description")}
                </p>
            </div>

            <div className="space-y-4">
                {TASK_TYPES.map(({ type, key }) => {
                    const currentMinutes = getCurrentPeriod(type);
                    const periodInput = minutesToPeriodInput(currentMinutes);
                    const isCustom = hasCustomSetting(type);

                    return (
                        <div
                            key={type}
                            className="flex flex-col gap-3 rounded-lg border p-4"
                        >
                            <span className="font-medium text-sm">
                                {t(`settings.periodSettings.${key}`)}
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                <NumberField
                                    value={periodInput.days}
                                    onChange={(value) =>
                                        handlePeriodFieldChange(
                                            type,
                                            "days",
                                            value,
                                        )
                                    }
                                    minValue={0}
                                    maxValue={7}
                                    aria-label={t(
                                        "settings.periodSettings.days",
                                    )}
                                    isDisabled={isPending}
                                />
                                <span className="text-muted-foreground text-sm">
                                    {t("settings.periodSettings.days")}
                                </span>

                                <NumberField
                                    value={periodInput.hours}
                                    onChange={(value) =>
                                        handlePeriodFieldChange(
                                            type,
                                            "hours",
                                            value,
                                        )
                                    }
                                    minValue={0}
                                    maxValue={23}
                                    aria-label={t(
                                        "settings.periodSettings.hours",
                                    )}
                                    isDisabled={isPending}
                                />
                                <span className="text-muted-foreground text-sm">
                                    {t("settings.periodSettings.hours")}
                                </span>

                                <NumberField
                                    value={periodInput.minutes}
                                    onChange={(value) =>
                                        handlePeriodFieldChange(
                                            type,
                                            "minutes",
                                            value,
                                        )
                                    }
                                    minValue={0}
                                    maxValue={55}
                                    step={5}
                                    aria-label={t(
                                        "settings.periodSettings.minutes",
                                    )}
                                    isDisabled={isPending}
                                />
                                <span className="text-muted-foreground text-sm">
                                    {t("settings.periodSettings.minutes")}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground text-xs">
                                    {t("settings.periodSettings.default", {
                                        value: formatPeriod(
                                            getDefaultPeriod(type),
                                            t,
                                        ),
                                    })}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => handleReset(type)}
                                    isDisabled={isPending || !isCustom}
                                    className={cn(!isCustom && "invisible")}
                                >
                                    {t("settings.periodSettings.reset")}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Button
                onPress={handleSave}
                isDisabled={isPending}
                className="w-full"
            >
                {isPending ? t("common.saving") : t("common.save")}
            </Button>
        </div>
    );
}
