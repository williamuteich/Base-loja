
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "4");

        const product = await prisma.product.findUnique({
            where: { id },
            select: { categories: { select: { categoryId: true } } },
        });

        if (!product) {
            return NextResponse.json([]);
        }

        const categoryIds = product.categories.map((c) => c.categoryId);

        if (categoryIds.length === 0) {
            return NextResponse.json([]);
        }

        const related = await prisma.product.findMany({
            where: {
                isActive: true,
                AND: [
                    { id: { not: id } },
                    {
                        categories: {
                            some: {
                                categoryId: { in: categoryIds },
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
                categories: {
                    include: { category: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        const formatted = related.map(p => ({
            ...p,
            createdAt: p.createdAt?.toISOString(),
            images: p.images?.map(i => ({ ...i, createdAt: i.createdAt?.toISOString(), updatedAt: i.updatedAt?.toISOString() })),
            brand: p.brand ? { ...p.brand, createdAt: p.brand.createdAt?.toISOString(), updatedAt: p.brand.updatedAt?.toISOString() } : undefined,
            categories: p.categories?.map(c => ({
                ...c,
                category: { ...c.category, createdAt: c.category.createdAt?.toISOString(), updatedAt: c.category.updatedAt?.toISOString() }
            }))
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("[API Product Related] GET Error:", error);
        return NextResponse.json({ error: "Erro Interno do Servidor" }, { status: 500 });
    }
}
