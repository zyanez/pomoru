import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

//READ
export async function GET(req: NextRequest) {
    try{
        // VALIDATE SESSION
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // RETRIEVE TASK ID
        const pathname = req.nextUrl.pathname
        const taskId = parseInt(pathname.split("/")[3]) //["","api","project",":id"]
        if (taskId == null)
            return new Response(JSON.stringify({
                    "error": "Bad Request : Invalid project id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });

        // QUERY DATABASE
        const tasks = await db
            .select()
            .from(tasksTable)
            .where(eq(tasksTable.id, taskId)) // If there are no matches, an empty list is sent
            .all();

        // RETURN RESULT
        return new Response(JSON.stringify(tasks), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        let message = "error"
        if (e instanceof Error) message = e.message
        return new Response(JSON.stringify({
                "error": "Internal server error",
                "message": message
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
        });
    }
}



//UPDATE
export async function PUT(req: NextRequest) {
    try{
        // VALIDATE SESSION
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // RETRIEVE TASK ID
        const pathname = req.nextUrl.pathname
        const id = parseInt(pathname.split("/")[3]) //["","api","project",":id"]
        if (id == null)
            return new Response(JSON.stringify({
                    "error": "Bad Request : Invalid task id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });

        // VALIDATE BODY
        const body = await req.json();
        const {title, completed, important, projectId, createdAt} = body

        if (title == undefined 
            && important == undefined 
            && projectId == undefined 
            && completed == undefined
            && createdAt == undefined
        ){
            return new Response(JSON.stringify({ error: "No valid attributes." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        // QUERY DATABASE
        const updatedTask = await db
            .update(tasksTable)
            .set(body)
            .where(eq(tasksTable.id, id))
            .returning();

        // RETURN RESULT
        return new Response(JSON.stringify(updatedTask), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        let message = "error"
        if (e instanceof Error) message = e.message
        return new Response(JSON.stringify({
                "error": "Internal server error",
                "message": message
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
        });
    }
}

//DELETE
export async function DELETE(req: NextRequest) {
    try{
        // VALIDATE SESSION
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // RETRIEVE TASK ID
        const pathname = req.nextUrl.pathname
        const id = parseInt(pathname.split("/")[3]) //["","api","project",":id"]
        if (id == null)
            return new Response(JSON.stringify({
                    "error": "Bad Request : Invalid task id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });

        // QUERY DATABASE
        await db
            .delete(tasksTable)
            .where(eq(tasksTable.id, id));

        // RETURN RESULT
        return new Response(JSON.stringify({"id": id}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        let message = "error"
        if (e instanceof Error) message = e.message
        return new Response(JSON.stringify({
                "error": "Internal server error",
                "message": message
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
        });
    }
}