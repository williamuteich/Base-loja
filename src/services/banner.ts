"use server";

import { Banner } from "@/types/banner";

export interface BannersResponse {
    data: Banner[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicBanners(): Promise<Banner[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/banner`, {
            next: { revalidate: 3600, tags: ["banners"] }
        });

        if (!res.ok) throw new Error("Failed to fetch public banners");
        return await res.json();
    } catch (error) {
        console.error("Error fetching public banners:", error);
        return [];
    }
}

export async function getAdminBanners(page: number = 1, limit: number = 10, search: string = ""): Promise<BannersResponse> {
    try {
        const url = new URL(`${API_URL}/api/private/banner`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch admin banners");
        return await res.json();
    } catch (error) {
        console.error("[Service Banner] getAdminBanners Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createBanner(formData: FormData): Promise<Banner | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/banner`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create banner");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Banner] createBanner Error:", error);
        throw new Error(error.message || "Failed to create banner");
    }
}

export async function updateBanner(id: string, formData: FormData): Promise<Banner | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/banner/${id}`, {
            method: "PATCH",
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update banner");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Banner] updateBanner Error:", error);
        throw new Error(error.message || "Failed to update banner");
    }
}

export async function deleteBanner(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/api/private/banner/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to delete banner");
        }

        return true;
    } catch (error) {
        console.error("[Service Banner] deleteBanner Error:", error);
        throw error;
    }
}
