import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, User, ClipboardPlus } from 'lucide-react';
import { Project } from "../types/utils";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: (project: Project) => void; 
}

export default function CreateProjectModal({
    isOpen,
    onClose,
    onProjectCreated,
}: CreateProjectModalProps) {
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState<"Work" | "Personal">("Personal");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [goals, setGoals] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    const [isLoading, setIsLoading] = useState(false);

    const createProject = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: projectName,
                    type: projectType,
                    description,
                    startDate,
                    endDate,
                    budget: Number(budget),
                    goals,
                    tags,
                    priority,
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create project");
            }
    
            const newProject = await response.json();
            console.log("Project created successfully:", newProject);
            onProjectCreated(newProject);
        } catch (error) {
            console.error("Error creating project:", error);
            alert("There was an error creating the project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim()) {
            await createProject();
            setProjectName("");
            setProjectType("Personal");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setBudget("");
            setGoals("");
            setTags([]);
            setPriority("medium");

            onClose();
        } else {
            alert("Project name is required.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white p-6 rounded-lg w-full max-w-lg"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">New Project</h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Enter project name"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Type
                                </label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setProjectType("Personal")}
                                        className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 ${
                                            projectType === "Personal"
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                        }`}
                                    >
                                        <User size={18} className="mr-2" />
                                        Personal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProjectType("Work")}
                                        className={`flex items-center text-sm px-4 py-2 rounded-full transition-colors duration-200 ${
                                            projectType === "Work"
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                        }`}
                                    >
                                        <Briefcase size={18} className="mr-2" />
                                        Work
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-800 text-sm text-white py-2 px-4 rounded flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Project...
                                    </>
                                ) : (
                                    <>
                                        <ClipboardPlus className="mr-3 h-5 w-5"/>
                                        <span>Create Project</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

