
import { Trash } from "lucide-react";
import { useTaskList } from "@/app/providers/taskList/use";
import LoadingModal from "../LoadingModal";
import { Task } from "@/app/types/utils";
import { ApiCall } from "@/app/calls/ApiCall";

export function DeleteTaskModal({task} : {task:Task}){
    const {actions : {deleteTask}} = useTaskList()
    
    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            const response = await ApiCall.deleteTask(task.id)
            deleteTask(response.id);

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