import { useTaskList } from "@/app/providers/taskList/use";
import { Task } from "@/app/types/utils";
import { Check, X } from "lucide-react";
import { UpdateTaskModal } from "../modal/UpdateTaskModal";
import { DeleteTaskModal } from "../modal/DeleteTaskModal";
import { ApiCall } from "@/app/calls/ApiCall";
import { useCallback } from "react";

export function TaskDetails({task} : {task:Task}){
    const {state: {taskList}, actions: {updateTask}} = useTaskList()

    const changeToCompleted = useCallback(async () => {
        try {
            const updatedTask = await ApiCall.completeTask(task.id)
            updateTask(updatedTask)

        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        }
    }, [task])
    
    return <div className="flex flex-row items-center h-10 mb-2 bg-slate-200">
        <Completed completed={task.completed} onClick={changeToCompleted}/>
        <Title title={task.title}/>
        <Importance type={task.important}/>
        <UpdateTaskModal task={task}/>
        <DeleteTaskModal task={task}/>
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