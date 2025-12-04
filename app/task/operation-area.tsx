import { generateRoundedPolygonPath } from "~/task/polygon";

interface OperationAreaProps {
    width?: number;
    radius?: number;
    className?: string;
}

export function OperationArea({
    width = 400,
    radius = 10,
    className = "fill-primary",
}: OperationAreaProps) {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    const heightRaito = 1 / goldenRatio;
    const height = width * heightRaito;

    const arrowCornerHeightRaito = heightRaito / goldenRatio;

    const poinsts: { x: number; y: number }[] = [
        { x: width * 0.5, y: 0 },
        { x: 0, y: height * arrowCornerHeightRaito },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: height * arrowCornerHeightRaito },
    ];

    const path = generateRoundedPolygonPath(poinsts, radius);

    return (
        <svg
            className={className}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="operationAreaTitle"
            role="img"
            preserveAspectRatio="xMidYMid meet"
        >
            <title id="operationAreaTitle">Operation Area</title>
            <path d={path} />
        </svg>
    );
}
