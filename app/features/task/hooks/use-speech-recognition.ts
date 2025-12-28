import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    getSpeechRecognition,
    isSpeechRecognitionSupported,
    mapLocaleToSpeechLang,
} from "../lib/speech-recognition";

interface UseSpeechRecognitionOptions {
    onResult: (transcript: string) => void;
    onError?: (error: string) => void;
    continuous?: boolean;
}

interface UseSpeechRecognitionReturn {
    isSupported: boolean;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    error: string | null;
    clearError: () => void;
}

export function useSpeechRecognition({
    onResult,
    onError,
    continuous = false,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
    const { i18n, t } = useTranslation();
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported = isSpeechRecognitionSupported();

    const getErrorMessage = useCallback(
        (errorType: string): string => {
            switch (errorType) {
                case "no-speech":
                    return t("voiceInput.errorNoSpeech");
                case "audio-capture":
                    return t("voiceInput.errorAudioCapture");
                case "not-allowed":
                    return t("voiceInput.errorNotAllowed");
                case "network":
                    return t("voiceInput.errorNetwork");
                default:
                    return t("voiceInput.errorGeneric");
            }
        },
        [t],
    );

    const startListening = useCallback(() => {
        if (!isSupported) return;

        const SpeechRecognitionCtor = getSpeechRecognition();
        if (!SpeechRecognitionCtor) return;

        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognitionCtor();
        recognition.lang = mapLocaleToSpeechLang(i18n.language);
        recognition.continuous = continuous;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const results = event.results;
            if (results.length > 0) {
                const transcript = results[results.length - 1][0].transcript;
                onResult(transcript);
            }
        };

        recognition.onerror = (event) => {
            const errorMessage = getErrorMessage(event.error);
            setError(errorMessage);
            onError?.(errorMessage);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        setError(null);
        setIsListening(true);

        try {
            recognition.start();
        } catch {
            setError(t("voiceInput.errorGeneric"));
            setIsListening(false);
        }
    }, [
        isSupported,
        i18n.language,
        continuous,
        onResult,
        onError,
        getErrorMessage,
        t,
    ]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    return {
        isSupported,
        isListening,
        startListening,
        stopListening,
        error,
        clearError,
    };
}
