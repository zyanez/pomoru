import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
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
    onOpen?: () => void
    onClose?: () => void
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
        onClose && onClose();
        setIsOpen(false);
    }

    const handleOpening = () => {
        onOpen && onOpen();
        setIsOpen(true);
    }

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
        label : isLoading ? confirmLabels.loadingLabel : confirmLabels.normalLabel, 
        onClick : handleConfirm
    }

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
