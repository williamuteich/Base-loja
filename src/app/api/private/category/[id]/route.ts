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
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
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

        revalidateTag("categories", "max");

        return NextResponse.json(category);
    } catch (error: any) {
        console.error("Private Category update error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
        });
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
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
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        if (category._count.products > 0) {
            return NextResponse.json({
                error: `Cannot delete category with ${category._count.products} linked products.`
            }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id }
        });

        revalidateTag("categories", "max");

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Private Category delete error:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
