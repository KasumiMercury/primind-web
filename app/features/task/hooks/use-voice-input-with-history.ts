import { useRef, useState } from "react";
import type { VoiceInputProps } from "../types/voice-input";
import { useSpeechRecognition } from "./use-speech-recognition";

export interface UseVoiceInputWithHistoryOptions {
    value: string;
    onChange: (value: string) => void;
}

export interface UseVoiceInputWithHistoryReturn {
    handleChange: (newValue: string) => void;
    voiceInput: VoiceInputProps;
    canRevert: boolean;
    handleRevert: () => void;
}

export function useVoiceInputWithHistory({
    value,
    onChange,
}: UseVoiceInputWithHistoryOptions): UseVoiceInputWithHistoryReturn {
    const voiceHistoryRef = useRef<string[]>([]);
    const [canRevert, setCanRevert] = useState(false);

    const handleChange = (newValue: string) => {
        voiceHistoryRef.current = [];
        setCanRevert(false);
        onChange(newValue);
    };

    const handleVoiceResult = (transcript: string) => {
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

    const voiceInput: VoiceInputProps = {
        isSupported,
        isListening,
        error,
        onStartListening: startListening,
        onStopListening: stopListening,
        onClearError: clearError,
    };

    return {
        handleChange,
        voiceInput,
        canRevert,
        handleRevert,
    };
}
