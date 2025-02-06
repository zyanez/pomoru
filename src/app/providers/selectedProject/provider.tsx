import { ReactNode, useState } from 'react';
import { Project } from '../../types/utils';
import {SelectedProjectContext} from "./context";

export function SelectedProjectProvider({ children } : {children : ReactNode}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const value = {
    state: { selectedProject },
    actions: { setSelectedProject },
  };

  return (
    <SelectedProjectContext.Provider value={value}>
      {children}
    </SelectedProjectContext.Provider>
  )
}