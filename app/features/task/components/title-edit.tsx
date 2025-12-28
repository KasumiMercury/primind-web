import type { ParseKeys } from "i18next";
import type { ChangeEvent } from "react";
import { ListBox, ListBoxItem } from "react-aria-components";
import { useTranslation } from "react-i18next";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { getAllTitlePresets, type TitlePreset } from "../lib/title-presets";

export interface TitleEditProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    customPresets?: TitlePreset[];
}

export function TitleEdit({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
    customPresets,
}: TitleEditProps) {
    const { t } = useTranslation();
    const presets = getAllTitlePresets(customPresets);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handlePresetSelect = (preset: TitlePreset) => {
        const translatedValue = t(preset.labelKey as ParseKeys);
        onChange(translatedValue);
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {/* Main Input with Voice Button */}
            <div className="flex items-start gap-2">
                <Input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    autoFocus={autoFocus}
                    className="flex-1"
                />
            </div>

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
