import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface TimeSlot {
    hour: number;
    minute: number;
    label: string;
}

const TIME_SLOTS: TimeSlot[] = [
    { hour: 9, minute: 0, label: "9:00" },
    { hour: 12, minute: 0, label: "12:00" },
    { hour: 15, minute: 0, label: "15:00" },
    { hour: 18, minute: 0, label: "18:00" },
    { hour: 21, minute: 0, label: "21:00" },
];

interface TimeSlotPickerProps {
    selectedHour?: number;
    selectedMinute?: number;
    onSelect: (hour: number, minute: number) => void;
    className?: string;
}

export function TimeSlotPicker({
    selectedHour,
    selectedMinute,
    onSelect,
    className,
}: TimeSlotPickerProps) {
    const { t } = useTranslation();

    const isSelected = (slot: TimeSlot) =>
        selectedHour === slot.hour && selectedMinute === slot.minute;

    return (
        <div className={className}>
            <span className="mb-2 block font-medium text-muted-foreground text-xs">
                {t("scheduleTask.timeSlots.title")}
            </span>
            <div className="flex flex-wrap gap-1.5">
                {TIME_SLOTS.map((slot) => (
                    <Button
                        key={slot.label}
                        variant={isSelected(slot) ? "default" : "outline"}
                        size="sm"
                        onPress={() => onSelect(slot.hour, slot.minute)}
                        className={cn(
                            "px-2 tabular-nums",
                            isSelected(slot) && "ring-2 ring-primary/30",
                        )}
                        aria-pressed={isSelected(slot)}
                    >
                        {slot.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
