"use server";

import { SocialMedia, SocialMediaResponse } from "@/types/social-media";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicSocialMedias(): Promise<SocialMedia[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/social-media`, { next: { tags: ["store-config"] } });
        if (!res.ok) throw new Error("Failed to fetch public social medias");
        return await res.json();
    } catch (error) {
        console.error("[Service SocialMedia] getPublicSocialMedias Error:", error);
        return [];
    }
}

export async function getAdminSocialMedias(page: number = 1, limit: number = 10, search: string = ""): Promise<SocialMediaResponse> {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/api/private/social-media`);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Cookie: cookieStore.toString()
            }
        });
        if (!res.ok) throw new Error("Failed to fetch social medias");
        return await res.json();
    } catch (error) {
        console.error("[Service SocialMedia] getAdminSocialMedias Error:", error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function createSocialMedia(data: { platform: string; url: string; isActive?: boolean }): Promise<SocialMedia | null> {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/social-media`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
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
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/social-media/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
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
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/private/social-media/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieStore.toString()
            }
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
