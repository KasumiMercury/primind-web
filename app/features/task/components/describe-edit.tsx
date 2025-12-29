import { Undo2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { VoiceInputProps } from "../types/voice-input";
import { VoiceInputButton } from "./voice-input-button";

export interface DescribeEditProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    voiceInput?: VoiceInputProps;
    canRevert?: boolean;
    onRevert?: () => void;
}

export function DescribeEdit({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
    voiceInput,
    canRevert = false,
    onRevert,
}: DescribeEditProps) {
    const { t } = useTranslation();

    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleVoiceToggle = () => {
        if (!voiceInput) return;

        if (voiceInput.isListening) {
            voiceInput.onStopListening();
        } else {
            voiceInput.onClearError();
            voiceInput.onStartListening();
        }
    };

    const showVoiceInput = voiceInput !== undefined;

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {/* Main Textarea */}
            <Textarea
                value={value}
                onChange={handleTextareaChange}
                placeholder={placeholder}
                disabled={isDisabled}
                autoFocus={autoFocus}
            />

            {showVoiceInput && (
                <div className="flex items-start justify-end gap-2">
                    {canRevert && onRevert && (
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onPress={onRevert}
                            aria-label={t("voiceInput.revert")}
                        >
                            <Undo2 className="size-4" />
                            <span>{t("voiceInput.revert")}</span>
                        </Button>
                    )}
                    <VoiceInputButton
                        isListening={voiceInput.isListening}
                        isSupported={voiceInput.isSupported}
                        isDisabled={isDisabled}
                        onPress={handleVoiceToggle}
                        error={voiceInput.error}
                    />
                </div>
            )}
        </div>
    );
}
