
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

    const importanceOptions: { text: string; color: keyof typeof colorStyles }[] = [
        { text: "Low", color: "emerald" },
        { text: "Medium", color: "amber" },
        { text: "High", color: "rose" },
    ];

    const colorStyles = {
        emerald: "bg-emerald-100 border-emerald-500 text-emerald-700",
        amber: "bg-amber-100 border-amber-500 text-amber-700",
        rose: "bg-rose-100 border-rose-500 text-rose-700",
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
                        <User size={18} className="mr-2" />
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
        
    </LoadingModal>
}