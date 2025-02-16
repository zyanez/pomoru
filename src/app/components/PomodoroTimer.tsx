"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RefreshCcw, Settings, Loader, Clock, Square, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectList } from "../providers/projectList/use";
import { Project } from "../types/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TooltipModal from "./modal/tooltipModal";

type Phase = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

const tooltipInfo = [
    {
        id: 1,
        title: "Pomodoros",
        content: "Pomodoros are (normally) 25-minute work cycles followed by a short break. This technique enhances productivity and concentration."
    },
    {
        id: 2,
        title: "Focus",
        content: "This is the focus time spent wich refers to the total time the user has spent using the Pomodoro focus timer, excluding both short and long breaks."
    },
]

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
        setLockedInProject(null)
    };

    // Change Timer Type
    const toggleTimerType = () => {
        setIsActive(false);
        setShowTimer(false);
    };

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
                sendNotification(
                    "Focus session complete!",
                    nextPhase === "LONG_BREAK"
                        ? "Time for a long break."
                        : "Time for a short break."
                );
            } else {
                setPhase("FOCUS");
                setTimeLeft(pomodoroType.focusTime);
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
    ]);

    const handleChangeType = (type: (typeof pomodoroTypes)[number]) => {
        setShowTimer(true);
        setPomodoroType(type);
        setPhase("FOCUS");
        setTimeLeft(type.focusTime);
        setIsActive(false);
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
        <div className="sticky top-14 space-y-4 py-4">
            <div className="py-3 px-2">
                <AnimatePresence mode="wait">
                {!showTimer ? (
                    <motion.div 
                        key="type-selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <h2 className="mb-2 text-lg font-bold tracking-tight">
                            Pomodoro Settings
                        </h2>
                        <div className="space-y-2">
                            {pomodoroTypes.map((type, index) => (
                                <button
                                    onClick={() => handleChangeType(type)}
                                    key={index}
                                    className="p-4 w-full bg-background border rounded-lg cursor-pointer hover:bg-accent "
                                >
                                    <div className="flex flex-col text-left space-y-2">
                                        <div className="flex flex-row justify-between items-center">
                                            <h3 className="font-bold text-medium">
                                                {type.name}
                                            </h3>
                                            <span className="text-xs py-1 px-2 bg-accent-foreground text-background rounded">{type.focusTime / 60} min</span>
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground">
                                            {type.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="timer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="rounded-lg border bg-card text-card-foreground p-4"
                    >
                        <h2 className="text-center text-2xl font-bold">
                            Pomodoro Timer
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1 mb-4 text-center">
                            {formatPhase(phase.toString())} Session
                        </p>
                        
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
                                    className="text-muted"
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                />
                                <motion.circle
                                    className="text-accent-foreground"
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
                                <span className="text-4xl font-bold">
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
                             <Button variant="outline" size="icon" onClick={toggleTimer} disabled={!selectedProject} >
                                 {isActive ? (
                                     <Pause className="h-4 w-4" />
                                 ) : (
                                     <Play className="h-4 w-4" />
                                 )}
                             </Button>
                             <Button variant="outline" size="icon" onClick={resetTimer} disabled={!selectedProject} >
                                 <RefreshCcw className="h-4 w-4" />
                             </Button>
                             <Button variant="outline" size="icon" onClick={toggleTimerType}>
                                 <Settings className="h-4 w-4" />
                             </Button>
                         </motion.div>
                         
                        <motion.div
                            className="flex justify-center gap-4 pb-4 text-xs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {lockedInProject != null 
                                ? lockedInProject.name 
                                : selectedProject != null 
                                    ? selectedProject.name 
                                    : "Select a project."
                            }
                        </motion.div>

                         <div className="flex flex-row border-t justify-between gap-4 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="p-3 w-1/2"
                            >
                                <div className="flex flex-row space-x-1 items-center mb-1">
                                    <h3 className="text-xs font-medium">
                                        Pomodoros
                                    </h3>
                                    <TooltipModal
                                        title={tooltipInfo[0].title}
                                        content={tooltipInfo[0].content}
                                    />
                                </div>
                                <p className="text-lg font-bold">
                                    {completedPomodoros}
                                </p>
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className=" p-3 w-1/2"
                            >
                                
                                <div className="flex flex-row space-x-1 items-center mb-1">
                                    <h3 className="text-xs font-medium">
                                        Focus
                                    </h3>
                                    <TooltipModal
                                        title={tooltipInfo[1].title}
                                        content={tooltipInfo[1].content}
                                    />
                                    
                                </div>
                                <p className="text-lg font-bold ">
                                    {formatFullTime(focusTimeSpent)}
                                </p>
                            </motion.div>
                        </div>
                         {/* <motion.div
                            key={motivationalPhrase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-accent text-muted-foreground w-full py-2 px-4 rounded-md inline-flex items-center text-sm font-medium"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                ` ${motivationalPhrase} `
                            )}
                        </motion.div> */}
                    </motion.div>
                    
                )}
                </AnimatePresence>
            </div>
        </div>
        
    );
}
