import { useId } from "react";
import { generateRoundedPolygonPath } from "~/task/polygon";

const toFixed = (num: number, digits: number = 6) => {
    return parseFloat(num.toFixed(digits));
};

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
}

export function OperationArea({
    width = 400,
    radius = 10,
    className = "w-full",
}: OperationAreaProps) {
    const clipPathId = useId();
    const goldenRatio = toFixed((1 + Math.sqrt(5)) / 2);

    const heightRaito = 1 / goldenRatio;
    const height = width * heightRaito;

    const arrowCornerHeightRaito = heightRaito / goldenRatio;

    const upperHeight = height * arrowCornerHeightRaito;
    const lowerHeight = height - upperHeight;

    const poinsts: { x: number; y: number }[] = [
        { x: width * 0.5, y: 0 },
        { x: 0, y: upperHeight },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: upperHeight },
    ];

    const path = generateRoundedPolygonPath(poinsts, radius);

    const sideButtonWidth = width * 0.2;
    const centerButtonWidth = width * 0.6;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            preserveAspectRatio="xMidYMid meet"
        >
            <title>Operation Area</title>
            <defs>
                <clipPath id={clipPathId}>
                    <path d={path} />
                </clipPath>
            </defs>
            <foreignObject
                width={width}
                height={height}
                clipPath={`url(#${clipPathId})`}
            >
                <div
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <button
                        className="w-full bg-primary"
                        type="button"
                        style={{
                            height: `${upperHeight}px`,
                        }}
                        onClick={() => {
                            console.log("Button 1 clicked");
                        }}
                    >
                        Button 1
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
                            onClick={() => {
                                console.log("Button A clicked");
                            }}
                        >
                            Button A
                        </button>
                        <button
                            className="bg-primary"
                            type="button"
                            style={{
                                width: `${centerButtonWidth}px`,
                                height: "100%",
                            }}
                            onClick={() => {
                                console.log("Button B clicked");
                            }}
                        >
                            Button B
                        </button>
                        <button
                            className="bg-secondary"
                            type="button"
                            style={{
                                width: `${sideButtonWidth}px`,
                                height: "100%",
                            }}
                            onClick={() => {
                                console.log("Button C clicked");
                            }}
                        >
                            Button C
                        </button>
                    </div>
                </div>
            </foreignObject>
        </svg>
    );
}
