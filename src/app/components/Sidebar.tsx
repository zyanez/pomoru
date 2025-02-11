"use client";

import { Plus, Folder, FolderOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Project } from "../types/utils";
import { motion } from "framer-motion";
import CreateProjectModal from "./CreateProjectModal";
import { useSelectedProject } from "../providers/selectedProject/use";
import { Logo } from "./Logo";
import { APP_VERSION } from "../config/version";

export function Sidebar() {
    const { state:{selectedProject}, actions: { setSelectedProject } } = useSelectedProject();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/projects");
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data: Project[] = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject: Project) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
        setSelectedProject(newProject);
    };

    return (
        <div className="pb-12 w-64 border-r border-gray-200 hidden md:block">
            <div className="space-y-4">
                <div className="py-4 px-3 border-b border-slate-200 hidden sm:block">
                    <div className="px-4 flex flex-row gap-2 text-slate-800 items-center">
                        <Logo/>
                        <div className="flex flex-row items-center">
                            <h1 className="font-bold text-lg">Pomoru</h1>
                            <span className="ml-2 px-2 py-0.5 text-xs text-slate-500 bg-slate-200 rounded-full">v{APP_VERSION}</span>
                        </div>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-2 text-black">
                        <h2 className="px-4 text-base font-semibold tracking-tight">
                            Projects
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100"
                            aria-label="Add new project"
                        >
                            <Plus className="h-4 w-4"/>
                        </button>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-16">
                            <Loader2 className="animate-spin h-5 w-5 text-slate-500" />
                            <span className="ml-2 text-sm text-gray-500">
                                Loading projects...
                            </span>
                        </div>
                    ) : (
                        <div className="h-[calc(100vh-10rem)] overflow-y-auto">
                            <div className="space-y-1">
                                {projects.map((project) => (
                                    <ProjectButton
                                        key={project.id}
                                        project={project}
                                        active={selectedProject?.id === project.id}
                                        onClick={() => setSelectedProject(project)}
                                    />
                                ))}
                                {projects.length === 0 && (
                                    <p className="px-4 text-sm text-gray-500">
                                        No projects available.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </div>
    );
}

function ProjectButton({
    project,
    active = false,
    onClick,
}: {
    project: Project;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }} 
            onClick={onClick}
            className={`w-full text-black font-medium text-black text-sm flex items-center justify-start gap-2 px-4 py-2 rounded-md text-left hover:bg-slate-100  ${
                active ? "bg-slate-100" : "bg-white"
            }`}
        >
            <div className="flex items-center justify-center h-4 w-4">
                {active ? (
                    <FolderOpen className="h-4 w-4" />
                ) : (
                    <Folder className="h-4 w-4" />
                )}
            </div>
            <span className="truncate">{project.name}</span>
            
        </motion.button>
    );
}
