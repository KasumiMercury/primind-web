export interface TitlePreset {
    id: string;
    labelKey: string;
    source: "system" | "user";
}

export const SYSTEM_TITLE_PRESETS: TitlePreset[] = [
    {
        id: "shopping",
        labelKey: "titlePresets.shopping",
        source: "system",
    },
    {
        id: "callback",
        labelKey: "titlePresets.callback",
        source: "system",
    },
    {
        id: "laundry",
        labelKey: "titlePresets.laundry",
        source: "system",
    },
];

export function getAllTitlePresets(userPresets?: TitlePreset[]): TitlePreset[] {
    return [...SYSTEM_TITLE_PRESETS, ...(userPresets ?? [])];
}
