import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { MINIMUM_SCHEDULE_LEAD_TIME_MINUTES } from "~/features/task/constants";
import {
    ScheduledDateTimeInput,
    useDateTimeState,
} from "./scheduled-datetime-input";

interface ScheduledDateTimeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (scheduledAt: Date) => void;
    onCancel: () => void;
}

export function ScheduledDateTimeModal({
    isOpen,
    onOpenChange,
    onConfirm,
    onCancel,
}: ScheduledDateTimeModalProps) {
    const { t } = useTranslation();
    const state = useDateTimeState();

    useEffect(() => {
        if (isOpen) {
            state.reset();
        }
    }, [isOpen, state.reset]);

    const handleConfirm = () => {
        const date = state.toNativeDate();
        onConfirm(date);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            showCloseButton={false}
            isDismissable={false}
        >
            <DialogHeader>
                <DialogTitle>{t("scheduleTask.title")}</DialogTitle>
            </DialogHeader>

            <div className="my-6">
                <ScheduledDateTimeInput state={state} />

                {state.isTooSoon && (
                    <p className="mt-4 text-destructive text-sm">
                        {t("scheduleTask.tooSoon", {
                            minutes: MINIMUM_SCHEDULE_LEAD_TIME_MINUTES,
                        })}
                    </p>
                )}
            </div>

            <DialogFooter>
                <div className="grid w-full grid-cols-2 gap-4">
                    <Button
                        className="order-last"
                        onPress={handleConfirm}
                        isDisabled={state.isTooSoon}
                    >
                        {t("common.confirm")}
                    </Button>
                    <Button variant="outline" onPress={handleCancel}>
                        {t("common.cancel")}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
