export function Logo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
            />
            <circle cx="50" cy="50" r="15" fill="currentColor" />
        </svg>
    );
}
