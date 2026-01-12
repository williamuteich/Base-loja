"use server";

import { Category, CategoriesResponse } from "@/types/category";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicCategories(homeOnly: boolean = false): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/category?home=${homeOnly}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        return await res.json();
    } catch (error) {
        console.error("[Service Category] getPublicCategories Error:", error);
        return [];
    }
}

export async function getAdminCategories(page: number = 1, limit: number = 10, search: string = ""): Promise<CategoriesResponse> {
    try {
        const res = await fetch(`${API_URL}/api/private/category?page=${page}&limit=${limit}&search=${search}`, {
            cache: 'no-store'
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
        const res = await fetch(`${API_URL}/api/private/category`, {
            method: "POST",
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
        const res = await fetch(`${API_URL}/api/private/category/${id}`, {
            method: "PATCH",
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
        const res = await fetch(`${API_URL}/api/private/category/${id}`, {
            method: "DELETE"
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
