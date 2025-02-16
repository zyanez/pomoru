import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { X, Trash } from "lucide-react";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm?: (() => void);
    onDelete?: (() => void);
}

export default function ShadBaseModal2({
    title,
    children,
    isOpen,
    onOpenChange,
    onConfirm,
    onDelete,
}: ModalProps) {

    const handleUpdate = () => {
        if (onConfirm){
            onConfirm();
            onOpenChange(false);
        }
    }
    const handleDelete = () => {
        if (onDelete){
            onDelete();
            onOpenChange(false);
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
                            {"Confirm"}
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
