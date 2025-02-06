import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "0";

    const projects = await db
        .select({
            id: projectsTable.id,
            name: projectsTable.name,
            description: projectsTable.description,
            ownerId: projectsTable.ownerId,
            type: projectsTable.type,
            completed: projectsTable.completed,
            archived: projectsTable.archived,
            workedTime: projectsTable.workedTime,
            restedTime: projectsTable.restedTime,
        })
        .from(projectsTable)
        .where(eq(projectsTable.ownerId, userId))
        .all();

    return new Response(JSON.stringify(projects), {
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const userId = session.user.id;

    const body = await req.json();
    const { name, type } = body;

    if (!name) {
        return new Response(JSON.stringify({ error: "Name is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!type) {
        return new Response(JSON.stringify({ error: "Type is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const result = await db
            .insert(projectsTable)
            .values({
                name: name,
                ownerId: userId,
                completed: 0,
                type: type
            })
            .returning({
                id: projectsTable.id,
                name: projectsTable.name,
            })
            .execute();

        return new Response(JSON.stringify(result[0]), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error inserting project:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
