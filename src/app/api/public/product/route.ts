import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedProducts() {
    "use cache";
    cacheTag("products");
    cacheLife("hours");

    return await prisma.product.findMany({
        where: {
            isActive: true,
        },
        include: {
            images: true,
            brand: true,
            categories: {
                include: {
                    category: true
                }
            },
            variants: true
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function GET() {
    try {
        const products = await getCachedProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error("[API Public Product] Error fetching products:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
