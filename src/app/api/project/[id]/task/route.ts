import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../../../auth/[...nextauth]/route";
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

        // RETRIEVE PROJECT ID
        const pathname = req.nextUrl.pathname
        const projectId = parseInt(pathname.split("/")[3]) //["","api","user",":userid","projects"]
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
            .from(tasksTable)
            .where(eq(tasksTable.projectId, projectId)) // If there are no matches, an empty list is sent
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
