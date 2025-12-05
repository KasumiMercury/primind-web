import type { ButtonConfig } from "~/task/operation-buttons";
import { OperationButtons } from "~/task/operation-buttons";
import { calculateDimensions, OperationShape } from "~/task/operation-shape";
import { OperationSwipe, type SwipeActions } from "~/task/operation-swipe";

export interface ButtonsConfig {
    top: ButtonConfig;
    bottomLeft: ButtonConfig;
    bottomCenter: ButtonConfig;
    bottomRight: ButtonConfig;
}

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
    buttons?: ButtonsConfig;
}

export const defaultButtonsConfig: ButtonsConfig = {
    top: {
        label: "Button 1",
        onClick: () => console.log("Button 1 clicked"),
    },
    bottomLeft: {
        label: "Button A",
        onClick: () => console.log("Button A clicked"),
    },
    bottomCenter: {
        label: "Button B",
        onClick: () => console.log("Button B clicked"),
    },
    bottomRight: {
        label: "Button C",
        onClick: () => console.log("Button C clicked"),
    },
};

export function OperationArea({
    width = 400,
    radius = 10,
    className = "w-full",
    buttons = defaultButtonsConfig,
}: OperationAreaProps) {
    const dimensions = calculateDimensions(width);
    const swipeActions: SwipeActions = {
        up: buttons.top.onClick,
        down: buttons.bottomCenter.onClick,
        left: buttons.bottomLeft.onClick,
        right: buttons.bottomRight.onClick,
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
                    topButton={buttons.top}
                    bottomButtons={{
                        left: buttons.bottomLeft,
                        center: buttons.bottomCenter,
                        right: buttons.bottomRight,
                    }}
                />
            </OperationSwipe>
        </OperationShape>
    );
}
