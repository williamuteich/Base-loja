"use server";

import { Banner, BannersResponse } from "@/types/banner";
import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicBanners(): Promise<Banner[]> {
    "use cache";
    cacheTag("banners");
    cacheLife("hours");

    try {
        const bannersRaw = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        return bannersRaw.map(banner => ({
            ...banner,
            createdAt: banner.createdAt.toISOString(),
            updatedAt: banner.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching public banners:", error);
        return [];
    }
}

export async function getAdminBanners(page: number = 1, limit: number = 10, search: string = ""): Promise<BannersResponse> {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { subtitle: { contains: search } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.banner.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.banner.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: data.map(banner => ({
                ...banner,
                createdAt: banner.createdAt.toISOString(),
                updatedAt: banner.updatedAt.toISOString(),
            })),
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    } catch (error) {
        console.error("[Service Banner] getAdminBanners Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createBanner(formData: FormData): Promise<Banner | null> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/banner`, {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create banner");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Banner] createBanner Error:", error);
        throw new Error(error.message || "Failed to create banner");
    }
}

export async function updateBanner(id: string, formData: FormData): Promise<Banner | null> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/banner/${id}`, {
            method: "PATCH",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update banner");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service Banner] updateBanner Error:", error);
        throw new Error(error.message || "Failed to update banner");
    }
}

export async function deleteBanner(id: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/banner/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieStore.toString()
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to delete banner");
        }

        return true;
    } catch (error) {
        console.error("[Service Banner] deleteBanner Error:", error);
        throw error;
    }
}
