"use server";

import { Banner } from "@/types/banner";

const API_URL = process.env.API_URL || "http://localhost:3000";

export interface BannersResponse {
    data: Banner[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getAdminBanners(page: number = 1, limit: number = 10, search: string = ""): Promise<BannersResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) {
        params.append("search", search);
    }

    const endpoint = `${API_URL}/banner?${params.toString()}`;

    try {
        const res = await fetch(endpoint, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`[API Error] GET ${endpoint} failed with status: ${res.status}`);
            return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
        }

        return await res.json();
    } catch (error) {
        console.error(`[API Exception] GET ${endpoint}:`, error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}
