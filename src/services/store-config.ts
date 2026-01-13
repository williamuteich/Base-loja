import { StoreConfig } from "@/types/store-config";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getStoreConfig(): Promise<StoreConfig | null> {
    "use cache";
    cacheTag("store-config");
    cacheLife("hours");

    try {
        const res = await fetch(`${API_URL}/api/public/store-configuration`);

        if (!res.ok) {
            console.warn(`Fetch to ${API_URL}/store-configuration/public returned status: ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching store config:", error);
        return null;
    }
}
