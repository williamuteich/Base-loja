
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
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
                categories: true,
                brand: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("[API Private Product ID] GET Error:", error);
        return NextResponse.json({ error: "Erro Interno do Servidor" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        const updateData: any = {};

        if (formData.has("title")) {
            const title = formData.get("title") as string;
            if (!title) return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });
            updateData.title = title;
        }

        if (formData.has("description")) {
            updateData.description = formData.get("description") as string | null;
        }

        if (formData.has("price")) {
            const price = parseFloat(formData.get("price") as string);
            if (isNaN(price)) return NextResponse.json({ error: "Preço válido é obrigatório." }, { status: 400 });
            updateData.price = price;
        }

        if (formData.has("discountPrice")) {
            const discountPriceVal = formData.get("discountPrice");
            const discountPrice = discountPriceVal && discountPriceVal !== "" ? parseFloat(discountPriceVal as string) : null;

            const currentPrice = updateData.price !== undefined ? updateData.price : (await prisma.product.findUnique({ where: { id }, select: { price: true } }))?.price || 0;

            if (discountPrice !== null && discountPrice >= currentPrice) {
                return NextResponse.json({ error: "O preço promocional deve ser menor que o preço de venda." }, { status: 400 });
            }
            updateData.discountPrice = discountPrice;
        }

        if (formData.has("brandId")) {
            updateData.brandId = formData.get("brandId") as string | null;
        }

        if (formData.has("isActive")) {
            updateData.isActive = formData.get("isActive") !== "false";
        }

        if (formData.has("categoryIds")) {
            const categoryIds = JSON.parse(formData.get("categoryIds") as string);
            updateData.categories = {
                set: categoryIds.map((cid: string) => ({ id: cid })),
            };
        }

        if (formData.has("specs")) {
            const specsRaw = formData.get("specs") as string | null;
            let specs: Record<string, string> = {};
            if (specsRaw) {
                specsRaw.split(',').forEach(item => {
                    const [key, value] = item.split(':').map(s => s.trim());
                    if (key && value) specs[key] = value;
                });
            }
            updateData.specs = specs;
        }

        const currentProduct = await prisma.product.findUnique({
            where: { id },
            select: { title: true, slug: true }
        });

        if (!currentProduct) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
        }

        let slug = currentProduct.slug;
        if (updateData.title && updateData.title !== currentProduct.title) {
            const baseSlug = updateData.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .trim();

            let uniqueSlug = baseSlug;
            let counter = 1;
            while (await prisma.product.findFirst({ where: { slug: uniqueSlug, NOT: { id } } })) {
                uniqueSlug = `${baseSlug}-${counter}`;
                counter++;
            }
            slug = uniqueSlug;
            updateData.slug = slug;
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                images: true,
                variants: true,
                categories: true,
                brand: true,
            }
        });

        if (formData.has("variants")) {
            const variants = JSON.parse(formData.get("variants") as string);
            await prisma.productVariant.deleteMany({ where: { productId: id } });
            if (variants.length > 0) {
                await prisma.productVariant.createMany({
                    data: variants.map((v: any) => ({
                        productId: id,
                        name: v.name || "Default",
                        color: v.color || "#000000",
                        quantity: parseInt(v.quantity) || 0
                    }))
                });
            }
        }

        if (formData.has("keptImageUrls") || (formData.getAll("files").length > 0)) {
            const keptImageUrlsJson = formData.get("keptImageUrls") as string;
            const keptImageUrls = keptImageUrlsJson ? JSON.parse(keptImageUrlsJson) : [];
            const files = formData.getAll("files") as File[];

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

            await prisma.productImage.deleteMany({
                where: {
                    productId: id,
                    url: { notIn: keptImageUrls }
                }
            });

            const newImageUrls = finalImageUrls.filter((url: string) => !keptImageUrls.includes(url));

            if (newImageUrls.length > 0) {
                await prisma.productImage.createMany({
                    data: newImageUrls.map((url: string) => ({
                        productId: id,
                        url
                    }))
                });
            }
        }

        revalidateTag("products", { expire: 0 } as any);
        if (updatedProduct.slug) {
            revalidateTag(`product-${updatedProduct.slug}`, { expire: 0 } as any);
        }

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
        const { UploadHandler } = await import("@/lib/upload-handler");

        const productImages = await prisma.productImage.findMany({
            where: { productId: id },
            select: { url: true, product: { select: { slug: true } } }
        });

        const slug = productImages[0]?.product?.slug;

        await prisma.$transaction(async (tx) => {
            await tx.productVariant.deleteMany({ where: { productId: id } });
            await tx.productImage.deleteMany({ where: { productId: id } });
            await tx.product.delete({ where: { id } });
        });

        for (const image of productImages) {
            await UploadHandler.deleteFile(image.url);
        }

        revalidateTag("products", { expire: 0 } as any);
        if (slug) {
            revalidateTag(`product-${slug}`, { expire: 0 } as any);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[API Private Product ID] DELETE Error:", error);
        return NextResponse.json(
            { error: "Falha ao excluir produto" },
            { status: 500 }
        );
    }
}
