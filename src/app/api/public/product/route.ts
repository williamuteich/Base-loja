import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedProducts(skip: number, take: number, category?: string, search?: string) {
    "use cache";
    cacheTag("products");
    cacheLife("hours");

    const where: any = {
        isActive: true,
    };

    if (category) {
        where.categories = {
            some: {
                category: {
                    name: category
                }
            }
        };
    }

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } }
        ];
    }

    return await prisma.product.findMany({
        where,
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
        skip,
        take
    });
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const skip = parseInt(searchParams.get("skip") || "0");
        const take = parseInt(searchParams.get("take") || "12");
        const category = searchParams.get("category") || undefined;
        const search = searchParams.get("search") || undefined;
        const paginated = searchParams.get("paginated") === "true";

        const products = await getCachedProducts(skip, take, category, search);

        if (paginated) {
            const where: any = { isActive: true };
            if (category) {
                where.categories = {
                    some: {
                        category: {
                            name: category
                        }
                    }
                };
            }
            if (search) {
                where.OR = [
                    { title: { contains: search } },
                    { description: { contains: search } }
                ];
            }

            const total = await prisma.product.count({ where });
            return NextResponse.json({
                data: products,
                meta: {
                    total,
                    page: Math.floor(skip / take) + 1,
                    limit: take,
                    totalPages: Math.ceil(total / take)
                }
            });
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error("[API Public Product] Error fetching products:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
