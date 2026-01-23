import { useRef } from "react";
import { useVoiceInputWithHistory } from "../hooks/use-voice-input-with-history";
import { DescribeEdit } from "./describe-edit";

export interface DescribeEditWithVoiceProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
}

export function DescribeEditWithVoice({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
}: DescribeEditWithVoiceProps) {
    const focusInputRef = useRef<(() => void) | null>(null);

    const { handleChange, voiceInput, canRevert, handleRevert } =
        useVoiceInputWithHistory({
            value,
            onChange,
            onVoiceInputComplete: () => focusInputRef.current?.(),
        });

    return (
        <DescribeEdit
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            autoFocus={autoFocus}
            className={className}
            voiceInput={voiceInput}
            canRevert={canRevert}
            onRevert={handleRevert}
            focusInputRef={focusInputRef}
        />
    );
}
