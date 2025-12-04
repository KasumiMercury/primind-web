import type { Dimensions } from "~/task/operation-shape";

export interface ButtonConfig {
    label: React.ReactNode;
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
            >
                {topButton.label}
            </button>

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
                >
                    {bottomButtons.left.label}
                </button>
                <button
                    className="bg-primary"
                    type="button"
                    style={{
                        width: `${centerButtonWidth}px`,
                        height: "100%",
                    }}
                    onClick={bottomButtons.center.onClick}
                >
                    {bottomButtons.center.label}
                </button>
                <button
                    className="bg-secondary"
                    type="button"
                    style={{
                        width: `${sideButtonWidth}px`,
                        height: "100%",
                    }}
                    onClick={bottomButtons.right.onClick}
                >
                    {bottomButtons.right.label}
                </button>
            </div>
        </div>
    );
}
