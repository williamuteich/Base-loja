import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const config = await prisma.storeConfiguration.findFirst({
            include: {
                socialMedias: {
                    where: { isActive: true }
                }
            }
        });

        if (!config) {
            return NextResponse.json({ error: "Store configuration not found" }, { status: 404 });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("[API Public Store Config] GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
