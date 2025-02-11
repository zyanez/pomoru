import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Task } from "../../types/utils";
import { TaskDetails } from "./TaskDetails";
import { useTaskList } from "@/app/providers/taskList/use";
import { useSelectedProject } from "@/app/providers/selectedProject/use";
import { CreateTaskModal } from "../modal/task/CreateTaskModal";

export function TasksTable(){
    const {state : {taskList}, actions: {addAll}} = useTaskList()
    const {state : {selectedProject}} = useSelectedProject()
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true)
            try {
                if (selectedProject == null) throw new Error("Failed to create task");
                const response = await fetch("/api/tasks/"+selectedProject?.id);
                if (!response.ok) {
                    console.log("error?")
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data: Task[] = await response.json();
                addAll(data);
            } catch (error) {
                console.error("Error fetching projects: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedProject]);

    return <>
        {loading ? (
            <div className="flex items-center justify-center h-16">
                <Loader2 className="animate-spin h-5 w-5 text-slate-500" />
                <span className="ml-2 text-sm text-gray-500">
                    Loading tasks...
                </span>
            </div>
        ) : (
            <div key="asjf">
                <CreateTaskModal />
                {
                    taskList.length != 0 ? taskList.map((task, i) => (
                        <TaskDetails task={task} />
                    )) : <p className="text-black">no task</p>
                }
            </div>
        )}
        
    </>
}