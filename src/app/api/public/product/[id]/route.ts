
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id, isActive: true },
            include: {
                images: true,
                variants: true,
                categories: {
                    include: { category: true }
                },
                brand: true
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
                category: cat.category ? {
                    ...cat.category,
                    createdAt: cat.category.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: cat.category.updatedAt?.toISOString() || new Date().toISOString(),
                } : { name: "N/A", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            })) || [],
            brand: product.brand ? {
                ...product.brand,
                createdAt: product.brand.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: product.brand.updatedAt?.toISOString() || new Date().toISOString(),
            } : undefined
        });

    } catch (error) {
        console.error("[API Product] GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
