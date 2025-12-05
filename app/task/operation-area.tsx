import { OperationButtons } from "~/task/operation-buttons";
import { calculateDimensions, OperationShape } from "~/task/operation-shape";
import { OperationSwipe, type SwipeActions } from "~/task/operation-swipe";

export interface OperationConfig {
    upAction: () => void;
    downAction: () => void;
    leftAction: () => void;
    rightAction: () => void;
}

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
    operation?: OperationConfig;
}

export const defaultOperationConfig: OperationConfig = {
    upAction: () => console.log("Up"),
    downAction: () => console.log("Down"),
    leftAction: () => console.log("Left"),
    rightAction: () => console.log("Right"),
};

export function OperationArea({
    width = 400,
    radius = 10,
    className = "w-full",
    operation = defaultOperationConfig,
}: OperationAreaProps) {
    const dimensions = calculateDimensions(width);
    const swipeActions: SwipeActions = {
        up: operation.upAction,
        down: operation.downAction,
        left: operation.leftAction,
        right: operation.rightAction,
    };

    return (
        <OperationShape
            dimensions={dimensions}
            radius={radius}
            className={className}
        >
            <OperationSwipe dimensions={dimensions} swipeActions={swipeActions}>
                <OperationButtons
                    dimensions={dimensions}
                    topButton={{ onClick: operation.upAction }}
                    bottomButtons={{
                        left: { onClick: operation.leftAction },
                        center: { onClick: operation.downAction },
                        right: { onClick: operation.rightAction },
                    }}
                />
            </OperationSwipe>
        </OperationShape>
    );
}
