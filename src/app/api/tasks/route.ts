import { db } from "@/db";
import { projectsTable, tasksTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

//READ
export async function GET(req: NextRequest) {
    // Checking if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try{
        // Retrieveing tasks from database by projectId
        const tasks = await db
            .select({
                id: tasksTable.id,
                title: tasksTable.title,
                completed: tasksTable.completed,
                important: tasksTable.important
            })
            .from(tasksTable)
            .all();

        return new Response(JSON.stringify(tasks), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error reading task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// INSERT
export async function POST(req: NextRequest) {
    // Checking if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Retrieving task info from request
    const body = await req.json();
    const { title, important, projectId } = body;

    // Validating task info
    let error_message = "";
    if (!title)                  error_message += "Title is missing. ";
    if (important == undefined)  error_message += "Importance is missing. ";
    if (!projectId)              error_message += "ProjectId is missing. ";
    if (error_message != "") {
        return new Response(JSON.stringify({ error: error_message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const result = await db
            .insert(tasksTable)
            .values({
                title: title,
                important: important,
                projectId: projectId,
            })
            .returning({
                id: tasksTable.id,
                title: tasksTable.title,
                important: tasksTable.important,
                completed: tasksTable.completed,
            })
            .execute();

        return new Response(JSON.stringify(result[0]), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error inserting task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

//UPDATE
export async function PUT(req: NextRequest) {
    // Checking if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Retrieving updates to task from request
    const body = await req.json();
    /* 
    The request must be structured like
    req = {
        taskId : 0,
        updates : {
            title,
            important,
            ...,
        }
    }
    */
    const {taskId} = body
    const {updatesToTask} = body

    try {
        const updatedTask = await db
            .update(tasksTable)
            .set(updatesToTask)
            .where(eq(tasksTable.id, taskId))
            .returning({
                id: tasksTable.id,
                title: tasksTable.title,
                important: tasksTable.important,
                completed: tasksTable.completed,
            });

        return new Response(JSON.stringify(updatedTask), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

//DELETE
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Retrieving task id from request
    const body = await req.json();
    const {taskId} = body

    try{
        await db
            .delete(tasksTable)
            .where(eq(tasksTable.id, taskId));

        return new Response(JSON.stringify({"taskId": taskId}), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}