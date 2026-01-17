import {
    type MouseEventHandler,
    type PointerEventHandler,
    useEffect,
    useRef,
} from "react";
import type { Dimensions } from "./operation-shape";

export interface SwipeActions {
    up: () => void;
    down: () => void;
    left: () => void;
    right: () => void;
}

interface OperationSwipeProps {
    dimensions: Dimensions;
    swipeActions: SwipeActions;
    children: React.ReactNode;
    swipeThreshold?: number;
}

export function OperationSwipe({
    dimensions,
    swipeActions,
    children,
    swipeThreshold = 30,
}: OperationSwipeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const swipeStart = useRef<{ x: number; y: number } | null>(null);
    const lastSwipeHandledAtRef = useRef<number | null>(null);
    const getNow = () =>
        typeof performance !== "undefined" ? performance.now() : Date.now();

    const resetSwipe = () => {
        swipeStart.current = null;
    };

    const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
        lastSwipeHandledAtRef.current = null;
        swipeStart.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
        const start = swipeStart.current;
        resetSwipe();

        if (!start) return;

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < swipeThreshold && absY < swipeThreshold) {
            return;
        }

        // Prevent button from receiving pointerup when swipe is detected
        event.stopPropagation();

        // Dispatch pointercancel to reset React Aria Button's internal state
        // Without this, the button remains in "pressed" state and won't respond to subsequent taps
        if (event.target instanceof Element) {
            const cancelEvent = new PointerEvent("pointercancel", {
                bubbles: true,
                cancelable: true,
                pointerId: event.pointerId,
                pointerType: event.pointerType,
                isPrimary: event.isPrimary,
            });
            event.target.dispatchEvent(cancelEvent);
        }

        if (absY >= absX) {
            if (deltaY < 0) {
                swipeActions.up();
            } else {
                swipeActions.down();
            }
            lastSwipeHandledAtRef.current = getNow();
            return;
        }

        if (deltaX < 0) {
            swipeActions.left();
        } else {
            swipeActions.right();
        }

        lastSwipeHandledAtRef.current = getNow();
    };

    const handlePointerCancel: PointerEventHandler<HTMLDivElement> = () => {
        resetSwipe();
    };

    const handleClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
        const lastSwipeHandledAt = lastSwipeHandledAtRef.current;
        if (!lastSwipeHandledAt) return;

        const elapsed = getNow() - lastSwipeHandledAt;

        if (elapsed <= 300) {
            event.preventDefault();
            lastSwipeHandledAtRef.current = null;
            return;
        }

        lastSwipeHandledAtRef.current = null;
    };

    // Use non-passive event listeners to allow preventDefault()
    // React registers wheel/touch events as passive by default
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventScroll = (event: Event) => {
            event.preventDefault();
        };

        const options: AddEventListenerOptions = { passive: false };

        container.addEventListener("wheel", preventScroll, options);
        container.addEventListener("touchstart", preventScroll, options);
        container.addEventListener("touchmove", preventScroll, options);

        return () => {
            container.removeEventListener("wheel", preventScroll, options);
            container.removeEventListener("touchstart", preventScroll, options);
            container.removeEventListener("touchmove", preventScroll, options);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                touchAction: "none",
                overscrollBehavior: "none",
            }}
            onPointerDownCapture={handlePointerDown}
            onPointerUpCapture={handlePointerUp}
            onPointerCancelCapture={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
            onClickCapture={handleClickCapture}
        >
            {children}
        </div>
    );
}
