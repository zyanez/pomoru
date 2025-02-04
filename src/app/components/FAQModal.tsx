import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FAQModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
    const faqs = [
        {
            question: "Q1",
            answer: "A1",
        },
        {
            question: "Q2",
            answer: "A2",
        },
        {
            question: "Q3",
            answer: "A3",
        },
        
    ];

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
                        className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-slate-800 font-bold">
                                Frequently Asked Questions
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index}>
                                    <h3 className="text-md text-slate-800 font-semibold mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-slate-500 text-sm ">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
