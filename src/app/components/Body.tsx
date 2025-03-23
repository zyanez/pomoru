import { Folder, Plus } from "lucide-react";
import { ProjectDetails } from "./ProjectDetails";
import { TasksTable } from "./tasks/TasksTable";
import { TaskListProvider } from "../providers/taskList/provider";
import { useProjectList } from "../providers/projectList/use";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";

export function Body() {
    const { state: { selectedProject } } = useProjectList();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [showTooltip, setShowTooltip] = useState(true);

    useEffect(() => {
        if (status !== "loading") {
            setIsLoading(false);
        }
    }, [status]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {selectedProject ? (
                <TaskListProvider>
                    <ProjectDetails selectedProject={selectedProject} />
                </TaskListProvider>
            ) : (
                <div className="h-[50vh] flex items-center justify-center h-[50vh]">
                    <div className="text-center">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="w-16 h-16 rounded-xl mx-auto" />
                                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                                <Skeleton className="h-4 w-32 mx-auto" />
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Folder className="w-8 h-8" />
                                </div>
                                <h2 className="text-base font-bold">
                                    Welcome, {session?.user.name || 'user'}!
                                </h2>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Select a project or create one to get started.
                                </p>
                                <Button className="h-10" variant="default">
                                    Create Project
                                    <Plus />
                                </Button>

                                

                                
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
