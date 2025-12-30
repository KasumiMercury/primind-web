import { describe, expect, it } from "vitest";
import {
    getAllTitlePresets,
    SYSTEM_TITLE_PRESETS,
    type TitlePreset,
} from "./title-presets";

describe("SYSTEM_TITLE_PRESETS", () => {
    it("contains expected presets", () => {
        expect(SYSTEM_TITLE_PRESETS).toHaveLength(3);
        expect(SYSTEM_TITLE_PRESETS.map((p) => p.id)).toContain("shopping");
        expect(SYSTEM_TITLE_PRESETS.map((p) => p.id)).toContain("callback");
        expect(SYSTEM_TITLE_PRESETS.map((p) => p.id)).toContain("laundry");
    });

    it("all presets have source set to system", () => {
        for (const preset of SYSTEM_TITLE_PRESETS) {
            expect(preset.source).toBe("system");
        }
    });

    it("all presets have valid labelKey", () => {
        for (const preset of SYSTEM_TITLE_PRESETS) {
            expect(preset.labelKey).toMatch(/^titlePresets\./);
        }
    });
});

describe("getAllTitlePresets", () => {
    it("returns only system presets when no user presets provided", () => {
        const result = getAllTitlePresets();
        expect(result).toEqual(SYSTEM_TITLE_PRESETS);
    });

    it("returns only system presets when undefined passed", () => {
        const result = getAllTitlePresets(undefined);
        expect(result).toEqual(SYSTEM_TITLE_PRESETS);
    });

    it("returns only system presets when empty array passed", () => {
        const result = getAllTitlePresets([]);
        expect(result).toEqual(SYSTEM_TITLE_PRESETS);
    });

    it("combines system and user presets", () => {
        const userPresets: TitlePreset[] = [
            { id: "custom1", labelKey: "custom.label1", source: "user" },
        ];
        const result = getAllTitlePresets(userPresets);

        expect(result).toHaveLength(4);
        expect(result.slice(0, 3)).toEqual(SYSTEM_TITLE_PRESETS);
        expect(result[3]).toEqual(userPresets[0]);
    });

    it("preserves order: system presets first, then user presets", () => {
        const userPresets: TitlePreset[] = [
            { id: "user1", labelKey: "user.label1", source: "user" },
            { id: "user2", labelKey: "user.label2", source: "user" },
        ];
        const result = getAllTitlePresets(userPresets);

        expect(result).toHaveLength(5);
        // First 3 are system presets
        expect(result[0].source).toBe("system");
        expect(result[1].source).toBe("system");
        expect(result[2].source).toBe("system");
        // Last 2 are user presets
        expect(result[3].source).toBe("user");
        expect(result[4].source).toBe("user");
    });
});
