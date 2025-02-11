import { motion } from "framer-motion";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import GoogleLogin from "./GoogleLogin";
import { APP_VERSION } from "@/app/config/version";
import Image from "next/image";
import { Logo } from "./Logo";


export default function Header() {
    const { data: session } = useSession();
    const [isModalOpen, setModalOpen] = useState(false);

    const truncate = (str: string, max: number) =>
        str.length > max ? str.slice(0, max) + "..." : str;

    function handleLogout() {
        signOut({ callbackUrl: '/' });
    }

    return (
        <header className="bg-white border-b border-slate-200 block sm:hidden">
            <div className="mx-auto">
                <div className="flex justify-between items-center py-4">
                    <div className="px-7 flex flex-row gap-2 text-slate-800 items-center">
                        <Logo/>
                        <div className="flex flex-row items-center">
                            <h1 className="font-bold text-lg">Pomoru</h1>
                            <span className="ml-2 px-2 py-0.5 text-xs text-slate-500 bg-slate-200 rounded-full">v{APP_VERSION}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => setModalOpen(true)}
                                className="flex items-center cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-md"
                            >
                                <Image
                                    src={
                                        session.user?.image ||
                                        "/default-avatar.png"
                                    }
                                    alt="User avatar"
                                    width={720}
                                    height={720}
                                    className="h-8 w-8 rounded-full mr-2 "
                                />
                                <span className="text-sm text-slate-800 font-medium block xs:hidden">
                                    {truncate(session.user?.name || "User", 10)}
                                </span>
                            </motion.button>
                        ) : (
                            <GoogleLogin />
                        )}
                        
                    </div>
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
