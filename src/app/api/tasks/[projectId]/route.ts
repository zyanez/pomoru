import { db } from "@/db";
import { projectsTable, tasksTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../../auth/[...nextauth]/route";
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

    // Retrieving projectId from url
    const projectId = parseInt(req.url.split("/tasks/")[1],10)
    

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
            .where(eq(tasksTable.projectId, projectId)) // If there are no matches, an empty list is sent
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
