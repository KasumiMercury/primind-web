import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "~/test/utils";
import { VoiceInputButton } from "./voice-input-button";

describe("VoiceInputButton", () => {
    it("renders nothing when not supported", () => {
        const { container } = render(
            <VoiceInputButton
                isListening={false}
                isSupported={false}
                onPress={vi.fn()}
            />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("renders button when supported", () => {
        render(
            <VoiceInputButton
                isListening={false}
                isSupported={true}
                onPress={vi.fn()}
            />,
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("shows listening state with correct aria label", () => {
        render(
            <VoiceInputButton
                isListening={true}
                isSupported={true}
                onPress={vi.fn()}
            />,
        );
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label");
    });

    it("shows idle state with correct aria label", () => {
        render(
            <VoiceInputButton
                isListening={false}
                isSupported={true}
                onPress={vi.fn()}
            />,
        );
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label");
    });

    it("calls onPress when clicked", async () => {
        const user = userEvent.setup();
        const onPress = vi.fn();

        render(
            <VoiceInputButton
                isListening={false}
                isSupported={true}
                onPress={onPress}
            />,
        );

        await user.click(screen.getByRole("button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("shows error message when provided", () => {
        render(
            <VoiceInputButton
                isListening={false}
                isSupported={true}
                onPress={vi.fn()}
                error="Microphone access denied"
            />,
        );
        expect(
            screen.getByText("Microphone access denied"),
        ).toBeInTheDocument();
    });

    it("disables button when isDisabled is true", () => {
        render(
            <VoiceInputButton
                isListening={false}
                isSupported={true}
                isDisabled={true}
                onPress={vi.fn()}
            />,
        );
        expect(screen.getByRole("button")).toHaveAttribute(
            "data-disabled",
            "true",
        );
    });

    it("applies custom className", () => {
        render(
            <VoiceInputButton
                isListening={false}
                isSupported={true}
                onPress={vi.fn()}
                className="custom-class"
            />,
        );
        // The className is applied to the wrapper div
        const wrapper = screen.getByRole("button").parentElement;
        expect(wrapper).toHaveClass("custom-class");
    });
});
