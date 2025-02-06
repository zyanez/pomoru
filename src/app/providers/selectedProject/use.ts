import { useContext } from 'react';
import { SelectedProjectContext } from './context';

export function useSelectedProject() {
  return useContext(SelectedProjectContext);
}