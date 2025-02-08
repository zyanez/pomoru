import { useTaskList } from "@/app/providers/taskList/use";
import { Task } from "@/app/types/utils";
import { Check, Clock, EllipsisVertical, X } from "lucide-react";
import { useMemo, useState } from "react";
import { UpdateTaskModal } from "../modal/UpdateTaskModal";

export function TaskDetails({task} : {task:Task}){
    const {actions: {updateTask}} = useTaskList()
    // create/POST needs modal on taskTable 
    // others RUD need special row component TaskDetails

    const update = async (task:Task) => {
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
            updateTask(newTask[0])
        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        }
    }

    const changeToCompleted = () => {
        const updatedTask : Task = {
            id: task.id,
            title: task.title,
            completed: true,
            important: task.important,
            createdAt: task.createdAt,
            projectId: task.projectId
        }
        update(updatedTask)
    }
    console.log("on details " + JSON.stringify(task))
    return <div className="flex flex-row items-center h-10 mb-2 bg-slate-200">
        <Completed completed={task.completed} onClick={changeToCompleted}/>
        <Title title={task.title}/>
        <Importance type={task.important}/>
        <UpdateTaskModal task={task}/>
    </div>
}
function Title({title}:{title:string}){
    return <span className={"mx-2 text-black text-bold"}>{title}</span>
}
function Completed({completed, onClick}:{completed:boolean, onClick : ()=>void}) {
    const className = "bg-slate-500 p-[0.05rem] h-8 w-8";
    return (
        <button onClick={onClick} disabled={completed}>
            {
                completed 
                ? <Check className={className + " text-green-300"} />
                : <X className={className +  " text-red-300 hover:bg-slate-900"} />
            }
        </button>
    )
}
function Importance({type}:{type:number}){
    switch (type) {
        case 0:
            return (<span className={"mx-2 text-green-500"}>
                Low
            </span>)
        case 1:
            return (<span className={"mx-2 text-blue-500"}>
                Medium
            </span>)
        case 2:
            return (<span className={"mx-2 text-red-500"}>
                High
            </span>)
        default:
            return (<span className={"mx-2 text-red-500"}>
                High
            </span>)
    }
}
/*
function Options({function}:{function : (task:Task)=>Promise<void>) | undefined}){
    return <button onClick={onClick}>
        <EllipsisVertical className="text-black items-between inline-flex justify-end h-6 w-6" />
    </button>
}
*/