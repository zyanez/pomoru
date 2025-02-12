"use client";

import { useSession } from "next-auth/react";
import {
    Clock,
    TagsIcon,
    EllipsisVertical,
    Plus,
    Settings,
} from "lucide-react";
import { Project } from "../types/utils";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";
import BaseModal from "./modal/BaseModal";
import { DeleteProjectModal } from "./modal/DeleteProjectModal";
import { UpdateProjectModal } from "./modal/UpdateProjectModal";
import { Button } from "@/components/ui/button";
import { TasksTable } from "./tasks/TasksTable";

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
            <div className="flex items-center justify-between">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {selectedProject.name}
                    </h2>
                    <p>{selectedProject.description}</p>
                </div>
                <div className="flex gap-x-4">
                    
                    <Button size="icon" variant="ghost">
                        <EllipsisVertical />
                    </Button>
                </div>
            </div>
            <div className="grid gap-4">
                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2">
                            Tasks Overview
                        </h3>
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
                </div>

                <div className="rounded-lg border bg-card text-card-foreground p-6">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="font-semibold text-lg mb-4">Current Tasks</h3>
                        <Button className="h-10">
                            <Plus />
                            Add Task
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <TasksTable/>
                    </div>
                </div>
            </div>
        </>
    );
}
