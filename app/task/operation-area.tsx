import {
    type ComponentType,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { CircleIcon } from "~/task/icons/circle-icon";
import { PillIcon } from "~/task/icons/pill-icon";
import { RectangleIcon } from "~/task/icons/rectangle-icon";
import { StarBurstIcon } from "~/task/icons/starburst-icon";
import { OperationButtons } from "~/task/operation-buttons";
import { OperationIndicator } from "~/task/operation-indicator";
import { calculateDimensions, OperationShape } from "~/task/operation-shape";
import { OperationSwipe, type SwipeActions } from "~/task/operation-swipe";

type IconComponent = ComponentType<{
    className?: string;
    label: string;
}>;

export interface OperationConfig {
    upAction: () => void;
    downAction: () => void;
    leftAction: () => void;
    rightAction: () => void;
}

interface ItemConfig {
    key: string;
    icon: IconComponent;
    label: string;
    className: string;
}

export const ITEMS = {
    urgent: {
        key: "urgent",
        icon: StarBurstIcon,
        label: "Urgent",
        className: "stroke-red-500",
    },
    normal: {
        key: "normal",
        icon: CircleIcon,
        label: "Normal",
        className: "stroke-blue-500",
    },
    low: {
        key: "low",
        icon: PillIcon,
        label: "Low",
        className: "stroke-green-500",
    },
    duetime: {
        key: "duetime",
        icon: RectangleIcon,
        label: "Due Time",
        className: "stroke-yellow-500",
    },
} satisfies Record<string, ItemConfig>;

const selectableItems = Object.values(ITEMS);

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
    innerClassName?: string;
    operation?: OperationConfig;
    swipeFlip?: boolean;
}

export function OperationArea({
    width = 400,
    radius = 10,
    className = "w-full",
    innerClassName,
    operation,
    swipeFlip = true,
}: OperationAreaProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemsCount = selectableItems.length;

    const selectedItem = useMemo(() => {
        if (itemsCount === 0) return null;
        return selectableItems[selectedIndex];
    }, [selectedIndex, itemsCount]);
    const selectedItemRef = useRef<string | null>(selectedItem?.key ?? null);

    useEffect(() => {
        selectedItemRef.current = selectedItem?.key ?? null;
    }, [selectedItem]);

    const nextSelection = () => {
        if (itemsCount === 0) return null;

        const nextIndex = (selectedIndex + 1) % itemsCount;
        setSelectedIndex(nextIndex);
    };

    const prevSelection = () => {
        if (itemsCount === 0) return null;

        const prevIndex = (selectedIndex - 1 + itemsCount) % itemsCount;
        setSelectedIndex(prevIndex);
    };

    const handleLeftAction = () => {
        operation?.leftAction ?? prevSelection();
    };

    const handleRightAction = () => {
        operation?.rightAction ?? nextSelection();
    };

    const handleUpAction = () => {
        operation?.upAction ?? console.log("Up");
    };

    const handleDownAction = () => {
        operation?.downAction ?? console.log("Down");
    };

    const dimensions = calculateDimensions(width);
    const swipeActions: SwipeActions = {
        left: swipeFlip ? handleRightAction : handleLeftAction,
        right: swipeFlip ? handleLeftAction : handleRightAction,
        up: handleUpAction,
        down: handleDownAction,
    };

    const SelectedIcon = selectedItem?.icon;

    return (
        <div
            className={className}
            style={{ position: "relative", width: `${width}px` }}
        >
            <OperationShape
                dimensions={dimensions}
                radius={(radius * 2) / 3}
                className="w-full"
                arrowClassName="stroke-primary stroke-4"
            >
                <OperationSwipe
                    dimensions={dimensions}
                    swipeActions={swipeActions}
                >
                    <OperationButtons
                        dimensions={dimensions}
                        topButton={{ onClick: handleUpAction }}
                        bottomButtons={{
                            left: { onClick: handleLeftAction },
                            center: { onClick: handleDownAction },
                            right: { onClick: handleRightAction },
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
                    />
                </div>
            ) : null}
            <div className="-translate-x-1/2 pointer-events-none absolute bottom-2 left-1/2 z-20">
                <OperationIndicator
                    itemCount={itemsCount}
                    selectedIndex={selectedIndex}
                    className="gap-1.5 rounded-full bg-secondary px-3 py-2 shadow-background shadow-sm"
                />
            </div>
        </div>
    );
}
