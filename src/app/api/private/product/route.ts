import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { connection } from "next/server";

export async function GET(req: NextRequest) {
    await connection();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const hasDiscount = searchParams.get("hasDiscount");
        const skip = (page - 1) * limit;

        const where: any = {};

        if (hasDiscount === "true") {
            where.discountPrice = { not: null };
        } else if (hasDiscount === "false") {
            where.discountPrice = null;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const [total, products] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    variants: true,
                    images: true,
                    categories: true,
                    brand: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return NextResponse.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[API Private Product] GET Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}


function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

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

        const files = formData.getAll("files") as File[];

        if (!title || isNaN(price)) {
            return NextResponse.json(
                { error: "Título e Preço válido são obrigatórios." },
                { status: 400 }
            );
        }

        if (discountPrice && discountPrice >= price) {
            return NextResponse.json(
                { error: "O preço promocional deve ser menor que o preço de venda." },
                { status: 400 }
            );
        }

        let slug = generateSlug(title);
        let uniqueSlug = slug;
        let counter = 1;

        while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        slug = uniqueSlug;

        const specsRaw = formData.get("specs") as string | null;
        let specs: Record<string, string> = {};
        if (specsRaw) {
            specsRaw.split(',').forEach(item => {
                const [key, value] = item.split(':').map(s => s.trim());
                if (key && value) specs[key] = value;
            });
        }

        const uploadedImageUrls = [];
        if (files && files.length > 0) {
            const { UploadHandler } = await import("@/lib/upload-handler");

            for (const file of files) {
                if (file instanceof File) {
                    const path = await UploadHandler.saveFile(file, "products");
                    uploadedImageUrls.push(path);
                }
            }
        }

        const product = await prisma.product.create({
            data: {
                title,
                slug,
                description,
                price,
                discountPrice,
                isActive,
                specs: specs as any,
                brandId: brandId || null,
                variants: {
                    create: variants.map((v: any) => ({
                        name: v.name || "Default",
                        color: v.color || "#000000",
                        quantity: parseInt(v.quantity) || 0
                    }))
                },
                images: {
                    create: uploadedImageUrls.map((url) => ({ url }))
                },
                categories: {
                    connect: categoryIds.map((id) => ({ id }))
                }
            },
            include: {
                images: true,
                variants: true,
                categories: true,
                brand: true
            }
        });

        revalidateTag("products", { expire: 0 } as any);
        if (product.slug) {
            revalidateTag(`product-${product.slug}`, { expire: 0 } as any);
        }

        return NextResponse.json(product, { status: 201 });

    } catch (error) {
        console.error("[API Private Product] POST Error:", error);
        return NextResponse.json(
            { error: "Falha ao criar produto" },
            { status: 500 }
        );
    }
}
