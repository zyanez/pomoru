import { Task } from '@/app/types/utils';
import { createContext } from 'react';

interface ITaskListContext {
    state: {
        taskList: Task[]     // Null if no project is selected
    };
    actions: {
        load: (tasks: Task[]) => void;
        addTask: (task: Task) => void;
        updateTask: (task: Task) => void;
        deleteTask: (taskId: number) => void;
    };
}

export const TaskListContext = createContext<ITaskListContext>(
    // Default value if provider is not found
    {
        state: { taskList: [] },
        actions: { 
            load: ()=>alert("Provider not found"),
            addTask: ()=>alert("Provider not found"),
            updateTask: ()=>alert("Provider not found"),
            deleteTask: ()=>alert("Provider not found"), 
        },
    }
);
