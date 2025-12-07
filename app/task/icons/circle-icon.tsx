interface CircleIconProps {
    className?: string;
    label: string;
}

export function CircleIcon({ className = "", label }: CircleIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={label}
        >
            <circle cx="50" cy="50" r="45" fill="none" />
            <text
                x="50"
                y="55"
                textAnchor="middle"
                stroke="none"
                fill="currentColor"
                fontSize="12"
                fontWeight="600"
            >
                {label}
            </text>
        </svg>
    );
}
