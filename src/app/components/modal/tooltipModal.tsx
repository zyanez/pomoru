"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";

const TooltipModal = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Info onClick={() => setIsOpen(true)} className="cursor-pointer h-4 w-4"/>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9000]">
                    <div className="border bg-background w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
                        <h3 className="text-lg font-bold text-foreground">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">{content}</p>
                        <div className="w-full flex flex-row justify-end mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Got it
                            </Button>
                        </div>
                        
                    </div>
                </div>
            )}
        </>
    );
};

export default TooltipModal;
