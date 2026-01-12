import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UploadHandler } from "@/lib/upload-handler";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.name = { contains: search };
        }

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                include: {
                    _count: {
                        select: { products: true }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.category.count({ where })
        ]);

        return NextResponse.json({
            data: categories,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Private Category list error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const isHome = formData.get("isHome") === "true";
        const isActive = formData.get("isActive") !== "false";
        const imageFile = formData.get("file") as File;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        let imageUrl = null;
        if (imageFile && typeof imageFile !== "string") {
            console.log("Saving new image for category:", imageFile.name);
            imageUrl = await UploadHandler.saveFile(imageFile, "categories");
        }

        const category = await prisma.category.create({
            data: {
                name,
                description,
                isHome,
                isActive,
                imageUrl
            }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error("Private Category create error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
        });
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
    }
}
