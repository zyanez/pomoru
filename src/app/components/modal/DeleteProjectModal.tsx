
import { Trash } from "lucide-react";
import { useProjectList } from "@/app/providers/projectList/use";
import LoadingModal from "./LoadingModal";
import { Project } from "@/app/types/utils";
import { ApiCall } from "@/app/calls/ApiCall";

export function DeleteProjectModal({project} : {project:Project}){
    const {actions : {deleteProject, selectProject}} = useProjectList()
    
    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            const response = await ApiCall.deleteProject(project.id)
            deleteProject(response.id);
            selectProject(null)

            return true;
        } catch (error) {
            console.error("Error creating project:", error);
            let error_message = "No message"
            if (error instanceof Error)
                error_message = error.message
            alert("There was an error during project creation. " + error_message);
            return false;
        }
    };

    const labels = {
        normalLabel: "Delete Project",
        loadingLabel: "Deleting Project..."
    }

    return <LoadingModal
        title={"Delete Project"}
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
                {project.name}
            </p>

        </div>
    </LoadingModal>
}