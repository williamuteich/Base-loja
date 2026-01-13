import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const socialMedias = await prisma.socialMedia.findMany({
            where: { isActive: true },
            orderBy: { platform: "asc" }
        });

        return NextResponse.json(socialMedias);
    } catch (error) {
        console.error("[API Public Social Media] GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
