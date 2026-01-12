import { Product } from "@/types/product";
import { cacheTag, cacheLife } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:3000";

export async function getPublicProducts(): Promise<Product[]> {
    "use cache";
    cacheTag("products");
    cacheLife("hours");

    const endpoint = `${API_URL}/product/public`;

    try {
        const res = await fetch(endpoint);

        if (!res.ok) {
            console.error(`[API Error] GET ${endpoint} failed with status: ${res.status}`);
            return [];
        }

        const responseData = await res.json();

        let products: Product[] = [];
        if (Array.isArray(responseData)) {
            products = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
            products = responseData.data;
        }

        return products;
    } catch (error) {
        console.error(`[API Exception] GET ${endpoint}:`, error);
        return [];
    }
}
