export interface VoiceInputState {
    isSupported: boolean;
    isListening: boolean;
    error: string | null;
}

export interface VoiceInputCallbacks {
    onStartListening: () => void;
    onStopListening: () => void;
    onClearError: () => void;
}

export type VoiceInputProps = VoiceInputState & VoiceInputCallbacks;
