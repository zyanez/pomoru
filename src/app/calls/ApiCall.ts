import { IInsertProject, IInsertTask, IUpdateProject, IUpdateTask, Project, Task } from "../types/utils";

export const ApiCall = {
    createTask: 
        async (attributes: IInsertTask) : Promise<Task> => {
            const response = await fetch("/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(attributes),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
    updateTask: 
        async (taskId: number, newAttributes: IUpdateTask) : Promise<Task> =>  {
            const response = await fetch("/api/task/"+taskId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAttributes),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body[0];
        },
    deleteTask: 
        async (taskId: number) : Promise<{id:number}>  => {
            const response = await fetch("/api/task/"+taskId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
    completeTask: 
        async (taskId: number) : Promise<Task>  => {
            const response = await fetch("/api/task/"+taskId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: true,
                }),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
    getTasksByProjectId: 
        async (projectId: number) : Promise<Task[]> => {
            const response = await fetch("/api/project/"+projectId+"/task");
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            
            return body;
        },
    createProject: 
        async (attributes: IInsertProject) : Promise<Project> => {
            const response = await fetch("/api/project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(attributes),
            });
            if (!response.ok) {
                const body: {message: string} = await response.json()
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
//            const body: Project = await response.json()
//            return body;
            const projectPromise: Promise<Project> = response.json()
            return projectPromise;
        },
    updateProject: 
        async (projectId: number, newAttributes: IUpdateProject) : Promise<Project> =>  {
            const response = await fetch("/api/project/"+projectId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAttributes),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body[0];
        },
    deleteProject: 
        async (projectId: number) : Promise<{id:number}>  => {
            const response = await fetch("/api/project/"+projectId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
    getProjectsByUserId: 
        async (userId: string) : Promise<Project[]> =>  {
            const response = await fetch("/api/user/"+userId+"/project");
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
}