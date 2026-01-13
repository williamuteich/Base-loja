"use server";

import { Category, CategoriesResponse } from "@/types/category";
import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicCategories(homeOnly: boolean = false, includeProducts: boolean = false): Promise<Category[]> {
    "use cache";
    cacheTag("categories");
    if (includeProducts) cacheTag("products");
    cacheLife("hours");

    try {
        const categoriesRaw = await prisma.category.findMany({
            where: {
                isActive: true,
                ...(homeOnly ? { isHome: true } : {})
            },
            include: {
                products: includeProducts ? {
                    include: {
                        product: {
                            include: {
                                images: true
                            }
                        }
                    }
                } : false
            },
            orderBy: { name: 'asc' }
        });

        return categoriesRaw.map(category => ({
            ...category,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
            products: category.products ? (category.products as any[]).map(p => ({
                ...p,
                product: p.product ? {
                    ...p.product,
                    createdAt: p.product.createdAt?.toISOString() || new Date().toISOString(),
                    images: p.product.images?.map((img: any) => ({
                        ...img,
                        createdAt: img.createdAt?.toISOString() || new Date().toISOString(),
                        updatedAt: img.updatedAt?.toISOString() || new Date().toISOString(),
                    })) || []
                } : null
            })).filter(p => p.product !== null) : undefined
        })) as any;
    } catch (error) {
        console.error("[Service Category] getPublicCategories Error:", error);
        return [];
    }
}

export async function getAdminCategories(page: number = 1, limit: number = 10, search: string = ""): Promise<CategoriesResponse> {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.name = { contains: search };
        }

        const [data, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            }),
            prisma.category.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: data.map(c => ({
                ...c,
                _count: c._count || { products: 0 }
            })) as any,
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        };
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
