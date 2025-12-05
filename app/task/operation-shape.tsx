import { useId } from "react";
import { generateRoundedPolygonPath } from "~/task/polygon";

export interface Dimensions {
    width: number;
    height: number;
    upperHeight: number;
    lowerHeight: number;
    sideButtonWidth: number;
    centerButtonWidth: number;
}

const toFixed = (num: number, digits: number = 6) => {
    return parseFloat(num.toFixed(digits));
};

export const calculateDimensions = (
    width: number,
    sideButtonWidthRatio: number = 0.15,
): Dimensions => {
    const goldenRatio = toFixed((1 + Math.sqrt(5)) / 2);
    const heightRatio = 1 / goldenRatio;
    const height = width * heightRatio;
    const arrowCornerHeightRatio = heightRatio / goldenRatio;
    const upperHeight = height * arrowCornerHeightRatio;
    const lowerHeight = height - upperHeight;
    const sideButtonWidth = width * sideButtonWidthRatio;
    const centerButtonWidth = width - 2 * sideButtonWidth;

    return {
        width,
        height,
        upperHeight,
        lowerHeight,
        sideButtonWidth,
        centerButtonWidth,
    };
};

interface OperationShapeProps {
    dimensions: Dimensions;
    radius?: number;
    className?: string;
    children: React.ReactNode;
}

export function OperationShape({
    dimensions,
    radius = 10,
    className = "w-full",
    children,
}: OperationShapeProps) {
    const clipPathId = useId();
    const { width, height, upperHeight } = dimensions;

    const points: { x: number; y: number }[] = [
        { x: width * 0.5, y: 0 },
        { x: 0, y: upperHeight },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: upperHeight },
    ];

    const path = generateRoundedPolygonPath(points, radius);

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
                {children}
            </foreignObject>
        </svg>
    );
}
