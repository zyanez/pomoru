import { ReactNode, useCallback, useState } from 'react';
import { Task } from '../../types/utils';
import {CacheTaskList, TaskListContext} from "./context";

export function TaskListProvider({ children } : {children : ReactNode}) {
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [cachedTasks, setCachedTaskList] = useState<CacheTaskList[]>([]);

    // Sets tasks for use,
    const setTasks = useCallback(async (tasks: Task[]) => {
        setTaskList(tasks);
    }, []);

    // Inserting a task
    const addTask = useCallback((task: Task) => {
        const projectId = taskList[0].projectId;
        const newTaskList = [...taskList, task];

        setTaskList(newTaskList);
        cacheTasks({projectId, tasks: newTaskList})
    }, [taskList]);

    // Updating a task
    const updateTask = useCallback((task: Task) => {
        const i = taskList.findIndex((oldTask) => oldTask.id == task.id)
        if (i == -1) throw Error("Task not found.")
            
        const projectId = taskList[0].projectId // 
        const newTaskList = taskList.with(i, task)
        
        setTaskList(newTaskList);
        cacheTasks({projectId, tasks: newTaskList})
    }, [taskList]);

    // Remove a task by id
    const deleteTask = useCallback((taskId: number) => {
        const i = taskList.findIndex((task) => task.id == taskId)
        if (i == -1) throw Error("Task not found.")

        const projectId = taskList[0].projectId // 
        const newTaskList = [...taskList.slice(0, i),...taskList.slice(i + 1)]

        setTaskList(newTaskList)
        cacheTasks({projectId, tasks: newTaskList})
    }, [taskList]);

    // Updating cache, can insert or update
    const cacheTasks = useCallback((newCache: CacheTaskList) => {
        setCachedTaskList(
            (cache : CacheTaskList[]) => {
                const i = cache.findIndex((oldCache) => oldCache.projectId == newCache.projectId)
                if (i == -1) {                  // Project id not found, 
                    return [...cache, newCache] // append to cache
                }
                return cache.with(i, newCache)  // else, update existing cache
            });
    }, []);

    // Remove cached task list by project id
    const deleteFromCache = useCallback((projectId: number) => {
        setCachedTaskList(
            (cache : CacheTaskList[]) => {
                const i = cache.findIndex((oldCache) => oldCache.projectId == projectId)
                if (i == -1) throw Error("Project not found.")
                return [
                    ...cache.slice(0, i),
                    ...cache.slice(i + 1),
                ]
            });
    }, []);

    // Retrieve task list from cache
    const retrieveFromCache = useCallback((projectId: number) : Task[] | undefined => {
        let result = cachedTasks.find((cache) => cache.projectId == projectId);
        if (result == undefined) return undefined;
        return result.tasks;
    }, [cachedTasks]);

  const value = {
    state: { taskList, cachedTasks },
    actions: { setTasks, addTask, updateTask, deleteTask, cacheTasks, deleteFromCache, retrieveFromCache },
  };

  return (
    <TaskListContext.Provider value={value}>
      {children}
    </TaskListContext.Provider>
  )
}