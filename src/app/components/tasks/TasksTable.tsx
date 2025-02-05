import { CirclePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Task } from "../../types/utils";

const initial_list : Task[] = []

export function TasksTable({selectedProjectId}:{selectedProjectId : number}){
    const [taskList, setTaskList] = useState(initial_list)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
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

    const handleClick = async () => {
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        title: "TEST",
                        important: 1,
                        projectId: selectedProjectId
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create task");
            }
    
            const newTask = await response.json();
            console.log("Project created successfully:", newTask);
            alert("CORRECTO");
            setTaskList(taskList.concat(newTask))
            //onProjectCreated(newTask);
        } catch (error) {
            console.error("Error creating task:", error);
            alert("There was an error creating the task. Please try again.");
        }
    }

    

    // fetch tasks related to project
    // need CRUD for tasks
    // create/POST needs button somewhere
    // others RUD need special row component TaskDetails
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
                <button onClick={handleClick}>
                    <CirclePlus className="text-black h-4 w-4"/>
                </button>
                {
                    taskList.length != 0 ? taskList.map((task, i) => (
                        <p className="text-black" key={i}>{task.id}</p>
                    )) : <p className="text-black">no task</p>
                }
            </div>
        )}
    </>
}