import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

interface ModalProps {
    title?: string;
    children: React.ReactNode;
    footerAction?: {
        label: string;
        onClick: () => void;
    };
    buttonLabel?: string;
    buttonIcon?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

export default function BaseModal({
    title,
    children,
    footerAction,
    buttonLabel = "Open Modal",
    buttonIcon = <Plus className="h-5 w-5" />,
    isOpen,
    onClose,
    onOpen,
}: ModalProps) {
    return (
        <>
            <button
                onClick={() => onOpen?.()}
                className="flex items-center gap-2 bg-slate-800 text-white px-2 py-2 rounded"
            >
                {buttonIcon}
                {buttonLabel}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                {title && (
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {title}
                                    </h2>
                                )}
                                <button
                                    onClick={onClose}
                                    className="text-slate-500 hover:text-slate-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="mb-4 text-slate-500 text-sm">{children}</div>
                            <div className="mt-4 flex justify-end gap-2">
                                {footerAction && (
                                    <button
                                        onClick={footerAction.onClick}
                                        className="bg-slate-800 px-4 py-2 rounded text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:hover:bg-none text-white enabled:hover:bg-slate-700 "
                                    >
                                        {footerAction.label}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="bg-white px-4 py-2 rounded text-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:hover:bg-none border border-slate-300 text-slate-900 enabled:hover:bg-slate-100"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
