import { useTaskList } from "@/app/providers/taskList/use";
import { Task } from "@/app/types/utils";
import { Check, Clock, EllipsisVertical, X } from "lucide-react";
import { useMemo, useState } from "react";
import { UpdateTaskModal } from "../modal/UpdateTaskModal";
import { DeleteTaskModal } from "../modal/DeleteTaskModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { cn } from "@/lib/utils";

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

export function TaskDetails({ task }: { task: Task }) {
    const {
        actions: { updateTask },
    } = useTaskList();
    // create/POST needs modal on taskTable
    // others RUD need special row component TaskDetails

    const update = async (task: Task) => {
        try {
            const response = await fetch("/api/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const newTask = await response.json();
            updateTask(newTask[0]);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        }
    };

    const changeToCompleted = () => {
        const updatedTask: Task = {
            id: task.id,
            title: task.title,
            completed: true,
            important: task.important,
            createdAt: task.createdAt,
            projectId: task.projectId,
        };
        update(updatedTask);
    };
    console.log("on details " + JSON.stringify(task));
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
                
                {/* <UpdateTaskModal task={task} />
                <DeleteTaskModal task={task} /> */}
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
