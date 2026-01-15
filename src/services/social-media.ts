"use server";

import { SocialMedia, SocialMediaResponse } from "@/types/social-media";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

import { prisma } from "@/lib/prisma";

export async function getPublicSocialMedias(): Promise<SocialMedia[]> {
    "use cache";
    cacheTag("store-config");
    cacheLife("hours");

    try {
        const socialMediasRaw = await prisma.socialMedia.findMany({
            where: { isActive: true },
            orderBy: { platform: 'asc' }
        });

        return socialMediasRaw.map(sm => ({
            ...sm,
            createdAt: sm.createdAt.toISOString(),
            updatedAt: sm.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("[Service SocialMedia] getPublicSocialMedias Error:", error);
        return [];
    }
}

export async function getAdminSocialMedias(page: number = 1, limit: number = 10, search: string = ""): Promise<SocialMediaResponse> {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.platform = { contains: search };
        }

        const [data, total] = await Promise.all([
            prisma.socialMedia.findMany({
                where,
                skip,
                take: limit,
                orderBy: { platform: "asc" },
            }),
            prisma.socialMedia.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: data.map(sm => ({
                ...sm,
                createdAt: sm.createdAt.toISOString(),
                updatedAt: sm.updatedAt.toISOString(),
            })),
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    } catch (error) {
        console.error("[Service SocialMedia] getAdminSocialMedias Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createSocialMedia(data: { platform: string; url: string; isActive?: boolean }): Promise<SocialMedia | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/social-media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create social media");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service SocialMedia] createSocialMedia Error:", error);
        throw new Error(error.message || "Failed to create social media");
    }
}

export async function updateSocialMedia(id: string, data: { platform?: string; url?: string; isActive?: boolean }): Promise<SocialMedia | null> {
    try {
        const res = await fetch(`${API_URL}/api/private/social-media/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to update social media");
        }

        return await res.json();
    } catch (error: any) {
        console.error("[Service SocialMedia] updateSocialMedia Error:", error);
        throw new Error(error.message || "Failed to update social media");
    }
}

export async function deleteSocialMedia(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/api/private/social-media/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to delete social media");
        }

        return true;
    } catch (error) {
        console.error("[Service SocialMedia] deleteSocialMedia Error:", error);
        throw error;
    }
}
