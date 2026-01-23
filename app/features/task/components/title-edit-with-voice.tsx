import { useRef } from "react";
import { useVoiceInputWithHistory } from "../hooks/use-voice-input-with-history";
import type { TitlePreset } from "../lib/title-presets";
import { TitleEdit } from "./title-edit";

export interface TitleEditWithVoiceProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    customPresets?: TitlePreset[];
}

export function TitleEditWithVoice({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
    customPresets,
}: TitleEditWithVoiceProps) {
    const focusInputRef = useRef<(() => void) | null>(null);

    const { handleChange, voiceInput, canRevert, handleRevert } =
        useVoiceInputWithHistory({
            value,
            onChange,
            onVoiceInputComplete: () => focusInputRef.current?.(),
        });

    return (
        <TitleEdit
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            autoFocus={autoFocus}
            className={className}
            customPresets={customPresets}
            voiceInput={voiceInput}
            canRevert={canRevert}
            onRevert={handleRevert}
            focusInputRef={focusInputRef}
        />
    );
}
