"use server";

import { Product, ProductsResponse } from "@/types/product";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/product`);
        if (!res.ok) throw new Error("Failed to fetch public products");
        return await res.json();
    } catch (error) {
        console.error(`[Service Product] getPublicProducts Error:`, error);
        return [];
    }
}

export async function getPaginatedPublicProducts(page: number = 1, limit: number = 12, category?: string, search?: string): Promise<ProductsResponse> {
    try {
        const url = new URL(`${API_URL}/api/public/product`);
        url.searchParams.set("skip", ((page - 1) * limit).toString());
        url.searchParams.set("take", limit.toString());
        url.searchParams.set("paginated", "true");
        if (category) url.searchParams.set("category", category);
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), { next: { tags: ["products"] } });
        if (!res.ok) throw new Error("Failed to fetch paginated public products");
        return await res.json();
    } catch (error) {
        console.error("[Service Product] getPaginatedPublicProducts Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function getPublicProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/api/public/product/${id}`, {
            method: 'GET',
            cache: 'force-cache',
            headers: { 'Content-Type': 'application/json' },
            next: { tags: [`product-${id}`] }
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch product: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`[Service Product] getPublicProduct Error:`, error);
        return null;
    }
}

export async function getRelatedProducts(id: string, limit: number = 4): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/product/${id}/related?limit=${limit}`, {
            method: 'GET',
            cache: 'force-cache',
            headers: { 'Content-Type': 'application/json' },
            next: { tags: [`product-related-${id}`] }
        });

        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error(`[Service Product] getRelatedProducts Error:`, error);
        return [];
    }
}

export async function getAdminProducts(page: number = 1, limit: number = 10, search: string = ""): Promise<ProductsResponse> {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/api/private/product`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString()
            }
        });
        if (!res.ok) throw new Error("Failed to fetch admin products");
        return await res.json();
    } catch (error) {
        console.error("[Service Product] getAdminProducts Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createProduct(formData: FormData): Promise<Product | null> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/product`, {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create product");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Product] createProduct Error:", error);
        throw new Error(error.message || "Failed to create product");
    }
}

export async function updateProduct(id: string, formData: FormData): Promise<Product | null> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/product/${id}`, {
            method: "PATCH",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update product");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Product] updateProduct Error:", error);
        throw new Error(error.message || "Failed to update product");
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/product/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieStore.toString()
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to delete product");
        }

        return true;
    } catch (error: any) {
        console.error("[Service Product] deleteProduct Error:", error);
        throw new Error(error.message || "Failed to delete product");
    }
}
