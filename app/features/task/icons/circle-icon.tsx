interface CircleIconProps {
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
    strokeWidth?: number;
}

export function CircleIcon({
    className = "",
    label,
    showLabel: displayLabel,
    fillColor,
    strokeWidth = 4,
}: CircleIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <circle
                cx="50"
                cy="50"
                r="42"
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
