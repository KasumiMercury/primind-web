interface StarBurstIconProps {
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
    strokeWidth?: number;
}

export function StarBurstIcon({
    className = "",
    label,
    showLabel: displayLabel,
    fillColor,
    strokeWidth = 4,
}: StarBurstIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <polygon
                points="50,8 58.652476,23.370418 74.686981,16.021286 72.652476,33.542013 89.944374,37.021286 78,50 89.944374,62.978714 72.652476,66.457987 74.686981,83.978714 58.652476,76.629582 50,92 41.347524,76.629582 25.313019,83.978714 27.347524,66.457987 10.055626,62.978714 22,50 10.055626,37.021286 27.347524,33.542013 25.313019,16.021286 41.347524,23.370418"
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
