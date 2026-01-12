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

export async function getAdminTeam(page: number = 1, limit: number = 10, search: string = ""): Promise<TeamResponse> {
    try {
        const url = new URL(`${API_URL}/api/private/team`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao buscar equipe");
        return await res.json();
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
