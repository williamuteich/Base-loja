import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const existing = await prisma.brand.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Marca não encontrada" }, { status: 404 });
        }

        if (data.name && data.name !== existing.name) {
            const nameConflict = await prisma.brand.findUnique({
                where: { name: data.name },
            });

            if (nameConflict) {
                return NextResponse.json(
                    { error: "Já existe uma marca com este nome" },
                    { status: 400 }
                );
            }
        }

        const brand = await prisma.brand.update({
            where: { id },
            data: {
                name: data.name !== undefined ? data.name : undefined,
                isActive: data.isActive !== undefined ? data.isActive : undefined,
            },
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error("[API Private Brand PATCH] Error:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar marca" },
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

        const existing = await prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!existing) {
            return NextResponse.json({ error: "Marca não encontrada" }, { status: 404 });
        }

        if (existing._count.products > 0) {
            return NextResponse.json(
                { error: "Não é possível excluir esta marca pois existem produtos vinculados a ela." },
                { status: 400 }
            );
        }

        await prisma.brand.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Marca removida com sucesso" });
    } catch (error) {
        console.error("[API Private Brand DELETE] Error:", error);
        return NextResponse.json(
            { error: "Falha ao remover marca" },
            { status: 500 }
        );
    }
}
