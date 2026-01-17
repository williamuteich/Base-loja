
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

        const title = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        const price = parseFloat(formData.get("price") as string);
        const discountPrice = formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : null;
        const brandId = formData.get("brandId") as string | null;
        const isActive = formData.get("isActive") !== "false";

        const variantsJson = formData.get("variants") as string;
        const variants = variantsJson ? JSON.parse(variantsJson) : [];

        const categoryIdsJson = formData.get("categoryIds") as string;
        const categoryIds: string[] = categoryIdsJson ? JSON.parse(categoryIdsJson) : [];

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
            const currentProduct = await tx.product.findUnique({
                where: { id },
                select: { title: true, slug: true }
            });

            let slug = currentProduct?.slug;
            if (title && title !== currentProduct?.title) {
                const baseSlug = title
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .trim();

                let uniqueSlug = baseSlug;
                let counter = 1;
                while (await tx.product.findFirst({ where: { slug: uniqueSlug, NOT: { id } } })) {
                    uniqueSlug = `${baseSlug}-${counter}`;
                    counter++;
                }
                slug = uniqueSlug;
            }

            const specsRaw = formData.get("specs") as string | null;
            let specs: Record<string, string> = {};
            if (specsRaw) {
                specsRaw.split(',').forEach(item => {
                    const [key, value] = item.split(':').map(s => s.trim());
                    if (key && value) specs[key] = value;
                });
            }

            const product = await tx.product.update({
                where: { id },
                data: {
                    title,
                    slug,
                    description,
                    price,
                    discountPrice,
                    isActive,
                    specs: specs as any,
                    brandId: brandId || null,
                    categories: {
                        set: categoryIds.map((cid) => ({ id: cid })),
                    },
                },
                include: {
                    images: true,
                    variants: true,
                    categories: true,
                    brand: true,
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
