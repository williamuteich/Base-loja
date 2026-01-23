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
        maxAge: 2 * 60 * 60,
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
                turnstileToken: { label: "Turnstile Token", type: "text" },
            },
            async authorize(credentials) {
                const turnstileToken = credentials?.turnstileToken as string | undefined;
                const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

                if (!turnstileSecret) {
                    console.warn("TURNSTILE_SECRET_KEY (or TURNSTILE) is not set. Skipping verification.");
                } else if (process.env.NODE_ENV === 'production' || turnstileSecret) {
                    if (!turnstileToken) {
                        throw new Error("Turnstile token missing");
                    }

                    const formData = new URLSearchParams();
                    formData.append('secret', turnstileSecret);
                    formData.append('response', turnstileToken);

                    try {
                        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                            method: 'POST',
                            body: formData,
                        });

                        const outcome = await res.json();
                        if (!outcome.success) {
                            console.error("Turnstile verification failed:", outcome);
                            throw new Error("Turnstile verification failed");
                        }
                    } catch (error) {
                        console.error("Turnstile error:", error);
                        throw new Error("invalid_turnstile");
                    }
                }

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