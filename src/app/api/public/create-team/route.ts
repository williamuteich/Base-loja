import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    await connection();
    try {
        const hashedPassword = await bcrypt.hash("admin", 10);

        const team = await prisma.team.upsert({
            where: { email: "team@admin.com" },
            update: {
                password: hashedPassword,
                role: "ADMIN",
                isActive: true
            },
            create: {
                name: "Admin",
                lastName: "Team",
                email: "team@admin.com",
                password: hashedPassword,
                role: "ADMIN",
                isActive: true
            }
        });

        return NextResponse.json({
            message: "Success",
            team: {
                id: team.id,
                email: team.email,
                role: team.role
            }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
