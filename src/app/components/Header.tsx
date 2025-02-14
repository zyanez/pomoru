import { motion } from "framer-motion";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import GoogleLogin from "./GoogleLogin";
import { APP_VERSION } from "@/app/config/version";
import Image from "next/image";
import { Logo } from "./Logo";
import Link from "next/link";
import { ModeToggle } from "@/components/toggleTheme";

export default function Header() {
    const { data: session } = useSession();
    const [isModalOpen, setModalOpen] = useState(false);

    const truncate = (str: string, max: number) =>
        str.length > max ? str.slice(0, max) + "..." : str;

    function handleLogout() {
        signOut({ callbackUrl: "/" });
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex items-center space-x-2">
                    <Logo />
                    <div className="flex flex-row gap-x-1 items-center">
                        <span className="font-bold inline-block">Pomoru</span>
                        <span className="text-xs text-muted-foreground">v{APP_VERSION}</span>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none"></div>
                    <nav className="flex items-center space-x-4">
                        <ModeToggle/>

                        <>
                            { session ? (
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-8 rounded-full"
                                >
                                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                                        <Image
                                            src={
                                                session?.user?.image ||
                                                "/default-avatar.png"
                                            }
                                            alt="User avatar"
                                            width={720}
                                            height={720}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    </span>
                                </button>
                            ) : (

                                <GoogleLogin/>
                            )}
                            
                        </>
                    </nav>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-lg p-6 w-80"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4 text-slate-800">
                            Account
                        </h2>
                        <div className="flex flex-col items-center space-y-4">
                            <Image
                                src={
                                    session?.user?.image ||
                                    "/default-avatar.png"
                                }
                                alt="User avatar"
                                width={720}
                                height={720}
                                className="h-16 w-16 rounded-full"
                            />
                            <p className="text-lg font-semibold text-center">
                                {session?.user?.name || "Nombre no disponible"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {session?.user?.email || "Email no disponible"}
                            </p>
                            <button
                                className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition-colors"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="mt-4 text-sm text-blue-500 hover:underline"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </header>
    );
}
