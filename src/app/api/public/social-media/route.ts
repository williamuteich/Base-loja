import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedSocialMedias() {
    "use cache";
    cacheTag("store-config");
    cacheLife("hours");

    return await prisma.socialMedia.findMany({
        where: { isActive: true },
        orderBy: { platform: "asc" }
    });
}

export async function GET() {
    try {
        const socialMedias = await getCachedSocialMedias();
        return NextResponse.json(socialMedias);
    } catch (error) {
        console.error("[API Public Social Media] GET Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}
