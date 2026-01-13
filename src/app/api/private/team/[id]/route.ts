import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const existing = await prisma.team.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Membro da equipe não encontrado" }, { status: 404 });
        }

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.lastName !== undefined) updateData.lastName = data.lastName;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.role !== undefined) updateData.role = data.role;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const member = await prisma.team.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        revalidateTag("team", "max");

        return NextResponse.json(member);
    } catch (error) {
        console.error("[API Private Team PATCH] Error:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar membro da equipe" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existing = await prisma.team.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Membro da equipe não encontrado" }, { status: 404 });
        }

        await prisma.team.delete({
            where: { id },
        });

        revalidateTag("team", "max");

        return NextResponse.json({ message: "Membro da equipe removido com sucesso" });
    } catch (error) {
        console.error("[API Private Team DELETE] Error:", error);
        return NextResponse.json(
            { error: "Falha ao remover membro da equipe" },
            { status: 500 }
        );
    }
}
