import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { X, Trash } from "lucide-react";
import { useState } from "react";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm?: (() => Promise<boolean>);
    onDelete?: (() => Promise<boolean>);
}

export default function ShadBaseModal({
    title,
    children,
    isOpen,
    onOpenChange,
    onConfirm,
    onDelete,
}: ModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        if (onConfirm){
            setIsLoading(true);
            const result = await onConfirm();
            if (result) {
                setIsLoading(false);
                onOpenChange(false);
            }
            setIsLoading(false);
        }
    }
    const handleDelete = async () => {
        if (onDelete){
            setIsLoading(true);
            const result = await onDelete();
            if (result) {
                setIsLoading(false);
                onOpenChange(false);
            }
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>        
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div>
                    
                    {children}

                    <div className="flex flex-row my-4 justify-end">
                        {onDelete && <button onClick={handleDelete} className="text-yellow-500">
                            <Trash className="text-red-500 w-6 h-6"/>
                        </button>}

                        <button 
                            onClick={async () => await handleUpdate()} 
                            className="text-yellow-500 mx-4"
                        >
                            {isLoading ? "Confirming..." : "Confirm"}
                        </button>

                        <DialogClose asChild>
                            <button>
                                <X className="text-red-500 w-6 h-6"/>
                            </button>
                        </DialogClose>
                    </div>

                    
                    

                </div>
            </DialogContent>
        </Dialog>
    );
}
