"use server";

import { Brand } from "@/types/brand";
import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface BrandsResponse {
    data: Brand[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicBrands(): Promise<Brand[]> {
    "use cache";
    cacheTag("brands");
    cacheLife("hours");

    try {
        const brandsRaw = await prisma.brand.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });

        return brandsRaw.map(brand => ({
            ...brand,
            createdAt: brand.createdAt.toISOString(),
            updatedAt: brand.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("[Service Brand] getPublicBrands Error:", error);
        return [];
    }
}

export async function getAdminBrands(page: number = 1, limit: number = 10, search: string = ""): Promise<BrandsResponse> {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.name = { contains: search };
        }

        const [data, total] = await Promise.all([
            prisma.brand.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.brand.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: data.map(brand => ({
                ...brand,
                createdAt: brand.createdAt.toISOString(),
                updatedAt: brand.updatedAt.toISOString(),
            })),
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        };
    } catch (error) {
        console.error("[Service Brand] getAdminBrands Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createBrand(data: { name: string; isActive?: boolean }): Promise<Brand> {
    try {
        const res = await fetch(`${API_URL}/api/private/brand`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        const res = await fetch(`${API_URL}/api/private/brand/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
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
        const res = await fetch(`${API_URL}/api/private/brand/${id}`, {
            method: "DELETE",
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
