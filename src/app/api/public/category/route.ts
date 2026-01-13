import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";
import { connection } from "next/server";

async function getCachedCategories(skip: number, take: number, homeOnly: boolean, includeProducts: boolean) {
    "use cache";
    cacheTag("categories");
    if (includeProducts) {
        cacheTag("products");
    }
    cacheLife("hours");

    const where: any = {
        isActive: true,
    };

    if (homeOnly) {
        where.isHome = true;
    }

    const include: any = {
        _count: {
            select: { products: true }
        }
    };

    if (includeProducts) {
        include.products = {
            include: {
                product: {
                    include: {
                        images: true
                    }
                }
            }
        };
    }

    return await prisma.category.findMany({
        where,
        include,
        skip,
        take,
        orderBy: { name: 'asc' }
    });
}

export async function GET(req: NextRequest) {
    await connection();
    try {
        const { searchParams } = new URL(req.url);
        const homeOnly = searchParams.get("home") === "true";
        const includeProducts = searchParams.get("includeProducts") === "true";
        const skip = parseInt(searchParams.get("skip") || "0");
        const take = parseInt(searchParams.get("take") || "10");

        const categories = await getCachedCategories(skip, take, homeOnly, includeProducts);

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Public Category list error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
