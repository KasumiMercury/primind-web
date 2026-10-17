import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatRelativeTime, formatTimestampRelative } from "./relative-time";

describe("formatRelativeTime", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns now text when less than one minute away", () => {
        const date = new Date("2025-01-15T11:59:30Z");
        expect(formatRelativeTime(date, "en")).toBe("now");
        expect(formatRelativeTime(date, "en", "たった今")).toBe("たった今");
    });

    it("formats time in minutes ago", () => {
        const date = new Date("2025-01-15T11:55:00Z"); // 5 minutes ago
        const result = formatRelativeTime(date, "en");
        expect(result).toMatch(/minute/);
    });

    it("formats time in hours ago", () => {
        const date = new Date("2025-01-15T09:00:00Z"); // 3 hours ago
        const result = formatRelativeTime(date, "en");
        expect(result).toMatch(/hour/);
    });

    it("formats time in days ago", () => {
        const date = new Date("2025-01-13T12:00:00Z"); // 2 days ago
        const result = formatRelativeTime(date, "en");
        expect(result).toMatch(/day/);
    });

    it("formats time in weeks ago", () => {
        const date = new Date("2025-01-01T12:00:00Z"); // 2 weeks ago
        const result = formatRelativeTime(date, "en");
        expect(result).toMatch(/week/);
    });

    it("formats future time", () => {
        const date = new Date("2025-01-15T13:00:00Z"); // 1 hour in the future
        const result = formatRelativeTime(date, "en");
        expect(result).toMatch(/hour/);
    });

    it("respects locale parameter", () => {
        const date = new Date("2025-01-15T11:55:00Z");
        expect(formatRelativeTime(date, "ja")).toMatch(/分/);
    });
});

describe("formatTimestampRelative", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns empty string for undefined timestamp", () => {
        expect(formatTimestampRelative(undefined)).toBe("");
    });

    it("handles string seconds", () => {
        const nowSeconds = Math.floor(Date.now() / 1000);
        const timestamp = { seconds: String(nowSeconds - 60) }; // 1 minute ago
        const result = formatTimestampRelative(timestamp, "en");
        expect(result).toMatch(/minute/);
    });

    it("handles bigint seconds", () => {
        const nowSeconds = Math.floor(Date.now() / 1000);
        const timestamp = { seconds: BigInt(nowSeconds - 60) }; // 1 minute ago
        const result = formatTimestampRelative(timestamp, "en");
        expect(result).toMatch(/minute/);
    });

    it("defaults to English locale", () => {
        const nowSeconds = Math.floor(Date.now() / 1000);
        const timestamp = { seconds: String(nowSeconds - 60) };
        const result = formatTimestampRelative(timestamp);
        expect(result).toMatch(/minute/);
    });
});
