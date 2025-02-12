import { ReactNode, useCallback, useState } from 'react';
import { Project } from '../../types/utils';
import {IProjectListContext, ProjectListContext} from "./context";

export function ProjectListProvider({ children } : {children : ReactNode}) {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Inserting a list of tasks
    const load = useCallback((projects: Project[]) => {
        setProjectList(projects);
    }, []);

    // Inserting a task
    const addProject = useCallback((newProject: Project) => {
        setProjectList((oldProjects) => [...oldProjects, newProject]);
        setSelectedProject(newProject)                                      // to avoid BUG
    }, []);

    // Updating a task
    const updateProject = useCallback((updatedProject: Project) => {
        setProjectList(
            (projects : Project[]) => {
                const i = projects.findIndex((project) => project.id == updatedProject.id)
                if (i == -1) throw Error("Task not found.")
                return projects.with(i, updatedProject)
            });
    }, []);

    // Delete a task by id
    const deleteProject = useCallback((projectId: number) => {
        setProjectList(
            (projects : Project[]) => {
                const i = projects.findIndex((project) => project.id == projectId)
                if (i == -1) throw Error("Project not found.")
                return [
                    ...projects.slice(0, i),
                    ...projects.slice(i + 1),
                ]
            });
//        setSelectedProject(null);
    }, []);

    const selectProject = useCallback((selectedProject: Project | null) => {
        if (selectedProject != null) {
            const i = projectList.findIndex((project) => project.id == selectedProject.id)
            if (i == -1) throw Error("Project not found.")
        }
        setSelectedProject(selectedProject)
    },[projectList]);





  const value : IProjectListContext = {
    state: { 
        projectList, 
        selectedProject 
    },
    actions: { 
        load,
        addProject,
        updateProject,
        deleteProject,
        selectProject,
     },
  };

  return (
    <ProjectListContext.Provider value={value}>
      {children}
    </ProjectListContext.Provider>
  )
}