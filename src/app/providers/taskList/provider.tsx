import { ReactNode, useCallback, useState } from 'react';
import { Task } from '../../types/utils';
import {TaskListContext} from "./context";

export function TaskListProvider({ children } : {children : ReactNode}) {
    const [taskList, setTaskList] = useState<Task[]>([]);

    // Inserting a list of tasks
    const addAll = useCallback(async (tasks: Task[]) => {
        setTaskList(tasks);
    }, []);

    // Inserting a task
    const addTask = useCallback(async (task: Task) => {
        setTaskList((oldTasks) => [...oldTasks, task]);
    }, []);

    // Updating a task
    const updateTask = useCallback(async (task: Task) => {
        setTaskList(
            (currentTasks : Task[]) => {
                return currentTasks.map((oldTask: Task) => {
                    if (oldTask.id == task.id) {
                        return task;
                    }
                    else {return oldTask;}
                })
            });
    }, []);

    // Remove a task by id
    const removeTask = useCallback((taskId: number) => {
        (currentTasks : Task[]) => {
            const i = currentTasks.findIndex((task) => task.id == taskId)
            if (i == -1) throw Error("Task not found.")
            return [
                ...currentTasks.slice(0, i),
                ...currentTasks.slice(i + 1),
            ]
        }
    }, []);

  const value = {
    state: { taskList },
    actions: { addAll, addTask, updateTask, removeTask },
  };

  return (
    <TaskListContext.Provider value={value}>
      {children}
    </TaskListContext.Provider>
  )
}