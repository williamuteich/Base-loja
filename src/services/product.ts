"use server";

import { Product, ProductsResponse } from "@/types/product";
import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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

export async function getPublicProduct(id: string): Promise<Product | null> {
    "use cache";
    cacheTag(`product-${id}`);
    cacheLife("hours");

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                categories: {
                    include: { category: true }
                },
                brand: true
            }
        });

        if (!product) return null;

        return {
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
        } as any;
    } catch (error) {
        console.error(`[Service Product] getPublicProduct Error:`, error);
        return null;
    }
}

export async function getRelatedProducts(id: string, limit: number = 4): Promise<Product[]> {
    "use cache";
    cacheTag(`product-related-${id}`);
    cacheLife("hours");

    try {
        const currentProduct = await prisma.product.findUnique({
            where: { id },
            include: { categories: true }
        });

        if (!currentProduct) return [];

        const categoryIds = currentProduct.categories.map(c => c.categoryId);

        const products = await prisma.product.findMany({
            where: {
                id: { not: id },
                isActive: true,
                categories: {
                    some: {
                        categoryId: { in: categoryIds }
                    }
                }
            },
            take: limit,
            include: {
                images: true,
                categories: {
                    include: { category: true }
                },
                brand: true
            }
        });

        return products.map(product => ({
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
        console.error(`[Service Product] getRelatedProducts Error:`, error);
        return [];
    }
}

export async function getAdminProducts(page: number = 1, limit: number = 10, search: string = ""): Promise<ProductsResponse> {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { sku: { contains: search } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    images: true,
                    categories: {
                        include: { category: true }
                    },
                    brand: true
                }
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: data.map(product => ({
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
            })) as any,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
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
