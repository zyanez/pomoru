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
import { TasksTable } from "./components/tasks/TasksTable";
import { Body } from "./components/Body";

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
                        <main className="flex-1 flex flex-col md:flex-row overflow-auto">
                            <Body selectedProject={selectedProject}/>
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
