import { Loader2 } from "lucide-react";
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