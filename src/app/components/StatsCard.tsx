"use client";

interface StatsCardProps {
    totalTime: number;
    totalPomodoro: number;
}

export default function StatsCard({ totalTime, totalPomodoro }: StatsCardProps) {
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="rounded-lg border-slate-200 border bg-white p-4 text-black">
            <h3></h3>
            
            <h3 className="text-lg font-semibold">Completed Pomodoros</h3>
            <p className="text-2xl font-bold">{totalPomodoro}</p>


            <h3 className="text-lg font-semibold">Focus Time Spent 🎯</h3>
            <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
        </div>
    );
}
