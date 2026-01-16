import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheTag, cacheLife } from "next/cache";

async function getCachedConfig() {
    "use cache";
    cacheTag("store-config");
    cacheLife("hours");

    return await prisma.storeConfiguration.findFirst({
        include: {
            socialMedias: {
                where: { isActive: true }
            }
        }
    });
}

export async function GET() {
    try {
        const config = await getCachedConfig();

        if (!config) {
            return NextResponse.json({ error: "Configuração da loja não encontrada" }, { status: 404 });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("[API Public Store Config] GET Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}
