import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStoreConfig } from "@/lib/store-config";
import { revalidateTag } from "next/cache";

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
                { platform: { contains: search } },
                { url: { contains: search } }
            ];
        }

        const [socialMedias, total] = await Promise.all([
            prisma.socialMedia.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.socialMedia.count({ where }),
        ]);

        return NextResponse.json({
            data: socialMedias,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[API Private Social Media] GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { platform, url, isActive } = body;

        if (!platform || !url) {
            return NextResponse.json(
                { error: "Platform and URL are required" },
                { status: 400 }
            );
        }

        const config = await getOrCreateStoreConfig();

        const socialMedia = await prisma.socialMedia.create({
            data: {
                platform,
                url,
                isActive: isActive !== undefined ? isActive : true,
                storeConfigId: config.id
            },
        });

        revalidateTag("store-config", "max");

        return NextResponse.json(socialMedia, { status: 201 });

    } catch (error: any) {
        console.error("[API Private Social Media] POST Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Esta plataforma já está cadastrada" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create social media" },
            { status: 500 }
        );
    }
}
