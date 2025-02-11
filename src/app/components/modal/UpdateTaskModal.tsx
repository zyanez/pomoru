
import { useState } from "react";
import { Check, Cog, User, X } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import LoadingModal from "./LoadingModal";
import { Task } from "@/app/types/utils";
import { ApiCall } from "@/app/calls/ApiCall";

export function UpdateTaskModal({task} : {task:Task}){
    const {actions : {updateTask}} = useTaskList()
    const [title, setTitle] = useState(task.title);
    const [completed, setCompleted] = useState(task.completed);
    const [important, setImportant] = useState(task.important);
    
    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            if (title.trim() == "") {
                alert("Task title is required.");
                return false;
            }
            const updatedTask = await ApiCall.updateTask(task.id, {title, important, completed})
            updateTask(updatedTask);

            return true;
        } catch (error) {
            console.error("Error creating task:", error);
            let error_message = "No message"
            if (error instanceof Error)
                error_message = error.message
            alert("There was an error during task creation. " + error_message);
            return false;
        }
    };

    const resetFields = ()=>{
        setTitle(task.title);
        setImportant(task.important);
        setCompleted(task.completed);
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
        onOpen={resetFields}     
    >
        <div>
            <label className="block text-m font-medium text-slate-700 mb-2">
                Title
            </label>
            <input
                type="text"
                value={title}
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