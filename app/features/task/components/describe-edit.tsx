import type { ChangeEvent } from "react";
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
    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleVoiceResult = (transcript: string) => {
        const newValue = value ? `${value} ${transcript}` : transcript;
        onChange(newValue);
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

            {/* Voice Input Button - below textarea, right aligned */}
            {enableVoiceInput && (
                <VoiceInputButton
                    isListening={isListening}
                    isSupported={isSupported}
                    isDisabled={isDisabled}
                    onPress={handleVoiceToggle}
                    error={error}
                />
            )}
        </div>
    );
}
