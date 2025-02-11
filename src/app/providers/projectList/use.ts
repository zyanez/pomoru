import { useContext } from 'react';
import { ProjectListContext } from './context';

export function useProjectList() {
  return useContext(ProjectListContext);
}