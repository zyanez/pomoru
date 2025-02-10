import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../auth/[...nextauth]/route";
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

        // VALIDATE BODY
        const tasks = await db
            .select()
            .from(tasksTable)
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

// INSERT
export async function POST(req: NextRequest) {
    try{
        // VALIDATE SESSION
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // VALIDATE BODY
        const body = await req.json();
        const { title, important, projectId } = body;
        let error_message = "";
        if (title == undefined)     error_message += "Title is missing. ";
        if (important == undefined) error_message += "Importance is missing. ";
        if (projectId == undefined) error_message += "Project id is missing. ";
        if (error_message != "") {
            return new Response(JSON.stringify({ error: error_message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // QUERY DATABASE
        const result = await db
            .insert(tasksTable)
            .values({
                title: title,
                important: important,
                projectId: projectId,
            })
            .returning()
            .execute();

        // RETURN RESULT
        return new Response(JSON.stringify(result[0]), {
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

        // VALIDATE BODY
        const body = await req.json();
        const {id, title, completed, important, projectId, createdAt} = body

        if (id == undefined) {
            return new Response(JSON.stringify({ error: "Id is missing." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

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

        // VALIDATE BODY
        const body = await req.json();
        const {id} = body
        if (id == undefined) {
            return new Response(JSON.stringify({ error: "Id is missing" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

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