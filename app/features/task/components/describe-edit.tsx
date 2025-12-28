import { Undo2 } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import { VoiceInputButton } from "./voice-input-button";

export interface DescribeEditProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    enableVoiceInput?: boolean;
}

export function DescribeEdit({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
    enableVoiceInput = true,
}: DescribeEditProps) {
    const { t } = useTranslation();

    // Voice input history management (stack structure)
    const voiceHistoryRef = useRef<string[]>([]);
    const [canRevert, setCanRevert] = useState(false);

    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleVoiceResult = (transcript: string) => {
        // Save current value to history before appending
        voiceHistoryRef.current.push(value);
        setCanRevert(true);

        const newValue = value ? `${value} ${transcript}` : transcript;
        onChange(newValue);
    };

    const handleRevert = () => {
        const history = voiceHistoryRef.current;
        if (history.length > 0) {
            const previousValue = history.pop() ?? "";
            onChange(previousValue);
            setCanRevert(history.length > 0);
        }
    };

    const {
        isSupported,
        isListening,
        startListening,
        stopListening,
        error,
        clearError,
    } = useSpeechRecognition({
        onResult: handleVoiceResult,
    });

    const handleVoiceToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            clearError();
            startListening();
        }
    };

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

            {enableVoiceInput && (
                <div className="flex items-start justify-end gap-2">
                    {canRevert && (
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onPress={handleRevert}
                            aria-label={t("voiceInput.revert")}
                        >
                            <Undo2 className="size-4" />
                            <span>{t("voiceInput.revert")}</span>
                        </Button>
                    )}
                    <VoiceInputButton
                        isListening={isListening}
                        isSupported={isSupported}
                        isDisabled={isDisabled}
                        onPress={handleVoiceToggle}
                        error={error}
                    />
                </div>
            )}
        </div>
    );
}
