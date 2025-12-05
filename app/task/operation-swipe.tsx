import { type PointerEventHandler, useRef } from "react";
import type { Dimensions } from "~/task/operation-shape";

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

    const resetSwipe = () => {
        swipeStart.current = null;
    };

    const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
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
            return;
        }

        if (deltaX < 0) {
            swipeActions.left();
        } else {
            swipeActions.right();
        }
    };

    const handlePointerCancel: PointerEventHandler<HTMLDivElement> = () => {
        resetSwipe();
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
        >
            {children}
        </div>
    );
}
