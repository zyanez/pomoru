import { Task } from '@/app/types/utils';
import { createContext } from 'react';

export type CacheTaskList = {
    projectId : number,
    tasks : Task[] | []
}

interface ITaskListContext {
    state: {
        taskList: Task[],
        cachedTasks: CacheTaskList[];
    };
    actions: {
        addTask: (task: Task) => void;          // add task to current task list
        updateTask: (task: Task) => void;       // update task to current task list
        deleteTask: (taskId: number) => void;   // delete task from current task list

        setTasks: (tasks: Task[]) => void;              // set tasks to use
        cacheTasks: (tasks: CacheTaskList) => void;     // cache tasks with project id
        deleteFromCache: (projectId: number) => void    // delete tasks from cache
        retrieveFromCache: (projectId: number) => Task[] | undefined    // get cached tasks
    };
}

export const TaskListContext = createContext<ITaskListContext>(
    // Default value if provider is not found
    {
        state: { 
            taskList: [],
            cachedTasks: [],  
        },
        actions: { 
            addTask: ()=>alert("Provider not found"),
            updateTask: ()=>alert("Provider not found"),
            deleteTask: ()=>alert("Provider not found"), 

            setTasks: ()=>alert("Provider not found"),
            cacheTasks: ()=>alert("Provider not found"),
            deleteFromCache: ()=>alert("Provider not found"),
            retrieveFromCache: ()=>{alert("Provider not found"); return[];},
            
        },
    }
);
