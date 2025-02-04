import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            } else {
                throw new Error("Token 'sub' is missing");
            }
            return session;
        },
        async signIn({ user, account }) {
            try {
                const googleId = account?.providerAccountId;

                
                if (!googleId || !user.email || !user.name) return false;
        
                const existingUser = await db
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.id, googleId))
                    .get();
        
                if (!existingUser) {
                    await db.insert(usersTable).values({
                        id: googleId,
                        email: user.email,
                        name: user.name,
                    });
                }
                return true;
            } catch (error) {
                console.error("Error during signIn:", error);
                return false;
            }
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
