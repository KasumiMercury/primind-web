import { type AnimationPlaybackControls, useAnimate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ITEMS, type TaskTypeKey } from "../lib/task-type-items";
import { OperationButtons } from "./operation-buttons";
import { OperationIndicator } from "./operation-indicator";
import { calculateDimensions, OperationShape } from "./operation-shape";
import { OperationSwipe, type SwipeActions } from "./operation-swipe";

export interface OperationConfig {
    upAction: () => void;
    downAction: () => void;
    leftAction: () => void;
    rightAction: () => void;
}

type ActionSource = "button" | "swipe";
type ActionDirection = "left" | "right" | "up" | "down";

const selectableItems = Object.values(ITEMS);
const selectableKeys = Object.keys(ITEMS) as TaskTypeKey[];

const registerTransitionAmount = 10;
const registerUpDuration = 0.1;
const registerDownDuration = 0.1;

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
    innerClassName?: string;
    operation?: OperationConfig;
    swipeFlip?: boolean;
    onRegister?: (taskTypeKey: TaskTypeKey) => void;
}

export function OperationArea({
    width = 400,
    radius = 10,
    className = "w-full",
    innerClassName,
    operation,
    swipeFlip = true,
    onRegister,
}: OperationAreaProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [scope, animate] = useAnimate();
    const animationControlRef = useRef<AnimationPlaybackControls | null>(null);
    const lastActionRef = useRef<{
        direction: ActionDirection;
        source: ActionSource;
        at: number;
    } | null>(null);

    const getNow = () =>
        typeof performance !== "undefined" ? performance.now() : Date.now();

    const itemsCount = selectableItems.length;

    const selectedItem = useMemo(() => {
        if (itemsCount === 0) return null;
        return selectableItems[selectedIndex];
    }, [selectedIndex, itemsCount]);

    const selectedKey = useMemo(() => {
        if (itemsCount === 0) return null;
        return selectableKeys[selectedIndex];
    }, [selectedIndex, itemsCount]);

    const selectedKeyRef = useRef<TaskTypeKey | null>(selectedKey);

    useEffect(() => {
        selectedKeyRef.current = selectedKey;
    }, [selectedKey]);

    const nextSelection = () => {
        if (itemsCount === 0) return null;

        setSelectedIndex((prevIndex) => (prevIndex + 1) % itemsCount);
    };

    const prevSelection = () => {
        if (itemsCount === 0) return null;

        setSelectedIndex(
            (prevIndex) => (prevIndex - 1 + itemsCount) % itemsCount,
        );
    };

    const handleRegisterAction = async () => {
        const currentKey = selectedKeyRef.current;
        if (!currentKey) {
            return;
        }

        const itemConfig = ITEMS[currentKey];
        if (!itemConfig) {
            return;
        }

        if (animationControlRef.current) {
            animationControlRef.current.stop();
        }

        const upAnimation = animate(
            scope.current,
            { y: -registerTransitionAmount },
            { duration: registerUpDuration, ease: "easeOut" },
        );
        animationControlRef.current = upAnimation;

        onRegister?.(currentKey);

        await upAnimation;

        const downAnimation = animate(
            scope.current,
            { y: 0 },
            { duration: registerDownDuration, ease: "easeIn" },
        );
        animationControlRef.current = downAnimation;
        await downAnimation;

        animationControlRef.current = null;
    };

    const runAction = (
        direction: ActionDirection,
        source: ActionSource,
        action: (() => void) | undefined,
        fallback: () => void,
    ) => {
        const now = getNow();
        const lastAction = lastActionRef.current;

        if (
            lastAction &&
            lastAction.direction === direction &&
            lastAction.source === source &&
            now - lastAction.at < 150
        ) {
            return;
        }

        lastActionRef.current = { direction, source, at: now };

        if (action) {
            action();
            return;
        }

        fallback();
    };

    const handleLeftAction = (source: ActionSource) => {
        runAction("left", source, operation?.leftAction, prevSelection);
    };

    const handleRightAction = (source: ActionSource) => {
        runAction("right", source, operation?.rightAction, nextSelection);
    };

    const handleUpAction = (source: ActionSource) => {
        runAction("up", source, operation?.upAction, handleRegisterAction);
    };

    const handleDownAction = (source: ActionSource) => {
        runAction("down", source, operation?.downAction, handleRegisterAction);
    };

    const dimensions = calculateDimensions(width);
    const swipeActions: SwipeActions = {
        left: swipeFlip
            ? () => handleRightAction("swipe")
            : () => handleLeftAction("swipe"),
        right: swipeFlip
            ? () => handleLeftAction("swipe")
            : () => handleRightAction("swipe"),
        up: () => handleUpAction("swipe"),
        down: () => handleDownAction("swipe"),
    };

    const SelectedIcon = selectedItem?.icon;

    return (
        <div
            ref={scope}
            className={className}
            style={{ position: "relative", width: `${width}px` }}
        >
            <OperationShape
                dimensions={dimensions}
                radius={(radius * 2) / 3}
                className="w-full shadow-primary/20 drop-shadow-md"
                arrowClassName="stroke-primary stroke-4"
            >
                <OperationSwipe
                    dimensions={dimensions}
                    swipeActions={swipeActions}
                >
                    <OperationButtons
                        dimensions={dimensions}
                        buttonsConfig={{
                            left: {
                                onClick: () => handleLeftAction("button"),
                            },
                            center: {
                                onClick: () => handleDownAction("button"),
                            },
                            right: {
                                onClick: () => handleRightAction("button"),
                            },
                        }}
                        className={innerClassName}
                    />
                </OperationSwipe>
            </OperationShape>
            {SelectedIcon ? (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                    <SelectedIcon
                        className={`h-1/2 ${selectedItem.className}`}
                        label={selectedItem?.label ?? ""}
                        showLabel={true}
                    />
                </div>
            ) : null}
            <div className="-translate-x-1/2 pointer-events-none absolute bottom-2 left-1/2 z-20">
                <OperationIndicator
                    itemCount={itemsCount}
                    selectedIndex={selectedIndex}
                    className="gap-1.5 rounded-full bg-accent px-3 py-2 shadow-background shadow-sm"
                />
            </div>
        </div>
    );
}
