import { Mic, MicOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface VoiceInputButtonProps {
    isListening: boolean;
    isSupported: boolean;
    isDisabled?: boolean;
    onPress: () => void;
    error?: string | null;
    className?: string;
}

export function VoiceInputButton({
    isListening,
    isSupported,
    isDisabled = false,
    onPress,
    error,
    className,
}: VoiceInputButtonProps) {
    const { t } = useTranslation();

    if (!isSupported) {
        return null;
    }

    const ariaLabel = isListening
        ? t("voiceInput.stopListening")
        : t("voiceInput.startListening");

    const buttonLabel = isListening
        ? t("voiceInput.labelListening")
        : t("voiceInput.label");

    return (
        <div className={cn("flex flex-col items-end", className)}>
            <Button
                variant="outline"
                size="sm"
                type="button"
                onPress={onPress}
                isDisabled={isDisabled}
                aria-label={ariaLabel}
                className={cn(
                    isListening &&
                        "text-red-500 data-hovered:bg-red-50 data-hovered:text-red-600 dark:data-hovered:bg-red-950/30",
                )}
            >
                {isListening ? (
                    <MicOff className="size-4 animate-pulse" />
                ) : (
                    <Mic className="size-4" />
                )}
                <span>{buttonLabel}</span>
            </Button>
            {error && (
                <span className="mt-1 w-full text-right text-destructive text-xs">
                    {error}
                </span>
            )}
        </div>
    );
}
