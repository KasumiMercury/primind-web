import type { MouseEvent } from "react";
import type { Dimensions } from "~/task/operation-shape";

export interface ButtonConfig {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface OperationButtonsProps {
    dimensions: Dimensions;
    topButton: ButtonConfig;
    bottomButtons: {
        left: ButtonConfig;
        center: ButtonConfig;
        right: ButtonConfig;
    };
    className?: string;
}

export function OperationButtons({
    dimensions,
    topButton,
    bottomButtons,
    className = "bg-secondary",
}: OperationButtonsProps) {
    const {
        width,
        height,
        upperHeight,
        lowerHeight,
        sideButtonWidth,
        centerButtonWidth,
    } = dimensions;

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
                className="bg-linear-to-r from-primary/10 to-transparent hover:bg-primary/10"
                type="button"
                style={{
                    width: `${sideButtonWidth}px`,
                    height: "100%",
                }}
                onClick={bottomButtons.left.onClick}
            ></button>

            <div
                className="hover:bg-primary/10"
                style={{
                    width: `${centerButtonWidth}px`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <button
                    className="bg-transparent"
                    type="button"
                    style={{
                        width: "100%",
                        height: `${upperHeight}px`,
                    }}
                    onClick={topButton.onClick}
                ></button>

                <button
                    className="bg-transparent"
                    type="button"
                    style={{
                        width: `${centerButtonWidth}px`,
                        height: `${lowerHeight}px`,
                    }}
                    onClick={bottomButtons.center.onClick}
                ></button>
            </div>

            <button
                className="bg-linear-to-l from-primary/10 to-transparent hover:bg-primary/10"
                type="button"
                style={{
                    width: `${sideButtonWidth}px`,
                    height: "100%",
                }}
                onClick={bottomButtons.right.onClick}
            ></button>
        </div>
    );
}
