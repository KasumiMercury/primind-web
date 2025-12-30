import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useReward } from "react-rewards";

const CONFETTI_CONFIG = {
    lifetime: 200,
    elementCount: 100,
    spread: 90,
    startVelocity: 35,
};

interface UseTaskCompleteConfettiOptions {
    rewardId: string;
    zIndex?: number;
}

export function useTaskCompleteConfetti({
    rewardId,
    zIndex = 100,
}: UseTaskCompleteConfettiOptions) {
    const { reward, isAnimating } = useReward(rewardId, "confetti", {
        ...CONFETTI_CONFIG,
        zIndex,
    });

    const pendingCallbackRef = useRef<(() => void) | null>(null);

    // Execute callback after animation ends
    useEffect(() => {
        if (!isAnimating && pendingCallbackRef.current) {
            pendingCallbackRef.current();
            pendingCallbackRef.current = null;
        }
    }, [isAnimating]);

    const triggerConfetti = (onComplete: () => void) => {
        pendingCallbackRef.current = onComplete;
        reward();
    };

    const interruptConfetti = () => {
        if (pendingCallbackRef.current) {
            pendingCallbackRef.current();
            pendingCallbackRef.current = null;
        }
    };

    const hasPendingCallback = pendingCallbackRef.current !== null;

    // Confetti anchor element (renders via portal to document.body)
    const confettiAnchor = useMemo(() => {
        if (typeof document === "undefined") return null;
        return createPortal(
            <span
                id={rewardId}
                className="pointer-events-none fixed top-1/2 left-1/2"
                style={{ zIndex }}
            />,
            document.body,
        );
    }, [rewardId, zIndex]);

    return {
        triggerConfetti,
        interruptConfetti,
        hasPendingCallback,
        isAnimating,
        confettiAnchor,
    };
}
