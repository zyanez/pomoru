import { Folder } from "lucide-react";
import { ProjectDetails } from "./ProjectDetails";
import { TasksTable } from "./tasks/TasksTable";
import { TaskListProvider } from "../providers/taskList/provider";
import { useProjectList } from "../providers/projectList/use";
import { CacheTaskListProvider } from "../providers/cacheTaskList/provider";

export function Body() {
    const {state : {selectedProject}} = useProjectList();
    
    return (
        <div className="flex-1 p-16 overflow-auto">
            {selectedProject ? (
                <>
                    <ProjectDetails selectedProject={selectedProject} />
                    <TaskListProvider>
                        <TasksTable />
                    </TaskListProvider>
                </>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-center w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Folder className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600">
                            Select a project to get started.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}