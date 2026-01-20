import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    await connection();
    try {
        const createTeam = await prisma.team.create({
            data: {
                name: "teste",
                lastName: "teste",
                email: "teste@teste.com",
                password: "teste123",
                role: "ADMIN",
                isActive: true
            }
        })

        return NextResponse.json({ message: "Equipe criada com sucesso", createTeam }, { status: 201 });
    } catch (error) {
        console.error("[API Public Create Team] POST Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}
