interface PillIconProps {
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
}

export function PillIcon({
    className = "",
    label,
    showLabel: displayLabel,
    fillColor,
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
                x="20"
                y="35"
                width="60"
                height="30"
                rx="15"
                ry="15"
                fill={fillColor ?? "none"}
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
