"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Project } from "./types/utils";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PomodoroTimer from "./components/PomodoroTimer";
import StatsCard from "./components/StatsCard";
import { ProjectDetails } from "./components/ProjectDetails";
import { useSession } from "next-auth/react";
import { Folder } from "lucide-react";

export default function Home() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [totalTime, setTotalTime] = useState(0);
    const [totalPomodoro, setTotalPomodoro] = useState(0);

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project);
    };
    const { data: session } = useSession();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 bg-white">
                {session ? (
                    <>
                        <Sidebar
                            onSelectProject={handleProjectSelect}
                            selectedProject={selectedProject}
                        />
                        {/* <main className="flex-1 overflow-auto">
                            <div className="container-custom py-8"> */}
                        <main className="flex-1 flex flex-col md:flex-row overflow-auto">
                            <div className="flex-1 p-4 md:p-8 overflow-auto">
                                {selectedProject ? (
                                    // <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    //     <div className="lg:col-span-2 xl:col-span-3">
                                    //         <ProjectDetails selectedProject={selectedProject} />
                                    //     </div>
                                    //     {/* POMODORO && STATS */}
                                    //     <div className="space-y-6">
                                    //         <PomodoroTimer selectedProject={selectedProject} onTimeUpdate={setTotalTime} onPomodoroUpdate={setTotalPomodoro} />
                                    //         <StatsCard totalTime={totalTime} totalPomodoro={totalPomodoro} />
                                    //     </div>
                                    // </div>
                                    <ProjectDetails selectedProject={selectedProject} />
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-center w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                <Folder className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600">
                                                Select a project to get started.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <PomodoroTimer selectedProject={selectedProject} onTimeUpdate={setTotalTime} onPomodoroUpdate={setTotalPomodoro} />
                        </main>
                    </>
                ) : (
                    "No account..."
                )}
            </div>
            <Footer />
        </div>
    );
}
