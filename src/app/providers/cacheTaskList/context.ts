import { Task } from '@/app/types/utils';
import { createContext } from 'react';

export type CacheTaskList = {
    projectId : number,
    tasks : Task[] | []
}

interface ICacheTaskListContext {
    state: {
        cachedTasks: CacheTaskList[] | [];
    }
    actions: {
        addToCache: (tasks: CacheTaskList) => void;
        updateCache: (tasks: CacheTaskList) => void;
        deleteFromCache: (projectId: number) => void
        retrieveFromCache: (projectId: number) => Task[] | undefined
    };
}

export const CacheTaskListContext = createContext<ICacheTaskListContext>(
    // Default value if provider is not found
    {
        state: { 
            cachedTasks: [], 
        },
        actions: { 
            addToCache: ()=>alert("Provider not found"),
            updateCache: ()=>alert("Provider not found"),
            deleteFromCache: ()=>alert("Provider not found"),
            retrieveFromCache: ()=>{alert("Provider not found"); return[];},
        },
    }
);
