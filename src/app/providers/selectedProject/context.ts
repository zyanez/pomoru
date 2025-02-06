import { Project } from '@/app/types/utils';
import { createContext, Dispatch, SetStateAction } from 'react';

interface ISelectedProjectContext {
    state: {
        selectedProject: Project | null     // Null if no project is selected
    };
    actions: {
        setSelectedProject: (value: Project | null) => void; // Type of setWhatever from setState hook
    };
}

export const SelectedProjectContext = createContext<ISelectedProjectContext>(
    // Default value if provider is not found
    {
        state: { selectedProject: null },
        actions: { setSelectedProject: ()=>alert("Provider not found"), },
    }
);
