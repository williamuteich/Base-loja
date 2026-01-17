"use server";

import { Brand, BrandsResponse } from "@/types/brand";
import { cookies } from "next/headers";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicBrands(): Promise<Brand[]> {
    "use cache";
    cacheTag("brands");
    cacheLife("hours");
    try {
        const res = await fetch(`${API_URL}/api/public/brand`);
        if (!res.ok) throw new Error("Failed to fetch public brands");
        return await res.json();
    } catch (error: any) {
        if (error.message?.includes('NEXT_PRERENDER_INTERRUPTED') || error.digest?.includes('NEXT_PRERENDER_INTERRUPTED')) {
            throw error;
        }
        console.error("[Service Brand] getPublicBrands Error:", error);
        return [];
    }
}

export async function getAdminBrands(page: number = 1, limit: number = 10, search: string = ""): Promise<BrandsResponse> {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/api/private/brand`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString()
            }
        });
        if (!res.ok) throw new Error("Failed to fetch admin brands");
        return await res.json();
    } catch (error) {
        console.error("[Service Brand] getAdminBrands Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createBrand(data: { name: string; isActive?: boolean }): Promise<Brand> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/brand`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Falha ao criar marca");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Brand] createBrand Error:", error);
        throw new Error(error.message || "Falha ao criar marca");
    }
}

export async function updateBrand(id: string, data: { name?: string; isActive?: boolean }): Promise<Brand> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/brand/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Falha ao atualizar marca");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Brand] updateBrand Error:", error);
        throw new Error(error.message || "Falha ao atualizar marca");
    }
}

export async function deleteBrand(id: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/brand/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieStore.toString()
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Falha ao remover marca");
        }

        return true;
    } catch (error: any) {
        console.error("[Service Brand] deleteBrand Error:", error);
        throw new Error(error.message || "Falha ao remover marca");
    }
}
