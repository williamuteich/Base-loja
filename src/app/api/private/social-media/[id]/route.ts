import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { platform, url, isActive } = body;

        const socialMedia = await prisma.socialMedia.update({
            where: { id },
            data: {
                ...(platform && { platform }),
                ...(url && { url }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        revalidateTag("store-config", "max");

        return NextResponse.json(socialMedia);

    } catch (error: any) {
        console.error("[API Private Social Media] PATCH Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Esta plataforma já está cadastrada" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update social media" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await prisma.socialMedia.delete({
            where: { id },
        });

        revalidateTag("store-config", "max");

        return NextResponse.json({ message: "Social media deleted successfully" });

    } catch (error) {
        console.error("[API Private Social Media] DELETE Error:", error);
        return NextResponse.json(
            { error: "Failed to delete social media" },
            { status: 500 }
        );
    }
}
