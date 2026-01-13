import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { connection } from "next/server";

export async function GET(req: NextRequest) {
    await connection();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        const where: any = {};

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
                    categories: {
                        include: { category: true },
                    },
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
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
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
        const categoryIds = categoryIdsJson ? JSON.parse(categoryIdsJson) : [];

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
                description,
                price,
                discountPrice,
                isActive,
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
                    create: categoryIds.map((id: string) => ({ categoryId: id }))
                }
            },
            include: {
                images: true,
                variants: true,
                categories: true,
                brand: true
            }
        });

        const { revalidateTag } = await import("next/cache");
        revalidateTag("products", { expire: 10 } as any);

        return NextResponse.json(product, { status: 201 });

    } catch (error) {
        console.error("[API Private Product] POST Error:", error);
        return NextResponse.json(
            { error: "Falha ao criar produto" },
            { status: 500 }
        );
    }
}
