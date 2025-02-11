
import { useState } from "react";
import { Plus, User } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import LoadingModal from "./LoadingModal";
import { ApiCall } from "@/app/calls/ApiCall";
import { useProjectList } from "@/app/providers/projectList/use";
import BaseModal from "./BaseModal";

export function CreateTaskModal(){
    const {actions : {addTask}} = useTaskList()
    const {state : {selectedProject}} = useProjectList()
    const [title, setTitle] = useState("");
    const [important, setImportant] = useState(0);

    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            if (selectedProject == null) {
                alert("No project is selected.");
                return false
            }
            if (title.trim() == "") { 
                alert("Title is required.");
                return false
            }

            const newTask = await ApiCall.createTask({title, important, projectId: selectedProject.id});
            addTask(newTask);

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
        setTitle("");
        setImportant(0);
    }

    const labels = {
        normalLabel: "Create Task",
        loadingLabel: "Creating Task..."
    }


    return <LoadingModal
        buttonLabel="Add Task"
        title={"Create Task"}
        confirmLabels={labels}
        onConfirm={handleSubmit}
        onOpen={resetFields}     >
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