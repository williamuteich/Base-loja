
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedProduct(id: string) {
    "use cache";
    cacheTag(`product-${id}`);
    cacheLife("hours");

    return await prisma.product.findUnique({
        where: { id, isActive: true },
        include: {
            images: true,
            variants: true,
            categories: true,
            brand: true
        }
    });
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await getCachedProduct(id);

        if (!product) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            ...product,
            createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
            images: product.images?.map(img => ({
                ...img,
                createdAt: img.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: img.updatedAt?.toISOString() || new Date().toISOString(),
            })) || [],
            variants: product.variants?.map(v => ({
                ...v,
            })) || [],
            categories: product.categories?.map(cat => ({
                ...cat,
                category: {
                    ...cat,
                    createdAt: cat.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: cat.updatedAt?.toISOString() || new Date().toISOString(),
                }
            })) || [],
            brand: product.brand ? {
                ...product.brand,
                createdAt: product.brand.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: product.brand.updatedAt?.toISOString() || new Date().toISOString(),
            } : undefined
        });

    } catch (error) {
        console.error("[API Product] GET Error:", error);
        return NextResponse.json({ error: "Erro Interno do Servidor" }, { status: 500 });
    }
}
