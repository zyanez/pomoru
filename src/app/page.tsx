"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PomodoroTimer from "./components/PomodoroTimer";
import { useSession } from "next-auth/react";
import { Body } from "./components/Body";
import { SelectedProjectProvider } from "./providers/selectedProject/provider";
import Modal from "./components/modal/modal";
import { TestTube } from "lucide-react";

export default function Home() {
    const [totalTime, setTotalTime] = useState(0);
    const [totalPomodoro, setTotalPomodoro] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const { data: session } = useSession();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* 🧪 Testing 🧪 */}

            <Modal
                title="Modal"
                isOpen={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                buttonLabel="Open Modal"
                buttonIcon={<TestTube className="ml-3 w-5 h-5" />}
                footerAction={{
                    label: "Confirm",
                    onClick: () => alert("Action!"),
                }}
            >
                <p>Content</p>
            </Modal>

            {/* 🧪 Testing 🧪 */}


            <div className="flex flex-1 bg-white">
                {session ? (
                    <SelectedProjectProvider>
                        <Sidebar />
                        <main className="flex-1 flex flex-col md:flex-row overflow-auto">
                            <Body/>
                            <PomodoroTimer onTimeUpdate={setTotalTime} onPomodoroUpdate={setTotalPomodoro} />
                        </main>
                    </SelectedProjectProvider>
                ) : (
                    "No account..."
                )}
            </div>
            <Footer />
        </div>
    );
}
