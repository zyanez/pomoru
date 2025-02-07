import { Task } from '@/app/types/utils';
import { createContext } from 'react';

interface ITaskListContext {
    state: {
        taskList: Task[]     // Null if no project is selected
    };
    actions: {
        addAll: (tasks: Task[]) => void;
        addTask: (task: Task) => void;
        removeTask: (taskId: number) => void;
    };
}

export const TaskListContext = createContext<ITaskListContext>(
    // Default value if provider is not found
    {
        state: { taskList: [] },
        actions: { 
            addAll: ()=>alert("Provider not found"),
            addTask: ()=>alert("Provider not found"),
            removeTask: ()=>alert("Provider not found"), 
        },
    }
);
