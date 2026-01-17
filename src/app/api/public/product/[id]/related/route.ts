
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedRelatedProducts(id: string, limit: number) {
    "use cache";
    cacheTag(`product-related-${id}`);
    cacheLife("hours");

    const product = await prisma.product.findUnique({
        where: { id },
        select: { categories: { select: { id: true } } },
    });

    if (!product) {
        return [];
    }

    const categoryIds = product.categories.map((c) => c.id);

    if (categoryIds.length === 0) {
        return [];
    }

    return await prisma.product.findMany({
        where: {
            isActive: true,
            AND: [
                { id: { not: id } },
                {
                    categories: {
                        some: {
                            id: { in: categoryIds },
                        },
                    },
                },
            ],
        },
        take: limit,
        include: {
            images: true,
            variants: true,
            brand: true,
            categories: true
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "4");

        const related = await getCachedRelatedProducts(id, limit);

        const formatted = related.map(p => ({
            ...p,
            createdAt: p.createdAt?.toISOString(),
            images: p.images?.map(i => ({ ...i, createdAt: i.createdAt?.toISOString(), updatedAt: i.updatedAt?.toISOString() })),
            brand: p.brand ? { ...p.brand, createdAt: p.brand.createdAt?.toISOString(), updatedAt: p.brand.updatedAt?.toISOString() } : undefined,
            categories: p.categories?.map(c => ({
                ...c,
                category: { ...c, createdAt: c.createdAt?.toISOString(), updatedAt: c.updatedAt?.toISOString() }
            }))
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("[API Product Related] GET Error:", error);
        return NextResponse.json({ error: "Erro Interno do Servidor" }, { status: 500 });
    }
}
