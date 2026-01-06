interface StarBurstIconProps {
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
    strokeWidth?: number;
}

const toFixed = (num: number, digits: number = 6) => {
    return parseFloat(num.toFixed(digits));
};

export function StarBurstIcon({
    className = "",
    label,
    showLabel: displayLabel,
    fillColor,
    strokeWidth = 4,
}: StarBurstIconProps) {
    const points = [];
    const centerX = 50;
    const centerY = 50;
    const outerRadius = 42;
    const innerRadius = 28;
    const numPoints = 10;

    for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push(`${toFixed(x)},${toFixed(y)}`);
    }

    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <polygon
                points={points.join(" ")}
                fill={fillColor ?? "none"}
                strokeWidth={strokeWidth}
            />
            {displayLabel && (
                <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="currentColor"
                    stroke="none"
                >
                    {label}
                </text>
            )}
        </svg>
    );
}
