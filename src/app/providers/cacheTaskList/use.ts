import { useContext } from 'react';
import { CacheTaskListContext } from './context';

export function useCacheTaskList() {
  return useContext(CacheTaskListContext);
}