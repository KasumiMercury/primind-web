import {
    type MouseEventHandler,
    type PointerEventHandler,
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

        if (absY >= absX) {
            if (deltaY < 0) {
                swipeActions.up();
            } else {
                swipeActions.down();
            }
            lastSwipeHandledAtRef.current = getNow();
            event.preventDefault();
            return;
        }

        if (deltaX < 0) {
            swipeActions.left();
        } else {
            swipeActions.right();
        }

        lastSwipeHandledAtRef.current = getNow();
        event.preventDefault();
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
            event.stopPropagation();
            lastSwipeHandledAtRef.current = null;
            return;
        }

        lastSwipeHandledAtRef.current = null;
    };

    return (
        <div
            style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                touchAction: "none",
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
            onClickCapture={handleClickCapture}
        >
            {children}
        </div>
    );
}
