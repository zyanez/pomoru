"use client";

import {Clock, EllipsisVertical, Plus, } from "lucide-react";
import { Project } from "../types/utils";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";
import UpdateProjectModal from "./newmodal/UpdateProjectModal";
import { Button } from "@/components/ui/button";
import { TasksTable } from "./tasks/TasksTable";
import CreateTaskModal from "./newmodal/CreateTaskModal";

export function ProjectDetails({selectedProject}: {selectedProject: Project}) {
    const [isOpen, setIsOpen] = useState(false);
    const [openItIs, setOpenItIs] = useState(false);

    return (
        <>
            <div className="grid gap-4">
                <div className="rounded-lg border bg-card text-card-foreground p-6">

                    <div className="flex flex-row justify-between mb-3">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold tracking-tight">
                                {selectedProject.name}
                            </h2>
                            <p className="text-sm">{selectedProject.description}</p>
                        </div>
                        <div className="flex gap-x-4">
                            <Button onClick={()=>setOpenItIs(!openItIs)} size="icon" variant="ghost">
                                <EllipsisVertical />
                            </Button>
                        </div>
                        <UpdateProjectModal isOpen={openItIs} onOpenChange={setOpenItIs} project={selectedProject}  />
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

                <div className="rounded-lg border bg-card text-card-foreground p-6">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="font-semibold text-lg mb-4">Current Tasks</h3>
                        <Button className="h-10" onClick={() => setIsOpen(!isOpen)}>
                            <Plus />
                            Add Task
                        </Button>
                        <CreateTaskModal isOpen={isOpen} onOpenChange={setIsOpen} />
                    </div>
                    <div className="space-y-4">
                        <TasksTable/>
                    </div>
                </div>

            </div>
        </>
    );
}
