import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedBanners() {
    "use cache";
    cacheTag("banners");
    cacheLife("hours");

    return await prisma.banner.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function GET() {
    try {
        const banners = await getCachedBanners();
        return NextResponse.json(banners);
    } catch (error) {
        console.error("[API Public Banner] Error fetching banners:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}
