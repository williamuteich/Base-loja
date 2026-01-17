import { NextResponse, NextRequest } from "next/server";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedBrands() {
    "use cache";
    cacheTag("brands");
    cacheLife("hours");

    return await prisma.brand.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function GET(req: NextRequest) {
    await connection();
    try {
        const brands = await getCachedBrands();
        return NextResponse.json(brands);
    } catch (error) {
        console.error("[API Public Brand] GET Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}
