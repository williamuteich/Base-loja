import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("[API Private Category] GET Error:", error);
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
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description || null,
                imageUrl: data.imageUrl || null,
                isActive: data.isActive !== undefined ? data.isActive : true,
                isHome: data.isHome !== undefined ? data.isHome : false,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("[API Private Category] POST Error:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
