import type { Dimensions } from "~/task/operation-shape";

export interface ButtonConfig {
    onClick: () => void;
}

interface OperationButtonsProps {
    dimensions: Dimensions;
    topButton: ButtonConfig;
    bottomButtons: {
        left: ButtonConfig;
        center: ButtonConfig;
        right: ButtonConfig;
    };
}

export function OperationButtons({
    dimensions,
    topButton,
    bottomButtons,
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
            style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <button
                className="bg-primary"
                type="button"
                style={{
                    width: "100%",
                    height: `${upperHeight}px`,
                }}
                onClick={topButton.onClick}
            ></button>

            <div
                style={{
                    height: `${lowerHeight}px`,
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                }}
            >
                <button
                    className="bg-secondary"
                    type="button"
                    style={{
                        width: `${sideButtonWidth}px`,
                        height: "100%",
                    }}
                    onClick={bottomButtons.left.onClick}
                ></button>
                <button
                    className="bg-primary"
                    type="button"
                    style={{
                        width: `${centerButtonWidth}px`,
                        height: "100%",
                    }}
                    onClick={bottomButtons.center.onClick}
                ></button>
                <button
                    className="bg-secondary"
                    type="button"
                    style={{
                        width: `${sideButtonWidth}px`,
                        height: "100%",
                    }}
                    onClick={bottomButtons.right.onClick}
                ></button>
            </div>
        </div>
    );
}
