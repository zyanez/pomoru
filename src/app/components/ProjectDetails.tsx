"use client";

import {Archive, ArchiveRestore, Clock, EllipsisVertical, Plus, } from "lucide-react";
import { Project } from "../types/utils";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";
import UpdateProjectModal2 from "./nowaitmodal/UpdateProjectModal2";
import { Button } from "@/components/ui/button";
import { ApiCall } from "../calls/ApiCall";
import { useProjectList } from "../providers/projectList/use";

export function ProjectDetails({selectedProject}: {selectedProject: Project}) {

    const [isOpen, setIsOpen] = useState(false);
    const {actions: {updateProject, selectProject}} = useProjectList()

    const archive = () => {
            try {
                ApiCall.updateProject(
                    selectedProject.id, {archived: !selectedProject.archived}
                )
    
                selectedProject.archived = !selectedProject.archived;
                
                updateProject(selectedProject);
                selectProject(selectedProject); // only for re-render
            } catch (error) {
                console.error("Error updating project:", error);
                let error_message = "No message"
                if (error instanceof Error)
                    error_message = error.message
                alert("There was an error during project update. " + error_message);
            }
        };


        

    return (
                <div className="rounded-lg border bg-card text-card-foreground p-6">

                    <div className="flex flex-row justify-between mb-3">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold tracking-tight">
                                {selectedProject.name}
                            </h2>
                            <p className="text-sm">{selectedProject.description}</p>
                        </div>
                        <div className="flex gap-x-4">
                            <Button onClick={archive} size="icon" variant="ghost">
                                {selectedProject.archived ? <Archive /> : <ArchiveRestore /> }
                            </Button>
                        </div>
                        <div className="flex gap-x-4">
                            <Button onClick={()=>setIsOpen(!isOpen)} size="icon" variant="ghost">
                                <EllipsisVertical />
                            </Button>
                        </div>
                        <UpdateProjectModal2 isOpen={isOpen} onOpenChange={setIsOpen} project={selectedProject}  />
                    </div>
                    <div className="mb-2 flex flex-row text-xs space-x-4 text-muted-foreground">
                        <div className="flex flex-row items-center space-x-2">
                            <TypeIcon type={selectedProject.type} />
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
                                    : "In Progress."}
                            </span>
                        </div>
                    </div>
                </div>
    );
}
