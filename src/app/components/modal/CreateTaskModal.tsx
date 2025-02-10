// task is null -> insert
// task is not null -> update/delete

import { useState } from "react";
import { AlertTriangle, Circle, CircleAlert, User,  } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import { useSelectedProject } from "@/app/providers/selectedProject/use";
import LoadingModal from "./LoadingModal";

export function CreateTaskModal(){
    const {actions : {addTask}} = useTaskList()
    const {state : {selectedProject}} = useSelectedProject()
    const [title, setTitle] = useState("");
    const [important, setImportant] = useState(0);

    const importanceOptions: { text: string; color: keyof typeof colorStyles; icon: React.ReactNode }[] = [
        { text: "Low", color: "emerald", icon: <Circle className="text-emerald-500 mr-2" size={20} /> },
        { text: "Medium", color: "amber", icon: <CircleAlert className="text-amber-500 mr-2" size={20} /> },
        { text: "High", color: "rose", icon: <AlertTriangle className="text-rose-500 mr-2" size={20} /> },
    ];


    const colorStyles = {
        emerald: "bg-emerald-100 border-emerald-400 text-emerald-500",
        amber: "bg-amber-100 border-amber-400 text-amber-500",
        rose: "bg-rose-100 border-rose-400 text-rose-500",
    };

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
        normalLabel: "Add Task",
        loadingLabel: "Saving Task..."
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
                placeholder="Enter Task Title"
                className="w-full text-black p-2 border rounded border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-50 transition-all duration-200"
                autoFocus
            />
        </div>
        
        <div>
            <label className="mt-4 block text-m font-medium text-slate-700 mb-2">
                Priority
            </label>
            <div className="flex space-x-4">
                {importanceOptions.map((option, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setImportant(i)}
                        className={`flex items-center justify-between px-4 py-2 border rounded transition-all duration-200 ${
                            important === i ? ` ${colorStyles[option.color]} ` : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        {option.icon}
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
        
    </LoadingModal>
}