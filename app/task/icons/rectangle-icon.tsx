interface RectangleIconProps {
    className?: string;
    label: string;
}

export function RectangleIcon({ className = "", label }: RectangleIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <rect x="10" y="35" width="80" height="30" fill="none" />
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
        </svg>
    );
}
