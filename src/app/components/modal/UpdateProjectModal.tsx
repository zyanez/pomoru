
import { useState } from "react";
import { Archive, ArchiveRestore, Check, Cog, User, X } from "lucide-react";
import { useProjectList } from "@/app/providers/projectList/use";
import LoadingModal from "./LoadingModal";
import { Project } from "@/app/types/utils";
import { ApiCall } from "@/app/calls/ApiCall";

export function UpdateProjectModal({project} : {project:Project}){
    const {actions: {updateProject, selectProject}} = useProjectList()
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [type, setType] = useState(project.type);
    const [completed, setCompleted] = useState(project.completed);
    const [archived, setArchived] = useState(project.completed);

    const handleSubmit: () => Promise<boolean> = async () => {
        try {
            if (name.trim() == "") {
                alert("Project name is required.");
                return false;
            }
            if (description.trim() == "") {
                alert("Project description is required.");
                return false;
            }
            const updatedProject = await ApiCall.updateProject(project.id, {name, description, type, completed, archived})
            updateProject(updatedProject);
            selectProject(updatedProject)

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

    const resetFields = ()=>{
        setName(project.name);
        setDescription(project.description);
        setType(project.type)
        setCompleted(project.completed);
        setArchived(project.archived)
    }

    const labels = {
        normalLabel: "Update Project",
        loadingLabel: "Updating Project..."
    }

    return <LoadingModal
        title={"Update Project"}
        buttonLabel=""
        buttonIcon={<Cog className="h-4 w-4" />}
        confirmLabels={labels}
        onConfirm={handleSubmit}
        onOpen={resetFields}     
    >
        <div>
            <label className="block text-m font-medium text-slate-700 mb-2">
                Name
            </label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project title"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
            />
        </div>

        <div>
            <label className="block text-m font-medium text-slate-700 mb-2">
                Description
            </label>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project title"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
            />
        </div>
        
        <div>
            <label className="mt-4 block text-m font-medium text-slate-700 mb-2">
                Type
            </label>
            <div className="flex space-x-4">
                {["Work","Personal"].map((text, i)=>(
                    <button
                        type="button"
                        onClick={() => text == "Work" || text == "Personal" ? setType(text) : null}
                        className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 ${
                            type == text
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
                Archived
            </label>
            <div className="flex space-x-4">

            <button
                onClick={() => setArchived(!archived)}
                className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 
                    ${archived
                        ? "bg-slate-800 text-green-500 hover:bg-slate-700"
                        : "bg-slate-200 text-blue-500 hover:bg-slate-300"
                    }`}
            >
                {
                    archived 
                    ? <><ArchiveRestore size={18} className="mr-2" />Restore</> 
                    : <><Archive size={18} className="mr-2" />Archive</>
                }
                </button>

            </div>
        </div>
        
    </LoadingModal>
}