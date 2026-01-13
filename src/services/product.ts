"use server";

import { Product } from "@/types/product";
import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicProducts(): Promise<Product[]> {
    "use cache";
    cacheTag("products");
    cacheLife("hours");

    try {
        const productsRaw = await prisma.product.findMany({
            where: { isActive: true },
            include: {
                images: true,
                categories: {
                    include: { category: true }
                },
                brand: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map Prisma Date to string to match Product interface
        return productsRaw.map(product => ({
            ...product,
            createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
            images: product.images?.map(img => ({
                ...img,
                createdAt: img.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: img.updatedAt?.toISOString() || new Date().toISOString(),
            })) || [],
            categories: product.categories?.map(cat => ({
                ...cat,
                category: cat.category ? {
                    ...cat.category,
                    createdAt: cat.category.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: cat.category.updatedAt?.toISOString() || new Date().toISOString(),
                } : { name: "N/A", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            })) || [],
            brand: product.brand ? {
                ...product.brand,
                createdAt: product.brand.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: product.brand.updatedAt?.toISOString() || new Date().toISOString(),
            } : undefined
        })) as any;
    } catch (error) {
        console.error(`[Service Product] getPublicProducts Error:`, error);
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
