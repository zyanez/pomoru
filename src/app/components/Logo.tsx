export function Logo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse
                cx="20"
                cy="20"
                rx="15"
                ry="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <circle
                cx="20"
                cy="20"
                r="5"
                fill="currentColor"
            />
        </svg>
    );
}
