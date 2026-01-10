import { type AnimationPlaybackControls, useAnimate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTaskTypeItems } from "../hooks/use-task-type-items";
import type { TaskTypeKey } from "../lib/task-type-items";
import { OperationButtons } from "./operation-buttons";
import { OperationIndicator } from "./operation-indicator";
import { calculateDimensions, OperationShape } from "./operation-shape";
import { OperationSwipe, type SwipeActions } from "./operation-swipe";
import { cn } from "~/lib/utils";

export interface OperationConfig {
    upAction: () => void;
    downAction: () => void;
    leftAction: () => void;
    rightAction: () => void;
}

type ActionSource = "button" | "swipe";
type ActionDirection = "left" | "right" | "up" | "down";

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
    const items = useTaskTypeItems();
    const selectableItems = useMemo(() => Object.values(items), [items]);
    const selectableKeys = useMemo(
        () => Object.keys(items) as TaskTypeKey[],
        [items],
    );

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
    }, [selectedIndex, itemsCount, selectableItems]);

    const selectedKey = useMemo(() => {
        if (itemsCount === 0) return null;
        return selectableKeys[selectedIndex];
    }, [selectedIndex, itemsCount, selectableKeys]);

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

        const itemConfig = items[currentKey];
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
                borderClassName="dark:stroke-border dark:stroke-2"
                className="w-full"
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
                                onPress: () => handleLeftAction("button"),
                            },
                            center: {
                                onPress: () => handleDownAction("button"),
                            },
                            right: {
                                onPress: () => handleRightAction("button"),
                            },
                        }}
                        className={cn("bg-card", innerClassName)}
                    />
                </OperationSwipe>
            </OperationShape>
            {SelectedIcon ? (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                    <SelectedIcon
                        className={`h-1/2 ${selectedItem.strokeClass}`}
                        label={selectedItem?.label ?? ""}
                        showLabel={true}
                        strokeWidth={2}
                    />
                </div>
            ) : null}
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2">
                <OperationIndicator
                    itemCount={itemsCount}
                    selectedIndex={selectedIndex}
                    className="gap-1.5 rounded-full border border-border bg-card px-3 py-2"
                    selectedBgClass={selectedItem?.bgClass}
                />
            </div>
        </div>
    );
}
