import { ReactNode, useCallback, useState } from 'react';
import { Task } from '../../types/utils';
import {CacheTaskList, CacheTaskListContext} from "./context";

export function CacheTaskListProvider({ children } : {children : ReactNode}) {
    const [cachedTasks, setCachedTaskList] = useState<CacheTaskList[]>([]);

    // Updating a task
    const cacheTasks = useCallback(async (newCache: CacheTaskList) => {
        setCachedTaskList(
            (cache : CacheTaskList[]) => {
                const i = cache.findIndex((oldCache) => oldCache.projectId == newCache.projectId)
                if (i == -1) {                  // Project id not found, 
                    return [...cache, newCache] // append to cache
                }
                return cache.with(i, newCache)  // else, update existing cache
            });
    }, []);

    // Remove a task by id
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

    const retrieveFromCache = useCallback((projectId: number) : Task[] | undefined => {
        let result = cachedTasks.find((cache) => cache.projectId == projectId);
        if (result == undefined) return undefined;
        return result.tasks;
    }, [cachedTasks]);


  const value = {
    state: { cachedTasks },
    actions: { cacheTasks, deleteFromCache, retrieveFromCache },
  };

  return (
    <CacheTaskListContext.Provider value={value}>
      {children}
    </CacheTaskListContext.Provider>
  )
}