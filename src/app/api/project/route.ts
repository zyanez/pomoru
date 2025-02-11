import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

//READ
export async function GET(req: NextRequest) {
    try {
        // VALIDATE SESSION
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // QUERY DATABASE
        const result = await db
            .select()
            .from(projectsTable)
            .all();

        // RETURN RESULT
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e:unknown) {
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

//INSERT
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
        const { name, type, ownerId } = body;
        let error_message = ""
        if (name == undefined)      error_message += "Name is missing. "
        if (type == undefined)      error_message += "Type is missing. "
        if (ownerId == undefined)   error_message += "Owner id is missing. "
        if (error_message != "") {
            return new Response(JSON.stringify({ error: error_message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // QUERY DATABASE
        const result = await db
            .insert(projectsTable)
            .values({
                name: name,
                type: type,
                ownerId: ownerId,
            })
            .returning()
            .execute();

        // RETURN RESULT
        return new Response(JSON.stringify(result[0]), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e:unknown) {
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
