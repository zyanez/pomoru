import { CirclePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Task } from "../../types/utils";
import { TaskDetails } from "./TaskDetails";
import CreateTaskModal from "../CreateTaskModal";

const initial_list : Task[] = []

export function TasksTable({selectedProjectId}:{selectedProjectId : number}){
    const [taskList, setTaskList] = useState(initial_list)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/tasks/"+selectedProjectId);
                if (!response.ok) {
                    console.log("error?")
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data: Task[] = await response.json();
                setTaskList(data);
            } catch (error) {
                console.error("Error fetching projects: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedProjectId]);

    const handleTaskCreated = (newTask: Task) => {
        setTaskList(taskList.concat(newTask));
    };

    const updateTask = async (task:Task) => {
        try {
            const response = await fetch("/api/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create task");
            }
    
            const newTask = await response.json();
            alert("no error")
            setTaskList(taskList.map((oldTask, i) => {
                if (oldTask.id === newTask.id) {
                  // Replace with new task
                  return newTask;
                } else {
                  // The rest does not change
                  return oldTask;
                }
              }))
        } catch (error) {
            console.error("Error creating task:", error);
            alert("There was an error creating the task. Please try again.");
        }
    }

    


    return <>
        {loading ? (
            <div className="flex items-center justify-center h-16">
                <Loader2 className="animate-spin h-5 w-5 text-slate-500" />
                <span className="ml-2 text-sm text-gray-500">
                    Loading tasks...
                </span>
            </div>
        ) : (
            <div>
                <button onClick={()=>setIsModalOpen(true)}>
                    <CirclePlus className="text-black h-4 w-4"/>
                </button>
                {
                    taskList.length != 0 ? taskList.map((task, i) => (
                        <div className="flex flex-row">
                            <input type="checkbox" checked={task.completed} onChange={()=>{
                                task.completed = true;
                                updateTask(task)
                            }} />
                            <span className={"mx-2 text-bold " + (task.important == 1 ? "text-green-500" : "text-red-500")}>{task.title}</span>
                        </div>
                    )) : <p className="text-black">no task</p>
                }
            </div>
        )}
        <CreateTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTaskCreated={handleTaskCreated}
            projectId={selectedProjectId}
        />
    </>
}