
// task is null -> insert
// task is not null -> update/delete

import { useMemo, useState } from "react";
import BaseModal from "./BaseModal";
import { ClipboardPlus, User, X } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import { useSelectedProject } from "@/app/providers/selectedProject/use";
import LoadingModal from "./LoadingModal";


export function CreateTaskModal(){
    const {actions : {addTask}} = useTaskList()
    const {state : {selectedProject}} = useSelectedProject()
    const [title, setTitle] = useState("");
    const [important, setImportant] = useState(0);

    const createTask = async () => {
        if (selectedProject == null) throw new Error("No project selected");
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    title: title,
                    important: important,
                    projectId: selectedProject.id
            }),
        });
        if (!response.ok) throw new Error("Internal server error");
        
        const newTask = await response.json();
        addTask(newTask);
    };
    
    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            if (title.trim()) {
                await createTask();
                resetFields();
                return true;
            } else {
                alert("Task title is required.");
                return false;
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("There was an error creating the task. ");
            return false;
        }
    };

    const resetFields = ()=>{
        setTitle("");
        setImportant(0);
    }

    const labels = {
        normalLabel: "Create Task",
        loadingLabel: "Creating Task..."
    }


    return <LoadingModal
        title={"Create Task"}
        confirmLabels={labels}
        onConfirm={handleSubmit}
        onClose={resetFields}     >
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
                Importance
            </label>
            <div className="flex space-x-4">
                {["Low","Medium","High"].map((text, i)=>(
                    <button
                        type="button"
                        onClick={() => setImportant(i)}
                        className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 ${
                            important === i
                                ? "bg-slate-800 text-white"
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