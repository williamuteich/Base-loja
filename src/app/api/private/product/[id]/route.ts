
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connection();
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                variants: true,
                categories: {
                    include: { category: true },
                },
                brand: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("[API Private Product ID] GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        const title = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        const price = parseFloat(formData.get("price") as string);
        const discountPrice = formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : null;
        const brandId = formData.get("brandId") as string | null;
        const isActive = formData.get("isActive") !== "false";

        const variantsJson = formData.get("variants") as string;
        const variants = variantsJson ? JSON.parse(variantsJson) : [];

        const categoryIdsJson = formData.get("categoryIds") as string;
        const categoryIds = categoryIdsJson ? JSON.parse(categoryIdsJson) : [];

        const keptImageUrlsJson = formData.get("keptImageUrls") as string;
        const keptImageUrls = keptImageUrlsJson ? JSON.parse(keptImageUrlsJson) : [];

        const files = formData.getAll("files") as File[];

        if (title && isNaN(price)) {
            return NextResponse.json(
                { error: "Preço válido é obrigatório." },
                { status: 400 }
            );
        }

        if (discountPrice && discountPrice >= price) {
            return NextResponse.json(
                { error: "O preço promocional deve ser menor que o preço de venda." },
                { status: 400 }
            );
        }

        let finalImageUrls = [...keptImageUrls];
        if (files && files.length > 0) {
            const { UploadHandler } = await import("@/lib/upload-handler");
            for (const file of files) {
                if (file instanceof File) {
                    const path = await UploadHandler.saveFile(file, "products");
                    finalImageUrls.push(path);
                }
            }
        }

        const updatedProduct = await prisma.$transaction(async (tx) => {
            const product = await tx.product.update({
                where: { id },
                data: {
                    title,
                    description,
                    price,
                    discountPrice,
                    isActive,
                    brandId: brandId || null,
                }
            });

            await tx.productVariant.deleteMany({ where: { productId: id } });
            if (variants.length > 0) {
                await tx.productVariant.createMany({
                    data: variants.map((v: any) => ({
                        productId: id,
                        name: v.name || "Default",
                        color: v.color || "#000000",
                        quantity: parseInt(v.quantity) || 0
                    }))
                });
            }

            await tx.productCategory.deleteMany({ where: { productId: id } });
            if (categoryIds.length > 0) {
                await tx.productCategory.createMany({
                    data: categoryIds.map((catId: string) => ({
                        productId: id,
                        categoryId: catId
                    }))
                });
            }

            const currentImages = await tx.productImage.findMany({ where: { productId: id }, select: { url: true } });
            const currentUrls = currentImages.map(img => img.url);

            await tx.productImage.deleteMany({
                where: {
                    productId: id,
                    url: { notIn: keptImageUrls }
                }
            });

            const newImageUrls = finalImageUrls.filter((url: string) => !keptImageUrls.includes(url));

            if (newImageUrls.length > 0) {
                await tx.productImage.createMany({
                    data: newImageUrls.map((url: string) => ({
                        productId: id,
                        url
                    }))
                });
            }


            return product;
        });

        const { revalidateTag } = await import("next/cache");
        revalidateTag("products", { expire: 10 } as any);

        return NextResponse.json(updatedProduct);

    } catch (error) {
        console.error("[API Private Product ID] PATCH Error:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar produto" },
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

        await prisma.$transaction(async (tx) => {
            await tx.productVariant.deleteMany({ where: { productId: id } });
            await tx.productCategory.deleteMany({ where: { productId: id } });
            await tx.productImage.deleteMany({ where: { productId: id } });

            await tx.product.delete({ where: { id } });
        });

        const { revalidateTag } = await import("next/cache");
        revalidateTag("products", { expire: 10 } as any);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[API Private Product ID] DELETE Error:", error);
        return NextResponse.json(
            { error: "Falha ao excluir produto" },
            { status: 500 }
        );
    }
}
