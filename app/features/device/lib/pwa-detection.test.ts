import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    detectPlatform,
    isInstallPromptAvailable,
    promptInstall,
    setupInstallPromptListener,
} from "./pwa-detection";

describe("detectPlatform", () => {
    beforeEach(() => {
        // Reset navigator mock before each test
        vi.stubGlobal("navigator", {
            userAgent: "",
            maxTouchPoints: 0,
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("iOS detection", () => {
        it("detects iPhone via userAgent", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
                maxTouchPoints: 5,
            });
            expect(detectPlatform()).toBe("ios");
        });

        it("detects iPad (pre-iPadOS 13) via userAgent", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (iPad; CPU OS 12_0 like Mac OS X) AppleWebKit/605.1.15",
                maxTouchPoints: 5,
            });
            expect(detectPlatform()).toBe("ios");
        });

        it("detects iPod via userAgent", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
                maxTouchPoints: 5,
            });
            expect(detectPlatform()).toBe("ios");
        });

        it("detects iOS via navigator.standalone property", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
                maxTouchPoints: 0,
                standalone: false, // iOS Safari has this property
            });
            expect(detectPlatform()).toBe("ios");
        });
    });

    describe("iPadOS 13+ detection", () => {
        it("detects iPadOS 13+ (reports as Mac with touch support)", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
                maxTouchPoints: 5,
            });
            expect(detectPlatform()).toBe("ios");
        });

        it("detects iPadOS with high touch points", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15",
                maxTouchPoints: 10,
            });
            expect(detectPlatform()).toBe("ios");
        });
    });

    describe("Mac desktop detection (should NOT be iOS)", () => {
        it("does not misdetect Mac desktop as iOS", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
                maxTouchPoints: 0,
            });
            expect(detectPlatform()).toBe("other");
        });

        it("does not misdetect MacBook Pro with Touch Bar as iOS (maxTouchPoints === 1)", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
                maxTouchPoints: 1,
            });
            expect(detectPlatform()).toBe("other");
        });

        it("does not misdetect Apple Silicon Mac as iOS", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                maxTouchPoints: 0,
            });
            expect(detectPlatform()).toBe("other");
        });
    });

    describe("Android detection", () => {
        it("detects Android phone", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                maxTouchPoints: 5,
            });
            expect(detectPlatform()).toBe("android");
        });

        it("detects Android tablet", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                maxTouchPoints: 10,
            });
            expect(detectPlatform()).toBe("android");
        });

        it("detects Android (case insensitive)", () => {
            vi.stubGlobal("navigator", {
                userAgent: "Mozilla/5.0 (Linux; ANDROID 14) AppleWebKit/537.36",
                maxTouchPoints: 5,
            });
            expect(detectPlatform()).toBe("android");
        });
    });

    describe("Other platforms", () => {
        it("returns other for Windows", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                maxTouchPoints: 0,
            });
            expect(detectPlatform()).toBe("other");
        });

        it("returns other for Linux desktop", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                maxTouchPoints: 0,
            });
            expect(detectPlatform()).toBe("other");
        });

        it("returns other for Windows with touch screen", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                maxTouchPoints: 10,
            });
            expect(detectPlatform()).toBe("other");
        });
    });

    describe("Edge cases", () => {
        it("returns other when navigator is undefined", () => {
            vi.stubGlobal("navigator", undefined);
            expect(detectPlatform()).toBe("other");
        });

        it("handles missing maxTouchPoints gracefully", () => {
            vi.stubGlobal("navigator", {
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
            });
            expect(detectPlatform()).toBe("other");
        });
    });
});

describe("promptInstall", () => {
    type EventHandler = (e: unknown) => void;

    function setupWindowMockWithEventCapture(): {
        getHandler: () => EventHandler | null;
    } {
        let capturedHandler: EventHandler | null = null;
        vi.stubGlobal("window", {
            addEventListener: vi.fn((event: string, handler: EventHandler) => {
                if (event === "beforeinstallprompt") {
                    capturedHandler = handler;
                }
            }),
            removeEventListener: vi.fn(),
        });
        return {
            getHandler: () => capturedHandler,
        };
    }

    beforeEach(() => {
        vi.stubGlobal("navigator", {
            userAgent:
                "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
            maxTouchPoints: 5,
        });
        vi.stubGlobal("window", {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("returns unavailable when no deferred prompt exists", async () => {
        const result = await promptInstall();
        expect(result).toBe("unavailable");
    });

    it("returns accepted when user accepts install", async () => {
        const mockPrompt = vi.fn().mockResolvedValue(undefined);
        const mockEvent = {
            preventDefault: vi.fn(),
            prompt: mockPrompt,
            userChoice: Promise.resolve({ outcome: "accepted", platform: "" }),
        };

        const { getHandler } = setupWindowMockWithEventCapture();
        setupInstallPromptListener();
        getHandler()?.(mockEvent);

        expect(isInstallPromptAvailable()).toBe(true);

        const result = await promptInstall();
        expect(result).toBe("accepted");
        expect(mockPrompt).toHaveBeenCalled();
        expect(isInstallPromptAvailable()).toBe(false);
    });

    it("returns dismissed when user dismisses install", async () => {
        const mockPrompt = vi.fn().mockResolvedValue(undefined);
        const mockEvent = {
            preventDefault: vi.fn(),
            prompt: mockPrompt,
            userChoice: Promise.resolve({ outcome: "dismissed", platform: "" }),
        };

        const { getHandler } = setupWindowMockWithEventCapture();
        setupInstallPromptListener();
        getHandler()?.(mockEvent);

        const result = await promptInstall();
        expect(result).toBe("dismissed");
        expect(isInstallPromptAvailable()).toBe(false);
    });

    it("clears deferredPrompt on error and returns unavailable", async () => {
        const mockPrompt = vi
            .fn()
            .mockRejectedValue(new Error("Prompt failed"));
        const mockEvent = {
            preventDefault: vi.fn(),
            prompt: mockPrompt,
            userChoice: Promise.resolve({ outcome: "accepted", platform: "" }),
        };

        const { getHandler } = setupWindowMockWithEventCapture();
        setupInstallPromptListener();
        getHandler()?.(mockEvent);

        expect(isInstallPromptAvailable()).toBe(true);

        const result = await promptInstall();
        expect(result).toBe("unavailable");
        // deferredPrompt should be cleared even on error
        expect(isInstallPromptAvailable()).toBe(false);
    });

    it("clears deferredPrompt when userChoice rejects", async () => {
        const mockPrompt = vi.fn().mockResolvedValue(undefined);
        const mockEvent = {
            preventDefault: vi.fn(),
            prompt: mockPrompt,
            userChoice: Promise.reject(new Error("User choice failed")),
        };

        const { getHandler } = setupWindowMockWithEventCapture();
        setupInstallPromptListener();
        getHandler()?.(mockEvent);

        expect(isInstallPromptAvailable()).toBe(true);

        const result = await promptInstall();
        expect(result).toBe("unavailable");
        // deferredPrompt should be cleared even when userChoice rejects
        expect(isInstallPromptAvailable()).toBe(false);
    });
});
