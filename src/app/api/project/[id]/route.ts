import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

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

        // RETRIEVE PROJECT ID
        const pathname = req.nextUrl.pathname
        const projectId = parseInt(pathname.split("/")[3]) //["","api","project",":id"]
        if (projectId == null)
            return new Response(JSON.stringify({
                    "error": "Bad Request : Invalid project id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });

        // QUERY DATABASE
        const result = await db
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.id, projectId)) // If there are no matches, an empty list is sent
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
                    "error": "Bad Request : Invalid project id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });

        // VALIDATE BODY
        // only checks if has any column of table
        const hasProps = (o: Object, props: string[]) => {
            for (const prop of props)
                if (o.hasOwnProperty(prop)) return true
            return false
        }
        const body = await req.json();
        const projectColumns: string[] = [
            "id","name","description","type","completed","archived",
            "ownerId","workedTime","restedTime","createdAt",
        ]
        if (!hasProps(body, projectColumns)){
            return new Response(JSON.stringify({ error: "No valid attributes." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        // QUERY DATABASE
        const updatedTask = await db
            .update(projectsTable)
            .set(body)
            .where(eq(projectsTable.id, id))
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
                    "error": "Bad Request : Invalid project id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });

        // QUERY DATABASE
        await db
            .delete(projectsTable)
            .where(eq(projectsTable.id, id));

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