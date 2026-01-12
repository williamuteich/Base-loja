import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UploadHandler } from "@/lib/upload-handler";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || PAGE_SIZE.toString());
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { subtitle: { contains: search } }
            ];
        }

        const [banners, total] = await Promise.all([
            prisma.banner.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.banner.count({ where }),
        ]);

        return NextResponse.json({
            data: banners,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[API Private Banner] GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get("title") as string;
        const subtitle = formData.get("subtitle") as string | null;
        const linkUrl = formData.get("linkUrl") as string | null;
        const resolutionDesktop = formData.get("resolutionDesktop") as string | null;
        const resolutionMobile = formData.get("resolutionMobile") as string | null;

        const desktopImageFile = formData.get("desktopImage") as File | null;
        const mobileImageFile = formData.get("mobileImage") as File | null;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        let imageDesktopPath = null;
        let imageMobilePath = null;

        if (desktopImageFile) {
            imageDesktopPath = await UploadHandler.saveFile(desktopImageFile, "banners");
        }

        if (mobileImageFile) {
            imageMobilePath = await UploadHandler.saveFile(mobileImageFile, "banners");
        }

        const isActive = formData.get("isActive") !== "false";

        const banner = await prisma.banner.create({
            data: {
                title,
                subtitle,
                linkUrl,
                resolutionDesktop,
                resolutionMobile,
                imageDesktop: imageDesktopPath,
                imageMobile: imageMobilePath,
                isActive,
            },
        });

        return NextResponse.json(banner, { status: 201 });

    } catch (error) {
        console.error("[API Private Banner] POST Error:", error);
        return NextResponse.json(
            { error: "Failed to create banner" },
            { status: 500 }
        );
    }
}
