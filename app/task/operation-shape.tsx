import { useId } from "react";
import {
    generateRoundedArrowPath,
    generateRoundedPolygonPath,
} from "~/task/polygon";

export interface Dimensions {
    width: number;
    height: number;
    upperHeight: number;
    lowerHeight: number;
    sideButtonWidth: number;
    centerButtonWidth: number;
}

export const calculateDimensions = (
    width: number,
    sideButtonWidthRatio: number = 0.15,
): Dimensions => {
    const lowerHeight = width / 2;
    const upperHeight = lowerHeight / 3;
    const height = upperHeight + lowerHeight;
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
    arrowOffset?: number;
    className?: string;
    arrowClassName?: string;
    children: React.ReactNode;
}

export function OperationShape({
    dimensions,
    radius = 10,
    arrowOffset = 20,
    className = "w-full",
    arrowClassName = "stroke-primary stroke-2",
    children,
}: OperationShapeProps) {
    const clipPathId = useId();
    const { width, height, upperHeight } = dimensions;

    const areaShapePoints: { x: number; y: number }[] = [
        { x: width * 0.5, y: 0 },
        { x: 0, y: upperHeight },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: upperHeight },
    ];

    const arrowAnchorPoint: { x: number; y: number }[] = [
        { x: 0, y: upperHeight + arrowOffset },
        { x: width * 0.5, y: arrowOffset },
        { x: width, y: upperHeight + arrowOffset },
    ];

    const clipPolygonPath = generateRoundedPolygonPath(areaShapePoints, radius);
    const arrowPolygonPath = generateRoundedArrowPath(
        arrowAnchorPoint,
        radius,
        0.15,
    );

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
                    <path d={clipPolygonPath} />
                </clipPath>
            </defs>
            <foreignObject
                width={width}
                height={height}
                clipPath={`url(#${clipPathId})`}
            >
                {children}
            </foreignObject>
            <path d={arrowPolygonPath} className={arrowClassName} fill="none" />
        </svg>
    );
}
