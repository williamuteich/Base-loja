import { Category } from "@/types/category";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicCategories(): Promise<Category[]> {
    "use cache";
    cacheTag("categories");
    cacheLife("hours");

    const endpoint = `${API_URL}/category/public`;

    try {
        const res = await fetch(endpoint);

        if (!res.ok) {
            console.error(`[API Error] GET ${endpoint} failed with status: ${res.status}`);
            return [];
        }

        const data = await res.json();

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`[API Exception] GET ${endpoint}:`, error);
        return [];
    }
}
