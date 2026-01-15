"use server";

import { TeamMember } from "@/types/team";

export interface TeamResponse {
    data: TeamMember[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const API_URL = process.env.API_URL || "http://localhost:3000";

import { prisma } from "@/lib/prisma";

export async function getAdminTeam(page: number = 1, limit: number = 10, search: string = ""): Promise<TeamResponse> {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { role: { contains: search } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.team.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: "asc" },
            }),
            prisma.team.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: data.map((member: any) => ({
                ...member,
                createdAt: member.createdAt.toISOString(),
                updatedAt: member.updatedAt.toISOString(),
            })),
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    } catch (error) {
        console.error("[Service Team] getAdminTeam Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createTeamMember(data: any): Promise<TeamMember | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/team`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Falha ao criar membro");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Team] createTeamMember Error:", error);
        throw new Error(error.message || "Falha ao criar membro");
    }
}

export async function updateTeamMember(id: string, data: any): Promise<TeamMember | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/team/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Falha ao atualizar membro");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Team] updateTeamMember Error:", error);
        throw new Error(error.message || "Falha ao atualizar membro");
    }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/api/private/team/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Falha ao remover membro");
        }

        return true;
    } catch (error) {
        console.error("[Service Team] deleteTeamMember Error:", error);
        throw error;
    }
}
