
// task is null -> insert
// task is not null -> update/delete

import { useMemo, useState } from "react";
import BaseModal from "../BaseModal";
import { Check, ClipboardPlus, Cog, User, X } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import { useSelectedProject } from "@/app/providers/selectedProject/use";
import LoadingModal from "../LoadingModal";
import { Task } from "@/app/types/utils";


export function UpdateTaskModal({task} : {task:Task}){
    const {actions : {updateTask}} = useTaskList()
    const [s_title, setTitle] = useState(task.title);
    const [completed, setCompleted] = useState(task.completed);
    const [important, setImportant] = useState(task.important);

    const updateTaskAndCall = async () => {
        const response = await fetch("/api/tasks", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: task.id,
                title: s_title,
                completed: completed,
                important: important,
            }),
        });
        if (!response.ok) throw new Error("Internal server error");
        
        const updatedTask = await response.json();
        updateTask(updatedTask[0]);
    };
    
    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            if (s_title.trim()) {
                await updateTaskAndCall();
                resetFields();
                return true;
            } else {
                alert("Task title is required.");
                return false;
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("There was an error creating the task. " + error);
            return false;
        }
    };

    const resetFields = ()=>{
        /*
        setTitle("");
        setImportant(0);
        setComplete(false);
        */
    }

    const labels = {
        normalLabel: "Update Task",
        loadingLabel: "Updating Task..."
    }

    return <LoadingModal
        title={"Update Task"}
        buttonLabel=""
        buttonIcon={<Cog className="h-4 w-4" />}
        confirmLabels={labels}
        onConfirm={handleSubmit}
        onClose={resetFields}     >
        <div>
            <label className="block text-m font-medium text-slate-700 mb-2">
                Title
            </label>
            <input
                type="text"
                value={s_title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
            />
        </div>
        
        <div>
            <label className="mt-4 block text-m font-medium text-slate-700 mb-2">
                Completed
            </label>
            <div className="flex space-x-4">

            {[true, false].map((bool:boolean, i)=>{
                return <button
                    onClick={() => setCompleted(bool)}
                    className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 
                        ${completed === bool
                            ? "bg-slate-800 text-white hover:bg-slate-700"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                >
                {
                    bool 
                    ? <><Check size={18} className="mr-2" />Completed</> 
                    : <><X size={18} className="mr-2" />Incompleted</>
                }
                </button>
            })}

            </div>
        </div>

        <div>
            <label className="mt-4 block text-m font-medium text-slate-700 mb-2">
                Importance
            </label>
            <div className="flex space-x-4">
                {["Low","Medium","High"].map((text, i)=>(
                    <button
                        onClick={() => setImportant(i)}
                        className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 ${
                            important === i
                                ? "bg-slate-800 text-white hover:bg-slate-700"
                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                    >
                        <User size={18} className="mr-2" />
                        {text}
                    </button>
                ))}
            </div>
        </div>
        
    </LoadingModal>
}