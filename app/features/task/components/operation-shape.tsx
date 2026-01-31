import { useAnimate } from "motion/react";
import { forwardRef, useId, useImperativeHandle, useRef } from "react";
import {
    generateRoundedArrowPath,
    generateRoundedPolygonPath,
} from "../lib/polygon";

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
    sideButtonWidthRatio: number = 0.2,
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

export interface OperationShapeHandle {
    animateArrow: () => void;
}

interface OperationShapeProps {
    dimensions: Dimensions;
    radius?: number;
    arrowOffset?: number;
    className?: string;
    arrowClassName?: string;
    arrowLineCap?: "butt" | "round" | "square";
    borderClassName?: string;
    children: React.ReactNode;
}

const arrowAnimationDuration = 0.2;
const arrowRefreshAnimationDuration = 0.5;
const arrowMoveAmount = 10;

export const OperationShape = forwardRef<
    OperationShapeHandle,
    OperationShapeProps
>(function OperationShape(
    {
        dimensions,
        radius = 10,
        arrowOffset = 20,
        className = "w-full",
        arrowClassName = "stroke-primary stroke-4",
        arrowLineCap = "round",
        borderClassName,
        children,
    },
    ref,
) {
    const clipPathId = useId();
    const { width, height, upperHeight } = dimensions;

    const [arrowScope, animateArrow] = useAnimate();
    const isAnimatingRef = useRef(false);

    useImperativeHandle(ref, () => ({
        animateArrow: async () => {
            if (isAnimatingRef.current || !arrowScope.current) return;
            isAnimatingRef.current = true;

            try {
                await animateArrow(
                    arrowScope.current,
                    {
                        y: -arrowMoveAmount,
                        opacity: 0,
                    },
                    {
                        duration: arrowAnimationDuration,
                        ease: "easeOut",
                    },
                );

                await animateArrow(
                    arrowScope.current,
                    {
                        y: 0,
                    },
                    {
                        duration: 0,
                    },
                );

                await animateArrow(
                    arrowScope.current,
                    {
                        opacity: 1,
                    },
                    {
                        duration: arrowRefreshAnimationDuration,
                        ease: "easeIn",
                    },
                );
            } finally {
                isAnimatingRef.current = false;
            }
        },
    }));

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
            <path
                d={clipPolygonPath}
                fill="none"
                className={borderClassName}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <g ref={arrowScope}>
                <path
                    d={arrowPolygonPath}
                    className={arrowClassName}
                    fill="none"
                    strokeLinecap={arrowLineCap}
                />
            </g>
        </svg>
    );
});
