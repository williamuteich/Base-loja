import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const auth: NextAuthOptions = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    jwt: {
        maxAge: 2 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("invalid_credentials");
                }

                const team = await prisma.team.findUnique({
                    where: { email: credentials.email },
                });

                if (!team) {
                    throw new Error("invalid_credentials");
                }

                if (!team.password) {
                    throw new Error("invalid_credentials");
                }

                const ok = await bcrypt.compare(credentials.password, team.password);
                if (!ok) {
                    throw new Error("invalid_credentials");
                }

                return {
                    id: String(team.id),
                    name: team.name,
                    email: team.email,
                    role: team.role
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.name = user.name;
                token.email = user.email;
                (token as any).role = (user as any).role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/admin`;
        }
    }
}