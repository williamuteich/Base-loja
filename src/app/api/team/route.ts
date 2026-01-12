import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, lastName, email, password, role } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeamMember = await prisma.team.create({
            data: {
                name,
                lastName,
                email,
                password: hashedPassword,
                role: role || "COLLABORATOR",
            },
        });

        const { password: _, ...teamWithoutPassword } = newTeamMember;

        return NextResponse.json(teamWithoutPassword);
    } catch (error: any) {
        console.error("Erro ao criar membro do time:", error);
        return NextResponse.json(
            { error: "Erro ao criar membro do time", details: error.message },
            { status: 500 }
        );
    }
}
