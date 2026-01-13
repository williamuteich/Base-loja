import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

const DEFAULT_PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || DEFAULT_PAGE_SIZE.toString());
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.name = { contains: search };
        }

        const [brands, total] = await Promise.all([
            prisma.brand.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: "asc" },
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            }),
            prisma.brand.count({ where }),
        ]);

        return NextResponse.json({
            data: brands,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[API Private Brand] GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json(
                { error: "Nome da marca é obrigatório" },
                { status: 400 }
            );
        }

        const existing = await prisma.brand.findUnique({
            where: { name: data.name },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Já existe uma marca com este nome" },
                { status: 400 }
            );
        }

        const brand = await prisma.brand.create({
            data: {
                name: data.name,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        });

        revalidateTag("brands", { expire: 10 });

        return NextResponse.json(brand, { status: 201 });
    } catch (error) {
        console.error("[API Private Brand] POST Error:", error);
        return NextResponse.json(
            { error: "Falha ao criar marca" },
            { status: 500 }
        );
    }
}
