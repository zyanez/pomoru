import { Project, Task } from "../types/utils";

export const ApiCall = {
    createTask: 
        async (title: string, important : number, projectId: number) : Promise<Task> => {
            const response = await fetch("/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        title: title,
                        important: important,
                        projectId: projectId
                }),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
    updateTask: 
        async (id: number, title: string | null, important: number | null, completed: boolean | null) : Promise<Task> =>  {
            const response = await fetch("/api/task/"+id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    completed: completed,
                    important: important,
                }),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body[0];
        },
    deleteTask: 
        async (id: number) : Promise<{id:number}>  => {
            const response = await fetch("/api/task/"+id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskId: id,
                }),
            });
            const body = await response.json()
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText} - ${body.message}`);
            }
            return body;
        },
    completeTask: 
        async (id: number) : Promise<Task>  => {
            const response = await fetch("/api/task/"+id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
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
        async (name: string, type: string, ownerId: string) : Promise<Project> => {
            const response = await fetch("/api/project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    type: type,
                    ownerId: ownerId,
                }),
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