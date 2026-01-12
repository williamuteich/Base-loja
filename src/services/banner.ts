import { Banner } from "@/types/banner";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicBanners(): Promise<Banner[]> {
    "use cache";
    cacheTag("banners");
    cacheLife("hours");

    try {
        const res = await fetch(`${API_URL}/banner/public`);

        if (!res.ok) {
            console.warn(`Fetch to ${API_URL}/banner/public returned status: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching public banners:", error);
        return [];
    }
}
