"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RefreshCcw, Settings, Loader, Clock, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectList } from "../providers/projectList/use";
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
    onTimeUpdate: (seconds: number) => void;
    onPomodoroUpdate: (pomodoros: number) => void;
}

export default function PomodoroTimer({
    onTimeUpdate,
    onPomodoroUpdate,
}: PomodoroTimerProps) {

    const {state : {selectedProject}} = useProjectList()
    const [lockedInProject, setLockedInProject] = useState<Project | null>(null);
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
    const [showTimer, setShowTimer] = useState(false);

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
        if (selectedProject == null){
            alert("No project selected")
        } else {
            setIsActive((prev) => !prev);
            if (lockedInProject == null){
                setLockedInProject(selectedProject)
            }
        }
    };

    // Reset Timer Function
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(pomodoroType.focusTime);
        setMotivationalPhrase(selectMotivationalPhrase());
        setLockedInProject(null)
    };

    // Change Timer Type
    const toggleTimerType = () => {
        setIsActive(false);
        setShowTimer(false);
    };

    // Select new project -> Reset timer
    //useEffect(() => {
    //    resetTimer();
    //}, [selectedProject]); // Added resetTimer to dependencies

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
                ? "bg-slate-800 text-white"
                : "border border-slate-300 text-slate-900 enabled:hover:bg-slate-100";
        const disabledClasses = disabled
            ? "pointer-events-none opacity-70"
            : "";

        return (
            <button
                onClick={onClick}
                className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
                disabled={!!disabled}
            >
                {children}
            </button>
        );
    };

    const handleChangeType = (type: (typeof pomodoroTypes)[number]) => {
        setShowTimer(true);
        setPomodoroType(type);
        setPhase("FOCUS");
        setTimeLeft(type.focusTime);
        setIsActive(false);
        setMotivationalPhrase(selectMotivationalPhrase());
    };

    //const progressOffset = 283 - (283 * timeLeft) / pomodoroType.focusTime;

    const currentPhaseTotalTime =
        phase === "FOCUS"
            ? pomodoroType.focusTime
            : phase === "SHORT_BREAK"
            ? pomodoroType.shortBreak
            : pomodoroType.longBreak;

    const progressOffset = 283 - (283 * timeLeft) / currentPhaseTotalTime;

    // We need to improve this later!!
    const formatPhase = (str: string) => {
        const formattedStr = str.replace(/_/g, " ").toLowerCase();
        return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full md:w-96 border-t sm:border-t-0 sm:border-l border-slate-200 bg-white p-8 overflow-auto"
        >
            <AnimatePresence mode="wait">
                {showTimer ? (
                    <motion.div
                        key="timer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <h2 className="text-center text-2xl font-bold text-slate-800 mb-4">
                            {formatPhase(phase.toString())}
                        </h2>
                        <motion.div
                            className="relative w-48 h-48 mx-auto mb-6"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                            >
                                <circle
                                    className="text-slate-200"
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                />
                                <motion.circle
                                    className="text-slate-800"
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeDasharray="283"
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{
                                        strokeDashoffset: progressOffset,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeInOut",
                                    }}
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <span className="text-4xl font-bold text-slate-800">
                                    {formatTimerTime(timeLeft)}
                                </span>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="flex justify-center gap-4 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Button variant="outline" onClick={toggleTimer}>
                                {isActive ? (
                                    <Pause className="h-4 w-4" />
                                ) : (
                                    <Play className="h-4 w-4" />
                                )}
                            </Button>
                            <Button variant="outline" onClick={resetTimer}>
                                <Square className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={toggleTimerType}>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </motion.div>
                        <motion.div
                            className="flex justify-center gap-4 mb-2 text-black"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {lockedInProject != null 
                                ? lockedInProject.name 
                                : selectedProject != null 
                                    ? selectedProject.name 
                                    : "Select a project to start Pomoru!!!"
                            }
                        </motion.div>
                        <div className="flex flex-row justify-between gap-4 items-center mb-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="bg-slate-100 rounded-lg p-3 w-1/2"
                            >
                                <h3 className="text-xs font-medium text-slate-500 mb-1">
                                    Completed
                                </h3>
                                <p className="text-xl font-bold text-slate-900">
                                    {completedPomodoros}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="bg-slate-100 rounded-lg p-3 w-1/2"
                            >
                                <h3 className="text-xs font-medium text-slate-500 mb-1">
                                    Focus Time Spent
                                </h3>
                                <p className="text-xl font-bold text-slate-900">
                                    {formatFullTime(focusTimeSpent)}
                                </p>
                            </motion.div>
                        </div>

                        <motion.div
                            key={motivationalPhrase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-slate-200 text-slate-800  w-full py-2 px-3 rounded-md inline-block text-sm font-medium"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                `${motivationalPhrase}`
                            )}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="type-selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex flex-col"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="px-4 text-lg mb-4 font-bold text-slate-700 flex items-center"
                        >
                            Select Pomodoro Type
                            <Clock className="w-4 h-4 ml-2 text-slate-500"/>
                        </motion.h2>


                        {pomodoroTypes.map((type, index) => (
                            <motion.button
                                key={type.id}
                                className="w-full text-left p-4 rounded-lg transition-all duration-200 hover:bg-slate-100"
                                onClick={() => handleChangeType(type)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                }}
                            >
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {type.name}
                                    {type.id === "standard" ? (
                                        " (Recommended)"
                                    ) : (
                                        ""
                                    )}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {type.description}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {type.name === "test" ? (
                                        ""
                                    ) : (
                                        `Focus: ${type.focusTime / 60} min | Break: ${type.shortBreak / 60} min | Long Break: ${type.longBreak / 60} min`
                                    )}
                                </p>

                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
