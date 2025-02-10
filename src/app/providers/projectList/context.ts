import { Project } from '@/app/types/utils';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface IProjectListContext {
    state: {
        projectList: Project[]
        selectedProject : Project | null     // Null if no project is selected
    };
    actions: {
        load: (project: Project[]) => void;
        addProject: (project: Project) => void;
        updateProject: (project: Project) => void;
        deleteProject: (projectId: number) => void;
        selectProject: (project: Project | null) => void; // Type of setWhatever from setState hook
    };
}

export const ProjectListContext = createContext<IProjectListContext>(
    // Default value if provider is not found
    {
        state: {
            projectList: [],
            selectedProject : null     // Null if no project is selected
        },
        actions: {
            load: ()=>alert("Provider not found"),
            addProject: ()=>alert("Provider not found"),
            updateProject: ()=>alert("Provider not found"),
            deleteProject: ()=>alert("Provider not found"),
            selectProject: ()=>alert("Provider not found"), // Type of setWhatever from setState hook
        }
    }
);
