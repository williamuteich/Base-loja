import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
                { name: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [members, total] = await Promise.all([
            prisma.team.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.team.count({ where }),
        ]);

        return NextResponse.json({
            data: members,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("[API Private Team] GET Error:", error);
        return NextResponse.json(
            { error: "Erro Interno do Servidor" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, lastName, email, password, role, isActive } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Nome, e-mail e senha são obrigatórios" },
                { status: 400 }
            );
        }

        const existingMember = await prisma.team.findUnique({
            where: { email },
        });

        if (existingMember) {
            return NextResponse.json(
                { error: "Este e-mail já está em uso" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const member = await prisma.team.create({
            data: {
                name,
                lastName,
                email,
                password: hashedPassword,
                role: role || "COLLABORATOR",
                isActive: isActive !== undefined ? isActive : true,
            },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        revalidateTag("team", { expire: 10 });

        return NextResponse.json(member, { status: 201 });

    } catch (error) {
        console.error("[API Private Team] POST Error:", error);
        return NextResponse.json(
            { error: "Falha ao criar membro da equipe" },
            { status: 500 }
        );
    }
}
