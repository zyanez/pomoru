import { useContext } from 'react';
import { TaskListContext } from './context';

export function useTaskList() {
  return useContext(TaskListContext);
}