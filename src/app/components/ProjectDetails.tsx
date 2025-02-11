"use client";

import { useSession } from "next-auth/react";
import { Clock, TagsIcon, EllipsisVertical } from "lucide-react";
import { Project } from "../types/utils";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";
import BaseModal from "./modal/BaseModal";
import { DeleteProjectModal } from "./modal/DeleteProjectModal";
import { UpdateProjectModal } from "./modal/UpdateProjectModal";

export function ProjectDetails({
    selectedProject,
}: {
    selectedProject: Project;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();


    // fetch tasks related to project
    // need CRUD for tasks
    // create/POST needs button somewhere
    // others RUD need special row component TaskDetails

    
    return (
        <>
            <div className="flex flex-row items-start justify-between space-y-0 pb-8">
                <div className="flex flex-col">
                    <div className="mb-2 text-black flex flex-row items-center">
                        <h1 className="text-2xl font-bold">
                            {selectedProject.name}
                        </h1>
                    </div>
                    <div className="mb-2 flex flex-row text-slate-500 text-xs space-x-4">
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
                    <div className="flex flex-row text-slate-900 text-sm font-medium space-x-4">
                        {selectedProject.description}
                    </div>
                </div>
                <UpdateProjectModal project={selectedProject} />
                <DeleteProjectModal project={selectedProject} />
                <BaseModal
                    isOpen={isOpen}
                    onOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    title="Project Details"
                    buttonIcon={<EllipsisVertical className="h-4 w-4" />}
                    isGhost={true}
                    
                >
                    <p>
                       Placeholder
                    </p>
                </BaseModal>
            </div>
        </>
    );
}
