import type { ParseKeys } from "i18next";
import { Undo2 } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { ListBox, ListBoxItem } from "react-aria-components";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import { getAllTitlePresets, type TitlePreset } from "../lib/title-presets";
import { VoiceInputButton } from "./voice-input-button";

export interface TitleEditProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    customPresets?: TitlePreset[];
    enableVoiceInput?: boolean;
}

export function TitleEdit({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
    customPresets,
    enableVoiceInput = true,
}: TitleEditProps) {
    const { t } = useTranslation();
    const presets = getAllTitlePresets(customPresets);

    // Voice input history management (stack structure)
    const voiceHistoryRef = useRef<string[]>([]);
    const [canRevert, setCanRevert] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handlePresetSelect = (preset: TitlePreset) => {
        const translatedValue = t(preset.labelKey as ParseKeys);
        onChange(translatedValue);
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
            {/* Main Input */}
            <Input
                type="text"
                value={value}
                onChange={handleInputChange}
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

            {/* Preset Section */}
            <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">
                    {t("titlePresets.label")}
                </span>

                <ListBox
                    aria-label={t("titlePresets.label")}
                    selectionMode="single"
                    className={cn(
                        "max-h-32 overflow-y-auto rounded-md border border-input p-1",
                        isDisabled && "pointer-events-none opacity-50",
                    )}
                    onAction={(key) => {
                        const preset = presets.find((p) => p.id === key);
                        if (preset) {
                            handlePresetSelect(preset);
                        }
                    }}
                >
                    {presets.map((preset) => (
                        <ListBoxItem
                            key={preset.id}
                            id={preset.id}
                            className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                                "hover:bg-accent hover:text-accent-foreground",
                                "data-focused:bg-accent data-focused:text-accent-foreground",
                                "data-disabled:pointer-events-none data-disabled:opacity-50",
                            )}
                        >
                            {t(preset.labelKey as ParseKeys)}
                        </ListBoxItem>
                    ))}
                </ListBox>
            </div>
        </div>
    );
}
