"use client";

import { useSession } from "next-auth/react";
import { Clock, TagsIcon, EllipsisVertical } from "lucide-react";
import { Project } from "../types/utils";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";

export function ProjectDetails({
    selectedProject,
}: {
    selectedProject: Project;
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const { data: session } = useSession();


    // fetch tasks related to project
    // need CRUD for tasks
    // create/POST needs button somewhere
    // others RUD need special row component TaskDetails

    const handleProjectConfig = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex flex-row items-start justify-between space-y-0 pb-8">
                <div className="flex flex-col">
                    <div className="mb-2 text-black flex flex-row items-center">
                        <h1 className="text-2xl font-bold">
                            {selectedProject.name}
                        </h1>
                    </div>
                    <div className="mb-2 flex flex-row text-slate-500 text-sm space-x-4">
                        <div className="flex flex-row items-center space-x-2">
                            <TypeIcon type={selectedProject.type}/>
                            <span>
                            Type:{" "}
                                {selectedProject.type
                                    ? selectedProject.type
                                    : "Unknown type"}
                            </span>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                                Status:{" "}
                                {selectedProject.completed
                                    ? "Completed."
                                    : "In Progress..."}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row text-slate-900 text-lg space-x-4">
                        {selectedProject.description}
                    </div>
                </div>
                <button
                    onClick={handleProjectConfig} 
                    className="inline-flex items-center text-black justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                >
                    <EllipsisVertical className="h-4 w-4" />
                </button>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 text-slate-800">
                        <h2 className="text-xl font-bold mb-4">Project Settings</h2>
                        <div className="flex flex-row gap-2">
                            <button
                                onClick={closeModal}
                                className="border-slate-200 border hover:bg-slate-100 px-4 py-2 rounded text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:hover:bg-none"
                            >
                                Cancel
                            </button>
                            <button
                                //
                                className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:hover:bg-none"
                            >
                                Save
                            </button>
                        </div> 
                    </div>
                </div>
            )}
        </>
    );
}
