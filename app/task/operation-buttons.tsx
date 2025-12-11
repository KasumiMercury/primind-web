import type { MouseEvent } from "react";
import type { Dimensions } from "~/task/operation-shape";

export interface ButtonConfig {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface OperationButtonsProps {
    dimensions: Dimensions;
    buttonsConfig: {
        left: ButtonConfig;
        center: ButtonConfig;
        right: ButtonConfig;
    };
    className?: string;
}

export function OperationButtons({
    dimensions,
    buttonsConfig,
    className = "bg-secondary",
}: OperationButtonsProps) {
    const { width, height, sideButtonWidth, centerButtonWidth } = dimensions;

    return (
        <div
            className={className}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "flex",
                flexDirection: "row",
            }}
        >
            <button
                className="cursor-pointer bg-trasnparent from-primary/15 to-transparent hover:bg-primary/10 focus:bg-linear-to-r"
                type="button"
                style={{
                    width: `${sideButtonWidth}px`,
                    height: "100%",
                }}
                onClick={buttonsConfig.left.onClick}
            ></button>

            <button
                type="button"
                className="cursor-pointer bg-transparent from-primary/15 to-transparent hover:bg-primary/10 focus:bg-radial"
                style={{
                    width: `${centerButtonWidth}px`,
                    height: "100%",
                }}
                onClick={buttonsConfig.center.onClick}
            ></button>

            <button
                className="cursor-pointer bg-trasnparent from-primary/15 to-transparent hover:bg-primary/10 focus:bg-linear-to-l"
                type="button"
                style={{
                    width: `${sideButtonWidth}px`,
                    height: "100%",
                }}
                onClick={buttonsConfig.right.onClick}
            ></button>
        </div>
    );
}
