"use server";

import { Category } from "@/types/category";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/api/public/category`, {
            next: { revalidate: 3600, tags: ["categories"] }
        });

        if (!res.ok) throw new Error("Failed to fetch public categories");
        return await res.json();
    } catch (error) {
        console.error("Error fetching public categories:", error);
        return [];
    }
}
