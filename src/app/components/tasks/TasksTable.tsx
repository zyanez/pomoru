import { ClipboardList, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { TaskDetails } from "./TaskDetails";
import { useTaskList } from "@/app/providers/taskList/use";
import CreateTaskModal from "../asyncModals/CreateTaskModal";
import { ApiCall } from "@/app/calls/ApiCall";
import { useProjectList } from "@/app/providers/projectList/use";
import { Button } from "@/components/ui/button";

export function TasksTable(){
    const {state : {taskList}, actions: {setTasks, cacheTasks, retrieveFromCache}} = useTaskList()
    const {state : {selectedProject}} = useProjectList();
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted ] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        setIsMounted(true)
        console.log("mounted")
    }, [])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                if (selectedProject == null) throw new Error("No project id.");
                
                // look in cache first, if nothing is found then do call
                let tasks = retrieveFromCache(selectedProject.id);
                if (tasks == undefined) {
                    tasks = await ApiCall.getTasksByProjectId(selectedProject?.id)
                    cacheTasks({projectId: selectedProject.id, tasks});
                }
                setTasks(tasks);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedProject]);

    return (
        <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex flex-row justify-between items-center">
                <h3 className="font-semibold text-lg mb-4">Current Tasks</h3>
                <Button className="h-10" onClick={() => setIsOpen(!isOpen)}>
                    <Plus />
                    Add Task
                </Button>
                <CreateTaskModal isOpen={isOpen} onOpenChange={setIsOpen} />
            </div>
            <div className="space-y-4">
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
                            taskList.map((task, i) => (
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
            </div>
        </div>
    )
}