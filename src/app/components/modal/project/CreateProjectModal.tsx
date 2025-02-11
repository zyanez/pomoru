
import { useState } from "react";
import { User } from "lucide-react";
import LoadingModal from "../LoadingModal";
import { useProjectList } from "@/app/providers/projectList/use";
import { useSession } from "next-auth/react";
import { ApiCall } from "@/app/calls/ApiCall";

export function CreateProjectModal(){
    const { actions: { addProject } } = useProjectList();
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [type, setType] = useState<"Work" | "Personal">("Personal");

    const handleSubmit : () => Promise<boolean> = async () => {
        try {
            const ownerId = session?.user.id;
            if (ownerId == null) { 
                alert("Owner id is required.");
                return false
            }
            if (name.trim() == "") { 
                alert("Name is required.");
                return false
            }

            const newProject = await ApiCall.createProject(name, type, ownerId)
            addProject(newProject); // also selects new project
            //selectProject(newProject);

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

    const resetFields = () => {
        setName("");
        setType("Personal");
    }

    const labels = {
        normalLabel: "Create Task",
        loadingLabel: "Creating Task..."
    }

    return <LoadingModal
        title={"Create Task"}
        confirmLabels={labels}
        onConfirm={handleSubmit}
        onOpen={resetFields}
    >
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
            </label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
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
        
    </LoadingModal>
}