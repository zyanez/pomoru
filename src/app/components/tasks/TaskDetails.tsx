import { useTaskList } from "@/app/providers/taskList/use";
import { Task } from "@/app/types/utils";
import { Check, EllipsisVertical, X } from "lucide-react";
import { UpdateTaskModal } from "../newmodal/UpdateTaskModal";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ApiCall } from "@/app/calls/ApiCall";
import { useCallback } from "react";

interface BadgeVariant {
    label: string;
    bg: string;
    text: string;
}
const badgeVariants: Record<number, BadgeVariant> = {
    0: {
        label: "Low",
        bg: "bg-green-100 dark:bg-green-800",
        text: "text-green-500 dark:text-green-100",
    },
    1: {
        label: "Medium",
        bg: "bg-yellow-100 dark:bg-yellow-800",
        text: "text-yellow-500 dark:text-yellow-100",
    },
    2: {
        label: "High",
        bg: "bg-rose-100 dark:bg-rose-800",
        text: "text-rose-500 dark:text-rose-100",
    },
};

export function TaskDetails({task} : {task:Task}){
    const {state: {taskList}, actions: {updateTask}} = useTaskList()
    const [isOpen, setIsOpen] = useState(false)

    const changeToCompleted = useCallback(async () => {
        try {
            const updatedTask = await ApiCall.completeTask(task.id)
            updateTask(updatedTask)

        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        }
    }, [task])
    
    return (
        <div className={` flex items-center justify-between mt-4 p-2 rounded ${ task.completed ? "bg-muted" : "bg-transparent"}`}>
            <div className="flex items-center gap-x-2">
                <Completed
                    completed={task.completed}
                    onClick={changeToCompleted}
                />
                <Title title={task.title} />
                <Importance type={task.important} />
            </div>
            <div className="flex items-center gap-x-2">
                
            <div className="flex gap-x-4">
                    <Button onClick={()=>setIsOpen(!isOpen)} size="icon" variant="ghost">
                        <EllipsisVertical />
                    </Button>
                </div>
                <UpdateTaskModal isOpen={isOpen} onOpenChange={setIsOpen} task={task}  />
            </div>
        </div>
    );
}
function Title({ title }: { title: string }) {
    return <span className={"mx-2 text-sm"}>{title}</span>;
}
function Completed({
    completed,
    onClick,
}: {
    completed: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            
            className={`h-5 w-5 rounded ${completed ? 'bg-foreground hover:bg-accent-foreground' : ''}`}
        >
            {completed ? <Check className={"text-background"} /> : ""}
        </Button>
    );
}
function Importance({ type }: { type: number }) {
    const variant = badgeVariants[type] || badgeVariants[2];
    return (
        <div
            className={cn(
                "text-xs px-3 py-1 rounded font-medium select-none",
                variant.bg,
                variant.text
            )}
        >
            {variant.label}
        </div>
    );
}
/*
function Options({function}:{function : (task:Task)=>Promise<void>) | undefined}){
    return <button onClick={onClick}>
        <EllipsisVertical className="text-black items-between inline-flex justify-end h-6 w-6" />
    </button>
}
*/
