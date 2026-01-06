interface PillIconProps {
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
    strokeWidth?: number;
}

export function PillIcon({
    className = "",
    label,
    showLabel: displayLabel,
    fillColor,
    strokeWidth = 4,
}: PillIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <rect
                x="14"
                y="26"
                width="72"
                height="48"
                rx="24"
                ry="24"
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
