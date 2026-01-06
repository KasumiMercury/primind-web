interface RectangleIconProps {
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
    strokeWidth?: number;
}

export function RectangleIcon({
    className = "",
    label,
    showLabel: displayLabel,
    fillColor,
    strokeWidth = 4,
}: RectangleIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <rect
                x="12"
                y="26"
                width="76"
                height="48"
                rx="4"
                ry="4"
                fill={fillColor ?? "none"}
                strokeWidth={strokeWidth}
            />
            {displayLabel && (
                <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fill="currentColor"
                    stroke="none"
                    fontSize="12"
                    fontWeight="600"
                >
                    {label}
                </text>
            )}
        </svg>
    );
}
