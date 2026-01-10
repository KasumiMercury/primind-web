import { generateRoundedPolygonPath } from "../lib/polygon";
import { calculateDimensions, type Dimensions } from "./operation-shape";

interface OnboardingDemoShapeProps {
    width?: number;
    radius?: number;
    className?: string;
    children?: React.ReactNode;
}

export function OnboardingDemoShape({
    width = 200,
    radius = 6,
    className = "",
    children,
}: OnboardingDemoShapeProps) {
    const dimensions = calculateDimensions(width);
    const { height, upperHeight, sideButtonWidth, centerButtonWidth } =
        dimensions;

    const shapePoints: { x: number; y: number }[] = [
        { x: width * 0.5, y: 0 },
        { x: 0, y: upperHeight },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: upperHeight },
    ];

    const shapePath = generateRoundedPolygonPath(shapePoints, radius);

    const leftDividerX = sideButtonWidth;
    const rightDividerX = sideButtonWidth + centerButtonWidth;

    return (
        <div className={`relative ${className}`}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <title>Operation Demo</title>
                <path
                    d={shapePath}
                    className="fill-muted/50 stroke-1 stroke-primary/30 dark:fill-muted/50 dark:stroke-primary/70"
                    paintOrder="stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    />
                <line
                    x1={leftDividerX}
                    y1={upperHeight}
                    x2={leftDividerX}
                    y2={height}
                    className="stroke-1 stroke-primary/20 dark:stroke-primary/40"
                    strokeDasharray="4 2"
                />
                <line
                    x1={rightDividerX}
                    y1={upperHeight}
                    x2={rightDividerX}
                    y2={height}
                    className="stroke-1 stroke-primary/20 dark:stroke-primary/40"
                    strokeDasharray="4 2"
                />
            </svg>
            {children && (
                <div className="pointer-events-none absolute inset-0">
                    {children}
                </div>
            )}
        </div>
    );
}

export { calculateDimensions, type Dimensions };
