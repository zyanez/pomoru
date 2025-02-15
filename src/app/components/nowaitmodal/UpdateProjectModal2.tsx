
import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Check, User, X } from "lucide-react";
import { useProjectList } from "@/app/providers/projectList/use";
import { Project } from "@/app/types/utils";
import { ApiCall } from "@/app/calls/ApiCall";
import ShadcnModal2 from "./ShadcnModal2";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project
}

export default function UpdateProjectModal({isOpen, onOpenChange, project}: ModalProps) {
    const {actions: {updateProject, deleteProject, selectProject}} = useProjectList()
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [type, setType] = useState(project.type);
    const [completed, setCompleted] = useState(project.completed);
    const [archived, setArchived] = useState(project.completed);
    
    useEffect(()=>{
        resetFields();
    }, [project])

    const resetFields = () => {
        setName(project.name);
        setDescription(project.description);
        setType(project.type)
        setCompleted(project.completed);
        setArchived(project.archived)
    }

    const update = () => {
        try {
            if (name.trim() == "") {
                throw new Error("Project name is required.");
            }
            if (description.trim() == "") {
                throw new Error("Project description is required.");
            }
            ApiCall.updateProject(
                project.id, {name, description, type, completed, archived}
            )

            project.name = name;
            project.description = description;
            project.type = type;
            project.completed = completed;
            project.archived = archived;
            
            updateProject(project);
            selectProject(project); // only for re-render
        } catch (error) {
            console.error("Error updating project:", error);
            let error_message = "No message"
            if (error instanceof Error)
                error_message = error.message
            alert("There was an error during project update. " + error_message);
        }
    };

    const remove = () => {
        try {
            ApiCall.deleteProject(project.id)
            deleteProject(project.id);
            selectProject(null)
        } catch (error) {
            console.error("Error removing project:", error);
            let error_message = "No message"
            if (error instanceof Error)
                error_message = error.message
            alert("There was an error during project removal. " + error_message);
        }
    };
    
    return <ShadcnModal2
        title={"Update Project"}
        onConfirm={update}
        onDelete={remove}
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
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
    </ShadcnModal2>
}