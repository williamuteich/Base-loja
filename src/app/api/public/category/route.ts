import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const homeOnly = searchParams.get("home") === "true";
        const skip = parseInt(searchParams.get("skip") || "0");
        const take = parseInt(searchParams.get("take") || "10");

        const where: any = {
            isActive: true,
        };

        if (homeOnly) {
            where.isHome = true;
        }

        const categories = await prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: { products: true }
                }
            },
            skip,
            take,
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Public Category list error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
