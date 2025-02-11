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

const sleep = (ms : number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Home() {
    const [totalTime, setTotalTime] = useState(0);
    const [totalPomodoro, setTotalPomodoro] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const { data: session } = useSession();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 bg-white">
                {session ? (
                    <ProjectListProvider>
                        <Sidebar />
                        <main className="flex-1 flex flex-col md:flex-row overflow-auto">
                            <Body/>
                            <PomodoroTimer onTimeUpdate={setTotalTime} onPomodoroUpdate={setTotalPomodoro} />
                        </main>
                    </ProjectListProvider>
                ) : (
                    "No account..."
                )}
            </div>
            <Footer />
        </div>
    );
}
