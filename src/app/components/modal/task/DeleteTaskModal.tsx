
import { Trash } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import LoadingModal from "../LoadingModal";
import { Task } from "@/app/types/utils";


export function DeleteTaskModal({task} : {task:Task}){
    const {actions : {deleteTask}} = useTaskList()

    const deleteTaskAndCall = async () => {
        const response = await fetch("/api/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskId: task.id,
            }),
        });
        if (!response.ok) throw new Error("Internal server error");
        
        const taskId = await response.json();
        deleteTask(taskId);
    };
    
    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            await deleteTaskAndCall();
            return true;

        } catch (error) {
            console.error("Error deleting task:", error);
            alert("There was an error deleting the task. " + error);
            return false;
        }
    };

    const labels = {
        normalLabel: "Delete Task",
        loadingLabel: "Deleting Task..."
    }

    return <LoadingModal
        title={"Delete Task"}
        buttonLabel=""
        buttonIcon={<Trash className="h-4 w-4" />}
        confirmLabels={labels}
        onConfirm={handleSubmit}
    >
        <div>
            <label className="block text-m font-medium text-slate-700 mb-2">
                Title
            </label>
            <p>
                {task.title}
            </p>

        </div>
    </LoadingModal>
}