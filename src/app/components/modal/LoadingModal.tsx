import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import BaseModal from "./BaseModal";

interface LoadingModalProps {
    title: string;
    children: React.ReactNode;
    confirmLabels: {
        normalLabel: string;
        loadingLabel: string;
    };
    onConfirm: () => Promise<boolean>;
    buttonLabel?: string;
    buttonIcon?: React.ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
}

export default function LoadingModal({
    title,
    children,
    confirmLabels = {
        normalLabel: "Confirm",
        loadingLabel: "Confirming..."
    },
    buttonLabel,
    buttonIcon,
    onConfirm,
    onOpen,
    onClose
}: LoadingModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleClosing = () => {
        if (onClose) onClose();
        setIsOpen(false);
    };
    
    const handleOpening = () => {
        if (onOpen) onOpen();
        setIsOpen(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        const result = await onConfirm();
        if (result) {
            setIsLoading(false);
            setIsOpen(false);
        }
        setIsLoading(false);
    }

    const footerAction = {
        label: (
            <div className="flex items-center gap-2">
                {isLoading && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <Loader2 className="w-5 h-5" />
                    </motion.div>
                )}
                {isLoading ? confirmLabels.loadingLabel : confirmLabels.normalLabel}
            </div>
        ),
        onClick: handleConfirm,
    };

    return (
        <BaseModal
            title={title} 
            isOpen={isOpen} 
            onOpen={handleOpening}
            onClose={handleClosing}
            buttonLabel={buttonLabel}
            buttonIcon={buttonIcon}
            footerAction={footerAction}
        >
            {children}
        </BaseModal>
    );
}
