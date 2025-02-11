import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

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

        // RETRIEVE USER ID
        const pathname = req.nextUrl.pathname
        const userId = pathname.split("/")[3] //["","api","user",":userid","projects"]
        if (userId == null)
            return new Response(JSON.stringify({
                    "error": "Bad Request : Invalid user id"
                }),{
                    status: 400,
                    headers: { "Content-Type": "application/json" },
            });
    
        // QUERY DATABASE
        const result = await db
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.ownerId, userId))
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
