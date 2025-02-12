"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PomodoroTimer from "./components/PomodoroTimer";
import { useSession } from "next-auth/react";
import { Body } from "./components/Body";
import { SelectedProjectProvider } from "./providers/selectedProject/provider";
import Modal from "./components/modal/BaseModal";
import { TestTube, X } from "lucide-react";
import BaseModal from "./components/modal/BaseModal";
import LoadingModal from "./components/modal/LoadingModal";
import { ProjectListProvider } from "./providers/projectList/provider";
import { ModeToggle } from "@/components/toggleTheme";

const sleep = (ms : number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Home() {
    const [totalTime, setTotalTime] = useState(0);
    const [totalPomodoro, setTotalPomodoro] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const { data: session } = useSession();

    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)_250px] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:gap-10">
                <ProjectListProvider>
                    <Sidebar/>
                    <main className="flex w-full flex-col overflow-hidden">
                        <Body/>
                    </main>
                    <PomodoroTimer onTimeUpdate={setTotalTime} onPomodoroUpdate={setTotalPomodoro} />
                </ProjectListProvider>
            </div>
            {/* <div className="flex flex-1 bg-white">
                {session ? (
                    <ProjectListProvider>
                        <Sidebar />
                        <main className="flex-1 flex flex-col md:flex-row overflow-auto">
                            <Body/>
                            <ModeToggle/>
                            <PomodoroTimer onTimeUpdate={setTotalTime} onPomodoroUpdate={setTotalPomodoro} />
                        </main>
                    </ProjectListProvider>
                ) : (
                    "No account..."
                )}
            </div>
            <Footer /> */}
        </div>
    );
}
