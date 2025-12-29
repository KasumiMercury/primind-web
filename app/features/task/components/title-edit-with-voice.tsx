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
    const { handleChange, voiceInput, canRevert, handleRevert } =
        useVoiceInputWithHistory({ value, onChange });

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
        />
    );
}
