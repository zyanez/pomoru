import { ClipboardList, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskDetails } from "./TaskDetails";
import { useTaskList } from "@/app/providers/taskList/use";
import { CreateTaskModal } from "../modal/CreateTaskModal";
import { ApiCall } from "@/app/calls/ApiCall";
import { useProjectList } from "@/app/providers/projectList/use";

export function TasksTable(){
    const {state : {taskList}, actions: {load}} = useTaskList()
    const {state : {selectedProject}} = useProjectList();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                if (selectedProject == null) throw new Error("Failed to create task. No project id.");
                const tasks = await ApiCall.getTasksByProjectId(selectedProject?.id)
                load(tasks);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedProject]);

    return <>
        {loading ? (
            <div className="flex items-center justify-center h-16 text-muted-foreground">
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="ml-2 text-sm">
                    Loading tasks...
                </span>
            </div>
        ) : (
            <>
                
                {taskList.length > 0 ? (
                    taskList.map((task) => (
                        <TaskDetails key={task.id || i} task={task} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                        <ClipboardList className="h-10 w-10 mb-2" />
                        <p className="text-sm font-medium">
                            No tasks yet. Start by adding one!
                        </p>
                    </div>
                )}
            </>
        )}
        
    </>
}