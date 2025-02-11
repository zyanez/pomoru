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
        if (important < 0) error_message += "importance is not valid. ";
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