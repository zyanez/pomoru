"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RefreshCcw, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../types/utils";

type Phase = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

const pomodoroTypes = [
    {
        id: "light",
        name: "Light",
        focusTime: 10 * 60,
        shortBreak: 2 * 60,
        longBreak: 6 * 60,
        description:
            "Ideal for short tasks or when you don't need deep concentration.",
    },
    {
        id: "standard",
        name: "Standard",
        focusTime: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
        description:
            "Recommended for regular focus sessions throughout the day.",
    },
    {
        id: "intense",
        name: "Intense",
        focusTime: 50 * 60,
        shortBreak: 10 * 60,
        longBreak: 30 * 60,
        description:
            "Perfect for deep work or tasks that require long hours of concentration.",
    },
];


interface PomodoroTimerProps {
    selectedProject: Project | null;
    onTimeUpdate: (seconds: number) => void;
    onPomodoroUpdate: (pomodoros: number) => void;
}

export default function PomodoroTimer({
    selectedProject,
    onTimeUpdate,
    onPomodoroUpdate,
}: PomodoroTimerProps) {
    // pomodoroTypes[0] (light) | pomodoroTypes[1] (standard) | pomodoroTypes[3] (intensive)
    const [pomodoroType, setPomodoroType] = useState(pomodoroTypes[1]);
    const [pomodorosBeforeLongBreak] = useState(4);

    const [phase, setPhase] = useState<Phase>("FOCUS");
    const [timeLeft, setTimeLeft] = useState(pomodoroType.focusTime);
    const [isActive, setIsActive] = useState(false);
    const [focusTimeSpent, setFocusTimeSpent] = useState(0);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [motivationalPhrase, setMotivationalPhrase] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const formatTimerTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const formatFullTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
        )}:${String(s).padStart(2, "0")}`;
    };

    const sendNotification = (title: string, body: string) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body });
        }
    };

    const selectMotivationalPhrase = useCallback(() => {
        setIsLoading(true);
        const phrases = [
            "Keep it up, you're doing amazing!",
            "Great focus! Stay consistent!",
            "Another step closer to your goals!",
            "Small progress is still progress!",
            "Your dedication will pay off!",
            "One task at a time, you're unstoppable!",
            "Stay in the zone, you got this!",
            "Success is built one focus session at a time!",
            "You're mastering the art of deep work!",
            "Hard work compounds over time, keep going!",
            "Your future self will thank you for this effort!",
            "Every session brings you closer to greatness!",
            "Push through distractions, you're stronger than them!",
            "Make this Pomodoro count!",
            "Break time is coming, stay focused a little longer!",
            "You're building unstoppable momentum!",
            "Your focus today shapes your success tomorrow!",
            "Great things take time, and you're investing wisely!",
            "Discipline beats motivation—you're proving it!",
            "Stay locked in, the results will show!",
            "You've got the power to achieve anything!",
            "Deep work now, big rewards later!",
            "You're making progress, even if it feels slow!",
        ];
        
        const emojis = [
            "🌟",
            "💪",
            "🚀",
            "🏆",
            "🔥",
            "💼",
            "🧠",
            "⏳",
            "📈",
            "💡",
            "🎯",
            "🔑",
            "📊",
            "✅",
            "🎉",
            "💯",
            "🏅",
            "📅",
            "⚡",
            "🔨",
        ];
        const randomPhrase =
            phrases[Math.floor(Math.random() * phrases.length)];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setIsLoading(false);
        return `${randomPhrase} ${randomEmoji}`;
    }, []);

    // Toggle for Timer
    const toggleTimer = () => {
        setIsActive((prev) => !prev);
    };

    // Reset Timer Function
    const resetTimer = () => {
        setIsActive(false);
        setPhase("FOCUS");
        setTimeLeft(pomodoroType.focusTime);
        setMotivationalPhrase(selectMotivationalPhrase());
    };

    // Select new project -> Reset timer
    useEffect(() => {
        resetTimer();
    }, [selectedProject]);

    useEffect(() => {
        onTimeUpdate(focusTimeSpent);
    }, [focusTimeSpent, onTimeUpdate]);

    useEffect(() => {
        onPomodoroUpdate(completedPomodoros);
    }, [completedPomodoros, onPomodoroUpdate]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                if (phase === "FOCUS") {
                    setFocusTimeSpent((prev) => prev + 1);
                }
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (phase === "FOCUS") {
                setCompletedPomodoros((prev) => prev + 1);
                const nextPhase: Phase =
                    (completedPomodoros + 1) % pomodorosBeforeLongBreak === 0
                        ? "LONG_BREAK"
                        : "SHORT_BREAK";
                setPhase(nextPhase);
                setTimeLeft(
                    nextPhase === "LONG_BREAK"
                        ? pomodoroType.longBreak
                        : pomodoroType.shortBreak
                );
                setMotivationalPhrase(selectMotivationalPhrase());
                sendNotification(
                    "Focus session complete!",
                    nextPhase === "LONG_BREAK"
                        ? "Time for a long break."
                        : "Time for a short break."
                );
            } else {
                setPhase("FOCUS");
                setTimeLeft(pomodoroType.focusTime);
                setMotivationalPhrase(selectMotivationalPhrase());
                sendNotification(
                    "Break is over!",
                    "Get ready for your next focus session."
                );
            }
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [
        isActive,
        timeLeft,
        phase,
        pomodoroType,
        pomodorosBeforeLongBreak,
        completedPomodoros,
        selectMotivationalPhrase,
    ]);

    const Button = ({
        variant = "default",
        children,
        onClick,
        disabled,
    }: {
        variant?: "default" | "outline";
        size?: "sm" | "md" | "lg";
        children: React.ReactNode;
        onClick: () => void;
        disabled?: boolean | null;
    }) => {
        const baseClasses =
            "px-4 py-2 rounded text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:hover:bg-none";
        const variantClasses =
            variant === "default"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 text-slate-900 enabled:hover:bg-slate-100";
        const disabledClasses = 
            disabled ? "pointer-events-none opacity-70" : "";

        return (
            <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${disabledClasses}`} disabled={!!disabled}>
                {children}
            </button>
        );
    };

    const handleChangeType = (type: (typeof pomodoroTypes)[number]) => {
        if (type.id === pomodoroType.id) return;
        setPomodoroType(type);
        setPhase("FOCUS");
        setTimeLeft(type.focusTime);
        setIsActive(false);
        setMotivationalPhrase(selectMotivationalPhrase());
    };

    //const progressOffset = 283 - (283 * timeLeft) / pomodoroType.focusTime;

    const currentPhaseTotalTime = phase === "FOCUS" 
    ? pomodoroType.focusTime 
    : phase === "SHORT_BREAK" 
        ? pomodoroType.shortBreak 
        : pomodoroType.longBreak;

    const progressOffset = 283 - (283 * timeLeft) / currentPhaseTotalTime;

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-96 border-l border-slate-200 bg-white p-4 md:p-8 overflow-auto"
        >
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                    Pomodoro Timer
                </h2>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                    {pomodoroTypes.map((type) => (
                        <Button
                            disabled={isActive}
                            key={type.id}
                            variant={pomodoroType.id === type.id ? "default" : "outline"}
                            onClick={() => handleChangeType(type)}
                        >
                            {type.name}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mb-4">{pomodoroType.description}</p>

                <motion.div
                    className="relative w-48 h-48 mx-auto mb-6"
                >
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="10"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth="10"
                            strokeDasharray="283"
                            animate={{ strokeDashoffset: progressOffset }}
                            transition={{ duration: isActive ? 0.5 : 0 }}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-slate-900">
                            {formatTimerTime(timeLeft)}
                        </span>
                    </div>
                </motion.div>

                <div className="flex justify-center gap-6 mb-6">
                    <Button size="lg" onClick={toggleTimer}>
                        {isActive ? (
                            <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Start
                            </>
                        )}
                    </Button>
                    <Button size="lg" variant="outline" onClick={resetTimer}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>

                <div className="flex flex-row justify-between gap-4 items-center mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-50 rounded-lg p-3 w-1/2"
                    >
                        <h3 className="text-xs font-medium text-slate-500 mb-1">
                            Completed
                        </h3>
                        <p className="text-xl font-bold text-slate-900">
                            {completedPomodoros}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-50 rounded-lg p-3 w-1/2"
                    >
                        <h3 className="text-xs font-medium text-slate-500 mb-1">
                            Focus Time Spent
                        </h3>
                        <p className="text-xl font-bold text-slate-900">
                            {formatFullTime(focusTimeSpent)}
                        </p>
                    </motion.div>
                </div>
                

                <AnimatePresence mode="wait">
                    <motion.div
                        key={motivationalPhrase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-50 text-slate-800  w-full py-2 rounded-md inline-block text-sm font-medium"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin" />
                        ) : (
                            `${motivationalPhrase}`
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
