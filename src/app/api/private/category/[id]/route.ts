import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UploadHandler } from "@/lib/upload-handler";
import { revalidateTag } from "next/cache";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData();

        const existing = await prisma.category.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
        }

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const isHome = formData.get("isHome") === "true";
        const isActive = formData.get("isActive") !== "false";
        const imageFile = formData.get("file") as File;

        let imageUrl = existing.imageUrl;
        if (imageFile && typeof imageFile !== "string") {
            console.log("Saving new image for category:", imageFile.name);
            imageUrl = await UploadHandler.saveFile(imageFile, "categories");
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: name || undefined,
                description: description !== null ? description : undefined,
                isHome,
                isActive,
                imageUrl
            }
        });

        revalidateTag("categories", { expire: 10 });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error("Private Category update error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
        });
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Já existe uma categoria com este nome" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Falha ao atualizar categoria" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
        }

        if (category._count.products > 0) {
            return NextResponse.json({
                error: `Não é possível excluir esta categoria pois existem ${category._count.products} produtos vinculados a ela.`
            }, { status: 400 });
        }

        if (category.imageUrl) {
            await UploadHandler.deleteFile(category.imageUrl);
        }

        await prisma.category.delete({
            where: { id }
        });

        revalidateTag("categories", { expire: 0 });

        return NextResponse.json({ message: "Categoria excluída com sucesso" });
    } catch (error) {
        console.error("Private Category delete error:", error);
        return NextResponse.json({ error: "Falha ao excluir categoria" }, { status: 500 });
    }
}
