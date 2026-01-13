"use server";

import { Product } from "@/types/product";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicProducts(): Promise<Product[]> {
    "use cache";
    cacheTag("products");
    cacheLife("hours");

    const endpoint = `${API_URL}/api/public/product`;

    try {
        const res = await fetch(endpoint);

        if (!res.ok) {
            console.error(`[API Error] GET ${endpoint} failed with status: ${res.status}`);
            return [];
        }

        const responseData = await res.json();

        let products: Product[] = [];
        if (Array.isArray(responseData)) {
            products = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
            products = responseData.data;
        }

        return products;
    } catch (error) {
        console.error(`[API Exception] GET ${endpoint}:`, error);
        return [];
    }
}

export interface ProductsResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getAdminProducts(page: number = 1, limit: number = 10, search: string = ""): Promise<ProductsResponse> {
    try {
        const url = new URL(`${API_URL}/api/private/product`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch admin products");
        return await res.json();
    } catch (error) {
        console.error("[Service Product] getAdminProducts Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createProduct(formData: FormData): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/product`, {
            method: "POST",
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
        const res = await fetch(`${API_URL}/api/private/product/${id}`, {
            method: "PATCH",
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
        const res = await fetch(`${API_URL}/api/private/product/${id}`, {
            method: "DELETE",
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
