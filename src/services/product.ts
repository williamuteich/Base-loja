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
