"use server";

import { Category, CategoriesResponse } from "@/types/category";
import { cookies } from "next/headers";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicCategories(homeOnly: boolean = false, includeProducts: boolean = false, productsLimit: number = 25): Promise<Category[]> {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");
    try {
        const url = new URL(`${API_URL}/api/public/category`);
        url.searchParams.set("homeOnly", homeOnly ? "true" : "false");
        if (includeProducts) {
            url.searchParams.set("includeProducts", "true");
            url.searchParams.set("productsLimit", productsLimit.toString());
        }

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch public categories");
        return await res.json();
    } catch (error: any) {
        if (error.message?.includes('NEXT_PRERENDER_INTERRUPTED') || error.digest?.includes('NEXT_PRERENDER_INTERRUPTED')) {
            throw error;
        }
        console.error("[Service Category] getPublicCategories Error:", error);
        return [];
    }
}

export async function getPaginatedPublicCategories(page: number = 1, limit: number = 10): Promise<CategoriesResponse> {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");
    try {
        const url = new URL(`${API_URL}/api/public/category`);
        url.searchParams.set("skip", ((page - 1) * limit).toString());
        url.searchParams.set("take", limit.toString());
        url.searchParams.set("paginated", "true");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch paginated public categories");
        return await res.json();
    } catch (error: any) {
        if (error.message?.includes('NEXT_PRERENDER_INTERRUPTED') || error.digest?.includes('NEXT_PRERENDER_INTERRUPTED')) {
            throw error;
        }
        console.error("[Service Category] getPaginatedPublicCategories Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function getAdminCategories(page: number = 1, limit: number = 10, search: string = ""): Promise<CategoriesResponse> {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/api/private/category`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString()
            }
        });
        if (!res.ok) throw new Error("Failed to fetch admin categories");
        return await res.json();
    } catch (error) {
        console.error("[Service Category] getAdminCategories Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createCategory(data: FormData): Promise<Category> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/category`, {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: data
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create category");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Category] createCategory Error:", error);
        throw new Error(error.message || "Failed to create category");
    }
}

export async function updateCategory(id: string, data: FormData): Promise<Category> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/category/${id}`, {
            method: "PATCH",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: data
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update category");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Category] updateCategory Error:", error);
        throw new Error(error.message || "Failed to update category");
    }
}

export async function deleteCategory(id: string): Promise<void> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/category/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieStore.toString()
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to delete category");
        }
    } catch (error: any) {
        console.error("[Service Category] deleteCategory Error:", error);
        throw new Error(error.message || "Failed to delete category");
    }
}
