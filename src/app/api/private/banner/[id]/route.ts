import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UploadHandler } from "@/lib/upload-handler";
import { revalidateTag } from "next/cache";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        const existing = await prisma.banner.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 });
        }

        const title = formData.get("title") as string | null;
        const subtitle = formData.get("subtitle") as string | null;
        const linkUrl = formData.get("linkUrl") as string | null;
        const resolutionDesktop = formData.get("resolutionDesktop") as string | null;
        const resolutionMobile = formData.get("resolutionMobile") as string | null;
        const isActiveStr = formData.get("isActive") as string | null;

        const desktopImageFile = formData.get("desktopImage") as File | null;
        const mobileImageFile = formData.get("mobileImage") as File | null;

        const data: any = {};
        if (title !== null) data.title = title;
        if (subtitle !== null) data.subtitle = subtitle;
        if (linkUrl !== null) data.linkUrl = linkUrl;
        if (resolutionDesktop !== null) data.resolutionDesktop = resolutionDesktop;
        if (resolutionMobile !== null) data.resolutionMobile = resolutionMobile;
        if (isActiveStr !== null) data.isActive = isActiveStr === "true";

        if (desktopImageFile) {
            if (existing.imageDesktop) {
                await UploadHandler.deleteFile(existing.imageDesktop);
            }
            data.imageDesktop = await UploadHandler.saveFile(desktopImageFile, "banners");
        }

        if (mobileImageFile) {
            if (existing.imageMobile) {
                await UploadHandler.deleteFile(existing.imageMobile);
            }
            data.imageMobile = await UploadHandler.saveFile(mobileImageFile, "banners");
        }

        const banner = await prisma.banner.update({
            where: { id },
            data,
        });

        revalidateTag("banners", { expire: 10 });

        return NextResponse.json(banner);
    } catch (error) {
        console.error("[API Private Banner PATCH] Error:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar banner" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existing = await prisma.banner.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 });
        }

        if (existing.imageDesktop) {
            await UploadHandler.deleteFile(existing.imageDesktop);
        }

        if (existing.imageMobile) {
            await UploadHandler.deleteFile(existing.imageMobile);
        }

        await prisma.banner.delete({
            where: { id },
        });

        revalidateTag("banners", { expire: 10 });

        return NextResponse.json({ message: "Banner excluído com sucesso" });
    } catch (error) {
        console.error("[API Private Banner DELETE] Error:", error);
        return NextResponse.json(
            { error: "Falha ao excluir banner" },
            { status: 500 }
        );
    }
}
